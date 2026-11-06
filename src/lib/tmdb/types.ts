import { z } from "zod";

export const TmdbMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().default(""),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string().optional().default(""),
  vote_average: z.number().default(0),
  vote_count: z.number().default(0),
  genre_ids: z.array(z.number()).default([]),
});
export type TmdbMovie = z.infer<typeof TmdbMovieSchema>;

export const TmdbDiscoverResponseSchema = z.object({
  page: z.number(),
  results: z.array(TmdbMovieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});
export type TmdbDiscoverResponse = z.infer<typeof TmdbDiscoverResponseSchema>;

export const TmdbGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const TmdbGenreListResponseSchema = z.object({
  genres: z.array(TmdbGenreSchema),
});

export const TmdbWatchProviderSchema = z.object({
  provider_id: z.number(),
  provider_name: z.string(),
  logo_path: z.string().nullable().default(null),
  display_priority: z.number().optional(),
});

export const TmdbWatchProviderRegionResultSchema = z.object({
  link: z.string().optional(),
  flatrate: z.array(TmdbWatchProviderSchema).optional(),
  rent: z.array(TmdbWatchProviderSchema).optional(),
  buy: z.array(TmdbWatchProviderSchema).optional(),
});

export const TmdbMovieWatchProvidersResponseSchema = z.object({
  id: z.number(),
  results: z.record(z.string(), TmdbWatchProviderRegionResultSchema),
});

export const TmdbWatchProviderListResponseSchema = z.object({
  results: z.array(TmdbWatchProviderSchema),
});

export const TmdbRegionSchema = z.object({
  iso_3166_1: z.string(),
  english_name: z.string(),
  native_name: z.string().optional(),
});

export const TmdbRegionListResponseSchema = z.object({
  results: z.array(TmdbRegionSchema),
});

export const TmdbPersonSchema = z.object({
  id: z.number(),
  name: z.string(),
  profile_path: z.string().nullable().default(null),
  known_for_department: z.string().optional(),
});

export const TmdbSearchPersonResponseSchema = z.object({
  results: z.array(TmdbPersonSchema),
});

export const TmdbCompanySchema = z.object({
  id: z.number(),
  name: z.string(),
  logo_path: z.string().nullable().default(null),
});

export const TmdbSearchCompanyResponseSchema = z.object({
  results: z.array(TmdbCompanySchema),
});
