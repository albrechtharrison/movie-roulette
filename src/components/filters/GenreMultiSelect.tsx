import { useGenres } from "@/hooks/useGenres";

export function GenreMultiSelect({
  selectedIds,
  onChange,
}: {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}) {
  const { data: genres, isLoading } = useGenres();

  const toggle = (id: number) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };

  if (isLoading) return <p className="text-sm text-neutral-500">Loading genres…</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {(genres ?? []).map((genre) => {
        const active = selectedIds.includes(genre.id);
        return (
          <button
            key={genre.id}
            type="button"
            onClick={() => toggle(genre.id)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              active
                ? "bg-red-600 text-white"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
}
