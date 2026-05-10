import { useEffect, useRef, useState } from 'react';
import HostBubble from '../../components/HostBubble';

interface PlayProps {
  onNext: (trials: number[]) => void;
}

type GameState = 'idle' | 'waiting' | 'go' | 'feedback' | 'too-soon';

const TARGET_TRIALS = 10;

export default function ReactionPlay({ onNext }: PlayProps) {
  const [trials, setTrials] = useState<number[]>([]);
  const [state, setState] = useState<GameState>('idle');
  const [lastResult, setLastResult] = useState<number | null>(null);
  const goAtRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const startTrial = () => {
    setState('waiting');
    setLastResult(null);
    const delay = 1200 + Math.random() * 2400; // 1.2–3.6s
    timerRef.current = window.setTimeout(() => {
      goAtRef.current = performance.now();
      setState('go');
    }, delay);
  };

  const handleAction = () => {
    if (state === 'idle' || state === 'feedback' || state === 'too-soon') {
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
  }, [state]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const median = trials.length > 0 ? [...trials].sort((a, b) => a - b)[Math.floor(trials.length / 2)] : null;
  const mean = trials.length > 0 ? trials.reduce((s, x) => s + x, 0) / trials.length : null;
  const fastest = trials.length > 0 ? Math.min(...trials) : null;
  const slowest = trials.length > 0 ? Math.max(...trials) : null;

  const targetBg = {
    idle: 'bg-brand-900',
    waiting: 'bg-rose-700',
    go: 'bg-emerald-500',
    feedback: 'bg-brand-900',
    'too-soon': 'bg-amber-600',
  }[state];

  const targetMsg = {
    idle: 'Press SPACE to begin',
    waiting: 'Wait for green…',
    go: 'GO! Press SPACE',
    feedback: lastResult !== null ? `${lastResult} ms` : '',
    'too-soon': 'Too soon. Wait for green.',
  }[state];

  const canFinish = trials.length >= TARGET_TRIALS;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="shrink-0 grid place-items-center w-14 h-14 rounded-md bg-gradient-to-br from-violet-600 to-violet-900 text-white shadow-editorial">
          <div className="text-[10px] eyebrow opacity-80">ACT</div>
          <div className="text-xl font-display font-bold leading-none -mt-0.5">2</div>
        </div>
        <div>
          <div className="eyebrow text-violet-700">DEVELOP A MODEL</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-900 leading-tight">
            Play 10 trials. Build your distribution.
          </h1>
          <p className="text-sm text-ink-soft">Press SPACE the moment the screen turns green.</p>
        </div>
      </div>

      <HostBubble accent="emerald" name="Alex">
        Each trial is its own data point — your reaction time in milliseconds.
        Ten trials gives you a small dataset. From those ten numbers we'll
        compute the median, mean, fastest, slowest — the same summary
        statistics any professional psychologist would. Don't try to be clever
        and pre-press; the game catches that.
      </HostBubble>

      {/* Target */}
      <button
        onClick={handleAction}
        className={`w-full h-72 rounded-2xl ${targetBg} text-white shadow-editorial transition-colors duration-100 grid place-items-center select-none`}
      >
        <div className="text-center">
          <div className="eyebrow text-white/70 mb-2">Trial {trials.length + 1} / {TARGET_TRIALS}</div>
          <div className="font-display text-4xl md:text-6xl font-bold tabular-nums tracking-tight">
            {targetMsg}
          </div>
          {state === 'feedback' && lastResult !== null && (
            <div className="text-sm text-white/80 mt-3">
              {lastResult < 200 ? 'Lightning fast!' : lastResult < 280 ? 'Quick.' : lastResult < 360 ? 'Normal range.' : lastResult < 500 ? 'A bit slow today.' : 'Quite slow — try again?'}
            </div>
          )}
        </div>
      </button>

      <div className="text-xs text-ink-muted text-center">
        Tap / click the panel or press <kbd className="font-mono px-1.5 py-0.5 rounded bg-surface-subtle border border-surface-line">SPACE</kbd> · {state === 'go' ? 'NOW!' : state === 'waiting' ? 'wait for green' : 'press to start a trial'}
      </div>

      {/* Live distribution + stats */}
      <div className="grid md:grid-cols-[1fr_280px] gap-5">
        <div className="bg-surface-raised border border-surface-line rounded-lg p-5">
          <div className="eyebrow text-ink-muted mb-3">YOUR TRIALS</div>
          {trials.length === 0 ? (
            <div className="text-sm text-ink-muted italic">No trials yet.</div>
          ) : (
            <div>
              <div className="flex items-end gap-1 h-32">
                {trials.map((t, i) => {
                  const maxT = Math.max(500, ...trials);
                  const h = (t / maxT) * 100;
                  const tone = t < 200 ? 'bg-emerald-500' : t < 280 ? 'bg-emerald-400' : t < 360 ? 'bg-amber-400' : t < 500 ? 'bg-amber-600' : 'bg-rose-500';
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className="text-[9px] font-mono text-ink-muted mb-0.5 tabular-nums">{t}</div>
                      <div className={`w-full ${tone} rounded-t`} style={{ height: `${h}%` }} />
                    </div>
                  );
                })}
                {Array.from({ length: Math.max(0, TARGET_TRIALS - trials.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex-1 flex flex-col items-end justify-end h-full opacity-30">
                    <div className="w-full bg-surface-line rounded-t" style={{ height: '4%' }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-ink-muted mt-1.5 font-mono">
                <span>trial 1</span>
                <span>trial {TARGET_TRIALS}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-surface-raised border border-surface-line rounded-lg p-5 space-y-3">
          <div className="eyebrow text-ink-muted">SUMMARY · YOUR DATA</div>
          <Stat label="Median" value={median !== null ? `${median} ms` : '—'} tone="brand" />
          <Stat label="Mean" value={mean !== null ? `${mean.toFixed(0)} ms` : '—'} tone="brand" />
          <Stat label="Fastest" value={fastest !== null ? `${fastest} ms` : '—'} tone="emerald" />
          <Stat label="Slowest" value={slowest !== null ? `${slowest} ms` : '—'} tone="amber" />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onNext(trials)}
          disabled={!canFinish}
          className="px-6 py-3 rounded-md bg-brand-900 text-white font-semibold shadow-editorial hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
        >
          {canFinish ? 'Next: interpret →' : `${TARGET_TRIALS - trials.length} more trials`}
        </button>
      </div>
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
