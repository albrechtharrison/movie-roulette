import { useQuery } from "@tanstack/react-query";
import type { Genre } from "@/lib/types/domain";

async function fetchGenres(): Promise<Genre[]> {
  const res = await fetch("/api/genres");
  if (!res.ok) throw new Error("Failed to load genres");
  const data = await res.json();
  return data.genres;
}

export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
