interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
  formula?: string;
}

export default function Slider({ label, value, min, max, step = 0.1, onChange, formula }: SliderProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-semibold text-ink">
          {label}
          {formula && <span className="ml-1.5 text-xs font-mono text-slate-500">{formula}</span>}
        </label>
        <span className="font-mono text-sm tabular-nums text-sky-700 font-semibold">
          {value.toFixed(step >= 1 ? 0 : 2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
