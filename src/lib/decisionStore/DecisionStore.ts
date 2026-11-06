import type { DecisionRecord, DecisionStatus, MovieSnapshot, FilterPreferencesV1, ActiveMaybeLater } from "@/lib/decisionStore/types";

/**
 * Behind this interface so a future accounts+DB backend can replace
 * localStorageAdapter without touching picker/filter/UI code.
 */
export interface DecisionStore {
  getAll(): Record<number, DecisionRecord>;
  getStatus(movieId: number): DecisionStatus | null;
  setDecision(movieId: number, status: DecisionStatus, snapshot: MovieSnapshot): void;
  removeDecision(movieId: number): void;
  getExclusionIds(now?: number): number[];
  getActiveMaybeLater(now?: number): ActiveMaybeLater[];
  clearAll(): void;
  getPreferences(): FilterPreferencesV1;
  setPreferences(partial: Partial<Omit<FilterPreferencesV1, "version">>): void;
}
