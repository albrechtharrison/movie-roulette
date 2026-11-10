import { NextResponse } from "next/server";
import { z } from "zod";
import { pickMovie } from "@/lib/selection/pickMovie";
import { TmdbError } from "@/lib/tmdb/client";
import { EMPTY_FILTERS } from "@/lib/types/domain";

const FiltersSchema = z.object({
  watchProviderIds: z.array(z.number()).default([]),
  genreIds: z.array(z.number()).default([]),
  castPersonIds: z.array(z.number()).default([]),
  companyIds: z.array(z.number()).default([]),
  region: z.string().default("US"),
  releaseYearFrom: z.number().nullable().default(null),
  releaseYearTo: z.number().nullable().default(null),
  minRating: z.number().min(0).max(10).default(0),
});

const RequestSchema = z.object({
  filters: FiltersSchema.default(EMPTY_FILTERS),
  exclusionIds: z.array(z.number()).default([]),
});

export async function POST(request: Request) {
  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine, defaults apply
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const result = await pickMovie(parsed.data.filters, parsed.data.exclusionIds);
    return NextResponse.json(result);
  } catch (err) {
    console.error("pick movie error:", err);
    if (err instanceof TmdbError) {
      return NextResponse.json({ error: err.message }, { status: err.status ?? 502 });
    }
    return NextResponse.json({ error: "Unexpected error picking a movie" }, { status: 500 });
  }
}
