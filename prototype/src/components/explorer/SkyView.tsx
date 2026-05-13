// "Sky" chart type for celestial-coordinate datasets (raHours / decDeg).
// Dark background, dot radius scales with apparent magnitude via Recharts
// ZAxis (brighter star = bigger dot), spectral-class hues by stellar
// surface colour when colour attribute is spectClass.

import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import type { Dataset, Row, Attribute } from '../../lib/dataset';
import { categoryColor } from './ColorScale';

interface SkyViewProps {
  dataset: Dataset;
  rows: Row[];
  colorAttr?: Attribute | null;
}

const STELLAR_COLOR: Record<string, string> = {
  O: '#9bb0ff',
  B: '#aabfff',
  A: '#cad7ff',
  F: '#f8f7ff',
  G: '#fff4ea',
  K: '#ffd2a1',
  M: '#ffcc6f',
};

// Apparent magnitude → dot radius (px) and opacity (0–1). A real night sky
// reads as points of light of varying brightness, not blobs of varying size.
// We use OPACITY as the primary brightness encoding (bright stars saturated,
// faint stars near-transparent) with a small radius bump for the very brightest
// few. Mag scale is logarithmic and inverted: Sirius -1.4, Vega 0.0, naked-eye
// limit ~+6.
function magToRadius(mag: number): number {
  // Sirius (-1.4) → ~3.0 px, Vega (0.0) → ~2.3 px, mag +3 → ~1.4 px, +6 → ~0.9 px
  const r = 2.5 - (mag + 1.5) * 0.28;
  return Math.max(0.9, Math.min(3.5, r));
}
function magToOpacity(mag: number): number {
  // Brightest (-1.5) → 1.0, faintest (+6) → 0.32
  const o = 1.0 - (mag + 1.5) * 0.09;
  return Math.max(0.32, Math.min(1.0, o));
}

interface SkyPoint {
  x: number;
  y: number;
  mag: number;
  name: string;
  constellation?: string;
  spectClass?: string;
  spectralType?: string;
}

function toPoint(row: Row): SkyPoint {
  const mag = Number(row.mag ?? 5);
  return {
    x: Number(row.raHours),
    y: Number(row.decDeg),
    mag,
    name: String(row.name ?? ''),
    constellation: row.constellation ? String(row.constellation) : undefined,
    spectClass: row.spectClass ? String(row.spectClass) : undefined,
    spectralType: row.spectralType ? String(row.spectralType) : undefined,
  };
}

export default function SkyView({ rows, colorAttr }: SkyViewProps) {
  const groups = useMemo(() => {
    if (colorAttr && colorAttr.kind === 'categorical') {
      const bucketsByValue = new Map<string, Row[]>();
      for (const row of rows) {
        const key = String(row[colorAttr.key] ?? 'other');
        const arr = bucketsByValue.get(key) ?? [];
        arr.push(row);
        bucketsByValue.set(key, arr);
      }
      const values = Array.from(bucketsByValue.keys()).sort();
      return values.map((v) => {
        const color =
          colorAttr.key === 'spectClass' && STELLAR_COLOR[v]
            ? STELLAR_COLOR[v]
            : categoryColor(v, values);
        return { name: v, color, points: (bucketsByValue.get(v) ?? []).map(toPoint) };
      });
    }
    return [{ name: 'stars', color: '#e8e8f0', points: rows.map(toPoint) }];
  }, [rows, colorAttr]);

  return (
    <div className="w-full h-full flex flex-col bg-[#06060e] rounded">
      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 24, bottom: 28, left: 24 }}>
          <CartesianGrid stroke="#1f2240" strokeDasharray="2 4" />
          <XAxis
            type="number"
            dataKey="x"
            name="RA"
            domain={[0, 24]}
            ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
            tickFormatter={(v) => `${v}h`}
            stroke="#9090b0"
            tick={{ fill: '#a8a8c0', fontSize: 11 }}
            label={{
              value: 'Right Ascension (hours)',
              position: 'insideBottom',
              offset: -10,
              fill: '#a8a8c0',
              fontSize: 12,
            }}
            reversed
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Dec"
            domain={[-90, 90]}
            ticks={[-90, -60, -30, 0, 30, 60, 90]}
            tickFormatter={(v) => (v > 0 ? `+${v}°` : `${v}°`)}
            stroke="#9090b0"
            tick={{ fill: '#a8a8c0', fontSize: 11 }}
            width={48}
            label={{
              value: 'Declination',
              angle: -90,
              position: 'insideLeft',
              fill: '#a8a8c0',
              fontSize: 12,
              style: { textAnchor: 'middle' },
            }}
          />
          <ReferenceLine y={0} stroke="#3a3a55" strokeDasharray="3 5" />
          <Tooltip
            cursor={{ stroke: '#3a3a55', strokeDasharray: '3 3' }}
            contentStyle={{
              background: '#101020',
              border: '1px solid #2a2a40',
              borderRadius: 6,
              fontSize: 12,
              color: '#e8e8f0',
            }}
            labelStyle={{ color: '#a8a8c0' }}
            formatter={(value, name) => {
              if (name === 'RA') return [`${Number(value).toFixed(2)} h`, 'RA'];
              if (name === 'Dec') return [`${Number(value).toFixed(2)}°`, 'Dec'];
              return [String(value), String(name)];
            }}
          />
          {groups.length > 1 && (
            <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11, paddingBottom: 4, color: '#a8a8c0' }} />
          )}
          {groups.map((g) => (
            <Scatter
              key={g.name}
              name={g.name}
              data={g.points}
              fill={g.color}
              isAnimationActive={false}
              shape={(props: any) => {
                const { cx, cy, fill, payload } = props;
                if (cx == null || cy == null || Number.isNaN(cx) || Number.isNaN(cy)) return null as any;
                const mag = Number(payload?.mag ?? 5);
                const r = magToRadius(mag);
                const op = magToOpacity(mag);
                return <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={op} />;
              }}
            />
          ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
