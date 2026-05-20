import { useMemo } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from 'recharts';
import { HISTORICAL_EARTHQUAKES } from '../../../data/historicalEarthquakes';
import { depthColor } from '../quakeColors';

// Tuva's flagship "is magnitude related to depth?" scatter. We invert the
// Y axis so the surface (depth = 0) sits at the top — same convention Tuva
// uses, and it's geologically intuitive.
//
// The bimodal depth pattern (most events under 200 km, then a separate band
// >500 km, very few in between) is what students should notice.

interface ScatterPoint {
  mag: number;
  depthKm: number;
  color: string;
}

export default function ScatterDepthMag() {
  const points = useMemo<ScatterPoint[]>(
    () =>
      HISTORICAL_EARTHQUAKES.map((q) => ({
        mag: q.mag,
        depthKm: q.depthKm,
        color: depthColor(q.depthKm),
      })),
    [],
  );

  // Split by depth tier so we can color the scatter without per-point fill.
  const shallow = points.filter((p) => p.depthKm < 70);
  const mid = points.filter((p) => p.depthKm >= 70 && p.depthKm < 300);
  const deep = points.filter((p) => p.depthKm >= 300);

  return (
    <div className="bg-white p-3" style={{ height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: 24, bottom: 32, left: 48 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          {/* Bands that highlight the bimodal depth distribution */}
          <ReferenceArea y1={0} y2={70} fill="#fee2e2" fillOpacity={0.25} />
          <ReferenceArea y1={300} y2={700} fill="#e0e7ff" fillOpacity={0.25} />
          <XAxis
            type="number"
            dataKey="mag"
            domain={[6, 'dataMax + 0.2']}
            label={{ value: 'Magnitude', position: 'bottom', offset: 10, fill: '#475569', fontSize: 12 }}
            tick={{ fill: '#475569', fontSize: 11 }}
            stroke="#94a3b8"
          />
          <YAxis
            type="number"
            dataKey="depthKm"
            reversed
            domain={[0, 'dataMax + 20']}
            label={{ value: 'Depth (km)', angle: -90, position: 'insideLeft', offset: 10, fill: '#475569', fontSize: 12 }}
            tick={{ fill: '#475569', fontSize: 11 }}
            stroke="#94a3b8"
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3', stroke: '#94a3b8' }}
            formatter={(value, name) => {
              const v = Number(value);
              if (!Number.isFinite(v)) return [String(value), String(name)];
              return name === 'depthKm'
                ? [`${v.toFixed(0)} km`, 'Depth']
                : [`M${v.toFixed(1)}`, 'Magnitude'];
            }}
            contentStyle={{ fontSize: 12 }}
          />
          <Scatter data={shallow} fill="#f87171" fillOpacity={0.55} r={3} />
          <Scatter data={mid} fill="#fbbf24" fillOpacity={0.55} r={3} />
          <Scatter data={deep} fill="#818cf8" fillOpacity={0.55} r={3} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
