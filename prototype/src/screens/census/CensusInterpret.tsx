import { useState } from 'react';
import { Link } from 'react-router-dom';
import HostBubble from '../../components/HostBubble';
import { POPULATION_DATASET } from '../../data/populationDataset';
import type { CensusIdentifyState } from './CensusIdentify';

interface InterpretProps {
  identify: CensusIdentifyState;
  onRestart: () => void;
}

// Precise share-by-age from the dataset, single source of truth.
function shareByAge(year: number, predicate: (age: number) => boolean) {
  let num = 0;
  let den = 0;
  for (const r of POPULATION_DATASET.rows as Array<{ year: number; age: number; population: number }>) {
    if (r.year !== year) continue;
    den += r.population;
    if (predicate(r.age)) num += r.population;
  }
  return (num / den) * 100;
}

const UNDER18_1900 = shareByAge(1900, (a) => a < 18);
const UNDER18_2020 = shareByAge(2020, (a) => a < 18);
const OVER65_1900 = shareByAge(1900, (a) => a >= 65);
const OVER65_2020 = shareByAge(2020, (a) => a >= 65);

const UNDER18_DROP = UNDER18_1900 - UNDER18_2020;       // positive number (kids shrank as share)
const OVER65_GAIN = OVER65_2020 - OVER65_1900;          // positive number (seniors grew)
const WHO_CHANGED_MORE: 'under18' | 'over65' = UNDER18_DROP > OVER65_GAIN ? 'under18' : 'over65';

