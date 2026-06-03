import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ActFrame from '../../wind/ActFrame';
import { NarratorSays } from './Narrator';
import type { AdvanceState } from '../../wind/NextRow';
import type { IdentifyState } from './ReactionIdentify';
import type { ReactionTrials } from './ReactionPlay';

interface InterpretProps {
  identify: IdentifyState;
  trials: ReactionTrials;
  onRestart: () => void;
  onAdvanceStateChange?: (state: AdvanceState) => void;
}

type Step = 1 | 2;

const STEP_LABELS: Record<Step, string> = {
  1: 'Compare',
  2: 'Wrap up',
};
const STEP_LABEL_LIST = [STEP_LABELS[1], STEP_LABELS[2]];

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

export default function ReactionInterpret({ identify, trials, onRestart, onAdvanceStateChange }: InterpretProps) {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);

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

  const canAdvance = true;

  const nextLabel =
    step === 1 ? 'Next: Wrap up →' :
    'Start over ↺';

  const handleAdvance = () => {
    if (step === 1) setStep(2);
    else onRestart();
  };

  const advanceRef = useRef(handleAdvance);
  advanceRef.current = handleAdvance;

  useEffect(() => {
    onAdvanceStateChange?.({
      canAdvance,
      hint: '',
      advance: () => advanceRef.current(),
      nextLabel,
      back: step > 1 ? () => setStep(1) : undefined,
      backLabel: step > 1 ? 'Back to compare' : undefined,
      step,
      stepLabels: STEP_LABEL_LIST,
    });
  }, [step, canAdvance, nextLabel, onAdvanceStateChange]);

  const stepSubhead =
    step === 1
      ? 'Compare your two distributions and the published research.'
      : 'Save your results and explore what comes next.';

  return (
    <ActFrame
      actNumber={3}
      eyebrow="ACT 3 · REVELATION · WHOLE CLASS"
      title="Eyes vs. ears."
      step={step}
      stepTotal={2}
      stepLabel={STEP_LABELS[step]}
      stepSubhead={stepSubhead}
    >
      {step === 1 && (
        <>
          <NarratorSays lineKey="act3Top" />

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-5">
            <p className="text-sm text-ink leading-relaxed">
              Your visual median was <strong>{v.median} ms</strong>. Your audio median
              was <strong>{a.median} ms</strong>. {audioFasterBy > 0 ? (
                <>That's <strong>{audioFasterBy} ms faster</strong> with your ears than your eyes — sound takes a shorter path.</>
              ) : audioFasterBy < 0 ? (
                <>That's <strong>{Math.abs(audioFasterBy)} ms faster</strong> with your eyes than your ears — unusual, but possible.</>
              ) : (
                <>Your two medians came in identical — very unusual!</>
              )}
              {hasGuess && <> You guessed <strong>{identify.conjecture} ms</strong>. {closenessLabel}</>}
            </p>
          </div>

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

          {/* Distribution dots */}
          <div className="bg-surface-raised border border-surface-line rounded-lg p-5">
            <div className="eyebrow text-ink-muted mb-3">DISTRIBUTIONS · {trials.visual.length} VISUAL + {trials.audio.length} AUDIO TRIALS</div>
            <div className="relative h-56">
              <svg viewBox="0 0 600 230" preserveAspectRatio="none" className="w-full h-full">
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

                <text x={24} y={86} fontSize="9" fontFamily="monospace" fill="#7C3AED" fontWeight="700">VISUAL</text>
                <text x={24} y={156} fontSize="9" fontFamily="monospace" fill="#0F766E" fontWeight="700">AUDIO</text>

                {trials.visual.map((t, i) => {
                  const x = 20 + ((t - 50) / 600) * 560;
                  return (
                    <circle key={`v-${i}`} cx={x} cy={75 + (i % 4) * 6} r={4.5} fill="#7C3AED" fillOpacity={0.7} />
                  );
                })}
                {trials.audio.map((t, i) => {
                  const x = 20 + ((t - 50) / 600) * 560;
                  return (
                    <circle key={`a-${i}`} cx={x} cy={145 + (i % 4) * 6} r={4.5} fill="#0F766E" fillOpacity={0.7} />
                  );
                })}

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
          </div>

          {/* Why audio is faster */}
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
            <div className="bg-violet-50 border border-violet-200 rounded-md p-3 text-sm">
              <strong className="text-violet-900">A statistics moment:</strong>{' '}
              comparing two medians is the simplest two-sample test there is. If
              you ran 1000 trials of each, you'd be looking at the difference in
              population medians. With 10 trials each, the gap could partly be
              luck. How would you know if it's real? That's hypothesis testing —
              another day.
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <NarratorSays lineKey="act3Closing" />

          {/* Data card */}
          <div className="bg-gradient-to-br from-violet-700 to-brand-900 rounded-2xl shadow-editorial p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-16 h-16 rounded-md bg-white/15 backdrop-blur grid place-items-center font-display text-2xl font-bold">
                11
              </div>
              <div className="flex-1 min-w-0">
                <div className="eyebrow text-violet-200 mb-1">DATA CARD · ALG 1 · TOPIC 11 · STATISTICS</div>
                <h3 className="font-display text-2xl font-bold mb-1">Reaction Time Arena</h3>
                <p className="text-sm text-violet-100 mb-4">
                  You generated two datasets of {trials.visual.length} trials each. Visual median {v.median} ms; audio median {a.median} ms.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  <FitCard sense="With your eyes" value={v.median} benchmark={CANONICAL_VISUAL} />
                  <FitCard sense="With your ears" value={a.median} benchmark={CANONICAL_AUDIO} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {!submitted ? (
                    <button onClick={() => setSubmitted(true)} className="px-4 py-2 rounded-md bg-white text-violet-800 font-semibold hover:bg-violet-50 transition text-sm">
                      Save to my notebook
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-md bg-emerald-500 text-white font-semibold text-sm">
                      Saved to notebook
                    </div>
                  )}
                  <button onClick={onRestart} className="px-4 py-2 rounded-md bg-white/10 backdrop-blur text-white font-semibold hover:bg-white/20 transition border border-white/20 text-sm">
                    Run again
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Where to go next */}
          <div>
            <div className="eyebrow text-ink-muted mb-3">Where to go next</div>
            <div className="grid md:grid-cols-2 gap-3">
              <DoorOut
                to="/c/alg1-t11"
                kicker="Back to your chapter"
                title="Topic 11 · Statistics"
                body="Return to the textbook landing."
              />
              <DoorOut
                to="/explorer?dataset=marathon"
                kicker="Apply this thinking"
                title="Boston Marathon finishers"
                body="Compare two distributions at scale: 32,000 runners, men vs women."
              />
            </div>
          </div>
        </>
      )}
    </ActFrame>
  );
}

