"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { decisionStore } from "@/lib/decisionStore";
import type { DecisionRecord, DecisionStatus, FilterPreferencesV1, MovieSnapshot } from "@/lib/decisionStore";
import {
  subscribeToChanges,
  getRawDecisionsSnapshot,
  getRawPreferencesSnapshot,
  parseDecisionsRaw,
  parsePreferencesRaw,
} from "@/lib/decisionStore/localStorageAdapter";

function getServerSnapshot(): string {
  return "";
}

/**
 * Reactive view over the decision store. Both `decisions` and `preferences`
 * are derived from useSyncExternalStore snapshots (not read live from
 * localStorage during render), so the initial client render matches SSR
 * exactly and only updates after hydration commits — no mismatch.
 */
export function useDecisionStore() {
  const decisionsRaw = useSyncExternalStore(subscribeToChanges, getRawDecisionsSnapshot, getServerSnapshot);
  const preferencesRaw = useSyncExternalStore(subscribeToChanges, getRawPreferencesSnapshot, getServerSnapshot);

  const hydrated = typeof window !== "undefined";

  const decisions = useMemo((): Record<number, DecisionRecord> => {
    const { decisions: raw } = parseDecisionsRaw(decisionsRaw);
    const result: Record<number, DecisionRecord> = {};
    for (const [id, record] of Object.entries(raw)) {
      result[Number(id)] = record;
    }
    return result;
  }, [decisionsRaw]);

  const preferences = useMemo((): FilterPreferencesV1 => parsePreferencesRaw(preferencesRaw), [preferencesRaw]);

  const setDecision = useCallback(
    (movieId: number, status: DecisionStatus, movieSnapshot: MovieSnapshot) => {
      decisionStore.setDecision(movieId, status, movieSnapshot);
    },
    []
  );

  const removeDecision = useCallback((movieId: number) => {
    decisionStore.removeDecision(movieId);
  }, []);

  const clearAll = useCallback(() => {
    decisionStore.clearAll();
  }, []);

  const setPreferences = useCallback((partial: Partial<Omit<FilterPreferencesV1, "version">>) => {
    decisionStore.setPreferences(partial);
  }, []);

  const getStatus = useCallback(
    (movieId: number): DecisionStatus | null => decisions[movieId]?.status ?? null,
    [decisions]
  );

  const getExclusionIds = useCallback((): number[] => decisionStore.getExclusionIds(), []);

  const getActiveMaybeLater = useCallback(() => decisionStore.getActiveMaybeLater(), []);

  return {
    hydrated,
    decisions,
    preferences,
    getStatus,
    setDecision,
    removeDecision,
    clearAll,
    setPreferences,
    getExclusionIds,
    getActiveMaybeLater,
  };
}
