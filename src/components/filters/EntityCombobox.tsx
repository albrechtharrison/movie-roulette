"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/useDebouncedSearch";
import type { NamedItem } from "@/lib/types/filterSelection";

interface EntityComboboxProps {
  label: string;
  placeholder: string;
  selected: NamedItem[];
  onChange: (next: NamedItem[]) => void;
  searchFn: (query: string) => Promise<NamedItem[]>;
  queryKeyPrefix: string;
}

export function EntityCombobox({
  label,
  placeholder,
  selected,
  onChange,
  searchFn,
  queryKeyPrefix,
}: EntityComboboxProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const { data: results, isFetching } = useQuery({
    queryKey: [queryKeyPrefix, debouncedQuery],
    queryFn: () => searchFn(debouncedQuery),
    enabled: debouncedQuery.trim().length > 1,
  });

  const selectedIds = new Set(selected.map((s) => s.id));
  const filteredResults = (results ?? []).filter((r) => !selectedIds.has(r.id));

  const add = (item: NamedItem) => {
    onChange([...selected, item]);
    setQuery("");
  };

  const remove = (id: number) => {
    onChange(selected.filter((s) => s.id !== id));
  };

  return (
    <div className="relative">
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </label>

      {selected.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selected.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-sm text-white"
            >
              {item.name}
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Remove ${item.name}`}
                className="ml-1 text-white/80 hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder:text-neutral-500"
      />

      {debouncedQuery.trim().length > 1 && (
        <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg bg-neutral-800 shadow-lg">
          {isFetching && <p className="px-3 py-2 text-sm text-neutral-500">Searching…</p>}
          {!isFetching && filteredResults.length === 0 && (
            <p className="px-3 py-2 text-sm text-neutral-500">No results.</p>
          )}
          {filteredResults.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => add(item)}
              className="block w-full px-3 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-700"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
