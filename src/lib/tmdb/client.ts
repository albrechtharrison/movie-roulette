import "server-only";
import type { z } from "zod";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export class TmdbError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "TmdbError";
  }
}

function getApiToken(): string {
  const token = process.env.TMDB_API_TOKEN;
  if (!token) {
    throw new TmdbError(
      "TMDB_API_TOKEN is not set. Add it to .env.local (see .env.local.example)."
    );
  }
  return token;
}

export async function tmdbFetch<S extends z.ZodType>(
  path: string,
  schema: S,
  params: Record<string, string | number | boolean | undefined> = {},
  nextOptions?: { revalidate?: number }
): Promise<z.infer<S>> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${getApiToken()}`,
      Accept: "application/json",
    },
    next: nextOptions,
  });

  if (!res.ok) {
    throw new TmdbError(`TMDB request failed: ${path} (${res.status})`, res.status);
  }

  const json = await res.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new TmdbError(`TMDB response failed validation: ${path}`);
  }
  return parsed.data;
}
