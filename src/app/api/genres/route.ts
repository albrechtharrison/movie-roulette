import { NextResponse } from "next/server";
import { tmdbFetch, TmdbError } from "@/lib/tmdb/client";
import { TmdbGenreListResponseSchema } from "@/lib/tmdb/types";
import { mapGenre } from "@/lib/tmdb/mappers";

export async function GET() {
  try {
    const data = await tmdbFetch(
      "/genre/movie/list",
      TmdbGenreListResponseSchema,
      { language: "en-US" },
      { revalidate: 86400 }
    );
    return NextResponse.json({ genres: data.genres.map(mapGenre) });
  } catch (err) {
    if (err instanceof TmdbError) {
      return NextResponse.json({ error: err.message }, { status: err.status ?? 502 });
    }
    return NextResponse.json({ error: "Unexpected error fetching genres" }, { status: 500 });
  }
}
