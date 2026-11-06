import { EntityCombobox } from "@/components/filters/EntityCombobox";
import type { NamedItem } from "@/lib/types/filterSelection";

async function searchCompanies(query: string): Promise<NamedItem[]> {
  const res = await fetch(`/api/search/companies?query=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.companies.map((c: { id: number; name: string }) => ({ id: c.id, name: c.name }));
}

export function CompanyAutocomplete({
  selected,
  onChange,
}: {
  selected: NamedItem[];
  onChange: (next: NamedItem[]) => void;
}) {
  return (
    <EntityCombobox
      label="Studios"
      placeholder="Search for a studio…"
      selected={selected}
      onChange={onChange}
      searchFn={searchCompanies}
      queryKeyPrefix="search-company"
    />
  );
}
