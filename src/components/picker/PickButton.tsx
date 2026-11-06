export function PickButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded-full bg-red-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Picking…" : "🎲 Pick me a movie"}
    </button>
  );
}
