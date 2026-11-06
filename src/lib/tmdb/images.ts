export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function posterUrl(path: string | null, size: "w200" | "w342" | "w500" = "w342"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function backdropUrl(path: string | null, size: "w780" | "w1280" = "w1280"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function logoUrl(path: string | null, size: "w45" | "w92" = "w45"): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
