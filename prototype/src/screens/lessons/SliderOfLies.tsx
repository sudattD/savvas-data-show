import { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ReferenceArea } from 'recharts';
import LessonShell from '../../components/LessonShell';
import { CO2_DATASET } from '../../data/co2Dataset';

// Build a clean annual series from the monthly CO2 dataset for a single chart.
function getAnnualSeries() {
  const byYear = new Map<number, number[]>();
  for (const r of CO2_DATASET.rows) {
    const y = r.year as number;
    const c = r.co2 as number;
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(c);
  }
  return Array.from(byYear.entries())
    .filter(([, vs]) => vs.length >= 6) // at least 6 monthly readings
    .map(([year, vs]) => ({ year, co2: vs.reduce((s, v) => s + v, 0) / vs.length }))
    .sort((a, b) => a.year - b.year);
}

export default function SliderOfLies() {
  const data = useMemo(() => getAnnualSeries(), []);
  const dataMin = Math.min(...data.map((d) => d.co2));
  const dataMax = Math.max(...data.map((d) => d.co2));
  const trueYFloor = Math.floor(dataMin / 5) * 5;
  const trueYCeil = Math.ceil(dataMax / 5) * 5;
  const yHonestHigh = trueYCeil + 10;

  const yearStart = data[0].year;
  const yearEnd = data[data.length - 1].year;

  const [yLow, setYLow] = useState(0);
  const [xStart, setXStart] = useState(yearStart);
  const [xEnd, setXEnd] = useState(yearEnd);

  // The window the user has cropped to.
  const windowed = useMemo(
    () => data.filter((d) => d.year >= xStart && d.year <= xEnd),
    [data, xStart, xEnd],
  );

  // What the visible chart shows: a vertical Y range and a horizontal X range.
  const visibleYRange = yHonestHigh - yLow;
  const visibleXRange = xEnd - xStart || 1;
  // The data's own change within the visible window.
  const windowYMin = windowed.length > 0 ? Math.min(...windowed.map((d) => d.co2)) : dataMin;
  const windowYMax = windowed.length > 0 ? Math.max(...windowed.map((d) => d.co2)) : dataMax;
  const windowYChange = windowYMax - windowYMin;

  // Heuristic: how "steep" the eye reads the line as. Real-world slope is
  // ΔY / ΔX. Visual slope on the chart is (ΔY / visibleYRange) / (ΔX / visibleXRange).
  // We report it as a percentage of the chart canvas: 100 = data fills the
  // canvas top-to-bottom, smaller = honest portrayal of small change.
  const visualSteepness = (windowYChange / visibleYRange) * 100;

  const cropped = yLow > 0 || xStart > yearStart || xEnd < yearEnd;

  const verdict = !cropped
    ? { tone: 'emerald', label: 'Faithful', note: 'Full Y axis, full time range. The reader sees the change at its real size.' }
    : visualSteepness < 25
      ? { tone: 'emerald', label: 'Faithful', note: 'Cropping is mild. The trend still reads close to its true size.' }
      : visualSteepness < 60
        ? { tone: 'amber', label: 'Tilted', note: 'Cropping exaggerates the change. A reader will overstate the trend.' }
        : { tone: 'rose', label: 'Distorted', note: 'Heavy cropping makes a real change look bigger than it is. Use with care.' };

  const resetCrop = () => {
    setYLow(0);
    setXStart(yearStart);
    setXEnd(yearEnd);
  };

  return (
    <LessonShell number="L1" family="VISUAL DECEPTION" title="Same Data, Different Story" concept="Cropping the axes" accent="rose" exploreDataset="co2">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
            Same data. Two stories.
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Real atmospheric CO₂ from NOAA, 1959 to today. The numbers haven't
            changed. Crop the y-axis floor or the time window and watch the
            chart's mood shift — without anyone touching the data.
          </p>
        </div>

        {/* Your version — interactive, cropped */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-baseline justify-between mb-2 px-2">
            <div>
              <div className="eyebrow text-rose-700">Your version</div>
              <div className="text-xs text-slate-500">Crop the y-axis floor or the time window.</div>
            </div>
            {cropped && (
              <button
                onClick={resetCrop}
                className="text-[11px] eyebrow text-brand-700 hover:text-accent-700 hover:underline"
              >
                reset cropping
              </button>
            )}
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={windowed} margin={{ top: 12, right: 16, bottom: 24, left: 16 }}>
                <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  type="number"
                  domain={[xStart, xEnd]}
                  stroke="#64748B"
                  tickCount={Math.min(8, Math.max(3, Math.floor(visibleXRange / 5)))}
                />
                <YAxis
                  domain={[yLow, yHonestHigh]}
                  stroke="#64748B"
                  label={{ value: 'CO₂ (ppm)', angle: -90, position: 'insideLeft', offset: 8, fill: '#475569', fontSize: 13 }}
                />
                {yLow > 0 && (
                  <ReferenceLine y={yLow} stroke="#FB7185" strokeDasharray="3 3" label={{ value: 'truncated here', fill: '#FB7185', fontSize: 11, position: 'insideTopLeft' }} />
                )}
                <Line type="monotone" dataKey="co2" stroke="#0F172A" strokeWidth={3.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Y-axis floor slider */}
          <div className="mt-5 px-2">
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-sm font-semibold text-ink">Y-axis floor</label>
              <span className="font-mono text-sm tabular-nums text-slate-700">{yLow.toFixed(0)} ppm</span>
            </div>
            <input
              type="range"
              min={0}
              max={trueYFloor}
              step={1}
              value={yLow}
              onChange={(e) => setYLow(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0 ppm (honest)</span>
              <span>{trueYFloor} ppm (cropped)</span>
            </div>
          </div>

          {/* X-axis window */}
          <div className="mt-5 px-2">
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-sm font-semibold text-ink">Time window</label>
              <span className="font-mono text-sm tabular-nums text-slate-700">
                {xStart} → {xEnd} <span className="text-slate-400">({xEnd - xStart} years)</span>
              </span>
            </div>
            <div className="space-y-1.5">
              <input
                type="range"
                min={yearStart}
                max={yearEnd}
                step={1}
                value={xStart}
                onChange={(e) => setXStart(Math.min(Number(e.target.value), xEnd - 1))}
                className="w-full accent-rose-500"
              />
              <input
                type="range"
                min={yearStart}
                max={yearEnd}
                step={1}
                value={xEnd}
                onChange={(e) => setXEnd(Math.max(Number(e.target.value), xStart + 1))}
                className="w-full accent-rose-500"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>{yearStart}</span>
              <span>{yearEnd}</span>
            </div>
          </div>
        </div>

        {/* Honest baseline — always shows full range so the comparison is direct */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-baseline justify-between mb-2 px-2">
            <div>
              <div className="eyebrow text-emerald-700">The same data, untouched</div>
              <div className="text-xs text-slate-500">Full y-axis from 0. Full time range, {yearStart}–{yearEnd}.</div>
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              reference
            </div>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 16, bottom: 16, left: 16 }}>
                <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  type="number"
                  domain={[yearStart, yearEnd]}
                  stroke="#64748B"
                  tickCount={6}
                />
                <YAxis
                  domain={[0, yHonestHigh]}
                  stroke="#64748B"
                />
                {/* Shade the window the user is currently cropped to. */}
                {cropped && (
                  <ReferenceArea
                    x1={xStart}
                    x2={xEnd}
                    y1={yLow}
                    y2={yHonestHigh}
                    fill="#FB7185"
                    fillOpacity={0.10}
                    stroke="#FB7185"
                    strokeOpacity={0.4}
                    strokeDasharray="3 3"
                  />
                )}
                <Line type="monotone" dataKey="co2" stroke="#10B981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {cropped && (
            <div className="px-2 mt-1.5 text-[11px] text-slate-500 font-mono tabular-nums">
              The rose-tinted area is what you're showing in the chart above.
            </div>
          )}
        </div>

        <Verdict tone={verdict.tone} label={verdict.label} note={verdict.note} steepness={visualSteepness} />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">The lesson</h2>
          <p className="text-sm text-ink leading-relaxed">
            CO₂ went from about <strong>316 ppm in 1959</strong> to{' '}
            <strong>424 ppm in 2024</strong>. That's a <strong>34%</strong> rise
            — significant, but not the steep cliff a cropped chart would
            suggest. Cropping either the y-axis floor or the time window makes
            the same trend read bigger or smaller than it is.
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Cropping isn't automatically dishonest. Sometimes it's the only way
            to <em>see</em> a small but real change (think: thermometers, stock
            prices, election polls). But it's a tool with consequences.{' '}
            <strong>Always check the axes before you believe a trend chart.</strong>
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
            <strong className="text-slate-800">Try it in the wild:</strong> next
            time you see a chart on social media, look at the y-axis floor and
            the year range first.
          </div>
        </div>
      </div>
    </LessonShell>
  );
}

function Verdict({ tone, label, note, steepness }: { tone: string; label: string; note: string; steepness: number }) {
  const cls = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    rose: 'border-rose-200 bg-rose-50 text-rose-900',
  }[tone] ?? 'border-slate-200 bg-slate-50 text-slate-900';
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <div className="text-[10px] font-semibold tracking-widest opacity-70 mb-0.5">VERDICT</div>
          <div className="font-display text-2xl font-bold">{label}</div>
        </div>
        <div className="text-xs font-mono opacity-70 tabular-nums">
          visual steepness: {steepness.toFixed(0)}%
        </div>
      </div>
      <p className="text-sm mt-1.5 leading-relaxed">{note}</p>
    </div>
  );
}
