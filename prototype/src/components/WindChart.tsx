import { useMemo } from 'react';
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { WIND_DATA } from '../data/windTurbine';
import { modelLinePoints } from '../lib/fit';
import type { ModelFn } from '../lib/fit';

interface WindChartProps {
  model?: ModelFn | null;
  showModel?: boolean;
  guessLow?: number | null;
  guessHigh?: number | null;
  highlightWindSpeed?: number | null;
}

export default function WindChart({
  model,
  showModel = true,
  guessLow = null,
  guessHigh = null,
  highlightWindSpeed = null,
}: WindChartProps) {
  const xMin = 0;
  const xMax = 18;
  const yMax = 1700;

  const modelPoints = useMemo(() => {
    if (!model || !showModel) return [];
    return modelLinePoints(model, xMin, xMax, 120);
  }, [model, showModel]);

  return (
    <div className="w-full h-[420px] bg-white rounded-2xl shadow-sm border border-sky-100 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={WIND_DATA} margin={{ top: 16, right: 24, bottom: 32, left: 24 }}>
          <CartesianGrid stroke="#E5EFFB" strokeDasharray="3 3" />
          <XAxis
            dataKey="windSpeed"
            type="number"
            domain={[xMin, xMax]}
            tickCount={10}
            stroke="#64748B"
            label={{ value: 'Wind speed (m/s)', position: 'insideBottom', offset: -16, fill: '#475569', fontSize: 13 }}
          />
          <YAxis
            type="number"
            domain={[0, yMax]}
            stroke="#64748B"
            label={{
              value: 'Power output (kW)',
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
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #DBEAFE',
              fontSize: 12,
            }}
            formatter={(val, name) => [
              `${Number(val).toFixed(0)} kW`,
              name === 'power' ? 'Measured power' : 'Your model',
            ]}
            labelFormatter={(v) => `${Number(v).toFixed(2)} m/s`}
          />

          {guessLow !== null && guessHigh !== null && guessLow > 0 && guessHigh > 0 && (
            <ReferenceArea
              y1={guessLow}
              y2={guessHigh}
              x1={9.5}
              x2={10.5}
              fill="#FFB627"
              fillOpacity={0.18}
              stroke="#FFB627"
              strokeOpacity={0.5}
              strokeDasharray="4 4"
            />
          )}
          {highlightWindSpeed !== null && (
            <ReferenceLine x={highlightWindSpeed} stroke="#FFB627" strokeWidth={2} strokeDasharray="4 4" />
          )}

          <Scatter
            name="power"
            data={WIND_DATA}
            dataKey="power"
            fill="#3B82F6"
            fillOpacity={0.55}
            shape="circle"
          />

          {showModel && model && (
            <Line
              type="monotone"
              dataKey="modelPower"
              data={modelPoints}
              stroke="#FFB627"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
              name="model"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
