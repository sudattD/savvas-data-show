import { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Dataset, Row, Attribute } from '../../lib/dataset';
import { categoryColor, uniqueValues, DEFAULT_POINT } from './ColorScale';

interface ScatterViewProps {
  dataset: Dataset;
  rows: Row[];
  xAttr: Attribute;
  yAttr: Attribute;
  colorAttr?: Attribute | null;
}

function axisLabel(a: Attribute): string {
  const base = `${a.label}${a.unit ? ` (${a.unit})` : ''}`;
  return a.axisHint ? `${base} · ${a.axisHint}` : base;
}

export default function ScatterView({ dataset, rows, xAttr, yAttr, colorAttr }: ScatterViewProps) {
  const groups = useMemo(() => {
    if (!colorAttr) {
      return [
        {
          name: dataset.name,
          color: DEFAULT_POINT,
          points: rows.map((r) => ({ x: Number(r[xAttr.key]), y: Number(r[yAttr.key]), row: r })),
        },
      ];
    }
    const cats = uniqueValues(rows, colorAttr.key);
    return cats.map((c) => ({
      name: c,
      color: categoryColor(c, cats),
      points: rows
        .filter((r) => String(r[colorAttr.key]) === c)
        .map((r) => ({ x: Number(r[xAttr.key]), y: Number(r[yAttr.key]), row: r })),
    }));
  }, [rows, xAttr, yAttr, colorAttr, dataset.name]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: 24, bottom: 36, left: 24 }}>
          <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            domain={['dataMin', 'dataMax']}
            stroke="#64748B"
            label={{
              value: axisLabel(xAttr),
              position: 'insideBottom',
              offset: -16,
              fill: '#475569',
              fontSize: 13,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={['dataMin', 'dataMax']}
            reversed={yAttr.preferReversed === true}
            stroke="#64748B"
            label={{
              value: axisLabel(yAttr),
              angle: -90,
              position: 'insideLeft',
              offset: 8,
              fill: '#475569',
              fontSize: 13,
              dy: 60,
            }}
          />
          <Tooltip
            cursor={{ stroke: '#94A3B8', strokeDasharray: '3 3' }}
            contentStyle={{ borderRadius: 12, border: '1px solid #DBEAFE', fontSize: 12 }}
            formatter={(val, name) => {
              if (name === 'x') return [Number(val).toFixed(2), xAttr.label];
              if (name === 'y') return [Number(val).toFixed(2), yAttr.label];
              return [val, name];
            }}
          />
          {colorAttr && groups.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {groups.map((g) => (
            <Scatter key={g.name} name={g.name} data={g.points} fill={g.color} fillOpacity={0.6} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
