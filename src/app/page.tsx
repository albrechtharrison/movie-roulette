"use client";

import { useState } from "react";
import Link from "next/link";
import { usePickMovie } from "@/hooks/usePickMovie";
import { useDecisionStore } from "@/hooks/useDecisionStore";
import { PickButton } from "@/components/picker/PickButton";
import { MovieCard } from "@/components/picker/MovieCard";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { EMPTY_SELECTION, toFilters, type FilterSelection } from "@/lib/types/filterSelection";
import type { DecisionStatus } from "@/lib/decisionStore";

export default function Home() {
  const [localSelection, setLocalSelection] = useState<Omit<FilterSelection, "region">>(EMPTY_SELECTION);
  const pickMovie = usePickMovie();
  const { preferences, setPreferences, getExclusionIds, getStatus, setDecision } = useDecisionStore();

  // Region lives in shared preferences (persists across reloads and the history page);
  // the rest of the filters are session-only local state.
  const selection: FilterSelection = { ...localSelection, region: preferences.region };

  const handleSelectionChange = (next: FilterSelection) => {
    const { region, ...rest } = next;
    if (region !== preferences.region) setPreferences({ region });
    setLocalSelection(rest);
  };

  const handlePick = () => {
    pickMovie.mutate({ filters: toFilters(selection), exclusionIds: getExclusionIds() });
  };

  const result = pickMovie.data;
  const isEmpty = result && "empty" in result;
  const movie = result && !isEmpty ? result.movie : null;
  const relaxed = result && !isEmpty ? result.relaxed : undefined;

  const handleDecide = (status: DecisionStatus) => {
    if (!movie) return;
    setDecision(movie.id, status, {
      title: movie.title,
      posterPath: movie.posterPath,
      releaseDate: movie.releaseDate,
    });
    // The current movie is now excluded, so roll the next one right away.
    pickMovie.mutate({ filters: toFilters(selection), exclusionIds: getExclusionIds() });
  };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-8 px-4 py-12 sm:py-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Movie Roulette</h1>
        <p className="mt-2 text-neutral-400">Can&apos;t decide what to watch? Let us pick.</p>
      </div>

      <FilterPanel value={selection} onChange={handleSelectionChange} />

      <PickButton onClick={handlePick} loading={pickMovie.isPending} />

      {pickMovie.isError && (
        <p className="text-sm text-red-400">{(pickMovie.error as Error).message}</p>
      )}

      {isEmpty && (
        <p className="text-sm text-neutral-400">
          No movies match right now — try again or adjust your filters.
        </p>
      )}

      {movie && (
        <MovieCard
          movie={movie}
          relaxed={relaxed}
          currentStatus={getStatus(movie.id)}
          onDecide={handleDecide}
        />
      )}

      <Link href="/history" className="text-sm text-neutral-500 hover:text-neutral-300">
        View history →
      </Link>
    </main>
  );
}
