export interface Genre {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  profilePath: string | null;
  knownForDepartment?: string;
}

export interface Company {
  id: number;
  name: string;
  logoPath: string | null;
}

export interface WatchProvider {
  providerId: number;
  providerName: string;
  logoPath: string | null;
}

export interface WatchProviderBucket {
  region: string;
  flatrate: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  watchProviders?: WatchProviderBucket;
  /** Set when this movie won the Academy Award for Best Picture, with the year it won. */
  oscarBestPictureYear?: number;
}

export interface Filters {
  watchProviderIds: number[];
  genreIds: number[];
  castPersonIds: number[];
  companyIds: number[];
  region: string;
  /** Inclusive release-year bounds. null means unbounded on that side. */
  releaseYearFrom: number | null;
  releaseYearTo: number | null;
  /** Minimum vote average, 0-10. 0 means unbounded (no constraint). */
  minRating: number;
}

export const EARLIEST_RELEASE_YEAR = 1900;

export const EMPTY_FILTERS: Filters = {
  watchProviderIds: [],
  genreIds: [],
  castPersonIds: [],
  companyIds: [],
  region: "US",
  releaseYearFrom: null,
  releaseYearTo: null,
  minRating: 0,
};

export interface PickMovieResult {
  movie: Movie;
  relaxed: string[];
}

export interface PickMovieEmptyResult {
  empty: true;
  reason: "no_candidates";
}
