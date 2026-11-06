import { useMutation } from "@tanstack/react-query";
import type { Filters, PickMovieEmptyResult, PickMovieResult } from "@/lib/types/domain";

async function requestPick(filters: Filters, exclusionIds: number[]): Promise<PickMovieResult | PickMovieEmptyResult> {
  const res = await fetch("/api/movies/pick", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filters, exclusionIds }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export function usePickMovie() {
  return useMutation({
    mutationFn: ({ filters, exclusionIds }: { filters: Filters; exclusionIds: number[] }) =>
      requestPick(filters, exclusionIds),
  });
}
