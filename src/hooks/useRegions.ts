import { useQuery } from "@tanstack/react-query";

export interface Region {
  code: string;
  name: string;
}

async function fetchRegions(): Promise<Region[]> {
  const res = await fetch("/api/regions");
  if (!res.ok) throw new Error("Failed to load regions");
  const data = await res.json();
  return data.regions;
}

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
