import { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import type { Dataset } from '../lib/dataset';
import { attrByKey, datasetAccent } from '../lib/dataset';
import { niceTicks } from '../lib/niceTicks';

interface Props {
  dataset: Dataset;
  height?: number;
  /** Color of the points / line. */
  tone?: string;
}

const ACCENT_TO_HEX: Record<string, string> = {
  sky: '#0EA5E9',
  emerald: '#10B981',
  cyan: '#06B6D4',
  amber: '#F59E0B',
  rose: '#F43F5E',
  violet: '#8B5CF6',
  indigo: '#6366F1',
  pink: '#EC4899',
  orange: '#F97316',
  teal: '#14B8A6',
  slate: '#475569',
};

export default function DatasetSparkline({ dataset, height = 160 }: Props) {
  const x = dataset.featured?.x
    ? attrByKey(dataset, dataset.featured.x)
    : dataset.attributes.find((a) => a.kind === 'numeric');
  const y = dataset.featured?.y
    ? attrByKey(dataset, dataset.featured.y)
    : dataset.attributes.find((a) => a.kind === 'numeric' && a.key !== x?.key);

  const points = useMemo(() => {
    if (!x || !y) return [];
    const out: { x: number; y: number }[] = [];
    for (const row of dataset.rows) {
      const xv = Number(row[x.key]);
      const yv = Number(row[y.key]);
      if (Number.isFinite(xv) && Number.isFinite(yv)) out.push({ x: xv, y: yv });
    }
    return out;
  }, [dataset, x, y]);

  const ticks = useMemo(() => {
    if (points.length === 0) return null;
    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    for (const p of points) {
      if (p.x < xMin) xMin = p.x;
      if (p.x > xMax) xMax = p.x;
      if (p.y < yMin) yMin = p.y;
      if (p.y > yMax) yMax = p.y;
    }
    return { x: niceTicks(xMin, xMax, 4), y: niceTicks(yMin, yMax, 4) };
  }, [points]);

  if (!x || !y || points.length === 0) {
    return (
      <div
        className="w-full bg-surface-subtle/40 border border-surface-line rounded-md flex items-center justify-center text-xs text-ink-muted italic"
        style={{ height }}
      >
        No featured view configured
      </div>
    );
  }

  const color = ACCENT_TO_HEX[datasetAccent(dataset)] ?? '#0EA5E9';

  return (
    <figure
      className="w-full bg-surface-raised border border-surface-line rounded-md overflow-hidden"
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 12, bottom: 22, left: 36 }}>
          <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            domain={ticks ? ticks.x.domain : ['dataMin', 'dataMax']}
            ticks={ticks?.x.ticks}
            stroke="#94A3B8"
            tick={{ fontSize: 10, fill: '#64748B' }}
            label={{
              value: `${x.label}${x.unit ? ` (${x.unit})` : ''}`,
              position: 'insideBottom',
              offset: -8,
              fill: '#94A3B8',
              fontSize: 10,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={ticks ? ticks.y.domain : ['dataMin', 'dataMax']}
            ticks={ticks?.y.ticks}
            reversed={y.preferReversed === true}
            stroke="#94A3B8"
            tick={{ fontSize: 10, fill: '#64748B' }}
            width={32}
            label={{
              value: `${y.label}${y.unit ? ` (${y.unit})` : ''}`,
              angle: -90,
              position: 'insideLeft',
              offset: 6,
              fill: '#94A3B8',
              fontSize: 10,
              dy: 50,
            }}
          />
          <Scatter
            data={points}
            fill={color}
            fillOpacity={0.6}
            shape="circle"
            isAnimationActive={false}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </figure>
  );
}
