import { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
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

const MIN_WIDTH = 280;
const MAX_WIDTH = 880;
const MIN_HEIGHT = 140;
const MAX_HEIGHT = 520;
const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 320;

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
  const [chartW, setChartW] = useState(DEFAULT_WIDTH);
  const [chartH, setChartH] = useState(DEFAULT_HEIGHT);

  // Apparent slope on screen, as pixels of Y rise per pixel of X. Compares
  // the on-canvas rise/run for the same underlying data change. Higher number
  // = chart looks steeper, no matter what the underlying trend is.
  const aspect = chartH / chartW;
  const visibleYRange = yHonestHigh - yLow;
  const dataYChange = dataMax - dataMin;
  // pixel rise per pixel run:
  // = (dataYChange / visibleYRange) * chartH / ((visibleXRange / visibleXRange) * chartW)
  // = (dataYChange / visibleYRange) * (chartH / chartW)
  const apparentSlope = (dataYChange / visibleYRange) * aspect;
  // The "true" slope reference — what you'd see at the default canvas size
  // with a 0-floor y-axis: dataYChange / (full range) * (default aspect).
  const trueSlope = (dataYChange / yHonestHigh) * (DEFAULT_HEIGHT / DEFAULT_WIDTH);
  const slopeMultiplier = apparentSlope / trueSlope;

  const cropped = yLow > 0 || chartW !== DEFAULT_WIDTH || chartH !== DEFAULT_HEIGHT;

  const verdict =
    slopeMultiplier < 1.2
      ? { tone: 'emerald', label: 'Faithful', note: 'The slope on screen matches the data\'s real rate of change.' }
      : slopeMultiplier < 2
        ? { tone: 'amber', label: 'Tilted', note: `The line looks ${slopeMultiplier.toFixed(1)}× steeper than the honest portrayal.` }
        : { tone: 'rose', label: 'Distorted', note: `The line looks ${slopeMultiplier.toFixed(1)}× steeper than the data warrants. A reader will badly overstate the change.` };

  const resetCrop = () => {
    setYLow(0);
    setChartW(DEFAULT_WIDTH);
    setChartH(DEFAULT_HEIGHT);
  };

  return (
    <LessonShell number="L1" family="VISUAL DECEPTION" title="Same Data, Different Story" concept="Y-axis crop and canvas size" accent="rose" exploreDataset="co2">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
            Same data. Different story.
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Real atmospheric CO₂ from NOAA, 1959 to today. The numbers haven't
            changed. Crop the y-axis floor, or just stretch the chart up and
            down — and watch the climate trend get more dramatic without
            anyone changing a thing.
          </p>
        </div>

        {/* Your version — interactive */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-baseline justify-between mb-3 px-2">
            <div>
              <div className="eyebrow text-rose-700">Your version</div>
              <div className="text-xs text-slate-500">Crop the y-axis, or change the chart's width and height.</div>
            </div>
            {cropped && (
              <button
                onClick={resetCrop}
                className="text-[11px] eyebrow text-brand-700 hover:text-accent-700 hover:underline"
              >
                reset
              </button>
            )}
          </div>

          {/* The chart canvas — its rendered dimensions are user-controlled. */}
          <div className="bg-surface-subtle/30 rounded-lg p-3 overflow-auto">
            <div
              className="mx-auto bg-white rounded-md border border-slate-200"
              style={{ width: chartW, height: chartH }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 12, right: 16, bottom: 20, left: 16 }}>
                  <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    type="number"
                    domain={[yearStart, yearEnd]}
                    stroke="#64748B"
                    tickCount={6}
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
            <div className="text-center text-[10px] font-mono text-slate-400 mt-2 tabular-nums">
              {chartW}px × {chartH}px · aspect {(chartW / chartH).toFixed(2)}:1
            </div>
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

          {/* Canvas width */}
          <div className="mt-5 px-2">
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-sm font-semibold text-ink">Chart width</label>
              <span className="font-mono text-sm tabular-nums text-slate-700">{chartW}px</span>
            </div>
            <input
              type="range"
              min={MIN_WIDTH}
              max={MAX_WIDTH}
              step={10}
              value={chartW}
              onChange={(e) => setChartW(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>{MIN_WIDTH}px (narrow)</span>
              <span>{MAX_WIDTH}px (wide)</span>
            </div>
          </div>

          {/* Canvas height */}
          <div className="mt-5 px-2">
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-sm font-semibold text-ink">Chart height</label>
              <span className="font-mono text-sm tabular-nums text-slate-700">{chartH}px</span>
            </div>
            <input
              type="range"
              min={MIN_HEIGHT}
              max={MAX_HEIGHT}
              step={10}
              value={chartH}
              onChange={(e) => setChartH(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>{MIN_HEIGHT}px (squat)</span>
              <span>{MAX_HEIGHT}px (tall)</span>
            </div>
          </div>
        </div>

        {/* Honest baseline — fixed proportions and full y-axis. */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-baseline justify-between mb-2 px-2">
            <div>
              <div className="eyebrow text-emerald-700">The same data, honest defaults</div>
              <div className="text-xs text-slate-500">
                Y-axis from 0. Default canvas size ({DEFAULT_WIDTH}×{DEFAULT_HEIGHT}).
              </div>
            </div>
            <div className="font-mono text-[10px] text-slate-400">reference</div>
          </div>
          <div className="bg-surface-subtle/30 rounded-lg p-3">
            <div
              className="mx-auto bg-white rounded-md border border-slate-200"
              style={{ width: DEFAULT_WIDTH, maxWidth: '100%', height: DEFAULT_HEIGHT }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 12, right: 16, bottom: 20, left: 16 }}>
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
                  <Line type="monotone" dataKey="co2" stroke="#10B981" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <Verdict tone={verdict.tone} label={verdict.label} note={verdict.note} multiplier={slopeMultiplier} />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">The lesson</h2>
          <p className="text-sm text-ink leading-relaxed">
            CO₂ went from about <strong>316 ppm in 1959</strong> to{' '}
            <strong>424 ppm in 2024</strong>. That's a <strong>34%</strong> rise
            — significant, but not the steep cliff a cropped or stretched chart
            can suggest. Two tricks here: cropping the y-axis floor makes the
            change look bigger, and changing the chart's aspect ratio (taller-
            than-wide) makes any slope look steeper. The data hasn't changed —
            only the canvas you drew it on.
          </p>
          <p className="text-sm text-ink leading-relaxed">
            Neither trick is automatically dishonest. Sometimes y-axis cropping
            is the only way to <em>see</em> a small but real change
            (thermometers, stock prices, election polls). Sometimes a tall
            chart is necessary to compare two near-identical trends. But both
            are tools with consequences.{' '}
            <strong>Always check the y-axis floor and the chart's shape before
            you believe a trend.</strong>
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
            <strong className="text-slate-800">Try it in the wild:</strong> next
            time you see a chart on social media, look at where the y-axis
            starts, and ask whether the chart is squat or stretched.
          </div>
        </div>
      </div>
    </LessonShell>
  );
}

function Verdict({ tone, label, note, multiplier }: { tone: string; label: string; note: string; multiplier: number }) {
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
          slope looks {multiplier.toFixed(1)}× steeper than honest
        </div>
      </div>
      <p className="text-sm mt-1.5 leading-relaxed">{note}</p>
    </div>
  );
}
