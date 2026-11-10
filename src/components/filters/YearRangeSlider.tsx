import { EARLIEST_RELEASE_YEAR } from "@/lib/types/domain";

const MIN_YEAR = EARLIEST_RELEASE_YEAR;
const CURRENT_YEAR = new Date().getFullYear();

const THUMB_CLASSES =
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white " +
  "[&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
  "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 " +
  "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer";

function percent(year: number): number {
  return ((year - MIN_YEAR) / (CURRENT_YEAR - MIN_YEAR)) * 100;
}

export function YearRangeSlider({
  from,
  to,
  onChange,
}: {
  from: number | null;
  to: number | null;
  onChange: (from: number | null, to: number | null) => void;
}) {
  const fromValue = from ?? MIN_YEAR;
  const toValue = to ?? CURRENT_YEAR;

  const handleFromChange = (value: number) => {
    const clamped = Math.min(value, toValue);
    onChange(clamped === MIN_YEAR ? null : clamped, to);
  };

  const handleToChange = (value: number) => {
    const clamped = Math.max(value, fromValue);
    onChange(from, clamped === CURRENT_YEAR ? null : clamped);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-neutral-500">
        <span>Release year</span>
        <span className="normal-case text-neutral-300">
          {fromValue === MIN_YEAR ? "Any" : fromValue} – {toValue === CURRENT_YEAR ? "Now" : toValue}
        </span>
      </div>

      <div className="relative h-5">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-neutral-800" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-red-600"
          style={{ left: `${percent(fromValue)}%`, right: `${100 - percent(toValue)}%` }}
        />
        <input
          type="range"
          aria-label="From year"
          min={MIN_YEAR}
          max={CURRENT_YEAR}
          value={fromValue}
          onChange={(e) => handleFromChange(Number(e.target.value))}
          className={`pointer-events-none absolute top-0 h-5 w-full appearance-none bg-transparent ${THUMB_CLASSES}`}
        />
        <input
          type="range"
          aria-label="To year"
          min={MIN_YEAR}
          max={CURRENT_YEAR}
          value={toValue}
          onChange={(e) => handleToChange(Number(e.target.value))}
          className={`pointer-events-none absolute top-0 h-5 w-full appearance-none bg-transparent ${THUMB_CLASSES}`}
        />
      </div>
    </div>
  );
}
