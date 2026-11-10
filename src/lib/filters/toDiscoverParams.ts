import type { Filters } from "@/lib/types/domain";

export interface DiscoverParams {
  [key: string]: string | number | boolean | undefined;
  watch_region: string;
  with_watch_providers?: string;
  with_genres?: string;
  with_cast?: string;
  with_companies?: string;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  sort_by?: string;
  "vote_count.gte"?: number;
  "vote_average.gte"?: number;
  include_adult: boolean;
  language: string;
  page: number;
}

/**
 * Within a category: OR (pipe) — "any of these services/actors/studios".
 * Across categories: AND — satisfied automatically by TMDB combining separate params.
 * Genres use comma (AND) by default: "Action AND Comedy" is a deliberate curated ask;
 * flip to pipe here if product direction prefers OR semantics for genres.
 */
export function toDiscoverParams(
  filters: Filters,
  overrides: Partial<DiscoverParams> = {}
): DiscoverParams {
  const base: DiscoverParams = {
    watch_region: filters.region,
    with_watch_providers: filters.watchProviderIds.length
      ? filters.watchProviderIds.join("|")
      : undefined,
    with_genres: filters.genreIds.length ? filters.genreIds.join(",") : undefined,
    with_cast: filters.castPersonIds.length ? filters.castPersonIds.join("|") : undefined,
    with_companies: filters.companyIds.length ? filters.companyIds.join("|") : undefined,
    "primary_release_date.gte": filters.releaseYearFrom ? `${filters.releaseYearFrom}-01-01` : undefined,
    "primary_release_date.lte": filters.releaseYearTo ? `${filters.releaseYearTo}-12-31` : undefined,
    "vote_average.gte": filters.minRating > 0 ? filters.minRating : undefined,
    include_adult: false,
    language: "en-US",
    page: 1,
  };
  return { ...base, ...overrides };
}

export type RelaxableCategory =
  | "releaseYear"
  | "minRating"
  | "castPersonIds"
  | "companyIds"
  | "genreIds"
  | "watchProviderIds";

/**
 * Order to drop filter categories in when the pool is empty — narrowest/most
 * negotiable first. Year range and minimum rating are usually soft
 * preferences, so they go before genre/provider choices, which are more
 * deliberate. Region is never dropped.
 */
export const RELAX_ORDER: RelaxableCategory[] = [
  "releaseYear",
  "minRating",
  "castPersonIds",
  "companyIds",
  "genreIds",
  "watchProviderIds",
];
