import { useState } from "react";
import Image from "next/image";
import { useProviders } from "@/hooks/useProviders";
import { logoUrl } from "@/lib/tmdb/images";
import { MAJOR_PROVIDER_IDS } from "@/lib/tmdb/majorProviders";
import type { WatchProvider } from "@/lib/types/domain";

function ProviderChip({
  provider,
  active,
  onToggle,
}: {
  provider: WatchProvider;
  active: boolean;
  onToggle: () => void;
}) {
  const logo = logoUrl(provider.logoPath, "w45");
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      title={provider.providerName}
      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${
        active ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
      }`}
    >
      {logo && <Image src={logo} alt="" width={20} height={20} className="h-5 w-5 rounded" />}
      {provider.providerName}
    </button>
  );
}

export function ProviderMultiSelect({
  region,
  selectedIds,
  onChange,
}: {
  region: string;
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}) {
  const { data: providers, isLoading } = useProviders(region);
  const [showAll, setShowAll] = useState(false);

  const toggle = (id: number) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };

  if (isLoading) return <p className="text-sm text-neutral-500">Loading streaming services…</p>;
  if (!providers || providers.length === 0) {
    return <p className="text-sm text-neutral-500">No streaming providers found for this region.</p>;
  }

  const major = providers.filter((p) => MAJOR_PROVIDER_IDS.has(p.providerId));
  const rest = providers.filter((p) => !MAJOR_PROVIDER_IDS.has(p.providerId));
  const visible = showAll ? providers : major;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((provider) => (
        <ProviderChip
          key={provider.providerId}
          provider={provider}
          active={selectedIds.includes(provider.providerId)}
          onToggle={() => toggle(provider.providerId)}
        />
      ))}
      {!showAll && rest.length > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="rounded-full px-3 py-1.5 text-sm text-neutral-400 underline-offset-2 hover:text-neutral-200 hover:underline"
        >
          Show all {providers.length} services
        </button>
      )}
    </div>
  );
}
