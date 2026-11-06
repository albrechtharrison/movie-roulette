import type { Filters } from "@/lib/types/domain";

export type DecisionStatus = "seen" | "not_interested" | "maybe_later";

export interface MovieSnapshot {
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
}

export interface DecisionRecord {
  status: DecisionStatus;
  timestamp: number;
  movieSnapshot: MovieSnapshot;
}

export interface DecisionStoreShapeV1 {
  version: 1;
  decisions: Record<string, DecisionRecord>;
}

export interface FilterPreferencesV1 {
  version: 1;
  region: string;
  lastFilters: Filters;
}

export interface ActiveMaybeLater {
  movieId: number;
  record: DecisionRecord;
  eligibleAt: number;
}
