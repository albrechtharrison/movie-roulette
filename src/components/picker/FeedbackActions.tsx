import type { DecisionStatus } from "@/lib/decisionStore";

const OPTIONS: { status: DecisionStatus; label: string }[] = [
  { status: "seen", label: "Already seen" },
  { status: "not_interested", label: "Not interested" },
  { status: "maybe_later", label: "Maybe later" },
];

export function FeedbackActions({
  currentStatus,
  onDecide,
}: {
  currentStatus: DecisionStatus | null;
  onDecide: (status: DecisionStatus) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map(({ status, label }) => {
        const active = currentStatus === status;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onDecide(status)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              active
                ? "bg-neutral-100 text-neutral-900"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
