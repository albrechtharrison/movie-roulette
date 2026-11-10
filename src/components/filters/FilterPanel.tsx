"use client";

import { useState } from "react";
import { RegionSelect } from "@/components/filters/RegionSelect";
import { ProviderMultiSelect } from "@/components/filters/ProviderMultiSelect";
import { GenreMultiSelect } from "@/components/filters/GenreMultiSelect";
import { CastAutocomplete } from "@/components/filters/CastAutocomplete";
import { CompanyAutocomplete } from "@/components/filters/CompanyAutocomplete";
import { YearRangeSlider } from "@/components/filters/YearRangeSlider";
import type { FilterSelection } from "@/lib/types/filterSelection";

export function FilterPanel({
  value,
  onChange,
}: {
  value: FilterSelection;
  onChange: (next: FilterSelection) => void;
}) {
  const [open, setOpen] = useState(false);

  const activeCount =
    value.watchProviderIds.length +
    value.genreIds.length +
    value.cast.length +
    value.companies.length +
    (value.releaseYearFrom !== null || value.releaseYearTo !== null ? 1 : 0);

  return (
    <div className="w-full rounded-xl bg-neutral-900/60 p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left text-sm font-medium text-neutral-200"
      >
        <span>
          Filters
          {activeCount > 0 && (
            <span className="ml-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
              {activeCount}
            </span>
          )}
        </span>
        <span className="text-neutral-500">{open ? "Hide ▲" : "Show ▼"}</span>
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-5">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Region
            </label>
            <RegionSelect value={value.region} onChange={(region) => onChange({ ...value, region })} />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
              Streaming services (any of these)
            </p>
            <ProviderMultiSelect
              region={value.region}
              selectedIds={value.watchProviderIds}
              onChange={(watchProviderIds) => onChange({ ...value, watchProviderIds })}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">Genres</p>
            <GenreMultiSelect
              selectedIds={value.genreIds}
              onChange={(genreIds) => onChange({ ...value, genreIds })}
            />
          </div>

          <CastAutocomplete selected={value.cast} onChange={(cast) => onChange({ ...value, cast })} />

          <CompanyAutocomplete
            selected={value.companies}
            onChange={(companies) => onChange({ ...value, companies })}
          />

          <YearRangeSlider
            from={value.releaseYearFrom}
            to={value.releaseYearTo}
            onChange={(releaseYearFrom, releaseYearTo) =>
              onChange({ ...value, releaseYearFrom, releaseYearTo })
            }
          />
        </div>
      )}
    </div>
  );
}
