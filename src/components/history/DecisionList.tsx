import Image from "next/image";
import { posterUrl } from "@/lib/tmdb/images";
import type { DecisionRecord } from "@/lib/decisionStore";
import { MAYBE_LATER_COOLDOWN_DAYS } from "@/lib/selection/constants";

interface Entry {
  movieId: number;
  record: DecisionRecord;
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function DecisionList({
  entries,
  showEligibility,
  onUndo,
}: {
  entries: Entry[];
  showEligibility?: boolean;
  onUndo: (movieId: number) => void;
}) {
  if (entries.length === 0) {
    return <p className="py-8 text-center text-sm text-neutral-500">Nothing here yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {entries.map(({ movieId, record }) => {
        const poster = posterUrl(record.movieSnapshot.posterPath, "w200");
        const year = record.movieSnapshot.releaseDate?.slice(0, 4);
        const eligibleAt = record.timestamp + MAYBE_LATER_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

        return (
          <li
            key={movieId}
            className="flex items-center gap-3 rounded-lg bg-neutral-900/60 p-3"
          >
            <div className="h-16 w-11 shrink-0 overflow-hidden rounded bg-neutral-800">
              {poster && (
                <Image src={poster} alt="" width={100} height={150} className="h-full w-full object-cover" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-neutral-100">
                {record.movieSnapshot.title} {year && <span className="text-neutral-500">({year})</span>}
              </p>
              <p className="text-xs text-neutral-500">
                Decided {formatDate(record.timestamp)}
                {showEligibility && <> · eligible again on {formatDate(eligibleAt)}</>}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onUndo(movieId)}
              className="shrink-0 rounded-full bg-neutral-800 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-700"
            >
              Undo
            </button>
          </li>
        );
      })}
    </ul>
  );
}
