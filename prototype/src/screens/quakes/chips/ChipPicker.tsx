// Shared chip-group component for the all-options activity. Renders a
// labelled multi-select group of chips, with a counter and max-pick cap.

interface ChipOption {
  id: string;
  label: string;
}

interface ChipPickerProps {
  label?: string;
  hint?: string;
  options: readonly ChipOption[];
  selected: readonly string[];
  onToggle: (id: string) => void;
  /** Maximum number of chips a student can select. Default: 3. */
  max?: number;
  /** Tone for the active state. 'rose' for everyday, 'amber' for synthesis. */
  tone?: 'rose' | 'amber';
}

export default function ChipPicker({
  label,
  hint,
  options,
  selected,
  onToggle,
  max = 3,
  tone = 'rose',
}: ChipPickerProps) {
  const atCap = selected.length >= max;
  const activeClasses =
    tone === 'amber'
      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-amber-500 shadow-md ring-2 ring-amber-200'
      : 'bg-gradient-to-br from-rose-600 to-rose-700 text-white border-rose-600 shadow-md ring-2 ring-rose-200';
  const counterPalette =
    selected.length === 0
      ? 'text-slate-400'
      : selected.length >= max
      ? tone === 'amber'
        ? 'text-amber-700 bg-amber-100'
        : 'text-rose-700 bg-rose-100'
      : tone === 'amber'
      ? 'text-amber-700 bg-amber-50'
      : 'text-rose-700 bg-rose-50';

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between gap-2">
          <div
            className={`text-xs font-bold tracking-widest ${
              tone === 'amber' ? 'text-amber-700' : 'text-rose-700'
            }`}
          >
            {label}
          </div>
          <div
            className={`text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full ${counterPalette}`}
          >
            {selected.length}/{max}
          </div>
        </div>
      )}
      {hint && <div className="text-sm text-slate-600 leading-snug">{hint}</div>}
      <div className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const active = selected.includes(opt.id);
          const disabled = !active && atCap;
          return (
            <button
              key={opt.id}
              onClick={() => onToggle(opt.id)}
              disabled={disabled}
              aria-pressed={active}
              className={`group/chip inline-flex items-center gap-2 text-left px-4 py-2.5 rounded-2xl text-sm font-semibold leading-snug transition-all border-2 ${
                active
                  ? activeClasses
                  : disabled
                  ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-rose-300 hover:bg-rose-50 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0'
              }`}
            >
              <ChipIcon active={active} disabled={disabled} tone={tone} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChipIcon({
  active,
  disabled,
  tone,
}: {
  active: boolean;
  disabled: boolean;
  tone: 'rose' | 'amber';
}) {
  if (active) {
    return (
      <span className="grid place-items-center w-5 h-5 rounded-full bg-white/25 text-white text-[11px] font-bold shrink-0 ring-1 ring-white/40">
        ✓
      </span>
    );
  }
  if (disabled) {
    return (
      <span className="grid place-items-center w-5 h-5 rounded-full bg-slate-100 text-slate-300 text-base leading-none font-light shrink-0">
        +
      </span>
    );
  }
  return (
    <span
      className={`grid place-items-center w-5 h-5 rounded-full text-base leading-none font-light shrink-0 transition-colors ${
        tone === 'amber'
          ? 'bg-amber-50 text-amber-600 group-hover/chip:bg-amber-100 group-hover/chip:text-amber-700'
          : 'bg-rose-50 text-rose-500 group-hover/chip:bg-rose-100 group-hover/chip:text-rose-700'
      }`}
    >
      +
    </span>
  );
}
