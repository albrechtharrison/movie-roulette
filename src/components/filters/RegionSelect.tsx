import { useRegions } from "@/hooks/useRegions";

export function RegionSelect({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const { data: regions, isLoading } = useRegions();

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
      className="rounded-lg bg-neutral-800 px-3 py-2 text-sm text-neutral-200 disabled:opacity-60"
    >
      {isLoading && <option>Loading…</option>}
      {(regions ?? []).map((r) => (
        <option key={r.code} value={r.code}>
          {r.name}
        </option>
      ))}
    </select>
  );
}
