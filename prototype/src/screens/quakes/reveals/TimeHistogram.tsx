import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { HISTORICAL_EARTHQUAKES } from '../../../data/historicalEarthquakes';

// Bucket every M6+ event by calendar year. The point: although individual
// years vary, the long-term rate is roughly steady — plate motion is
// constant, so the *rate* of large quakes globally is too. No "earthquake
// seasons."

interface YearBin {
  year: string;
  count: number;
}

export default function TimeHistogram() {
  const bins = useMemo<YearBin[]>(() => {
    const map = new Map<number, number>();
    for (const q of HISTORICAL_EARTHQUAKES) {
      const y = new Date(q.time).getUTCFullYear();
      map.set(y, (map.get(y) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([y, n]) => ({ year: String(y), count: n }));
  }, []);

  return (
    <div className="bg-white p-3" style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bins} margin={{ top: 16, right: 24, bottom: 32, left: 48 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="year"
            label={{ value: 'Year', position: 'bottom', offset: 10, fill: '#475569', fontSize: 12 }}
            tick={{ fill: '#475569', fontSize: 10 }}
            interval={4}
            stroke="#94a3b8"
          />
          <YAxis
            label={{ value: 'M6+ events globally', angle: -90, position: 'insideLeft', offset: 10, fill: '#475569', fontSize: 12 }}
            tick={{ fill: '#475569', fontSize: 11 }}
            stroke="#94a3b8"
          />
          <Tooltip
            cursor={{ fill: 'rgba(244, 63, 94, 0.08)' }}
            formatter={(value) => [`${value} events`, '']}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="count" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
