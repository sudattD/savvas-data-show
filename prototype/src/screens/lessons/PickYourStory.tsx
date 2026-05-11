import { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceArea } from 'recharts';
import LessonShell from '../../components/LessonShell';
import { CO2_DATASET } from '../../data/co2Dataset';
import { niceTicksWithin } from '../../lib/niceTicks';

interface SeriesRow { decYear: number; co2: number; }

function getSeries(): SeriesRow[] {
  // monthly, but thinned to ~ quarterly for chart legibility
  const rows = CO2_DATASET.rows.map((r) => ({ decYear: r.decYear as number, co2: r.co2 as number }));
  return rows.filter((_, i) => i % 3 === 0).sort((a, b) => a.decYear - b.decYear);
}

interface Window {
  start: number;
  end: number;
  label: string;
  spin: string;
}

const PRESETS: Window[] = [
  { start: 1959, end: 2025, label: 'The full record', spin: 'CO₂ has risen relentlessly for 65 years.' },
  { start: 2010, end: 2025, label: 'Recent 15 years', spin: 'CO₂ is accelerating — the rise is steeper than ever.' },
  { start: 1998, end: 2012, label: 'The "pause"', spin: 'CO₂ rose, but the rate looks modest. Some called it a slowdown.' },
  { start: 1990, end: 2005, label: '15-year window', spin: 'Steady linear rise.' },
];

function linearFit(data: SeriesRow[]): { slope: number; intercept: number } {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: 0 };
  const xMean = data.reduce((s, d) => s + d.decYear, 0) / n;
  const yMean = data.reduce((s, d) => s + d.co2, 0) / n;
  let num = 0, den = 0;
  for (const d of data) {
    num += (d.decYear - xMean) * (d.co2 - yMean);
    den += (d.decYear - xMean) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  return { slope, intercept: yMean - slope * xMean };
}

export default function PickYourStory() {
  const all = useMemo(() => getSeries(), []);
  const minYear = Math.floor(all[0].decYear);
  const maxYear = Math.ceil(all[all.length - 1].decYear);

  const [start, setStart] = useState(minYear);
  const [end, setEnd] = useState(maxYear);

  const windowed = useMemo(
    () => all.filter((r) => r.decYear >= start && r.decYear <= end),
    [all, start, end],
  );
  const fit = useMemo(() => linearFit(windowed), [windowed]);
  const yearsSpan = end - start;
  const totalRise = fit.slope * yearsSpan;
  const ratePerYear = fit.slope;

  const verdict =
    yearsSpan <= 5
      ? 'You\'re looking at fewer than 5 years. Way too short — random fluctuations dominate.'
      : yearsSpan <= 15
      ? 'A 5–15 year window can show a "pause" or "spike" that doesn\'t reflect the long trend.'
      : yearsSpan <= 30
      ? 'A 15–30 year window starts to look like the long-term truth, but still slices off context.'
      : 'A multi-decade window. This is closer to the real story — but watch out for the start year you picked.';

  const applyPreset = (w: Window) => {
    setStart(w.start);
    setEnd(w.end);
  };

  const yMin = Math.floor(Math.min(...all.map((d) => d.co2)) / 5) * 5;
  const yMax = Math.ceil(Math.max(...all.map((d) => d.co2)) / 5) * 5;
  const yearTicks = useMemo(() => niceTicksWithin(minYear, maxYear, 9), [minYear, maxYear]);
  const yTicks = useMemo(() => niceTicksWithin(yMin, yMax, 6), [yMin, yMax]);

  return (
    <LessonShell number="L5" family="VISUAL DECEPTION" title="Pick Your Story" concept="Cherry-picked time windows" accent="rose" exploreDataset="co2">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
            Same data. Different decades. Different headlines.
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Real CO₂ data from NOAA, every quarter from 1958 to 2026. Move the
            two sliders to crop the time window. Watch the trend rate change.
            Watch the headline change.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={all} margin={{ top: 12, right: 16, bottom: 24, left: 16 }}>
                <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
                <XAxis dataKey="decYear" type="number" domain={[minYear, maxYear]} ticks={yearTicks} stroke="#64748B" />
                <YAxis domain={[yMin, yMax]} ticks={yTicks} stroke="#64748B" label={{ value: 'CO₂ (ppm)', angle: -90, position: 'insideLeft', offset: 8, fill: '#475569', fontSize: 13 }} />
                <ReferenceArea x1={start} x2={end} fill="#fda4af" fillOpacity={0.2} stroke="#fb7185" strokeOpacity={0.5} />
                <Line type="monotone" dataKey="co2" stroke="#0F172A" strokeWidth={1.4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sliders */}
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label className="text-sm font-semibold text-ink">Window start</label>
                <span className="font-mono text-sm tabular-nums text-rose-700">{start}</span>
              </div>
              <input type="range" min={minYear} max={end - 2} step={1} value={start}
                onChange={(e) => setStart(Math.min(Number(e.target.value), end - 2))}
                className="w-full" />
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label className="text-sm font-semibold text-ink">Window end</label>
                <span className="font-mono text-sm tabular-nums text-rose-700">{end}</span>
              </div>
              <input type="range" min={start + 2} max={maxYear} step={1} value={end}
                onChange={(e) => setEnd(Math.max(Number(e.target.value), start + 2))}
                className="w-full" />
            </div>
          </div>

          {/* Presets */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-xs font-semibold tracking-widest text-slate-500 mb-2">JUMP TO A WINDOW</div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((w) => (
                <button
                  key={w.label}
                  onClick={() => applyPreset(w)}
                  className={`text-left px-3 py-2 rounded-lg border text-xs transition ${
                    start === w.start && end === w.end
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : 'bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/40'
                  }`}
                >
                  <div className="font-semibold">{w.label}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{w.start}–{w.end}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-rose-50 to-rose-100 p-6 shadow-sm">
          <div className="text-[10px] font-semibold tracking-widest text-rose-700 mb-1">YOUR CHART HEADLINE WOULD READ</div>
          <h2 className="font-display text-2xl font-bold text-ink leading-tight">
            "Atmospheric CO₂ rose <span className="text-rose-700">{totalRise.toFixed(1)} ppm</span> from {start} to {end}, an average rate of <span className="text-rose-700">{ratePerYear.toFixed(2)} ppm/year</span>."
          </h2>
          <p className="text-sm text-slate-700 mt-3 leading-relaxed">{verdict}</p>
        </div>

        {/* Lesson */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">The lesson</h2>
          <p className="text-sm text-ink leading-relaxed">
            By choosing a small enough window, you can make almost any trend
            look flat, steep, or even reversed. This is called{' '}
            <strong>cherry-picking</strong>, and it's the most common form of
            statistical dishonesty — used by people on every side of every
            argument.
          </p>
          <p className="text-sm text-ink leading-relaxed">
            The fix is simple: <strong>always ask for the full series</strong>.
            What's the longest version of this data? Show me. Climate
            scientists, economists, and pollsters all live by this rule
            because the rule is hard-won.
          </p>
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm">
            <strong className="text-rose-900">Famous case:</strong> A
            popular argument from 2009-2014 was that global warming had
            "paused" since 1998. The pause vanished when you looked at any
            window starting just 2 years earlier or ending 2 years later.
          </div>
        </div>
      </div>
    </LessonShell>
  );
}
