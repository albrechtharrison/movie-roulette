import { NextResponse } from "next/server";
import { tmdbFetch, TmdbError } from "@/lib/tmdb/client";
import { TmdbRegionListResponseSchema } from "@/lib/tmdb/types";

export async function GET() {
  try {
    const data = await tmdbFetch(
      "/watch/providers/regions",
      TmdbRegionListResponseSchema,
      { language: "en-US" },
      { revalidate: 86400 }
    );
    const regions = data.results
      .map((r) => ({ code: r.iso_3166_1, name: r.english_name }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ regions });
  } catch (err) {
    if (err instanceof TmdbError) {
      return NextResponse.json({ error: err.message }, { status: err.status ?? 502 });
    }
    return NextResponse.json({ error: "Unexpected error fetching regions" }, { status: 500 });
  }
}
