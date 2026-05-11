import { useState } from 'react';
import HostBubble from '../../components/HostBubble';
import type { IdentifyState } from './ReactionIdentify';
import type { ReactionTrials } from './ReactionPlay';

interface InterpretProps {
  identify: IdentifyState;
  trials: ReactionTrials;
  onRestart: () => void;
}

// Published research: simple visual ~270ms, simple auditory ~160ms (Woods et al 2015).
const CANONICAL_VISUAL = 270;
const CANONICAL_AUDIO = 160;

function summarize(arr: number[]) {
  if (arr.length === 0) return { median: 0, mean: 0, fastest: 0, slowest: 0, stdDev: 0 };
  const sorted = [...arr].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const mean = arr.reduce((s, x) => s + x, 0) / arr.length;
  const fastest = sorted[0];
  const slowest = sorted[sorted.length - 1];
  const stdDev = Math.sqrt(arr.reduce((s, x) => s + (x - mean) ** 2, 0) / arr.length);
  return { median, mean, fastest, slowest, stdDev };
}

export default function ReactionInterpret({ identify, trials, onRestart }: InterpretProps) {
  const v = summarize(trials.visual);
  const a = summarize(trials.audio);
  const audioFasterBy = v.median - a.median;

  const hasGuess = identify.conjecture > 0;
  const hasBounds = identify.tooLow > 0 && identify.tooHigh > 0;
  const inBounds = hasBounds && v.median >= identify.tooLow && v.median <= identify.tooHigh;
  const closeness = Math.abs(v.median - identify.conjecture);
  const closenessLabel = !hasGuess ? '' :
    closeness < 30 ? 'Right on the money.' :
    closeness < 80 ? 'Pretty close.' :
    'A long way off your guess.';

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
            Eyes vs. ears.
          </h1>
          <p className="text-sm text-ink-soft">Compare your two distributions and the published research.</p>
        </div>
      </div>

      <HostBubble accent="emerald" name="Alex">
        Your visual median was <strong>{v.median} ms</strong>. Your audio median
        was <strong>{a.median} ms</strong>. {audioFasterBy > 0 ? (
          <>That's <strong>{audioFasterBy} ms faster</strong> with your ears than your eyes — sound takes a shorter path.</>
        ) : audioFasterBy < 0 ? (
          <>That's <strong>{Math.abs(audioFasterBy)} ms faster</strong> with your eyes than your ears — unusual, but possible.</>
        ) : (
          <>Your two medians came in identical — very unusual!</>
        )}
        {hasGuess && <> You guessed <strong>{identify.conjecture} ms</strong>. {closenessLabel}</>}
      </HostBubble>

      {/* Comparison stats */}
      <div className="grid md:grid-cols-3 gap-3">
        <Stat
          label="Visual median"
          value={`${v.median}`}
          unit="ms"
          tone={inBounds ? 'emerald' : hasBounds ? 'rose' : 'brand'}
          sub={`research ${CANONICAL_VISUAL} ms`}
        />
        <Stat
          label="Audio median"
          value={`${a.median}`}
          unit="ms"
          tone="emerald"
          sub={`research ${CANONICAL_AUDIO} ms`}
        />
        <Stat
          label={audioFasterBy >= 0 ? 'Audio is faster by' : 'Visual is faster by'}
          value={`${Math.abs(audioFasterBy)}`}
          unit="ms"
          tone="amber"
          sub={`research gap ${CANONICAL_VISUAL - CANONICAL_AUDIO} ms`}
        />
      </div>

      {/* Distribution viz — both rounds on one axis */}
      <div className="bg-surface-raised border border-surface-line rounded-lg p-5">
        <div className="eyebrow text-ink-muted mb-3">DISTRIBUTIONS · {trials.visual.length} VISUAL + {trials.audio.length} AUDIO TRIALS</div>
        <div className="relative h-56">
          <svg viewBox="0 0 600 230" preserveAspectRatio="none" className="w-full h-full">
            {/* Axis */}
            <line x1={20} x2={580} y1={200} y2={200} stroke="#94A3B8" strokeWidth={1} />
            {[100, 200, 300, 400, 500, 600].map((ms) => {
              const x = 20 + ((ms - 50) / 600) * 560;
              return (
                <g key={ms}>
                  <line x1={x} x2={x} y1={200} y2={205} stroke="#94A3B8" strokeWidth={1} />
                  <text x={x} y={218} textAnchor="middle" fontSize="9" fill="#64748B" fontFamily="monospace">{ms}</text>
                </g>
              );
            })}
            <text x={580} y={218} textAnchor="end" fontSize="9" fill="#64748B" fontFamily="monospace" fontWeight="700">ms</text>

            {/* Bounds shading (if set) */}
            {hasBounds && (
              <rect
                x={20 + ((identify.tooLow - 50) / 600) * 560}
                y={20}
                width={Math.max(2, ((identify.tooHigh - identify.tooLow) / 600) * 560)}
                height={180}
                fill="#FBD78A"
                fillOpacity={0.18}
                stroke="#E18809"
                strokeOpacity={0.3}
                strokeDasharray="4 3"
              />
            )}

            {/* Lanes label */}
            <text x={24} y={86} fontSize="9" fontFamily="monospace" fill="#7C3AED" fontWeight="700">VISUAL</text>
            <text x={24} y={156} fontSize="9" fontFamily="monospace" fill="#0F766E" fontWeight="700">AUDIO</text>

            {/* Visual trial dots */}
            {trials.visual.map((t, i) => {
              const x = 20 + ((t - 50) / 600) * 560;
              return (
                <circle key={`v-${i}`} cx={x} cy={75 + (i % 4) * 6} r={4.5} fill="#7C3AED" fillOpacity={0.7} />
              );
            })}
            {/* Audio trial dots */}
            {trials.audio.map((t, i) => {
              const x = 20 + ((t - 50) / 600) * 560;
              return (
                <circle key={`a-${i}`} cx={x} cy={145 + (i % 4) * 6} r={4.5} fill="#0F766E" fillOpacity={0.7} />
              );
            })}

            {/* Medians */}
            {v.median > 0 && (
              <>
                <line x1={20 + ((v.median - 50) / 600) * 560} x2={20 + ((v.median - 50) / 600) * 560} y1={50} y2={110} stroke="#5B21B6" strokeWidth={2.5} />
                <text x={20 + ((v.median - 50) / 600) * 560} y={44} textAnchor="middle" fontSize="11" fill="#5B21B6" fontWeight="700">visual {v.median}</text>
              </>
            )}
            {a.median > 0 && (
              <>
                <line x1={20 + ((a.median - 50) / 600) * 560} x2={20 + ((a.median - 50) / 600) * 560} y1={120} y2={180} stroke="#0F766E" strokeWidth={2.5} />
                <text x={20 + ((a.median - 50) / 600) * 560} y={194} textAnchor="middle" fontSize="11" fill="#0F766E" fontWeight="700">audio {a.median}</text>
              </>
            )}
          </svg>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <Mini label="Visual median" value={`${v.median} ms`} />
          <Mini label="Audio median" value={`${a.median} ms`} />
          <Mini label="Visual range" value={`${v.fastest}–${v.slowest}`} />
          <Mini label="Audio range" value={`${a.fastest}–${a.slowest}`} />
        </div>
        <details className="mt-4 group">
          <summary className="cursor-pointer text-xs eyebrow text-ink-muted hover:text-violet-700 select-none">
            <span className="group-open:hidden">Show raw data ▾</span>
            <span className="hidden group-open:inline">Hide raw data ▴</span>
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-surface-line text-ink-muted">
                  <th className="text-left py-2 px-3">Trial</th>
                  <th className="text-right py-2 px-3 text-violet-700">Visual (ms)</th>
                  <th className="text-right py-2 px-3 text-emerald-700">Audio (ms)</th>
                  <th className="text-right py-2 px-3">Diff</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {Array.from({ length: Math.max(trials.visual.length, trials.audio.length) }).map((_, i) => {
                  const vt = trials.visual[i];
                  const at = trials.audio[i];
                  const diff = vt !== undefined && at !== undefined ? vt - at : null;
                  return (
                    <tr key={i} className="border-b border-surface-line last:border-0">
                      <td className="py-1.5 px-3 text-ink-muted">{i + 1}</td>
                      <td className="py-1.5 px-3 text-right">{vt ?? '—'}</td>
                      <td className="py-1.5 px-3 text-right">{at ?? '—'}</td>
                      <td className={`py-1.5 px-3 text-right ${diff !== null && diff > 0 ? 'text-emerald-700' : diff !== null && diff < 0 ? 'text-rose-700' : ''}`}>
                        {diff !== null ? (diff > 0 ? `+${diff}` : diff) : '—'}
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-ink/20 font-semibold">
                  <td className="py-1.5 px-3 text-ink-muted">median</td>
                  <td className="py-1.5 px-3 text-right">{v.median}</td>
                  <td className="py-1.5 px-3 text-right">{a.median}</td>
                  <td className="py-1.5 px-3 text-right text-emerald-700">{v.median - a.median > 0 ? `+${v.median - a.median}` : v.median - a.median}</td>
                </tr>
              </tbody>
            </table>
            <div className="text-[10px] text-ink-muted italic mt-2">
              Diff = visual − audio. Positive means your audio reaction was faster.
            </div>
          </div>
        </details>
      </div>

      {/* Story */}
      <div className="bg-surface-raised border border-surface-line rounded-lg p-6 space-y-3">
        <h2 className="font-display text-xl font-bold text-brand-900">Why audio is faster</h2>
        <p className="text-sm text-ink leading-relaxed">
          Sound takes a more direct neural path than vision. A loud tone
          triggers brainstem-level reflexes in <strong>8–10 ms</strong>; light
          first has to be processed by the retina and travel through several
          visual relays, taking <strong>30+ ms</strong>. By the time the brain
          decides and the motor signal heads to your finger, audio reactions
          land roughly <strong>{CANONICAL_VISUAL - CANONICAL_AUDIO} ms ahead</strong>
          {' '}of visual ones, on average.
        </p>
        <p className="text-sm text-ink leading-relaxed">
          That's not the whole story. Your distribution isn't a single number —
          it's a <strong>shape</strong>. The median tells you the typical trial,
          the spread tells you how consistent you are. Both medians and both
          spreads matter. Real labs always report both.
        </p>
        <div className="bg-violet-50 border border-violet-200 rounded-md p-3 text-sm">
          <strong className="text-violet-900">A statistics moment:</strong>{' '}
          comparing two medians is the simplest two-sample test there is. If
          you ran 1000 trials of each, you'd be looking at the difference in
          population medians. With 10 trials each, the gap could partly be
          luck. How would you know if it's real? That's hypothesis testing —
          another day.
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
              You generated two datasets of {trials.visual.length} trials each. Visual median {v.median} ms; audio median {a.median} ms.
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
