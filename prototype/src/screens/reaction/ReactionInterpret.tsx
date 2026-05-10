import { useState } from 'react';
import HostBubble from '../../components/HostBubble';
import type { IdentifyState } from './ReactionIdentify';

interface InterpretProps {
  identify: IdentifyState;
  trials: number[];
  onRestart: () => void;
}

// Published research: median simple visual reaction time is ~270ms in adults (Deary et al 2001; Woods et al 2015)
const CANONICAL_MEDIAN = 270;

export default function ReactionInterpret({ identify, trials, onRestart }: InterpretProps) {
  const sorted = [...trials].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const mean = trials.reduce((s, x) => s + x, 0) / trials.length;
  const fastest = sorted[0];
  const slowest = sorted[sorted.length - 1];
  const stdDev = Math.sqrt(trials.reduce((s, x) => s + (x - mean) ** 2, 0) / trials.length);

  const inBounds = median >= identify.tooLow && median <= identify.tooHigh;
  const closeness = Math.abs(median - identify.conjecture);
  const closenessLabel = closeness < 30 ? 'Right on the money.' : closeness < 80 ? 'Pretty close.' : 'A long way off your guess.';

  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="shrink-0 grid place-items-center w-14 h-14 rounded-md bg-gradient-to-br from-violet-600 to-violet-900 text-white shadow-editorial">
          <div className="text-[10px] eyebrow opacity-80">ACT</div>
          <div className="text-xl font-display font-bold leading-none -mt-0.5">3</div>
        </div>
        <div>
          <div className="eyebrow text-violet-700">INTERPRET THE RESULTS</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-900 leading-tight">
            What does it mean?
          </h1>
          <p className="text-sm text-ink-soft">Compare your data, your guess, and the published research.</p>
        </div>
      </div>

      <HostBubble accent="emerald" name="Alex">
        You played {trials.length} trials. Your median reaction time was{' '}
        <strong>{median} ms</strong>. Your guess was{' '}
        <strong>{identify.conjecture} ms</strong>. You said the answer would
        be between <strong>{identify.tooLow}</strong> and{' '}
        <strong>{identify.tooHigh} ms</strong>. {closenessLabel}
      </HostBubble>

      {/* Comparison stats */}
      <div className="grid md:grid-cols-3 gap-3">
        <Stat label="Your bounds" value={`${identify.tooLow} – ${identify.tooHigh}`} unit="ms" tone="amber" />
        <Stat
          label="Your median"
          value={`${median}`}
          unit="ms"
          tone={inBounds ? 'emerald' : 'rose'}
          sub={inBounds ? 'Inside your bounds' : 'Outside your bounds'}
        />
        <Stat
          label="Research median"
          value={`${CANONICAL_MEDIAN}`}
          unit="ms"
          tone="brand"
          sub="adults, Woods et al. 2015"
        />
      </div>

      {/* Full distribution viz */}
      <div className="bg-surface-raised border border-surface-line rounded-lg p-5">
        <div className="eyebrow text-ink-muted mb-3">YOUR DISTRIBUTION · {trials.length} TRIALS</div>
        <div className="relative h-48">
          <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="w-full h-full">
            {/* Axis */}
            <line x1={20} x2={580} y1={170} y2={170} stroke="#94A3B8" strokeWidth={1} />
            {/* Ticks */}
            {[100, 200, 300, 400, 500, 600].map((ms) => {
              const x = 20 + ((ms - 50) / 600) * 560;
              return (
                <g key={ms}>
                  <line x1={x} x2={x} y1={170} y2={175} stroke="#94A3B8" strokeWidth={1} />
                  <text x={x} y={188} textAnchor="middle" fontSize="9" fill="#64748B" fontFamily="monospace">{ms}</text>
                </g>
              );
            })}
            <text x={580} y={188} textAnchor="end" fontSize="9" fill="#64748B" fontFamily="monospace" fontWeight="700">ms</text>

            {/* Bounds shading */}
            <rect
              x={20 + ((identify.tooLow - 50) / 600) * 560}
              y={20}
              width={Math.max(2, ((identify.tooHigh - identify.tooLow) / 600) * 560)}
              height={150}
              fill="#FBD78A"
              fillOpacity={0.18}
              stroke="#E18809"
              strokeOpacity={0.3}
              strokeDasharray="4 3"
            />

            {/* Trial dots */}
            {trials.map((t, i) => {
              const x = 20 + ((t - 50) / 600) * 560;
              return (
                <circle key={i} cx={x} cy={130 + (i % 5) * 6} r={5} fill="#7C3AED" fillOpacity={0.7} />
              );
            })}

            {/* Your median */}
            <line
              x1={20 + ((median - 50) / 600) * 560}
              x2={20 + ((median - 50) / 600) * 560}
              y1={30} y2={170}
              stroke="#1A2A52" strokeWidth={2.5}
            />
            <text x={20 + ((median - 50) / 600) * 560} y={24} textAnchor="middle" fontSize="11" fill="#1A2A52" fontWeight="700">your median {median}</text>

            {/* Research median */}
            <line
              x1={20 + ((CANONICAL_MEDIAN - 50) / 600) * 560}
              x2={20 + ((CANONICAL_MEDIAN - 50) / 600) * 560}
              y1={50} y2={170}
              stroke="#E18809" strokeWidth={2} strokeDasharray="4 3"
            />
            <text x={20 + ((CANONICAL_MEDIAN - 50) / 600) * 560} y={46} textAnchor="middle" fontSize="11" fill="#E18809" fontWeight="700">research {CANONICAL_MEDIAN}</text>
          </svg>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <Mini label="Median" value={`${median} ms`} />
          <Mini label="Mean" value={`${mean.toFixed(0)} ms`} />
          <Mini label="Range" value={`${fastest}–${slowest}`} />
          <Mini label="Std dev" value={`${stdDev.toFixed(0)} ms`} />
        </div>
      </div>

      {/* Story */}
      <div className="bg-surface-raised border border-surface-line rounded-lg p-6 space-y-3">
        <h2 className="font-display text-xl font-bold text-brand-900">The story behind the number</h2>
        <p className="text-sm text-ink leading-relaxed">
          Where does the ~250 ms come from? Light hits your retina and triggers
          a signal in about <strong>30 ms</strong>. That signal races up the
          optic nerve to your visual cortex, where your brain notices and
          decides to react in about <strong>150 ms</strong>. A motor command
          then travels back down through your arm to your finger in about{' '}
          <strong>70 ms</strong>. Add it up and you get roughly a quarter of
          a second.
        </p>
        <p className="text-sm text-ink leading-relaxed">
          Your distribution isn't a single number — it's a <strong>shape</strong>.
          The median tells you the typical trial. The standard deviation tells
          you how consistent you are. The fastest trial is probably near your
          biological limit; the slowest reveals when you got distracted. Real
          psychology research reports BOTH median and spread, because the
          single "your reaction time is X" is an oversimplification.
        </p>
        <div className="bg-violet-50 border border-violet-200 rounded-md p-3 text-sm">
          <strong className="text-violet-900">A statistics moment:</strong>{' '}
          your 10 trials are a <em>sample</em>. The median you computed
          estimates your <em>true</em> median if you played thousands of
          trials. With 10 trials, the estimate has uncertainty. How wide is
          that uncertainty? That's a chapter for another day.
        </div>
      </div>

      {/* Card */}
      <div className="bg-gradient-to-br from-violet-700 to-brand-900 rounded-2xl shadow-editorial p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-16 h-16 rounded-md bg-white/15 backdrop-blur grid place-items-center font-display text-2xl font-bold">
            11
          </div>
          <div className="flex-1">
            <div className="eyebrow text-violet-200 mb-1">DATA CARD · ALG 1 · TOPIC 11 · STATISTICS</div>
            <h3 className="font-display text-2xl font-bold mb-1">Reaction Time Arena</h3>
            <p className="text-sm text-violet-100 mb-4">
              You generated your own dataset of {trials.length} trials. Median {median} ms; research median {CANONICAL_MEDIAN} ms.
            </p>
            <div className="flex flex-wrap gap-2">
              {!submitted ? (
                <button onClick={() => setSubmitted(true)} className="px-4 py-2 rounded-md bg-white text-violet-800 font-semibold hover:bg-violet-50 transition">
                  Save to my notebook
                </button>
              ) : (
                <div className="px-4 py-2 rounded-md bg-emerald-500 text-white font-semibold">
                  Saved to notebook
                </div>
              )}
              <button onClick={onRestart} className="px-4 py-2 rounded-md bg-white/10 backdrop-blur text-white font-semibold hover:bg-white/20 transition border border-white/20">
                Start over
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, unit, tone, sub }: { label: string; value: string; unit: string; tone: 'amber' | 'emerald' | 'rose' | 'brand'; sub?: string }) {
  const cls = {
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    rose: 'border-rose-200 bg-rose-50 text-rose-900',
    brand: 'border-brand-200 bg-brand-50 text-brand-900',
  }[tone];
  return (
    <div className={`rounded-lg border p-4 ${cls}`}>
      <div className="eyebrow text-[10px] opacity-70 mb-1">{label}</div>
      <div className="font-display text-3xl font-bold tabular-nums">
        {value} <span className="text-base font-medium opacity-60">{unit}</span>
      </div>
      {sub && <div className="text-xs mt-1 opacity-80">{sub}</div>}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-subtle/40 rounded-md px-3 py-2">
      <div className="eyebrow text-[9px] text-ink-muted">{label}</div>
      <div className="font-display text-base font-bold text-ink tabular-nums">{value}</div>
    </div>
  );
}
