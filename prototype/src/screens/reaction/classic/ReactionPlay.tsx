import { useCallback, useEffect, useRef, useState } from 'react';
import { NarratorSays } from './Narrator';
import { ReactionActFrame } from './ReactionClassicShell';
import type { ReactionAdvanceState } from './ReactionClassicShell';

export type ReactionTrials = { visual: number[]; audio: number[] };

interface PlayProps {
  onNext: (trials: ReactionTrials) => void;
  onAdvanceStateChange?: (state: ReactionAdvanceState) => void;
}

type Step = 1 | 2;

const STEP_LABELS: Record<Step, string> = {
  1: 'Visual trials',
  2: 'Audio trials',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2]];
const TARGET_TRIALS = 10;

function useBeep() {
  const ctxRef = useRef<AudioContext | null>(null);
  return useCallback(() => {
    try {
      if (!ctxRef.current) {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctxRef.current = new Ctor();
      }
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.35, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // audio not available — silent fallback
    }
  }, []);
}

export default function ReactionPlay({ onNext, onAdvanceStateChange }: PlayProps) {
  const [step, setStep] = useState<Step>(1);
  const mode = step === 1 ? 'visual' : 'audio';
  const [visualTrials, setVisualTrials] = useState<number[]>([]);
  const [audioTrials, setAudioTrials] = useState<number[]>([]);
  const [state, setState] = useState<'idle' | 'waiting' | 'go' | 'feedback' | 'too-soon'>('idle');
  const [lastResult, setLastResult] = useState<number | null>(null);
  const goAtRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const beep = useBeep();

  const trials = mode === 'visual' ? visualTrials : audioTrials;
  const setTrials = mode === 'visual' ? setVisualTrials : setAudioTrials;

  const startTrial = () => {
    setState('waiting');
    setLastResult(null);
    const delay = 1200 + Math.random() * 2400;
    timerRef.current = window.setTimeout(() => {
      goAtRef.current = performance.now();
      if (mode === 'audio') beep();
      setState('go');
    }, delay);
  };

  const handleAction = () => {
    if (state === 'idle' || state === 'feedback' || state === 'too-soon') {
      if (trials.length >= TARGET_TRIALS) return;
      startTrial();
    } else if (state === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState('too-soon');
    } else if (state === 'go') {
      const elapsed = performance.now() - (goAtRef.current ?? performance.now());
      const ms = Math.round(elapsed);
      setLastResult(ms);
      setTrials((prev) => [...prev, ms]);
      setState('feedback');
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAction();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, mode, trials.length]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const allDone = visualTrials.length >= TARGET_TRIALS && audioTrials.length >= TARGET_TRIALS;
  const visualDone = visualTrials.length >= TARGET_TRIALS;

  const canAdvance =
    (step === 1 && visualDone) ||
    (step === 2 && allDone);

  const hint =
    step === 1 && !visualDone
      ? `Complete ${TARGET_TRIALS} visual trials to continue.`
      : step === 2 && !allDone
      ? `Complete ${TARGET_TRIALS} audio trials to continue.`
      : '';

  const nextLabel =
    step === 1 ? 'Next: Audio trials →' :
    'Next: Interpret →';

  const handleAdvance = () => {
    if (step === 1) setStep(2);
    else onNext({ visual: visualTrials, audio: audioTrials });
  };

  const advanceRef = useRef(handleAdvance);
  advanceRef.current = handleAdvance;

  useEffect(() => {
    onAdvanceStateChange?.({
      canAdvance,
      hint,
      advance: () => advanceRef.current(),
      nextLabel,
      back: step > 1 ? () => setStep(1) : undefined,
      backLabel: step > 1 ? 'Back to visual trials' : undefined,
      step,
      stepLabels: STEP_LABEL_LIST,
    });
  }, [step, canAdvance, hint, nextLabel, onAdvanceStateChange, visualTrials.length, audioTrials.length]);

  const median = trials.length > 0 ? [...trials].sort((a, b) => a - b)[Math.floor(trials.length / 2)] : null;
  const fastest = trials.length > 0 ? Math.min(...trials) : null;
  const slowest = trials.length > 0 ? Math.max(...trials) : null;

  const targetBg = mode === 'visual'
    ? {
        idle: 'bg-brand-900',
        waiting: 'bg-rose-700',
        go: 'bg-emerald-500',
        feedback: 'bg-brand-900',
        'too-soon': 'bg-amber-600',
      }[state]
    : {
        idle: 'bg-brand-900',
        waiting: 'bg-violet-900',
        go: 'bg-violet-900',
        feedback: 'bg-brand-900',
        'too-soon': 'bg-amber-600',
      }[state];

  const targetMsg = {
    idle: trials.length === 0 ? (mode === 'visual' ? 'Press SPACE to begin' : 'Press SPACE — react to the BEEP') : 'Press SPACE for next trial',
    waiting: mode === 'visual' ? 'Wait for green…' : 'Listen for the beep…',
    go: mode === 'visual' ? 'GO! Press SPACE' : 'BEEP! Press SPACE',
    feedback: lastResult !== null ? `${lastResult} ms` : '',
    'too-soon': mode === 'visual' ? 'Too soon. Wait for green.' : 'Too soon. Wait for the beep.',
  }[state];

  const stepSubhead =
    step === 1
      ? 'React to the flash. 10 trials, then we switch to audio.'
      : 'React to the beep. Same game, different sense.';

  return (
    <ReactionActFrame
      actNumber={2}
      eyebrow={`INVESTIGATE · ${mode === 'visual' ? 'EYES' : 'EARS'}`}
      title={mode === 'visual' ? '10 trials — react to the flash.' : '10 trials — react to the beep.'}
      step={step}
      stepTotal={2}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={stepSubhead}
    >
      <NarratorSays lineKey={mode === 'visual' ? 'act2Visual' : 'act2Audio'} />

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-surface-line bg-surface-subtle/60 p-2">
            <RoundBadge
              active={mode === 'visual'}
              complete={visualTrials.length >= TARGET_TRIALS}
              label="Eyes"
              detail={`${visualTrials.length}/${TARGET_TRIALS} visual`}
              tone="violet"
            />
            <RoundBadge
              active={mode === 'audio'}
              complete={audioTrials.length >= TARGET_TRIALS}
              label="Ears"
              detail={`${audioTrials.length}/${TARGET_TRIALS} audio`}
              tone="emerald"
            />
          </div>

          <button
            onClick={handleAction}
            className={`relative grid h-80 w-full select-none place-items-center overflow-hidden rounded-3xl ${targetBg} text-white shadow-[0_24px_70px_-38px_rgba(15,23,42,0.9)] transition-colors duration-100`}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-35"
              style={{
                background:
                  mode === 'visual'
                    ? 'radial-gradient(circle at center, rgba(255,255,255,0.34), transparent 28%), repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0 1px, transparent 1px 44px)'
                    : 'radial-gradient(circle at center, rgba(255,255,255,0.22), transparent 25%), repeating-radial-gradient(circle at center, rgba(255,255,255,0.13) 0 1px, transparent 1px 34px)',
              }}
            />
            <div className="relative text-center">
              <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[10px] font-bold tracking-widest text-white/75 backdrop-blur">
                {mode === 'visual' ? 'VISUAL CUE' : 'AUDIO CUE'} · TRIAL {Math.min(trials.length + 1, TARGET_TRIALS)} / {TARGET_TRIALS}
              </div>
              <div className="font-display text-4xl font-bold tracking-tight tabular-nums md:text-7xl">
                {targetMsg}
              </div>
              {state === 'feedback' && lastResult !== null && (
                <div className="mt-4 text-sm text-white/80">
                  {lastResult < 200 ? 'Lightning fast!' : lastResult < 280 ? 'Quick.' : lastResult < 360 ? 'Normal range.' : lastResult < 500 ? 'A bit slow today.' : 'Quite slow — try again?'}
                </div>
              )}
            </div>
          </button>

          <div className="rounded-xl border border-surface-line bg-white px-4 py-3 text-center text-xs text-ink-muted">
            Tap / click the arena or press <kbd className="rounded bg-surface-subtle px-1.5 py-0.5 font-mono">SPACE</kbd>
            {mode === 'audio' && <> · sound cue plays through your speakers</>}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
            <div className="text-[10px] font-bold tracking-widest text-ink-muted">LIVE DATASET</div>
            <div className="mt-1 font-display text-xl font-bold text-brand-900">
              {mode === 'visual' ? 'Visual trials' : 'Audio trials'}
            </div>
            {trials.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-surface-line bg-surface-subtle/50 p-5 text-center text-sm text-ink-muted">
                No trials yet.
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex h-36 items-end gap-1">
                  {trials.map((t, i) => {
                    const maxT = Math.max(500, ...trials);
                    const h = (t / maxT) * 100;
                    const tone = t < 200 ? 'bg-emerald-500' : t < 280 ? 'bg-emerald-400' : t < 360 ? 'bg-amber-400' : t < 500 ? 'bg-amber-600' : 'bg-rose-500';
                    return (
                      <div key={i} className="flex h-full flex-1 flex-col items-center justify-end">
                        <div className="mb-0.5 text-[9px] font-mono tabular-nums text-ink-muted">{t}</div>
                        <div className={`w-full rounded-t ${tone}`} style={{ height: `${h}%` }} />
                      </div>
                    );
                  })}
                  {Array.from({ length: Math.max(0, TARGET_TRIALS - trials.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="flex h-full flex-1 flex-col items-end justify-end opacity-30">
                      <div className="w-full rounded-t bg-surface-line" style={{ height: '4%' }} />
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between font-mono text-[10px] text-ink-muted">
                  <span>trial 1</span>
                  <span>trial {TARGET_TRIALS}</span>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-surface-line bg-surface-raised p-5">
            <div className="text-[10px] font-bold tracking-widest text-ink-muted">SUMMARY · {mode === 'visual' ? 'EYES' : 'EARS'}</div>
            <div className="mt-3 space-y-3">
              <Stat label="Median" value={median !== null ? `${median} ms` : '—'} tone="brand" />
              <Stat label="Fastest" value={fastest !== null ? `${fastest} ms` : '—'} tone="emerald" />
              <Stat label="Slowest" value={slowest !== null ? `${slowest} ms` : '—'} tone="amber" />
            </div>
          </div>
        </aside>
      </div>
    </ReactionActFrame>
  );
}

function RoundBadge({
  active,
  complete,
  label,
  detail,
  tone,
}: {
  active: boolean;
  complete: boolean;
  label: string;
  detail: string;
  tone: 'violet' | 'emerald';
}) {
  const activeCls =
    tone === 'violet'
      ? 'border-violet-400 bg-violet-50 text-violet-900'
      : 'border-emerald-400 bg-emerald-50 text-emerald-900';
  return (
    <div
      className={`rounded-xl border px-4 py-3 transition ${
        active ? activeCls : complete ? 'border-emerald-200 bg-white text-emerald-800' : 'border-transparent bg-white text-ink-muted'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-display text-lg font-bold">{label}</div>
        {complete && <span className="text-xs font-bold">✓</span>}
      </div>
      <div className="text-xs font-semibold opacity-75">{detail}</div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: 'brand' | 'emerald' | 'amber' }) {
  const t = {
    brand: 'text-brand-900',
    emerald: 'text-emerald-700',
    amber: 'text-amber-700',
  }[tone];
  return (
    <div className="flex items-baseline justify-between border-b border-surface-line py-1.5 last:border-0">
      <span className="text-xs text-ink-muted">{label}</span>
      <span className={`font-display text-lg font-bold tabular-nums ${t}`}>{value}</span>
    </div>
  );
}
