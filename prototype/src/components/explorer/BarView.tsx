import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { Dataset, Row, Attribute } from '../../lib/dataset';
import { categoricalCounts } from '../../lib/dataset';
import { categoryColor } from './ColorScale';

interface BarViewProps {
  dataset: Dataset;
  rows: Row[];
  xAttr: Attribute; // categorical
}

export default function BarView({ rows, xAttr }: BarViewProps) {
  const data = useMemo(() => {
    const counts = categoricalCounts(rows.map((r) => (r[xAttr.key] as string | number | null)));
    if (xAttr.ordinal) {
      // Use first-occurrence order from the rows. Preserves natural ordering
      // (decades chronological, hurricane categories TS→5, age bands ascending).
      const order: string[] = [];
      const seen = new Set<string>();
      for (const r of rows) {
        const v = r[xAttr.key];
        if (v === null || v === undefined) continue;
        const k = String(v);
        if (!seen.has(k) && counts.has(k)) {
          seen.add(k);
          order.push(k);
        }
      }
      return order.map((cat) => ({ cat, count: counts.get(cat) ?? 0 }));
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({ cat, count }));
  }, [rows, xAttr]);

  const cats = data.map((d) => d.cat);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 24, bottom: 70, left: 24 }}>
          <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
          <XAxis
            dataKey="cat"
            stroke="#64748B"
            angle={-30}
            textAnchor="end"
            height={70}
            interval={0}
            label={{
              value: xAttr.label,
              position: 'insideBottom',
              offset: -2,
              fill: '#475569',
              fontSize: 13,
            }}
          />
          <YAxis
            stroke="#64748B"
            label={{ value: 'Count', angle: -90, position: 'insideLeft', offset: 8, fill: '#475569', fontSize: 13, dy: 30 }}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #DBEAFE', fontSize: 12 }}
            formatter={(val) => [String(val), 'count']}
          />
          <Bar dataKey="count">
            {data.map((d) => (
              <Cell key={d.cat} fill={categoryColor(d.cat, cats)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
