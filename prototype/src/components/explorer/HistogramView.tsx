import { useMemo, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { Dataset, Row, Attribute } from '../../lib/dataset';
import { numericStats } from '../../lib/dataset';
import { niceTicks, niceLogTicks } from '../../lib/niceTicks';

interface HistogramViewProps {
  dataset: Dataset;
  rows: Row[];
  xAttr: Attribute;
}

export default function HistogramView({ rows, xAttr }: HistogramViewProps) {
  const [bins, setBins] = useState(20);
  const [markerOn, setMarkerOn] = useState(false);
  const [markerValue, setMarkerValue] = useState(0);
  const [logScale, setLogScale] = useState(false);

  const values = useMemo(
    () => rows.map((r) => Number(r[xAttr.key])).filter((n) => Number.isFinite(n)),
    [rows, xAttr],
  );
  const stats = useMemo(() => numericStats(values), [values]);

  // Log scale needs strictly-positive values. Disable the toggle otherwise.
  const canLog = stats !== null && stats.min > 0;
  const effectiveLog = canLog && logScale;

  // Detect heavy long-tail skew (mean way past median, or one bin holds >70%
  // of the data) — suggest log scale visually.
  const longTail = useMemo(() => {
    if (!stats || !canLog) return false;
    if (stats.max / Math.max(stats.median, 1e-9) > 100) return true;
    return false;
  }, [stats, canLog]);

  // Initialize marker to the median the first time the feature is toggled on.
  useEffect(() => {
    if (markerOn && stats && markerValue === 0) {
      setMarkerValue(stats.median);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerOn, stats]);

  const binsData = useMemo(() => {
    if (!stats || values.length === 0) return [];
    // In log mode, bin in log-space so each bar covers an equal multiplicative
    // factor (e.g. 1-10, 10-100, 100-1000…) — that's what unsquashes long-tail
    // distributions like GDP per capita.
    if (effectiveLog) {
      const lmin = Math.log10(stats.min);
      const lmax = Math.log10(stats.max);
      const lw = (lmax - lmin) / bins;
      const counts = new Array(bins).fill(0);
      for (const v of values) {
        if (v <= 0) continue;
        let i = Math.floor((Math.log10(v) - lmin) / lw);
        if (i === bins) i = bins - 1;
        if (i >= 0 && i < bins) counts[i]++;
      }
      return counts.map((count, i) => {
        const lo = Math.pow(10, lmin + i * lw);
        const hi = Math.pow(10, lmin + (i + 1) * lw);
        return {
          bin: (lo + hi) / 2,
          label: `${formatBinEdge(lo)}–${formatBinEdge(hi)}`,
          count,
        };
      });
    }
    const range = stats.max - stats.min;
    const w = range / bins;
    const counts = new Array(bins).fill(0);
    for (const v of values) {
      let i = Math.floor((v - stats.min) / w);
      if (i === bins) i = bins - 1;
      if (i >= 0 && i < bins) counts[i]++;
    }
    return counts.map((count, i) => ({
      bin: stats.min + (i + 0.5) * w,
      label: `${(stats.min + i * w).toFixed(1)}–${(stats.min + (i + 1) * w).toFixed(1)}`,
      count,
    }));
  }, [values, stats, bins, effectiveLog]);

  const xTickConfig = useMemo(() => {
    if (!stats) return null;
    return effectiveLog
      ? niceLogTicks(stats.min, stats.max)
      : niceTicks(stats.min, stats.max);
  }, [stats, effectiveLog]);

  // Count below the marker value.
  const belowCount = useMemo(
    () => values.filter((v) => v <= markerValue).length,
    [values, markerValue],
  );
  const belowPct = values.length > 0 ? (belowCount / values.length) * 100 : 0;

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="shrink-0 flex items-center gap-3 flex-wrap text-xs">
        <label className="flex items-center gap-2">
          <span className="text-ink-muted">bins</span>
          <input
            type="range"
            min={4}
            max={60}
            step={1}
            value={bins}
            onChange={(e) => setBins(Number(e.target.value))}
            className="w-28 accent-brand-700"
          />
          <span className="font-mono tabular-nums text-ink w-6 text-right">{bins}</span>
        </label>

        <button
          onClick={() => setMarkerOn((v) => !v)}
          className={`px-3 py-1.5 rounded-md font-semibold transition ${
            markerOn
              ? 'bg-brand-900 text-white shadow-editorial'
              : 'bg-surface-raised border border-surface-line text-ink hover:border-brand-300'
          }`}
        >
          {markerOn ? 'Drop a marker ✓' : 'Drop a marker'}
        </button>

        {canLog && (
          <button
            onClick={() => setLogScale((v) => !v)}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              logScale
                ? 'bg-indigo-700 text-white shadow-editorial'
                : 'bg-surface-raised border border-surface-line text-ink hover:border-indigo-300'
            }`}
            title="Bin in log space — useful when one value dominates"
          >
            {logScale ? 'Log scale ✓' : longTail ? 'Try log scale' : 'Log scale'}
          </button>
        )}

        {markerOn && stats && (
          <>
            <label className="flex items-center gap-2">
              <span className="text-ink-muted">value</span>
              <input
                type="range"
                min={stats.min}
                max={stats.max}
                step={(stats.max - stats.min) / 200}
                value={markerValue}
                onChange={(e) => setMarkerValue(Number(e.target.value))}
                className="w-32 accent-brand-700"
              />
              <span className="font-mono tabular-nums text-ink w-16 text-right">{formatScalar(markerValue)}</span>
            </label>
            <div className="font-mono tabular-nums text-ink-soft ml-auto">
              <span className="font-bold text-brand-900">{belowPct.toFixed(1)}%</span> of data ≤ marker ({belowCount.toLocaleString()} of {values.length.toLocaleString()})
            </div>
          </>
        )}
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={binsData} margin={{ top: 16, right: 24, bottom: 36, left: 24 }}>
            <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
            <XAxis
              dataKey="bin"
              type="number"
              domain={xTickConfig ? xTickConfig.domain : ['dataMin', 'dataMax']}
              ticks={xTickConfig?.ticks}
              stroke="#64748B"
              tickFormatter={(v) => Number(v).toFixed(1)}
              label={{
                value: `${xAttr.label}${xAttr.unit ? ` (${xAttr.unit})` : ''}${xAttr.axisHint ? ` · ${xAttr.axisHint}` : ''}`,
                position: 'insideBottom',
                offset: -16,
                fill: '#475569',
                fontSize: 13,
              }}
            />
            <YAxis
              stroke="#64748B"
              label={{
                value: 'Count',
                angle: -90,
                position: 'insideLeft',
                offset: 8,
                fill: '#475569',
                fontSize: 13,
                dy: 30,
              }}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #DBEAFE', fontSize: 12 }}
              formatter={(val) => [String(val), 'count']}
              labelFormatter={(v) => `bin center: ${Number(v).toFixed(2)}`}
            />
            {stats && (
              <ReferenceLine x={stats.mean} stroke="#F59E0B" strokeWidth={2} strokeDasharray="3 3" label={{ value: 'mean', fill: '#F59E0B', fontSize: 11 }} />
            )}
            {stats && (
              <ReferenceLine x={stats.median} stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" label={{ value: 'median', fill: '#10B981', fontSize: 11, position: 'insideTopRight' }} />
            )}
            {markerOn && (
              <ReferenceLine
                x={markerValue}
                stroke="#1A2A52"
                strokeWidth={2.5}
                label={{ value: 'marker', fill: '#1A2A52', fontSize: 11, position: 'top' }}
              />
            )}
            <Bar dataKey="count" fill="#3B82F6" fillOpacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function formatScalar(s: number): string {
  const abs = Math.abs(s);
  if (abs === 0) return '0';
  if (abs >= 1000) return s.toFixed(0);
  if (abs >= 10) return s.toFixed(1);
  return s.toFixed(2);
}

function formatBinEdge(s: number): string {
  const abs = Math.abs(s);
  if (abs === 0) return '0';
  if (abs >= 1_000_000) return `${(s / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(s / 1_000).toFixed(1)}k`;
  if (abs >= 10) return s.toFixed(0);
  if (abs >= 1) return s.toFixed(1);
  return s.toFixed(2);
}
