"use client";

import { useState } from "react";
import Link from "next/link";
import { useDecisionStore } from "@/hooks/useDecisionStore";
import { DecisionList } from "@/components/history/DecisionList";
import { RegionSelect } from "@/components/filters/RegionSelect";
import type { DecisionStatus } from "@/lib/decisionStore";

const TABS: { status: DecisionStatus; label: string }[] = [
  { status: "seen", label: "Seen" },
  { status: "not_interested", label: "Not Interested" },
  { status: "maybe_later", label: "Maybe Later" },
];

export default function HistoryPage() {
  const { decisions, removeDecision, clearAll, preferences, setPreferences } = useDecisionStore();
  const [activeTab, setActiveTab] = useState<DecisionStatus>("seen");
  const [confirmingReset, setConfirmingReset] = useState(false);

  const entries = Object.entries(decisions)
    .map(([id, record]) => ({ movieId: Number(id), record }))
    .filter((entry) => entry.record.status === activeTab)
    .sort((a, b) => b.record.timestamp - a.record.timestamp);

  const counts = TABS.reduce<Record<DecisionStatus, number>>(
    (acc, tab) => {
      acc[tab.status] = Object.values(decisions).filter((d) => d.status === tab.status).length;
      return acc;
    },
    { seen: 0, not_interested: 0, maybe_later: 0 }
  );

  const handleReset = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    clearAll();
    setConfirmingReset(false);
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-12 sm:py-20">
      <div>
        <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-200">
          ← Back to picker
        </Link>
        <h1 className="mt-2 text-3xl font-bold">History</h1>
      </div>

      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.status}
            type="button"
            onClick={() => setActiveTab(tab.status)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeTab === tab.status
                ? "bg-red-600 text-white"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {tab.label} ({counts[tab.status]})
          </button>
        ))}
      </div>

      <DecisionList
        entries={entries}
        showEligibility={activeTab === "maybe_later"}
        onUndo={removeDecision}
      />

      <div className="mt-4 flex flex-col gap-4 rounded-xl bg-neutral-900/60 p-4">
        <h2 className="text-sm font-medium text-neutral-200">Preferences</h2>

        <div className="flex items-center justify-between">
          <label className="text-sm text-neutral-400">Region</label>
          <RegionSelect
            value={preferences.region}
            onChange={(region) => setPreferences({ region })}
          />
        </div>

        <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
          <p className="text-sm text-neutral-400">
            {confirmingReset ? "Are you sure? This clears all history." : "Reset all decisions"}
          </p>
          <div className="flex gap-2">
            {confirmingReset && (
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="rounded-full bg-neutral-800 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-700"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full bg-red-900/60 px-3 py-1.5 text-sm text-red-200 hover:bg-red-900"
            >
              {confirmingReset ? "Yes, reset everything" : "Reset"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
