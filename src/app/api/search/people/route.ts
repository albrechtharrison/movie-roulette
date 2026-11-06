import { NextResponse } from "next/server";
import { tmdbFetch, TmdbError } from "@/lib/tmdb/client";
import { TmdbSearchPersonResponseSchema } from "@/lib/tmdb/types";
import { mapPerson } from "@/lib/tmdb/mappers";
import { withCache, TTL } from "@/lib/tmdb/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";
  if (!query) return NextResponse.json({ people: [] });

  try {
    const data = await withCache(`search-person:${query}`, TTL.SEARCH, () =>
      tmdbFetch("/search/person", TmdbSearchPersonResponseSchema, {
        query,
        include_adult: false,
        language: "en-US",
      })
    );
    return NextResponse.json({ people: data.results.slice(0, 10).map(mapPerson) });
  } catch (err) {
    if (err instanceof TmdbError) {
      return NextResponse.json({ error: err.message }, { status: err.status ?? 502 });
    }
    return NextResponse.json({ error: "Unexpected error searching people" }, { status: 500 });
  }
}
