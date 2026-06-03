import type { ReactNode } from 'react';

export interface ReactionAdvanceState {
  canAdvance: boolean;
  hint: string;
  advance: () => void;
  nextLabel: string;
  back?: () => void;
  backLabel?: string;
  step?: number;
  stepLabels?: string[];
}

interface ReactionActFrameProps {
  actNumber: 1 | 2 | 3;
  eyebrow: string;
  title: string;
  step: number;
  stepTotal: number;
  stepLabel: string;
  stepSubhead: string;
  children: ReactNode;
}

const ACTS = [
  { num: 1, label: 'Act 1', sub: 'Notice & wonder' },
  { num: 2, label: 'Act 2', sub: 'Investigate' },
  { num: 3, label: 'Act 3', sub: 'Reveal' },
] as const;

type RailState = 'done' | 'active' | 'upcoming';

export function ReactionClassicBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f1e8] text-ink">
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 18% 12%, rgba(124, 58, 237, 0.16), transparent 34%), radial-gradient(circle at 82% 20%, rgba(16, 185, 129, 0.12), transparent 32%), linear-gradient(135deg, rgba(10,21,48,0.04), rgba(255,255,255,0))',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function ReactionActFrame({
  actNumber,
  eyebrow,
  title,
  step,
  stepTotal,
  stepLabel,
  stepSubhead,
  children,
}: ReactionActFrameProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-violet-200/80 bg-white shadow-[0_18px_55px_-34px_rgba(49,33,115,0.55)]">
      <header className="relative overflow-hidden border-b border-violet-200 bg-slate-950 px-5 py-6 text-white sm:px-7">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(circle at 18% 26%, rgba(139,92,246,0.42), transparent 28%), radial-gradient(circle at 78% 18%, rgba(20,184,166,0.24), transparent 30%), linear-gradient(135deg, #17153b 0%, #0f172a 70%)',
          }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur">
              <div className="text-center">
                <div className="text-[9px] font-bold tracking-widest text-violet-200">ACT</div>
                <div className="font-display text-2xl font-bold leading-none">{actNumber}</div>
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold tracking-widest text-violet-200">{eyebrow}</div>
              <h1 className="mt-1 font-display text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
            </div>
          </div>
          <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-violet-100 backdrop-blur">
            Step {step} / {stepTotal}
          </div>
        </div>
      </header>

      <div className="px-5 py-5 sm:px-7 sm:py-6">
        <div className="mb-5 rounded-xl border border-surface-line bg-surface-subtle/50 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-widest text-ink-muted">
            <StepDots step={step} total={stepTotal} />
            <span>{stepLabel.toUpperCase()}</span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{stepSubhead}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

export function ReactionProgressRail({
  current,
  step,
  stepLabels,
}: {
  current: 1 | 2 | 3;
  step?: number;
  stepLabels?: string[];
}) {
  return (
    <aside
      aria-label="Activity progress"
      className="hidden xl:flex fixed left-6 top-28 z-10 w-72 flex-col rounded-2xl border border-violet-200/70 bg-white/80 p-4 shadow-[0_18px_50px_-34px_rgba(49,33,115,0.65)] backdrop-blur"
    >
      <div className="mb-4">
        <div className="text-[10px] font-bold tracking-widest text-violet-700">REACTION TIME ARENA</div>
        <div className="mt-1 text-xs leading-relaxed text-ink-muted">Track the question, the trials, and the reveal.</div>
      </div>
      {ACTS.map((act, index) => {
        const state: RailState = act.num < current ? 'done' : act.num === current ? 'active' : 'upcoming';
        return (
          <div key={act.num} className="flex flex-col">
            <div className="flex items-center gap-3">
              <RailDot num={act.num} state={state} />
              <div>
                <div className={`text-[10px] font-bold tracking-widest ${state === 'active' ? 'text-violet-700' : 'text-slate-400'}`}>
                  {act.label.toUpperCase()}
                </div>
                <div className={`font-display text-lg font-bold leading-tight ${state === 'active' ? 'text-ink' : 'text-slate-500'}`}>
                  {act.sub}
                </div>
              </div>
            </div>

            {state === 'active' && step && stepLabels && (
              <ol className="ml-[18px] mt-3 space-y-2 border-l-2 border-violet-200 pl-5">
                {stepLabels.map((label, idx) => {
                  const sn = idx + 1;
                  const stepState: RailState = sn < step ? 'done' : sn === step ? 'active' : 'upcoming';
                  return (
                    <li key={label} className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          stepState === 'active'
                            ? 'bg-violet-600 ring-4 ring-violet-100'
                            : stepState === 'done'
                            ? 'bg-emerald-500'
                            : 'bg-slate-300'
                        }`}
                      />
                      <span className={`text-sm font-semibold ${stepState === 'active' ? 'text-ink' : 'text-slate-500'}`}>
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}

            {index < ACTS.length - 1 && (
              <div className={`my-2 ml-[18px] h-8 w-0.5 rounded-full ${state === 'done' ? 'bg-emerald-300' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </aside>
  );
}

export function ReactionNextRow({
  advance,
  fallbackBack,
  fallbackBackLabel,
}: {
  advance: ReactionAdvanceState | null;
  fallbackBack?: () => void;
  fallbackBackLabel?: string;
}) {
  const ready = advance?.canAdvance ?? false;
  const onBack = advance?.back ?? fallbackBack;
  const backLabel = advance?.backLabel ?? fallbackBackLabel ?? 'Back';
  return (
    <div className="sticky bottom-4 z-20 mt-8 rounded-2xl border border-violet-200/70 bg-white/88 p-3 shadow-[0_18px_60px_-32px_rgba(49,33,115,0.6)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        {onBack ? (
          <button
            onClick={onBack}
            className="rounded-xl border border-surface-line px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-800"
          >
            ← {backLabel}
          </button>
        ) : (
          <span />
        )}
        <div className="flex min-w-0 items-center gap-3">
          {!ready && advance?.hint && (
            <span className="hidden truncate text-xs text-ink-muted sm:block">{advance.hint}</span>
          )}
          <button
            onClick={() => advance?.advance()}
            disabled={!ready}
            title={!ready ? advance?.hint : undefined}
            className="rounded-xl bg-violet-700 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-violet-600 hover:shadow-lg disabled:bg-slate-300 disabled:text-white disabled:shadow-none"
          >
            {advance?.nextLabel ?? 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="mr-1 flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`rounded-full ${
            i + 1 === step
              ? 'h-2.5 w-6 bg-violet-600'
              : i + 1 < step
              ? 'h-2.5 w-2.5 bg-emerald-500'
              : 'h-2.5 w-2.5 bg-slate-300'
          }`}
        />
      ))}
    </div>
  );
}

function RailDot({ state, num }: { state: RailState; num: number }) {
  if (state === 'active') {
    return (
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-700 font-display text-sm font-bold text-white shadow-md ring-4 ring-violet-100">
        {num}
      </div>
    );
  }
  if (state === 'done') {
    return (
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-500 text-sm font-bold text-white">
        ✓
      </div>
    );
  }
  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-slate-300 bg-white font-display text-sm font-bold text-slate-400">
      {num}
    </div>
  );
}
