import type { Genre, Movie, Company, Person, WatchProvider, WatchProviderBucket } from "@/lib/types/domain";
import type { TmdbMovie, TmdbWatchProviderRegionResultSchema } from "@/lib/tmdb/types";
import { z } from "zod";

type TmdbWatchProviderRegionResult = z.infer<typeof TmdbWatchProviderRegionResultSchema>;
type TmdbWatchProviderRaw = NonNullable<TmdbWatchProviderRegionResult["flatrate"]>[number];

export function mapMovie(raw: TmdbMovie): Movie {
  return {
    id: raw.id,
    title: raw.title,
    overview: raw.overview,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    releaseDate: raw.release_date || null,
    voteAverage: raw.vote_average,
    voteCount: raw.vote_count,
    genreIds: raw.genre_ids,
  };
}

export function mapGenre(raw: { id: number; name: string }): Genre {
  return { id: raw.id, name: raw.name };
}

export function mapPerson(raw: {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
}): Person {
  return {
    id: raw.id,
    name: raw.name,
    profilePath: raw.profile_path,
    knownForDepartment: raw.known_for_department,
  };
}

export function mapCompany(raw: { id: number; name: string; logo_path: string | null }): Company {
  return { id: raw.id, name: raw.name, logoPath: raw.logo_path };
}

function toProviderList(items: TmdbWatchProviderRaw[] | undefined): WatchProvider[] {
  return (items ?? []).map((p) => ({
    providerId: p.provider_id,
    providerName: p.provider_name,
    logoPath: p.logo_path,
  }));
}

export function mapWatchProviderBucket(
  region: string,
  raw: TmdbWatchProviderRegionResult | undefined
): WatchProviderBucket {
  return {
    region,
    flatrate: toProviderList(raw?.flatrate),
    rent: toProviderList(raw?.rent),
    buy: toProviderList(raw?.buy),
  };
}
