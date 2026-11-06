import "server-only";
import { tmdbFetch, TmdbError } from "@/lib/tmdb/client";
import { withCache, TTL } from "@/lib/tmdb/cache";
import {
  TmdbDiscoverResponseSchema,
  TmdbMovieWatchProvidersResponseSchema,
  type TmdbMovie,
} from "@/lib/tmdb/types";
import { mapMovie, mapWatchProviderBucket } from "@/lib/tmdb/mappers";
import { toDiscoverParams, RELAX_ORDER, type DiscoverParams } from "@/lib/filters/toDiscoverParams";
import type { Filters, Movie, PickMovieEmptyResult, PickMovieResult } from "@/lib/types/domain";
import {
  CURATED_POOL_RATIO,
  CURATED_POOL_PAGE_COUNT,
  RANDOM_POOL_PAGE_COUNT,
  VOTE_COUNT_FLOOR,
  MAX_DISCOVER_PAGE,
} from "@/lib/selection/constants";

function randomInt(maxInclusive: number): number {
  return 1 + Math.floor(Math.random() * maxInclusive);
}

function cacheKey(params: DiscoverParams): string {
  return `discover:${JSON.stringify(params)}`;
}

async function fetchDiscoverPage(params: DiscoverParams) {
  return withCache(cacheKey(params), TTL.DISCOVER, () =>
    tmdbFetch("/discover/movie", TmdbDiscoverResponseSchema, params)
  );
}

interface PoolResult {
  candidates: TmdbMovie[];
  totalPages: number;
}

async function fetchPool(baseParams: DiscoverParams, maxPageSample: number): Promise<PoolResult> {
  const firstPage = await fetchDiscoverPage({ ...baseParams, page: 1 });
  const cappedTotalPages = Math.min(firstPage.total_pages, MAX_DISCOVER_PAGE);
  if (cappedTotalPages <= 1) {
    return { candidates: firstPage.results, totalPages: cappedTotalPages };
  }
  const pageRange = Math.min(maxPageSample, cappedTotalPages);
  const page = randomInt(pageRange);
  if (page === 1) {
    return { candidates: firstPage.results, totalPages: cappedTotalPages };
  }
  const sampledPage = await fetchDiscoverPage({ ...baseParams, page });
  return { candidates: sampledPage.results, totalPages: cappedTotalPages };
}

function removeExcluded(movies: TmdbMovie[], exclusionIds: number[]): TmdbMovie[] {
  if (exclusionIds.length === 0) return movies;
  const excluded = new Set(exclusionIds);
  return movies.filter((m) => !excluded.has(m.id));
}

function pickRandom<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

async function enrichWithWatchProviders(movie: TmdbMovie, region: string): Promise<Movie> {
  const domainMovie = mapMovie(movie);
  try {
    const providersResponse = await withCache(
      `watch-providers:${movie.id}:${region}`,
      TTL.DETAILS,
      () => tmdbFetch(`/movie/${movie.id}/watch/providers`, TmdbMovieWatchProvidersResponseSchema, {})
    );
    const regionResult = providersResponse.results[region];
    domainMovie.watchProviders = mapWatchProviderBucket(region, regionResult);
  } catch {
    // Watch-provider enrichment is best-effort; a missing/failed lookup shouldn't block showing the movie.
    domainMovie.watchProviders = { region, flatrate: [], rent: [], buy: [] };
  }
  return domainMovie;
}

export async function pickMovie(
  filters: Filters,
  exclusionIds: number[]
): Promise<PickMovieResult | PickMovieEmptyResult> {
  const curatedBaseParams = toDiscoverParams(filters, {
    sort_by: "popularity.desc",
    "vote_count.gte": VOTE_COUNT_FLOOR,
  });
  const randomBaseParams = toDiscoverParams(filters, {});

  let curated = await fetchPool(curatedBaseParams, CURATED_POOL_PAGE_COUNT);
  let random = await fetchPool(randomBaseParams, RANDOM_POOL_PAGE_COUNT);

  let curatedCandidates = removeExcluded(curated.candidates, exclusionIds);
  let randomCandidates = removeExcluded(random.candidates, exclusionIds);

  const relaxed: string[] = [];

  const tryBlend = (): TmdbMovie | undefined => {
    const useCurated = Math.random() < CURATED_POOL_RATIO;
    const primary = useCurated ? curatedCandidates : randomCandidates;
    const fallback = useCurated ? randomCandidates : curatedCandidates;
    return pickRandom(primary) ?? pickRandom(fallback);
  };

  let chosen = tryBlend();

  if (!chosen) {
    // Retry once with another random page, favoring whichever pool had more total pages.
    const retryCurated = curated.totalPages >= random.totalPages;
    if (retryCurated) {
      curated = await fetchPool(curatedBaseParams, CURATED_POOL_PAGE_COUNT);
      curatedCandidates = removeExcluded(curated.candidates, exclusionIds);
    } else {
      random = await fetchPool(randomBaseParams, RANDOM_POOL_PAGE_COUNT);
      randomCandidates = removeExcluded(random.candidates, exclusionIds);
    }
    chosen = tryBlend();
  }

  if (!chosen) {
    // Progressively relax filters on the curated fetch only, narrowest category first.
    let relaxedFilters = { ...filters };
    for (const category of RELAX_ORDER) {
      if (relaxedFilters[category].length === 0) continue;
      relaxedFilters = { ...relaxedFilters, [category]: [] };
      relaxed.push(category);

      const relaxedParams = toDiscoverParams(relaxedFilters, {
        sort_by: "popularity.desc",
        "vote_count.gte": VOTE_COUNT_FLOOR,
      });
      const relaxedPool = await fetchPool(relaxedParams, CURATED_POOL_PAGE_COUNT);
      const relaxedCandidates = removeExcluded(relaxedPool.candidates, exclusionIds);
      chosen = pickRandom(relaxedCandidates);
      if (chosen) break;
    }
  }

  if (!chosen) {
    return { empty: true, reason: "no_candidates" };
  }

  const movie = await enrichWithWatchProviders(chosen, filters.region);
  return { movie, relaxed };
}

export { TmdbError };
