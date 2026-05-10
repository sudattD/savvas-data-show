import { useMemo, useState } from 'react';
import LessonShell from '../../components/LessonShell';

// 10 modest wages in dollars. Then we drop in the "billionaire" outlier.
const BAR_WAGES_K = [28, 31, 35, 38, 42, 48, 53, 61, 72, 95]; // 10 people, in $k

function median(arr: number[]): number {
  const s = [...arr].sort((a, b) => a - b);
  const n = s.length;
  if (n === 0) return 0;
  if (n % 2 === 1) return s[(n - 1) / 2];
  return (s[n / 2 - 1] + s[n / 2]) / 2;
}
function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

export default function WalkIntoABar() {
  const baseValues = useMemo(() => BAR_WAGES_K.slice(), []);
  // Outlier wealth in millions (billionaire varies)
  const [outlierM, setOutlierM] = useState(0); // 0..1000 million

  const all = useMemo(() => {
    const arr = [...baseValues];
    if (outlierM > 0) arr.push(outlierM * 1000); // convert M to $k for unit consistency
    return arr;
  }, [baseValues, outlierM]);

  const m = mean(all);
  const med = median(all);
  const baseMean = mean(baseValues);
  const baseMedian = median(baseValues);

  const meanX = (m / 1500) * 100; // x position on a 0..1500k bar
  const medX = (med / 1500) * 100;

  return (
    <LessonShell number="L2" family="STATISTICAL THINKING" title="A Billionaire Walks Into a Bar" concept="Mean vs median with outliers" accent="amber">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
            One person can move the average.<br />
            But not the middle.
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Here are 10 people in a bar with their annual salaries. Slide the
            slider to walk a billionaire in — and watch what happens to the
            average. Then watch what happens to the median.
          </p>
        </div>

        {/* Bar with people */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="text-xs font-semibold tracking-widest text-slate-500 mb-3">
            ANNUAL SALARY ($K) · {all.length} PEOPLE
          </div>

          <div className="relative h-32 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg overflow-hidden border border-amber-200">
            {/* Axis ticks */}
            <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 text-[10px] text-slate-500 font-mono">
              {[0, 250, 500, 750, 1000, 1250, 1500].map((v) => (
                <span key={v}>${v}k</span>
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-4 h-px bg-slate-300" />

            {/* People dots */}
            {baseValues.map((v, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-slate-700 border-2 border-white shadow-sm"
                style={{ left: `calc(${(v / 1500) * 100}% - 6px)`, bottom: 14 + (i % 3) * 14 }}
                title={`Person ${i + 1}: $${v}k`}
              />
            ))}
            {outlierM > 0 && (
              <div
                className="absolute w-4 h-4 rounded-full bg-amber-600 border-2 border-white shadow-md ring-4 ring-amber-300/60"
                style={{ left: `calc(${Math.min(99, (outlierM * 1000 / 1500) * 100)}% - 8px)`, bottom: 50 }}
                title={`Billionaire: $${outlierM}M`}
              />
            )}

            {/* Mean / median markers */}
            <div
              className="absolute top-1 bottom-4 w-0.5 bg-rose-500"
              style={{ left: `${Math.min(99, meanX)}%` }}
            >
              <div className="absolute -top-1 -translate-x-1/2 px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold whitespace-nowrap">
                mean
              </div>
            </div>
            <div
              className="absolute top-1 bottom-4 w-0.5 bg-emerald-600"
              style={{ left: `${Math.min(99, medX)}%` }}
            >
              <div className="absolute -bottom-1 translate-y-full -translate-x-1/2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold whitespace-nowrap">
                median
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="mt-6">
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-sm font-semibold text-ink">
                Walk a billionaire in
              </label>
              <span className="font-mono text-sm tabular-nums text-amber-700">
                {outlierM > 0 ? `$${outlierM}M /yr` : 'no one yet'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={outlierM}
              onChange={(e) => setOutlierM(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>$0M (no outlier)</span>
              <span>$1B (mega-billionaire)</span>
            </div>
          </div>

          {/* Stats panel */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Stat label="Mean (average)" before={baseMean} after={m} tone="rose" />
            <Stat label="Median (middle)" before={baseMedian} after={med} tone="emerald" />
          </div>
        </div>

        {/* Lesson */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">The lesson</h2>
          <p className="text-sm text-ink leading-relaxed">
            The <strong>mean</strong> includes every value, so a single huge
            outlier drags it up violently. The <strong>median</strong> only
            cares about the middle of the sorted list — adding one extreme
            value barely moves it.
          </p>
          <p className="text-sm text-ink leading-relaxed">
            That's why "average wage" and "household income" are usually
            reported as <em>medians</em>. If you reported them as means, a
            handful of CEOs would make the whole country look richer than
            it is.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
            <strong className="text-amber-900">Rule of thumb:</strong> when a
            distribution might have outliers (income, house prices, social
            media followers), the median is usually the more honest summary.
          </div>
        </div>
      </div>
    </LessonShell>
  );
}

function Stat({ label, before, after, tone }: { label: string; before: number; after: number; tone: 'rose' | 'emerald' }) {
  const fmt = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(2)}M` : `$${v.toFixed(0)}k`;
  const moved = before > 0 ? ((after - before) / before) * 100 : 0;
  const cls = tone === 'rose' ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900';
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <div className="text-[10px] font-semibold tracking-widest opacity-70 mb-1">{label}</div>
      <div className="font-display text-2xl font-bold tabular-nums">{fmt(after)}</div>
      <div className="text-xs mt-1 opacity-80 font-mono tabular-nums">
        was {fmt(before)} {moved !== 0 ? `· ${moved > 0 ? '+' : ''}${moved.toFixed(0)}%` : ''}
      </div>
    </div>
  );
}
