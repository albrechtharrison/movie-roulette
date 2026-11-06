import Image from "next/image";
import { posterUrl } from "@/lib/tmdb/images";
import type { Movie } from "@/lib/types/domain";
import type { DecisionStatus } from "@/lib/decisionStore";
import { FeedbackActions } from "@/components/picker/FeedbackActions";

export function MovieCard({
  movie,
  relaxed,
  currentStatus,
  onDecide,
}: {
  movie: Movie;
  relaxed?: string[];
  currentStatus: DecisionStatus | null;
  onDecide: (status: DecisionStatus) => void;
}) {
  const poster = posterUrl(movie.posterPath, "w342");
  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : null;
  const providers = movie.watchProviders?.flatrate ?? [];

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-neutral-900/60 p-4 shadow-lg sm:flex-row sm:p-6">
      <div className="mx-auto h-72 w-48 shrink-0 overflow-hidden rounded-lg bg-neutral-800 sm:mx-0">
        {poster ? (
          <Image src={poster} alt={movie.title} width={342} height={513} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
            No poster
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <div>
          <h2 className="text-xl font-semibold">
            {movie.title} {year && <span className="text-neutral-400">({year})</span>}
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            ⭐ {movie.voteAverage.toFixed(1)} · {movie.voteCount.toLocaleString()} votes
          </p>
        </div>

        <p className="text-sm leading-relaxed text-neutral-200">{movie.overview || "No synopsis available."}</p>

        {providers.length > 0 && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Streaming on</p>
            <p className="mt-1 text-sm text-neutral-200">
              {providers.map((p) => p.providerName).join(", ")}
            </p>
          </div>
        )}

        {relaxed && relaxed.length > 0 && (
          <p className="text-xs text-amber-400">
            Note: no exact matches, so we dropped the {relaxed.join(", ")} filter{relaxed.length > 1 ? "s" : ""}.
          </p>
        )}

        <div className="mt-1">
          <FeedbackActions currentStatus={currentStatus} onDecide={onDecide} />
        </div>
      </div>
    </div>
  );
}
