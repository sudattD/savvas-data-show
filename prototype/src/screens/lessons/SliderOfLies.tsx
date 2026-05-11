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

export default function SliderOfLies() {
  const data = useMemo(() => getAnnualSeries(), []);
  const dataMin = Math.min(...data.map((d) => d.co2));
  const dataMax = Math.max(...data.map((d) => d.co2));
  const trueMin = Math.floor(dataMin / 5) * 5;
  const trueMax = Math.ceil(dataMax / 5) * 5;

  // The slider controls the LOW edge of the y-axis. At yLow=0 it tells the truth.
  // At yLow near dataMin the trend looks dramatic. Default to 0 (honest).
  const [yLow, setYLow] = useState(0);
  const yHigh = trueMax + 10;

  const range = yHigh - yLow;
  const dataRange = dataMax - dataMin;
  const visualSteepness = (dataRange / range) * 100;

  const verdict =
    visualSteepness < 15
      ? { tone: 'emerald', label: 'Honest', note: 'Y-axis starts at zero. The trend reads correctly.' }
      : visualSteepness < 50
      ? { tone: 'amber', label: 'Borderline', note: 'Y-axis is cropped. Reader may overstate the change.' }
      : { tone: 'rose', label: 'Misleading', note: 'Y-axis is heavily cropped. The trend looks much steeper than it is.' };

  return (
    <LessonShell number="L1" family="VISUAL DECEPTION" title="The Slider of Lies" concept="Truncated y-axis" accent="rose">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
            Same data. Two stories.
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            This is real atmospheric CO₂ from NOAA, 1959 to today. The numbers
            haven't changed. Slide the y-axis floor up and watch the chart get
            more dramatic — without anyone changing a thing.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 12, right: 16, bottom: 24, left: 16 }}>
                <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  stroke="#64748B"
                  tickCount={8}
                />
                <YAxis
                  domain={[yLow, yHigh]}
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

          <div className="mt-5 px-2">
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-sm font-semibold text-ink">
                Y-axis floor
              </label>
              <span className="font-mono text-sm tabular-nums text-slate-700">
                {yLow.toFixed(0)} ppm
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={trueMin}
              step={1}
              value={yLow}
              onChange={(e) => setYLow(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0 (honest)</span>
              <span>{trueMin} (cropped)</span>
            </div>
          </div>
        </div>

        <Verdict tone={verdict.tone} label={verdict.label} note={verdict.note} steepness={visualSteepness} />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">The lesson</h2>
          <p className="text-sm text-ink leading-relaxed">
            CO₂ went from about <strong>316 ppm in 1959</strong> to{' '}
            <strong>424 ppm in 2024</strong>. That's a <strong>34%</strong> rise
            — significant, but not the steep cliff a cropped chart would
            suggest. When a y-axis doesn't start at zero, your eye reads the
            change as bigger than it is.
          </p>
          <p className="text-sm text-ink leading-relaxed">
            That doesn't make a truncated y-axis automatically dishonest.
            Sometimes it's the only way to <em>see</em> a small but real
            change (think: thermometers, stock prices, election polls). But
            it's a tool with consequences. <strong>Always check the y-axis
            floor before you believe a trend chart.</strong>
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
            <strong className="text-slate-800">Try it on the wild:</strong> next
            time you see a chart on social media, look at the bottom of the
            y-axis first.
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
