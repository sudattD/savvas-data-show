import { useMemo } from 'react';
import type { Dataset, Row, Attribute } from '../../lib/dataset';
import { numericStats } from '../../lib/dataset';
import { categoryColor } from './ColorScale';

interface BoxPlotViewProps {
  dataset: Dataset;
  rows: Row[];
  yAttr: Attribute; // numeric
  groupAttr: Attribute; // categorical
}

interface Box {
  group: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  count: number;
}

export default function BoxPlotView({ rows, yAttr, groupAttr }: BoxPlotViewProps) {
  const boxes = useMemo(() => {
    const grouped = new Map<string, number[]>();
    for (const r of rows) {
      const g = String(r[groupAttr.key]);
      const v = Number(r[yAttr.key]);
      if (!Number.isFinite(v)) continue;
      const list = grouped.get(g) ?? [];
      list.push(v);
      grouped.set(g, list);
    }
    const out: Box[] = [];
    for (const [g, vals] of grouped.entries()) {
      const s = numericStats(vals);
      if (!s) continue;
      out.push({
        group: g,
        min: s.min,
        q1: s.q1,
        median: s.median,
        q3: s.q3,
        max: s.max,
        count: s.count,
      });
    }
    if (groupAttr.ordinal) {
      const order: string[] = [];
      const seen = new Set<string>();
      for (const r of rows) {
        const k = String(r[groupAttr.key]);
        if (!seen.has(k) && grouped.has(k)) {
          seen.add(k);
          order.push(k);
        }
      }
      const idx = new Map(order.map((k, i) => [k, i]));
      return out.sort((a, b) => (idx.get(a.group) ?? 999) - (idx.get(b.group) ?? 999));
    }
    return out.sort((a, b) => b.median - a.median);
  }, [rows, yAttr, groupAttr]);

  if (boxes.length === 0) {
    return <div className="grid place-items-center h-full text-slate-400 text-sm">No data</div>;
  }

  const allCats = boxes.map((b) => b.group);

  // overall y range
  const yMin = Math.min(...boxes.map((b) => b.min));
  const yMax = Math.max(...boxes.map((b) => b.max));
  const yPad = (yMax - yMin) * 0.05;
  const yLo = yMin - yPad;
  const yHi = yMax + yPad;
  const yScale = (v: number, h: number) => h - ((v - yLo) / (yHi - yLo)) * h;

  // Draw via SVG. CHART width responsive via parent.
  return (
    <div className="w-full h-full p-4">
      <svg viewBox={`0 0 ${Math.max(boxes.length * 60 + 80, 400)} 360`} className="w-full h-full">
        {/* y axis */}
        <g>
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
            const v = yLo + p * (yHi - yLo);
            const y = yScale(v, 320) + 10;
            return (
              <g key={i}>
                <line x1={60} x2={Math.max(boxes.length * 60 + 80, 400) - 10} y1={y} y2={y} stroke="#E5EFFB" strokeDasharray="3 3" />
                <text x={55} y={y + 4} textAnchor="end" fontSize={11} fill="#64748B" fontFamily="monospace">
                  {v.toFixed(0)}
                </text>
              </g>
            );
          })}
          <text x={20} y={20} fontSize={11} fill="#475569" fontWeight="600" textAnchor="start">
            {yAttr.label}
            {yAttr.unit ? ` (${yAttr.unit})` : ''}
          </text>
        </g>
        {/* boxes */}
        {boxes.map((b, i) => {
          const cx = 60 + 40 + i * 60;
          const boxW = 36;
          const yMinPx = yScale(b.min, 320) + 10;
          const yQ1 = yScale(b.q1, 320) + 10;
          const yMed = yScale(b.median, 320) + 10;
          const yQ3 = yScale(b.q3, 320) + 10;
          const yMaxPx = yScale(b.max, 320) + 10;
          const color = categoryColor(b.group, allCats);
          return (
            <g key={b.group}>
              {/* whiskers */}
              <line x1={cx} x2={cx} y1={yMinPx} y2={yMaxPx} stroke={color} strokeWidth={1.5} />
              <line x1={cx - boxW / 4} x2={cx + boxW / 4} y1={yMinPx} y2={yMinPx} stroke={color} strokeWidth={1.5} />
              <line x1={cx - boxW / 4} x2={cx + boxW / 4} y1={yMaxPx} y2={yMaxPx} stroke={color} strokeWidth={1.5} />
              {/* box */}
              <rect x={cx - boxW / 2} y={yQ3} width={boxW} height={yQ1 - yQ3} fill={color} fillOpacity={0.45} stroke={color} strokeWidth={1.5} rx={2} />
              {/* median */}
              <line x1={cx - boxW / 2} x2={cx + boxW / 2} y1={yMed} y2={yMed} stroke="#0B1B2B" strokeWidth={2} />
              {/* group label */}
              <text x={cx} y={344} textAnchor="middle" fontSize={11} fill="#475569" fontWeight="600">
                {b.group.length > 8 ? b.group.slice(0, 7) + '…' : b.group}
              </text>
              <text x={cx} y={356} textAnchor="middle" fontSize={9} fill="#94A3B8" fontFamily="monospace">
                n={b.count}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
