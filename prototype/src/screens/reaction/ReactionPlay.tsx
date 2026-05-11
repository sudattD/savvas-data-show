import { useCallback, useEffect, useRef, useState } from 'react';
import HostBubble from '../../components/HostBubble';

export type ReactionTrials = { visual: number[]; audio: number[] };

interface PlayProps {
  onNext: (trials: ReactionTrials) => void;
}

type GameState = 'idle' | 'waiting' | 'go' | 'feedback' | 'too-soon';
type Mode = 'visual' | 'audio';

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

export default function ReactionPlay({ onNext }: PlayProps) {
  const [mode, setMode] = useState<Mode>('visual');
  const [visualTrials, setVisualTrials] = useState<number[]>([]);
  const [audioTrials, setAudioTrials] = useState<number[]>([]);
  const [state, setState] = useState<GameState>('idle');
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [showTransition, setShowTransition] = useState(false);
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
      // Don't allow starting another trial once we've hit target — force the next step
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

  // Auto-trigger transition once visual round is done
  useEffect(() => {
    if (mode === 'visual' && visualTrials.length === TARGET_TRIALS && state === 'feedback') {
      setShowTransition(true);
    }
  }, [mode, visualTrials.length, state]);

  const switchToAudio = () => {
    setMode('audio');
    setState('idle');
    setLastResult(null);
    setShowTransition(false);
  };

  const median = trials.length > 0 ? [...trials].sort((a, b) => a - b)[Math.floor(trials.length / 2)] : null;
  const visualMedian = visualTrials.length > 0 ? [...visualTrials].sort((a, b) => a - b)[Math.floor(visualTrials.length / 2)] : null;
  const audioMedian = audioTrials.length > 0 ? [...audioTrials].sort((a, b) => a - b)[Math.floor(audioTrials.length / 2)] : null;
  const fastest = trials.length > 0 ? Math.min(...trials) : null;
  const slowest = trials.length > 0 ? Math.max(...trials) : null;

  // Visual mode keeps the green flash; audio mode keeps the panel neutral so the cue is sound-only.
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

  const allDone = visualTrials.length >= TARGET_TRIALS && audioTrials.length >= TARGET_TRIALS;

  const accent = mode === 'visual' ? 'emerald' : 'violet';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="shrink-0 grid place-items-center w-14 h-14 rounded-md bg-gradient-to-br from-violet-600 to-violet-900 text-white shadow-editorial">
          <div className="text-[10px] eyebrow opacity-80">ACT</div>
          <div className="text-xl font-display font-bold leading-none -mt-0.5">2</div>
        </div>
        <div>
          <div className="eyebrow text-violet-700">
            {mode === 'visual' ? 'ROUND 1 · EYES' : 'ROUND 2 · EARS'}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-900 leading-tight">
            {mode === 'visual' ? '10 trials — react to the flash.' : '10 trials — react to the beep.'}
          </h1>
          <p className="text-sm text-ink-soft">
            {mode === 'visual'
              ? 'Press SPACE the moment the panel turns green.'
              : 'Look away if you like — press SPACE the moment you hear the beep.'}
          </p>
        </div>
      </div>

      <HostBubble accent={accent === 'violet' ? 'purple' : 'emerald'} name="Alex">
        {mode === 'visual' ? (
          <>
            Each trial is one data point — your reaction time in milliseconds.
            Ten trials gives you a small dataset. From those ten numbers we'll
            compute the median, mean, fastest, slowest — the same summary stats
            a psychology lab would. Don't try to pre-press; the game catches that.
          </>
        ) : (
          <>
            Same idea, different sense. Sound reaches your brain through a
            shorter pathway than vision, so this round is often <em>faster</em>.
            Real psychophysics labs run this exact comparison.
          </>
        )}
      </HostBubble>

      <button
        onClick={handleAction}
        className={`w-full h-72 rounded-2xl ${targetBg} text-white shadow-editorial transition-colors duration-100 grid place-items-center select-none`}
      >
        <div className="text-center">
          <div className="eyebrow text-white/70 mb-2">
            {mode === 'visual' ? 'Visual' : 'Audio'} · Trial {Math.min(trials.length + 1, TARGET_TRIALS)} / {TARGET_TRIALS}
          </div>
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
        Tap / click the panel or press <kbd className="font-mono px-1.5 py-0.5 rounded bg-surface-subtle border border-surface-line">SPACE</kbd>
        {mode === 'audio' && <> · audio cue plays through your speakers</>}
      </div>

      {/* Live distribution + stats */}
      <div className="grid md:grid-cols-[1fr_280px] gap-5">
        <div className="bg-surface-raised border border-surface-line rounded-lg p-5">
          <div className="eyebrow text-ink-muted mb-3">YOUR {mode.toUpperCase()} TRIALS</div>
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
          <div className="eyebrow text-ink-muted">SUMMARY · ROUND {mode === 'visual' ? '1' : '2'}</div>
          <Stat label="Median" value={median !== null ? `${median} ms` : '—'} tone="brand" />
          <Stat label="Fastest" value={fastest !== null ? `${fastest} ms` : '—'} tone="emerald" />
          <Stat label="Slowest" value={slowest !== null ? `${slowest} ms` : '—'} tone="amber" />
          {visualMedian !== null && audioMedian !== null && (
            <div className="pt-2 border-t border-surface-line text-xs text-ink-muted leading-relaxed">
              Visual median <strong className="text-ink">{visualMedian}</strong> · audio median <strong className="text-ink">{audioMedian}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Transition card after round 1 */}
      {showTransition && (
        <div className="bg-violet-50 border border-violet-300 rounded-lg p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="eyebrow text-violet-800 mb-1">ROUND 1 COMPLETE</div>
            <div className="text-sm text-ink">
              Visual median: <strong>{visualMedian} ms</strong>. Now try the same test with sound.
              Make sure your volume is on.
            </div>
          </div>
          <button
            onClick={switchToAudio}
            className="px-5 py-2.5 rounded-md bg-violet-700 text-white font-semibold shadow hover:bg-violet-800 transition"
          >
            Start audio round →
          </button>
        </div>
      )}

      {allDone && (
        <div className="flex justify-end">
          <button
            onClick={() => onNext({ visual: visualTrials, audio: audioTrials })}
            className="px-6 py-3 rounded-md bg-brand-900 text-white font-semibold shadow-editorial hover:bg-brand-700 transition"
          >
            Next: interpret →
          </button>
        </div>
      )}
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
