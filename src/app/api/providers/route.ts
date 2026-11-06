import { NextResponse } from "next/server";
import { tmdbFetch, TmdbError } from "@/lib/tmdb/client";
import { TmdbWatchProviderListResponseSchema } from "@/lib/tmdb/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") ?? "US";

  try {
    const data = await tmdbFetch(
      "/watch/providers/movie",
      TmdbWatchProviderListResponseSchema,
      { watch_region: region, language: "en-US" },
      { revalidate: 86400 }
    );
    const providers = data.results
      .slice()
      .sort((a, b) => (a.display_priority ?? 999) - (b.display_priority ?? 999))
      .map((p) => ({ providerId: p.provider_id, providerName: p.provider_name, logoPath: p.logo_path }));
    return NextResponse.json({ providers });
  } catch (err) {
    if (err instanceof TmdbError) {
      return NextResponse.json({ error: err.message }, { status: err.status ?? 502 });
    }
    return NextResponse.json({ error: "Unexpected error fetching providers" }, { status: 500 });
  }
}
