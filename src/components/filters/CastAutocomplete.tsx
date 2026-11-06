import { EntityCombobox } from "@/components/filters/EntityCombobox";
import type { NamedItem } from "@/lib/types/filterSelection";

async function searchPeople(query: string): Promise<NamedItem[]> {
  const res = await fetch(`/api/search/people?query=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.people.map((p: { id: number; name: string }) => ({ id: p.id, name: p.name }));
}

export function CastAutocomplete({
  selected,
  onChange,
}: {
  selected: NamedItem[];
  onChange: (next: NamedItem[]) => void;
}) {
  return (
    <EntityCombobox
      label="Actors"
      placeholder="Search for an actor…"
      selected={selected}
      onChange={onChange}
      searchFn={searchPeople}
      queryKeyPrefix="search-person"
    />
  );
}