function describeFit(median: number, benchmark: number): { tone: 'faster' | 'on' | 'slower'; phrase: string } {
  const gap = benchmark - median;
  if (gap >= 30) return { tone: 'faster', phrase: `faster than typical by ${gap} ms` };
  if (gap <= -30) return { tone: 'slower', phrase: `slower than typical by ${-gap} ms` };
  return { tone: 'on', phrase: 'right on the published benchmark' };
}

function FitCard({ sense, value, benchmark }: { sense: string; value: number; benchmark: number }) {
  const fit = describeFit(value, benchmark);
  const toneColor: Record<string, string> = {
    faster: 'text-emerald-200',
    on: 'text-accent-300',
    slower: 'text-rose-200',
  };
  return (
    <div className="bg-white/10 backdrop-blur rounded-md p-3 border border-white/15">
      <div className="text-[10px] eyebrow text-violet-200 mb-1">{sense}</div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold tabular-nums">{value}</span>
        <span className="text-xs text-violet-200">ms</span>
        <span className="text-[10px] font-mono text-violet-300 ml-auto">vs {benchmark}</span>
      </div>
      <div className={`text-xs mt-1 ${toneColor[fit.tone]}`}>{fit.phrase}</div>
    </div>
  );
}

function DoorOut({ to, kicker, title, body }: { to: string; kicker: string; title: string; body: string }) {
  return (
    <Link to={to} className="block bg-surface-raised border border-surface-line rounded-lg p-4 h-full transition hover:border-violet-400 hover:bg-violet-50/30 hover:shadow-sm">
      <div className="eyebrow text-[10px] text-violet-700 mb-1">{kicker}</div>
      <div className="font-display text-base font-bold text-brand-900 mb-1.5">{title}</div>
      <p className="text-xs text-ink-soft leading-relaxed">{body}</p>
      <div className="text-xs text-violet-700 mt-3 font-semibold inline-flex items-center gap-1">
        Go <span aria-hidden>→</span>
      </div>
    </Link>
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
