import { localStorageAdapter } from "@/lib/decisionStore/localStorageAdapter";
import type { DecisionStore } from "@/lib/decisionStore/DecisionStore";

export const decisionStore: DecisionStore = localStorageAdapter;

export type { DecisionStore } from "@/lib/decisionStore/DecisionStore";
export type {
  DecisionStatus,
  DecisionRecord,
  MovieSnapshot,
  FilterPreferencesV1,
  ActiveMaybeLater,
} from "@/lib/decisionStore/types";
