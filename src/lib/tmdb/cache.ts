interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export async function withCache<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const cached = getCached<T>(key);
  if (cached !== undefined) return cached;
  const data = await fetcher();
  setCached(key, data, ttlMs);
  return data;
}

export const TTL = {
  LONG: 24 * 60 * 60 * 1000,
  DISCOVER: 5 * 60 * 1000,
  SEARCH: 10 * 60 * 1000,
  DETAILS: 60 * 60 * 1000,
};
