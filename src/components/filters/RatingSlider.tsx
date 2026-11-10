const THUMB_CLASSES =
  "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow " +
  "[&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 " +
  "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 " +
  "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer";

export function RatingSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const percent = (value / 10) * 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-neutral-500">
        <span>Minimum rating</span>
        <span className="normal-case text-neutral-300">
          {value === 0 ? "Any" : `${value.toFixed(1)}+ / 10`}
        </span>
      </div>

      <div className="relative h-5">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-neutral-800" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-red-600"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          aria-label="Minimum rating"
          min={0}
          max={10}
          step={0.5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`absolute top-0 h-5 w-full appearance-none bg-transparent ${THUMB_CLASSES}`}
        />
      </div>
    </div>
  );
}
