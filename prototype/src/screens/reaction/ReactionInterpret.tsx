import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HostBubble from '../../components/HostBubble';
import { NarratorDynamicSays } from './classic/Narrator';
import type { IdentifyState } from './ReactionIdentify';
import type { ReactionTrials } from './ReactionPlay';

interface InterpretProps {
  identify: IdentifyState;
  trials: ReactionTrials;
  onRestart: () => void;
  narrator?: 'sarah';
}

// Published research: simple visual ~270ms, simple auditory ~160ms (Woods et al 2015).
const CANONICAL_VISUAL = 270;
const CANONICAL_AUDIO = 160;
const DR_REYES_ACT3_RESULT =
  "Your visual median was 377 milliseconds. Your audio median was 243 milliseconds. That's 134 milliseconds faster with your ears than your eyes — sound takes a shorter path. You guessed 333 milliseconds. Pretty close.";

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

function quantile(sorted: number[], q: number): number {
  const p = (sorted.length - 1) * q;
  const b = Math.floor(p);
  const r = p - b;
  return sorted[b + 1] !== undefined ? sorted[b] + r * (sorted[b + 1] - sorted[b]) : sorted[b];
}

const VIS_COLOR = "#7F77DD";
const VIS_DARK = "#534AB7";
const AUD_COLOR = "#1D9E75";
const AUD_DARK = "#0F6E56";

/* ───────────────────────────────────────────────
   BeeswarmChart — an SVG beeswarm with IQR bands,
   median lines, and interactive dots.
   Adapted from the reference design.
   ─────────────────────────────────────────────── */
interface BeeswarmProps {
  visual: number[];
  audio: number[];
  visualMedian: number;
  audioMedian: number;
  visualQ1: number;
  visualQ3: number;
  audioQ1: number;
  audioQ3: number;
}

