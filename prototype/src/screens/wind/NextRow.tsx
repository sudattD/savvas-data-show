// Inline Back / Next row rendered below each Act's content. The parent page
// owns the row; each Act publishes its readiness via onAdvanceStateChange so
// the Next button knows the right label, whether to be enabled, and what to
// do on click. Back is also Act-published so it can step within the Act;
// the parent fills in a cross-Act fallback when the Act is on its first step.
export interface AdvanceState {
  canAdvance: boolean;
  hint: string;
  advance: () => void;
  nextLabel: string;
  back?: () => void;
  backLabel?: string;
  // Optional: each Act publishes its current step and full step labels so
  // the persistent ActRail can render sub-steps under the active Act.
  step?: number;
  stepLabels?: string[];
}

interface NextRowProps {
  advance: AdvanceState | null;
  fallbackBack?: () => void;
  fallbackBackLabel?: string;
}

export default function NextRow({ advance, fallbackBack, fallbackBackLabel }: NextRowProps) {
  const ready = advance?.canAdvance ?? false;
  const onBack = advance?.back ?? fallbackBack;
  const backLabel = advance?.backLabel ?? fallbackBackLabel ?? 'Back';
  const handleNext = () => advance?.advance();
  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      {onBack ? (
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 transition"
        >
          ← {backLabel}
        </button>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-3">
        {!ready && advance?.hint && (
          <span className="text-xs text-slate-500 hidden sm:block">{advance.hint}</span>
        )}
        <button
          onClick={handleNext}
          disabled={!ready}
          title={!ready ? advance?.hint : undefined}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
        >
          {advance?.nextLabel ?? 'Next →'}
        </button>
      </div>
    </div>
  );
}
