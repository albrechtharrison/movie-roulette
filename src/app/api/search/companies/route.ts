import { NextResponse } from "next/server";
import { tmdbFetch, TmdbError } from "@/lib/tmdb/client";
import { TmdbSearchCompanyResponseSchema } from "@/lib/tmdb/types";
import { mapCompany } from "@/lib/tmdb/mappers";
import { withCache, TTL } from "@/lib/tmdb/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";
  if (!query) return NextResponse.json({ companies: [] });

  try {
    const data = await withCache(`search-company:${query}`, TTL.SEARCH, () =>
      tmdbFetch("/search/company", TmdbSearchCompanyResponseSchema, { query })
    );
    return NextResponse.json({ companies: data.results.slice(0, 10).map(mapCompany) });
  } catch (err) {
    if (err instanceof TmdbError) {
      return NextResponse.json({ error: err.message }, { status: err.status ?? 502 });
    }
    return NextResponse.json({ error: "Unexpected error searching companies" }, { status: 500 });
  }
}
