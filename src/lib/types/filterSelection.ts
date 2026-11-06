import type { Filters } from "@/lib/types/domain";
import { EMPTY_FILTERS } from "@/lib/types/domain";

export interface NamedItem {
  id: number;
  name: string;
}

export interface FilterSelection {
  region: string;
  watchProviderIds: number[];
  genreIds: number[];
  cast: NamedItem[];
  companies: NamedItem[];
}

export const EMPTY_SELECTION: FilterSelection = {
  region: EMPTY_FILTERS.region,
  watchProviderIds: [],
  genreIds: [],
  cast: [],
  companies: [],
};

export function toFilters(selection: FilterSelection): Filters {
  return {
    region: selection.region,
    watchProviderIds: selection.watchProviderIds,
    genreIds: selection.genreIds,
    castPersonIds: selection.cast.map((c) => c.id),
    companyIds: selection.companies.map((c) => c.id),
  };
}
