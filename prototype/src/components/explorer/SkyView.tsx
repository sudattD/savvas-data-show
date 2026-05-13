// Dedicated "Sky" chart type for datasets carrying celestial coordinates
// (raHours 0–24, decDeg -90 to +90). Dark background, dot radius scales with
// inverse apparent magnitude (brighter = bigger), stellar-color hues by
// spectral class. Currently used by the Visible Stars dataset.

import { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
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
  O: '#9bb0ff',  // hottest, blue
  B: '#aabfff',
  A: '#cad7ff',  // white-blue
  F: '#f8f7ff',  // white
  G: '#fff4ea',  // yellow (Sun is G2V)
  K: '#ffd2a1',  // orange
  M: '#ffcc6f',  // cool, red-orange
};

// Apparent magnitude → dot radius. Magnitude is logarithmic and inverted
// (lower = brighter). Sirius is -1.4; faintest naked-eye stars ≈ +6.
// We map to a radius range [1, 6] px so the brightest stars stand out without
// the sky becoming a clump.
function magToRadius(mag: number): number {
  // mag -1.5 → 6 px, mag +6 → 1 px (clamped at extremes)
  const r = 6 - (mag + 1.5) * (5 / 7.5);
  return Math.max(1, Math.min(6, r));
}

function fmtRA(h: number): string {
  // 0–24 with leading zero handling, no decimal for axis ticks
  const hi = Math.round(h);
  return `${hi}h`;
}

function fmtDec(d: number): string {
  if (d === 0) return '0°';
  return d > 0 ? `+${d}°` : `${d}°`;
}

export default function SkyView({ dataset, rows, colorAttr }: SkyViewProps) {
  // Use spectClass colours when the color attribute is spectClass; otherwise
  // fall back to the existing categoryColor scheme.
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
          <CartesianGrid stroke="#1a1a2a" strokeDasharray="2 4" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 24]}
            ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
            tickFormatter={fmtRA}
            stroke="#7a7a96"
            tick={{ fill: '#a8a8c0', fontSize: 11 }}
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
            stroke="#7a7a96"
            tick={{ fill: '#a8a8c0', fontSize: 11 }}
            label={{
              value: 'Declination (degrees)',
              angle: -90,
              position: 'insideLeft',
              fill: '#a8a8c0',
              fontSize: 12,
            }}
          />
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
            content={({ active, payload }) => {
              if (!active || !payload || payload.length === 0) return null;
              const p = payload[0].payload as SkyPoint;
              return (
                <div className="rounded-md border px-2.5 py-2"
                  style={{ background: '#101020', borderColor: '#2a2a40', color: '#e8e8f0' }}>
                  <div className="font-semibold text-[13px]" style={{ color: '#fff' }}>{p.name}</div>
                  {p.constellation && (
                    <div className="text-[11px]" style={{ color: '#a8a8c0' }}>{p.constellation} · {p.spectralType ?? p.spectClass}</div>
                  )}
                  <div className="mt-1 text-[11px] tabular-nums" style={{ color: '#a8a8c0' }}>
                    RA {fmtRA(p.x)} · Dec {fmtDec(Math.round(p.y))} · mag {p.mag.toFixed(2)}
                  </div>
                </div>
              );
            }}
          />
          {groups.map((g) => (
            <Scatter
              key={g.name}
              name={g.name}
              data={g.points}
              fill={g.color}
              fillOpacity={0.9}
              stroke={g.color}
              strokeOpacity={0.4}
              strokeWidth={0.5}
              shape={(props: any) => {
                const { cx, cy, fill } = props;
                const r = magToRadius(props.payload.mag);
                return <circle cx={cx} cy={cy} r={r} fill={fill} opacity={0.9} />;
              }}
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
  return {
    x: Number(row.raHours),
    y: Number(row.decDeg),
    mag: Number(row.mag ?? 5),
    name: String(row.name ?? ''),
    constellation: row.constellation ? String(row.constellation) : undefined,
    spectClass: row.spectClass ? String(row.spectClass) : undefined,
    spectralType: row.spectralType ? String(row.spectralType) : undefined,
  };
}