function BeeswarmChart({ visual, audio, visualMedian, audioMedian, visualQ1, visualQ3, audioQ1, audioQ3 }: BeeswarmProps) {
  const PAD_L = 16, PAD_R = 24;
  const BASE_W = 680;
  const VIZ_H = 250;
  const AXIS_Y = 206;
  const R = 7;

  // Zoom state
  const [zoomMin, setZoomMin] = useState<number | null>(null);
  const [zoomMax, setZoomMax] = useState<number | null>(null);
  const [hovered, setHovered] = useState<{ v: number; label: string; x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  // Domain
  const rawD0 = Math.min(...visual, ...audio, 100);
  const rawD1 = Math.max(...visual, ...audio, 500);
  const D0 = zoomMin ?? rawD0;
  const D1 = zoomMax ?? rawD1;
  const totalSpan = D1 - D0 || 1;
  const sc = useCallback((ms: number) => PAD_L + ((ms - D0) / totalSpan) * (BASE_W - PAD_L - PAD_R), [D0, D1]);

  function beeswarmPositions(vals: number[], cy: number): { x: number; y: number; v: number }[] {
    const sorted = vals.map(v => ({ v, x: sc(v) })).sort((a, b) => a.x - b.x);
    const placed: { x: number; y: number; v: number }[] = [];
    sorted.forEach(p => {
      let y = cy;
      for (let k = 0; k < 60; k++) {
        const off = k === 0 ? 0 : Math.ceil(k / 2) * (2 * R - 1.5) * (k % 2 ? 1 : -1);
        y = cy + off;
        if (!placed.some(o => Math.hypot(o.x - p.x, o.y - y) < 2 * R - 0.5)) break;
      }
      placed.push({ x: p.x, y, v: p.v });
    });
    return placed;
  }

  const visualDots = beeswarmPositions(visual, 68);
  const audioDots = beeswarmPositions(audio, 155);

  function gridLine(ms: number) {
    const x = sc(ms);
    if (x < PAD_L || x > BASE_W - PAD_R) return null;
    return (
      <g key={`grid-${ms}`}>
        <line x1={x} y1={28} x2={x} y2={AXIS_Y} stroke="#D1D5DB" strokeWidth={1} />
        <text x={x} y={AXIS_Y + 16} textAnchor="middle" fontSize={11} fill="#9CA3AF">{ms}</text>
      </g>
    );
  }

  const gridMarks: number[] = [];
  const step = D1 - D0 <= 200 ? 25 : D1 - D0 <= 400 ? 50 : 100;
  const gridStart = Math.ceil(D0 / step) * step;
  for (let m = gridStart; m <= D1; m += step) gridMarks.push(m);

  // Scroll-to-zoom on the SVG wrapper
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.15 : 0.85;
      const mid = (D0 + D1) / 2;
      const half = ((D1 - D0) / 2) * factor;
      setZoomMin(Math.round(mid - half));
      setZoomMax(Math.round(mid + half));
    }
  };

  // Double-click to reset zoom
  const handleDoubleClick = () => { setZoomMin(null); setZoomMax(null); };

  const isZoomed = zoomMin !== null;

  // Cmd+scroll hint
  const showHint = visualDots.some((d, i, a) => i > 0 && Math.abs(d.x - a[i - 1].x) < R * 2);

  return (
    <div className="bg-surface-raised border border-surface-line rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="eyebrow text-ink-muted">REACTION TIME · {visual.length} VISUAL + {audio.length} AUDIO TRIALS</div>
        <div className="flex items-center gap-2">
          {isZoomed && (
            <button
              onClick={handleDoubleClick}
              className="text-[11px] px-2 py-0.5 rounded bg-violet-100 text-violet-800 hover:bg-violet-200 transition font-medium"
            >
              Reset zoom
            </button>
          )}
          {showHint && !isZoomed && (
            <span className="text-[10px] text-ink-muted italic hidden sm:inline">
              {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl+'}scroll to zoom
            </span>
          )}
        </div>
      </div>
      <div className="relative select-none" onWheel={handleWheel}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${BASE_W} ${VIZ_H}`}
          className="w-full"
          role="img"
          aria-label="Beeswarm distribution of visual and audio reaction times in milliseconds"
          onDoubleClick={handleDoubleClick}
        >
          {gridMarks.map(gridLine)}
          <line x1={sc(D0) - 4} y1={AXIS_Y} x2={sc(D1) + 4} y2={AXIS_Y} stroke="#D1D5DB" strokeWidth={1} />
          <text x={sc(D1) + 8} y={AXIS_Y + 16} textAnchor="start" fontSize={11} fill="#9CA3AF">ms</text>

          {/* Row labels */}
          <text x={sc(D0) - 10} y={64} textAnchor="end" fontSize={11} fontWeight="500" fill="#9CA3AF" className="select-none">Visual</text>
          <text x={sc(D0) - 10} y={151} textAnchor="end" fontSize={11} fontWeight="500" fill="#9CA3AF" className="select-none">Audio</text>

          {/* IQR band — visual */}
          <rect x={sc(visualQ1)} y={68 - 23} width={Math.max(2, sc(visualQ3) - sc(visualQ1))} height={46} rx={5} fill={VIS_COLOR} opacity={0.14} pointerEvents="none" />
          {/* IQR band — audio */}
          <rect x={sc(audioQ1)} y={155 - 23} width={Math.max(2, sc(audioQ3) - sc(audioQ1))} height={46} rx={5} fill={AUD_COLOR} opacity={0.14} pointerEvents="none" />

          {/* Median lines */}
          <line x1={sc(visualMedian)} y1={68 - 28} x2={sc(visualMedian)} y2={68 + 28} stroke={VIS_DARK} strokeWidth={2.5} strokeLinecap="round" pointerEvents="none" />
          {sc(visualMedian) > PAD_L + 10 && sc(visualMedian) < BASE_W - PAD_R - 10 && (
            <text x={sc(visualMedian)} y={68 - 30} textAnchor="middle" fontSize={11} fill={VIS_DARK} fontWeight="600" className="select-none">median {visualMedian}</text>
          )}
          <line x1={sc(audioMedian)} y1={155 - 28} x2={sc(audioMedian)} y2={155 + 28} stroke={AUD_DARK} strokeWidth={2.5} strokeLinecap="round" pointerEvents="none" />
          {sc(audioMedian) > PAD_L + 10 && sc(audioMedian) < BASE_W - PAD_R - 10 && (
            <text x={sc(audioMedian)} y={AXIS_Y + 36} textAnchor="middle" fontSize={11} fill={AUD_DARK} fontWeight="600" className="select-none">median {audioMedian}</text>
          )}

          {/* Visual dots */}
          {visualDots.map((p, i) => (
            <circle
              key={`v-${i}`}
              cx={p.x} cy={p.y} r={R}
              fill={VIS_COLOR} opacity={0.92}
              style={{ cursor: 'pointer', transition: 'r .1s' }}
              onMouseEnter={() => setHovered({ v: p.v, label: 'Visual', x: p.x, y: p.y })}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered({ v: p.v, label: 'Visual', x: p.x, y: p.y })}
              onBlur={() => setHovered(null)}
              tabIndex={0}
            />
          ))}
          {/* Audio dots */}
          {audioDots.map((p, i) => (
            <circle
              key={`a-${i}`}
              cx={p.x} cy={p.y} r={R}
              fill={AUD_COLOR} opacity={0.92}
              style={{ cursor: 'pointer', transition: 'r .1s' }}
              onMouseEnter={() => setHovered({ v: p.v, label: 'Audio', x: p.x, y: p.y })}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered({ v: p.v, label: 'Audio', x: p.x, y: p.y })}
              onBlur={() => setHovered(null)}
              tabIndex={0}
            />
          ))}
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            ref={tipRef}
            className="absolute pointer-events-none z-10 bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded shadow-md whitespace-nowrap"
            style={{
              left: `${(hovered.x / BASE_W) * 100}%`,
              top: `calc(${(hovered.y / VIZ_H) * 100}% - 8px)`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {hovered.label}: {hovered.v} ms
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────
   BeeswarmCards — four stat cards below the chart
   ─────────────────────────────────────────────── */
interface CardsProps {
  visualMedian: number;
  audioMedian: number;
  visualFastest: number;
  visualSlowest: number;
  audioFastest: number;
  audioSlowest: number;
  audioAdvantage: number;
}

function BeeswarmCards({ visualMedian, audioMedian, visualFastest, visualSlowest, audioFastest, audioSlowest, audioAdvantage }: CardsProps) {
  // IQR needs the full sorted arrays — we'll show range instead since it's more intuitive for small N
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard color={VIS_COLOR} label="Visual median" value={`${visualMedian} ms`} sub={`range ${visualFastest}–${visualSlowest}`} />
      <StatCard color={AUD_COLOR} label="Audio median" value={`${audioMedian} ms`} sub={`range ${audioFastest}–${audioSlowest}`} />
      <StatCard color="#D97706" label="Audio advantage" value={audioAdvantage > 0 ? `−${audioAdvantage} ms` : audioAdvantage < 0 ? `+${Math.abs(audioAdvantage)} ms` : "0 ms"} sub={audioAdvantage > 0 ? "faster than visual" : audioAdvantage < 0 ? "slower than visual" : "identical"} />
      <StatCard color="#6366F1" label="Trials" value={`${visualFastest}–${visualSlowest} / ${audioFastest}–${audioSlowest} ms`} sub="visual / audio range" />
    </div>
  );
}

function StatCard({ color, label, value, sub }: { color: string; label: string; value: string; sub?: string }) {
  return (
    <div style={{ borderLeft: `3px solid ${color}` }} className="bg-surface-subtle/40 rounded-md p-4">
      <div className="eyebrow text-[10px] text-ink-muted mb-0.5">{label}</div>
      <div className="font-display text-xl font-bold text-brand-900 tabular-nums">{value}</div>
      {sub && <div className="text-xs text-ink-soft mt-0.5">{sub}</div>}
    </div>
  );
}

export default function ReactionInterpret({ identify, trials, onRestart, narrator }: InterpretProps) {
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

      {narrator === 'sarah' ? (
        <NarratorDynamicSays text={DR_REYES_ACT3_RESULT} lineKey="act3Result377" />
      ) : (
        <HostBubble accent="emerald">
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
      )}

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

      {/* Beeswarm distribution viz */}
      <BeeswarmChart
        visual={trials.visual}
        audio={trials.audio}
        visualMedian={v.median}
        audioMedian={a.median}
        visualQ1={quantile([...trials.visual].sort((a, b) => a - b), 0.25)}
        visualQ3={quantile([...trials.visual].sort((a, b) => a - b), 0.75)}
        audioQ1={quantile([...trials.audio].sort((a, b) => a - b), 0.25)}
        audioQ3={quantile([...trials.audio].sort((a, b) => a - b), 0.75)}
      />
      {/* Summary stat cards */}
      <BeeswarmCards
        visualMedian={v.median}
        audioMedian={a.median}
        visualFastest={v.fastest}
        visualSlowest={v.slowest}
        audioFastest={a.fastest}
        audioSlowest={a.slowest}
        audioAdvantage={audioFasterBy}
      />
      {/* Raw data — collapsed by default */}
      <details className="group bg-surface-raised border border-surface-line rounded-lg p-5">
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

      {/* ─── End of Experience · wrap + three doors out ──────────────────── */}
      <EndOfExperience
        v={v}
        a={a}
        trialsCount={trials.visual.length}
        onRestart={onRestart}
        submitted={submitted}
        setSubmitted={setSubmitted}
      />
    </div>
  );
}

function describeFit(median: number, benchmark: number): { tone: 'faster' | 'on' | 'slower'; phrase: string } {
  const gap = benchmark - median;
  if (gap >= 30) return { tone: 'faster', phrase: `faster than typical by ${gap} ms` };
  if (gap <= -30) return { tone: 'slower', phrase: `slower than typical by ${-gap} ms` };
  return { tone: 'on', phrase: 'right on the published benchmark' };
}

interface EndProps {
  v: ReturnType<typeof summarize>;
  a: ReturnType<typeof summarize>;
  trialsCount: number;
  onRestart: () => void;
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
}

function EndOfExperience({ v, a, trialsCount, onRestart, submitted, setSubmitted }: EndProps) {
  const visualFit = describeFit(v.median, CANONICAL_VISUAL);
  const audioFit = describeFit(a.median, CANONICAL_AUDIO);

  const toneColor: Record<'faster' | 'on' | 'slower', string> = {
    faster: 'text-emerald-200',
    on: 'text-accent-300',
    slower: 'text-rose-200',
  };

  return (
    <section aria-label="End of experience" className="space-y-4">
      {/* Data card — what you did, in one card */}
      <div className="bg-gradient-to-br from-violet-700 to-brand-900 rounded-2xl shadow-editorial p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-16 h-16 rounded-md bg-white/15 backdrop-blur grid place-items-center font-display text-2xl font-bold">
            11
          </div>
          <div className="flex-1 min-w-0">
            <div className="eyebrow text-violet-200 mb-1">DATA CARD · ALG 1 · TOPIC 11 · STATISTICS</div>
            <h3 className="font-display text-2xl font-bold mb-1">Reaction Time Arena</h3>
            <p className="text-sm text-violet-100 mb-4">
              You generated two datasets of {trialsCount} trials each. Visual median {v.median} ms; audio median {a.median} ms.
            </p>

            {/* Where you fit — one honest sentence per sense */}
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              <FitCard sense="With your eyes" value={v.median} benchmark={CANONICAL_VISUAL} phrase={visualFit.phrase} toneCls={toneColor[visualFit.tone]} />
              <FitCard sense="With your ears" value={a.median} benchmark={CANONICAL_AUDIO} phrase={audioFit.phrase} toneCls={toneColor[audioFit.tone]} />
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

      {/* Three doors out — no quiz, just agency */}
      <div>
        <div className="eyebrow text-ink-muted mb-3">Where to go next</div>
        <div className="grid md:grid-cols-3 gap-3">
          <DoorOut
            to="/c/alg1-t11"
            kicker="Back to your chapter"
            title="Topic 11 · Statistics"
            body="Return to the textbook landing. Retake the Arena, or move on to the next lesson with your data in hand."
          />
          <DoorOut
            to="/explorer?dataset=marathon"
            kicker="Apply this thinking"
            title="Boston Marathon finishers"
            body={`Compare two distributions at scale: 32,000 runners, men vs women. The same compare-the-medians move you just used on yourself.`}
          />
          <DoorOut
            to="/c/alg1-t11"
            kicker="Or — try another 3-Acts"
            title="Wind Power Curve"
            body="Algebra 1 · Topic 8 · Quadratic Functions. Same Mathematical-Modeling-in-3-Acts shape, different math, real wind-turbine data."
            disabled
            note="Tee-up coming soon"
          />
        </div>
      </div>
    </section>
  );
}

function FitCard({ sense, value, benchmark, phrase, toneCls }: { sense: string; value: number; benchmark: number; phrase: string; toneCls: string }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-md p-3 border border-white/15">
      <div className="text-[10px] eyebrow text-violet-200 mb-1">{sense}</div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold tabular-nums">{value}</span>
        <span className="text-xs text-violet-200">ms</span>
        <span className="text-[10px] font-mono text-violet-300 ml-auto">vs {benchmark}</span>
      </div>
      <div className={`text-xs mt-1 ${toneCls}`}>{phrase}</div>
    </div>
  );
}

function DoorOut({ to, kicker, title, body, disabled, note }: { to: string; kicker: string; title: string; body: string; disabled?: boolean; note?: string }) {
  const className = `block bg-surface-raised border border-surface-line rounded-lg p-4 h-full transition ${
    disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-violet-400 hover:bg-violet-50/30 hover:shadow-sm'
  }`;
  const inner = (
    <>
      <div className="eyebrow text-[10px] text-violet-700 mb-1">{kicker}</div>
      <div className="font-display text-base font-bold text-brand-900 mb-1.5">{title}</div>
      <p className="text-xs text-ink-soft leading-relaxed">{body}</p>
      {note && <div className="text-[10px] eyebrow text-ink-muted mt-2 italic">{note}</div>}
      {!disabled && (
        <div className="text-xs text-violet-700 mt-3 font-semibold inline-flex items-center gap-1">
          Go <span aria-hidden>→</span>
        </div>
      )}
    </>
  );
  return disabled ? <div className={className}>{inner}</div> : <Link to={to} className={className}>{inner}</Link>;
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