export default function CensusInterpret({ identify, onRestart }: InterpretProps) {
  const [submitted, setSubmitted] = useState(false);

  const hasGuess = identify.seniorChangePp > 0;
  const hasBracket = identify.tooLow > 0 && identify.tooHigh > 0;
  const hasPick = identify.whoChangedMore !== '';
  const pickedRight = identify.whoChangedMore === WHO_CHANGED_MORE;
  const actualInBracket = hasBracket && OVER65_2020 >= identify.tooLow && OVER65_2020 <= identify.tooHigh;
  const closeness = Math.abs(identify.seniorChangePp - OVER65_2020);
  const closenessLabel = !hasGuess ? '' :
    closeness < 2 ? 'Right on the money.' :
    closeness < 5 ? 'Pretty close.' :
    closeness < 10 ? 'In the right neighborhood.' :
    'A long way off your guess.';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="shrink-0 grid place-items-center w-14 h-14 rounded-md bg-gradient-to-br from-rose-700 to-rose-900 text-white shadow-editorial">
          <div className="text-[10px] eyebrow opacity-80">ACT</div>
          <div className="text-xl font-display font-bold leading-none -mt-0.5">3</div>
        </div>
        <div>
          <div className="eyebrow text-rose-700">INTERPRET THE CHANGE</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-900 leading-tight">
            What changed, and why?
          </h1>
          <p className="text-sm text-ink-soft">Compare your prediction to what the census actually shows.</p>
        </div>
      </div>

      <HostBubble accent="rose" name="Maya">
        {hasPick ? (
          <>You predicted that <strong>{identify.whoChangedMore === 'under18' ? 'kids under 18' : 'seniors 65+'}</strong> changed share more. </>
        ) : null}
        {hasGuess ? (
          <>You said seniors are about <strong>{identify.seniorChangePp}%</strong> of the US today
          {hasBracket ? <> (between <strong>{identify.tooLow}%</strong> and <strong>{identify.tooHigh}%</strong>)</> : null}.
          {' '}{closenessLabel}{' '}</>
        ) : null}
        Here's what the census actually says.
      </HostBubble>

      {/* The reveal card */}
      <div className="grid md:grid-cols-2 gap-4">
        <RevealCard
          label="Kids (under 18) share"
          v1900={UNDER18_1900}
          v2020={UNDER18_2020}
          deltaLabel={`dropped ${UNDER18_DROP.toFixed(1)} pp`}
          tone="amber"
        />
        <RevealCard
          label="Seniors (65+) share"
          v1900={OVER65_1900}
          v2020={OVER65_2020}
          deltaLabel={`grew ${OVER65_GAIN.toFixed(1)} pp`}
          tone="emerald"
        />
      </div>

      {/* Verdict on student commits */}
      {(hasPick || hasGuess) && (
        <div className={`grid ${hasPick && hasGuess ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-3`}>
          {hasPick && (
            <Verdict
              ok={pickedRight}
              title={pickedRight ? `Right — ${WHO_CHANGED_MORE === 'under18' ? 'kids' : 'seniors'} changed more` : `Other group changed more`}
              body={`Kids' share dropped ${UNDER18_DROP.toFixed(1)} pp; seniors' share grew ${OVER65_GAIN.toFixed(1)} pp. The bigger absolute swing was at the ${WHO_CHANGED_MORE === 'under18' ? 'bottom of the pyramid' : 'top of the pyramid'}.`}
            />
          )}
          {hasGuess && (
            <Verdict
              ok={hasBracket ? actualInBracket : closeness < 5}
              title={`Senior share is actually ${OVER65_2020.toFixed(1)}%`}
              body={hasBracket
                ? `You bracketed ${identify.tooLow}% to ${identify.tooHigh}%. Your point guess was ${identify.seniorChangePp}% — off by ${closeness.toFixed(1)} pp.`
                : `Your guess was ${identify.seniorChangePp}% — off by ${closeness.toFixed(1)} pp.`}
              warn={hasBracket && !actualInBracket}
            />
          )}
        </div>
      )}

      {hasPick && !pickedRight && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
          <strong>Surprise:</strong> most people guess seniors, since "the country is aging"
          is the headline you hear. But the bottom of the pyramid moved more
          in absolute terms because the baseline was bigger — kids were 43% of
          the country in 1900, almost half. You can't drop seniors much when
          they were only 4% to begin with.
        </div>
      )}

      {/* Hard data table */}
      <div className="bg-surface-raised border border-surface-line rounded-lg p-5">
        <div className="eyebrow text-ink-muted mb-3">THE NUMBERS · COMPUTED FROM CENSUS DATA</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-line text-left text-ink-muted">
                <th className="py-2">Group</th>
                <th className="py-2 text-right">1900 share</th>
                <th className="py-2 text-right">2020 share</th>
                <th className="py-2 text-right">Change (pp)</th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              <tr className="border-b border-surface-line">
                <td className="py-2 font-sans">Under 5</td>
                <td className="py-2 text-right">{shareByAge(1900, (a) => a < 5).toFixed(1)}%</td>
                <td className="py-2 text-right">{shareByAge(2020, (a) => a < 5).toFixed(1)}%</td>
                <td className="py-2 text-right text-rose-700">{(shareByAge(2020, (a) => a < 5) - shareByAge(1900, (a) => a < 5)).toFixed(1)}</td>
              </tr>
              <tr className="border-b border-surface-line">
                <td className="py-2 font-sans">Under 18 (kids)</td>
                <td className="py-2 text-right">{UNDER18_1900.toFixed(1)}%</td>
                <td className="py-2 text-right">{UNDER18_2020.toFixed(1)}%</td>
                <td className="py-2 text-right text-rose-700">{(UNDER18_2020 - UNDER18_1900).toFixed(1)}</td>
              </tr>
              <tr className="border-b border-surface-line">
                <td className="py-2 font-sans">18–64 (working age)</td>
                <td className="py-2 text-right">{shareByAge(1900, (a) => a >= 18 && a < 65).toFixed(1)}%</td>
                <td className="py-2 text-right">{shareByAge(2020, (a) => a >= 18 && a < 65).toFixed(1)}%</td>
                <td className="py-2 text-right">{(shareByAge(2020, (a) => a >= 18 && a < 65) - shareByAge(1900, (a) => a >= 18 && a < 65)).toFixed(1)}</td>
              </tr>
              <tr>
                <td className="py-2 font-sans">65+ (seniors)</td>
                <td className="py-2 text-right">{OVER65_1900.toFixed(1)}%</td>
                <td className="py-2 text-right">{OVER65_2020.toFixed(1)}%</td>
                <td className="py-2 text-right text-emerald-700">+{(OVER65_2020 - OVER65_1900).toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-[10px] text-ink-muted mt-3 italic">
          Computed from POPULATION_DATASET rows. 1900: 12th Decennial Census; 2020: Census Bureau Population Estimates (vintage 2024).
        </div>
      </div>

      {/* Story */}
      <div className="bg-surface-raised border border-surface-line rounded-lg p-6 space-y-3">
        <h2 className="font-display text-xl font-bold text-brand-900">The story behind the shape</h2>
        <p className="text-sm text-ink leading-relaxed">
          A pyramid becomes a column when three things happen at once.
          <strong> First, fewer kids per family.</strong> In 1900 a typical US woman had
          3.5 children over her lifetime. By 2020 that number was 1.6. Smaller
          families mean a narrower base.{' '}
          <strong>Second, fewer kids die young.</strong> In 1900, about 1 in 7 babies
          died before their first birthday. Today it is about 1 in 175. Kids
          who survive grow into adults, fattening the middle.{' '}
          <strong>Third, more people reach old age.</strong> Life expectancy at birth
          went from 47 to 79 over the same century. The top of the pyramid
          stops being narrow.
        </p>
        <p className="text-sm text-ink leading-relaxed">
          Layered on top: an enormous baby boom from 1946 to 1964 created a
          bulge that you can still see in the 2020 chart, now in their 55-75
          band. And immigration kept the middle wider than the births alone
          would predict.
        </p>
        <div className="bg-rose-50 border border-rose-200 rounded-md p-3 text-sm">
          <strong className="text-rose-900">A data literacy moment:</strong>{' '}
          to compare two groups of different sizes (72M vs 332M), we used
          <em> share of total</em> instead of raw counts. Raw counts would have made 1900
          invisible. Choosing the right denominator is half the work of
          making a chart honest.
        </div>
      </div>

      {/* Card */}
      <div className="bg-gradient-to-br from-rose-700 to-brand-900 rounded-2xl shadow-editorial p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-16 h-16 rounded-md bg-white/15 backdrop-blur grid place-items-center font-display text-2xl font-bold">
            12
          </div>
          <div className="flex-1">
            <div className="eyebrow text-rose-200 mb-1">DATA CARD · ALG 1 · TOPIC 12 · TWO-WAY TABLES & DISTRIBUTIONS</div>
            <h3 className="font-display text-2xl font-bold mb-1">120 Years of America</h3>
            <p className="text-sm text-rose-100 mb-4">
              The age pyramid went from wide-bottom to column. Kids dropped from {UNDER18_1900.toFixed(0)}% to {UNDER18_2020.toFixed(0)}% of the country; seniors grew from {OVER65_1900.toFixed(0)}% to {OVER65_2020.toFixed(0)}%.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/explorer?dataset=population"
                className="px-4 py-2 rounded-md bg-white text-rose-800 font-semibold hover:bg-rose-50 transition"
              >
                Explore the full dataset →
              </Link>
              {!submitted ? (
                <button onClick={() => setSubmitted(true)} className="px-4 py-2 rounded-md bg-white/10 backdrop-blur text-white font-semibold hover:bg-white/20 transition border border-white/20">
                  Submit this finding
                </button>
              ) : (
                <div className="px-4 py-2 rounded-md bg-emerald-500 text-white font-semibold">
                  Submitted to class wall
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

function RevealCard({ label, v1900, v2020, deltaLabel, tone }: { label: string; v1900: number; v2020: number; deltaLabel: string; tone: 'amber' | 'emerald' }) {
  const cls = {
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  }[tone];
  return (
    <div className={`rounded-lg border p-5 ${cls}`}>
      <div className="eyebrow text-[10px] opacity-70 mb-3">{label}</div>
      <div className="flex items-baseline gap-4">
        <div>
          <div className="text-[10px] font-mono opacity-60">1900</div>
          <div className="font-display text-3xl font-bold tabular-nums">{v1900.toFixed(1)}%</div>
        </div>
        <div className="text-xl font-bold opacity-50">→</div>
        <div>
          <div className="text-[10px] font-mono opacity-60">2020</div>
          <div className="font-display text-3xl font-bold tabular-nums">{v2020.toFixed(1)}%</div>
        </div>
      </div>
      <div className="text-sm font-semibold mt-3 opacity-80">{deltaLabel}</div>
    </div>
  );
}

function Verdict({ ok, title, body, warn }: { ok: boolean; title: string; body: string; warn?: boolean }) {
  const cls = ok
    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
    : warn
    ? 'border-amber-300 bg-amber-50 text-amber-900'
    : 'border-rose-300 bg-rose-50 text-rose-900';
  return (
    <div className={`rounded-lg border p-4 ${cls}`}>
      <div className="font-display text-sm font-bold mb-1">{title}</div>
      <div className="text-xs leading-relaxed opacity-90">{body}</div>
    </div>
  );
}
