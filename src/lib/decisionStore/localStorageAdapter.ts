import type { DecisionStore } from "@/lib/decisionStore/DecisionStore";
import type {
  ActiveMaybeLater,
  DecisionRecord,
  DecisionStatus,
  DecisionStoreShapeV1,
  FilterPreferencesV1,
} from "@/lib/decisionStore/types";
import { EMPTY_FILTERS } from "@/lib/types/domain";
import { MAYBE_LATER_COOLDOWN_DAYS } from "@/lib/selection/constants";

const DECISIONS_KEY = "movieroulette:decisions:v1";
const PREFERENCES_KEY = "movieroulette:preferences:v1";
const COOLDOWN_MS = MAYBE_LATER_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
const CHANGE_EVENT = "movieroulette:decisions-changed";

/** For useDecisionStore's useSyncExternalStore subscription (same-tab + cross-tab updates). */
export function subscribeToChanges(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Cheap, referentially-comparable snapshots for useSyncExternalStore (hydration-safe hook reads). */
export function getRawDecisionsSnapshot(): string {
  if (!isBrowser()) return "";
  try {
    return window.localStorage.getItem(DECISIONS_KEY) ?? "";
  } catch {
    return "";
  }
}

export function getRawPreferencesSnapshot(): string {
  if (!isBrowser()) return "";
  try {
    return window.localStorage.getItem(PREFERENCES_KEY) ?? "";
  } catch {
    return "";
  }
}

export function parseDecisionsRaw(raw: string): DecisionStoreShapeV1 {
  if (!raw) return { version: 1, decisions: {} };
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version === 1 && parsed?.decisions) return parsed;
    return { version: 1, decisions: {} };
  } catch {
    return { version: 1, decisions: {} };
  }
}

export function parsePreferencesRaw(raw: string): FilterPreferencesV1 {
  const fallback: FilterPreferencesV1 = {
    version: 1,
    region: EMPTY_FILTERS.region,
    lastFilters: EMPTY_FILTERS,
  };
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version === 1) return parsed;
    return fallback;
  } catch {
    return fallback;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readDecisions(): DecisionStoreShapeV1 {
  return parseDecisionsRaw(getRawDecisionsSnapshot());
}

function writeDecisions(shape: DecisionStoreShapeV1): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(DECISIONS_KEY, JSON.stringify(shape));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // localStorage can throw (quota, private mode); decisions simply won't persist.
  }
}

function readPreferences(): FilterPreferencesV1 {
  return parsePreferencesRaw(getRawPreferencesSnapshot());
}

function writePreferences(prefs: FilterPreferencesV1): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // best-effort; ignore write failures
  }
}

export const localStorageAdapter: DecisionStore = {
  getAll() {
    const { decisions } = readDecisions();
    const result: Record<number, DecisionRecord> = {};
    for (const [id, record] of Object.entries(decisions)) {
      result[Number(id)] = record;
    }
    return result;
  },

  getStatus(movieId) {
    const { decisions } = readDecisions();
    return decisions[String(movieId)]?.status ?? null;
  },

  setDecision(movieId, status, snapshot) {
    const shape = readDecisions();
    shape.decisions[String(movieId)] = {
      status,
      timestamp: Date.now(),
      movieSnapshot: snapshot,
    };
    writeDecisions(shape);
  },

  removeDecision(movieId) {
    const shape = readDecisions();
    delete shape.decisions[String(movieId)];
    writeDecisions(shape);
  },

  getExclusionIds(now = Date.now()) {
    const { decisions } = readDecisions();
    const ids: number[] = [];
    for (const [id, record] of Object.entries(decisions)) {
      if (record.status === "seen" || record.status === "not_interested") {
        ids.push(Number(id));
      } else if (record.status === "maybe_later") {
        const eligibleAt = record.timestamp + COOLDOWN_MS;
        if (now < eligibleAt) ids.push(Number(id));
      }
    }
    return ids;
  },

  getActiveMaybeLater(now = Date.now()) {
    const { decisions } = readDecisions();
    const active: ActiveMaybeLater[] = [];
    for (const [id, record] of Object.entries(decisions)) {
      if (record.status !== "maybe_later") continue;
      const eligibleAt = record.timestamp + COOLDOWN_MS;
      if (now < eligibleAt) {
        active.push({ movieId: Number(id), record, eligibleAt });
      }
    }
    return active;
  },

  clearAll() {
    writeDecisions({ version: 1, decisions: {} });
  },

  getPreferences() {
    return readPreferences();
  },

  setPreferences(partial) {
    const current = readPreferences();
    writePreferences({ ...current, ...partial, version: 1 });
  },
};

export type { DecisionStatus };
