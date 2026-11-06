import { useQuery } from "@tanstack/react-query";
import type { WatchProvider } from "@/lib/types/domain";

async function fetchProviders(region: string): Promise<WatchProvider[]> {
  const res = await fetch(`/api/providers?region=${encodeURIComponent(region)}`);
  if (!res.ok) throw new Error("Failed to load providers");
  const data = await res.json();
  return data.providers;
}

export function useProviders(region: string) {
  return useQuery({
    queryKey: ["providers", region],
    queryFn: () => fetchProviders(region),
    staleTime: 24 * 60 * 60 * 1000,
  });
}
