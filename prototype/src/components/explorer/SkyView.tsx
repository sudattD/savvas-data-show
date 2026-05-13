// Dedicated "Sky" chart type for datasets carrying celestial coordinates
// (raHours 0–24, decDeg -90 to +90). Dark background, dot radius scales with
// inverse apparent magnitude via Recharts ZAxis (brighter = bigger), stellar-
// color hues by spectral class. Currently used by the Visible Stars dataset.

import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { Dataset, Row, Attribute } from '../../lib/dataset';
import { categoryColor } from './ColorScale';

interface SkyViewProps {
  dataset: Dataset;
  rows: Row[];
  colorAttr?: Attribute | null;
}

// Harvard spectral-class → approximate stellar surface colour. Used when the
// user picks spectClass as the color attribute (the default for stars).
const STELLAR_COLOR: Record<string, string> = {
  O: '#9bb0ff',
  B: '#aabfff',
  A: '#cad7ff',
  F: '#f8f7ff',
  G: '#fff4ea',
  K: '#ffd2a1',
  M: '#ffcc6f',
};

// Apparent magnitude → relative dot "z" (Recharts ZAxis size). Lower mag =
// brighter = larger. We map to z in [1, 100] which Recharts then scales to
// the pixel-radius range we pass on ZAxis.range.
function magToZ(mag: number): number {
  // mag -1.5 -> 100; mag +6 -> 1
  const z = 100 - (mag + 1.5) * (99 / 7.5);
  return Math.max(1, Math.min(100, z));
}

function fmtRA(h: number): string {
  return `${Math.round(h)}h`;
}

function fmtDec(d: number): string {
  if (d === 0) return '0°';
  return d > 0 ? `+${d}°` : `${d}°`;
}

interface SkyPoint {
  x: number;
  y: number;
  z: number;
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
    z: magToZ(mag),
    mag,
    name: String(row.name ?? ''),
    constellation: row.constellation ? String(row.constellation) : undefined,
    spectClass: row.spectClass ? String(row.spectClass) : undefined,
    spectralType: row.spectralType ? String(row.spectralType) : undefined,
  };
}

export default function SkyView({ dataset, rows, colorAttr }: SkyViewProps) {
  const groups = useMemo(() => {
    if (colorAttr) {
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
    <div className="w-full h-full bg-[#06060e] rounded">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: 24, bottom: 36, left: 32 }}>
          <CartesianGrid stroke="#1f2240" strokeDasharray="2 4" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 24]}
            ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
            tickFormatter={fmtRA}
            stroke="#8a8aa8"
            label={{
              value: 'Right Ascension (hours, 0 → 24)',
              position: 'insideBottom',
              offset: -16,
              fill: '#a8a8c0',
              fontSize: 12,
            }}
            reversed
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[-90, 90]}
            ticks={[-90, -60, -30, 0, 30, 60, 90]}
            tickFormatter={fmtDec}
            stroke="#8a8aa8"
            label={{
              value: 'Declination (degrees)',
              angle: -90,
              position: 'insideLeft',
              fill: '#a8a8c0',
              fontSize: 12,
              style: { textAnchor: 'middle' },
            }}
          />
          {/* ZAxis maps each point's `z` field to a dot-area range in px²,
              which Recharts converts into circle radius. Range [4, 220] gives
              roughly 1–8 px radius across mag +6 → -1.5. */}
          <ZAxis type="number" dataKey="z" range={[4, 220]} />
          {/* Celestial equator */}
          <ReferenceLine y={0} stroke="#3a3a55" strokeDasharray="4 4" />
          <Tooltip
            cursor={false}
            contentStyle={{
              background: '#101020',
              border: '1px solid #2a2a40',
              borderRadius: 6,
              color: '#e8e8f0',
              fontSize: 12,
            }}
            labelStyle={{ color: '#a8a8c0' }}
            formatter={(value, name, payload) => {
              if (name === 'x') return [`${Number(value).toFixed(2)} h`, 'RA'];
              if (name === 'y') return [`${Number(value).toFixed(2)}°`, 'Dec'];
              if (name === 'z') {
                const p = payload?.payload as SkyPoint | undefined;
                return [p ? `${p.mag.toFixed(2)}` : '', 'mag'];
              }
              return [value as any, name as any];
            }}
            labelFormatter={(_v, payload) => {
              const p = payload?.[0]?.payload as SkyPoint | undefined;
              if (!p) return '';
              const sub = p.constellation
                ? ` · ${p.constellation}${p.spectralType ? ` · ${p.spectralType}` : ''}`
                : '';
              return `${p.name}${sub}`;
            }}
          />
          {groups.map((g) => (
            <Scatter
              key={g.name}
              name={g.name}
              data={g.points}
              fill={g.color}
              fillOpacity={0.85}
              stroke={g.color}
              strokeOpacity={0.4}
              isAnimationActive={false}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      {!dataset.attributes.find((a) => a.key === 'raHours') && (
        <div className="text-xs text-rose-300 p-2">This dataset lacks celestial coordinates.</div>
      )}
    </div>
  );
}
