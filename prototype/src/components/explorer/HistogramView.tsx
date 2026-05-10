import { useMemo } from 'react';
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

interface HistogramViewProps {
  dataset: Dataset;
  rows: Row[];
  xAttr: Attribute;
  bins?: number;
}

export default function HistogramView({ rows, xAttr, bins = 20 }: HistogramViewProps) {
  const { binsData, stats } = useMemo(() => {
    const values = rows
      .map((r) => Number(r[xAttr.key]))
      .filter((n) => Number.isFinite(n));
    const stats = numericStats(values);
    if (!stats || values.length === 0) return { binsData: [], stats: null };
    const range = stats.max - stats.min;
    const w = range / bins;
    const counts = new Array(bins).fill(0);
    for (const v of values) {
      let i = Math.floor((v - stats.min) / w);
      if (i === bins) i = bins - 1;
      if (i >= 0 && i < bins) counts[i]++;
    }
    const binsData = counts.map((count, i) => ({
      bin: stats.min + (i + 0.5) * w,
      label: `${(stats.min + i * w).toFixed(1)}–${(stats.min + (i + 1) * w).toFixed(1)}`,
      count,
    }));
    return { binsData, stats };
  }, [rows, xAttr, bins]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={binsData} margin={{ top: 16, right: 24, bottom: 36, left: 24 }}>
          <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
          <XAxis
            dataKey="bin"
            type="number"
            domain={['dataMin', 'dataMax']}
            stroke="#64748B"
            tickFormatter={(v) => Number(v).toFixed(1)}
            label={{
              value: `${xAttr.label}${xAttr.unit ? ` (${xAttr.unit})` : ''}`,
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
          <Bar dataKey="count" fill="#3B82F6" fillOpacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
