import type { Filters } from "@/lib/types/domain";

export interface DiscoverParams {
  [key: string]: string | number | boolean | undefined;
  watch_region: string;
  with_watch_providers?: string;
  with_genres?: string;
  with_cast?: string;
  with_companies?: string;
  sort_by?: string;
  "vote_count.gte"?: number;
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
    include_adult: false,
    language: "en-US",
    page: 1,
  };
  return { ...base, ...overrides };
}

export type RelaxableCategory = "castPersonIds" | "companyIds" | "genreIds" | "watchProviderIds";

/** Order to drop filter categories in when the pool is empty — narrowest first. Region is never dropped. */
export const RELAX_ORDER: RelaxableCategory[] = [
  "castPersonIds",
  "companyIds",
  "genreIds",
  "watchProviderIds",
];
