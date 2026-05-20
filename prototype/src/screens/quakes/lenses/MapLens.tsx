import { useEffect, useMemo, useState } from 'react';
import { getDataset } from '../../../data/registry';
import InteractiveGlobe from '../InteractiveGlobe';
import type { GlobeDot, GlobeOverlay } from '../InteractiveGlobe';
import { isOnRingOfFire, RING_ARCS } from '../ringOfFire';
import { depthColor, magnitudeRadius, DepthLegend } from '../quakeColors';
import type { MapLensState } from './types';

interface MapLensProps {
  state: MapLensState;
  onChange: (next: MapLensState) => void;
  onDerivedChange?: (derived: MapLensDerived) => void;
}

export interface MapLensDerived {
  totalCount: number;
  shownCount: number;
  ringOfFireCount: number;
}

interface QuakePoint {
  lat: number;
  lon: number;
  magnitude: number;
  depthKm: number;
  place: string;
  region: string;
}

function magBand(min: number): { label: string; story: string } {
  if (min < 3.5) return { label: 'Background', story: 'Background tremors — small events everywhere a plate is moving.' };
  if (min < 4.5) return { label: 'Felt locally', story: 'These were felt by people nearby. The dots already trace the Ring.' };
  if (min < 5.5) return { label: 'Damaging', story: 'Strong enough to crack walls. The pattern sharpens — Ring or trench, almost every time.' };
  return { label: 'Major', story: 'The strongest quakes this week. Even at this filter, almost all of them sit on the Ring.' };
}

const RING_OVERLAYS: GlobeOverlay[] = RING_ARCS.map((arc) => ({ points: arc }));

export default function MapLens({ state, onChange, onDerivedChange }: MapLensProps) {
  const dataset = getDataset('earthquakes');

  const allPoints = useMemo<QuakePoint[]>(
    () =>
      dataset.rows.map((r) => ({
        lat: Number(r.lat),
        lon: Number(r.lon),
        magnitude: Number(r.magnitude),
        depthKm: Number(r.depthKm),
        place: String(r.place ?? ''),
        region: String(r.region ?? ''),
      })),
    [dataset],
  );

  const filteredPoints = useMemo(
    () => allPoints.filter((p) => p.magnitude >= state.minMag),
    [allPoints, state.minMag],
  );

  const dots = useMemo<GlobeDot[]>(
    () =>
      filteredPoints.map((p, i) => ({
        id: i,
        lat: p.lat,
        lon: p.lon,
        radius: magnitudeRadius(p.magnitude + 1.5), // M2.5–6 range → boost to feel like M4–7.5
        color: depthColor(p.depthKm),
      })),
    [filteredPoints],
  );

  const ringOfFireCount = useMemo(
    () => filteredPoints.filter((p) => isOnRingOfFire(p.lat, p.lon)).length,
    [filteredPoints],
  );
  const ringPct = filteredPoints.length === 0 ? 0 : Math.round((ringOfFireCount / filteredPoints.length) * 100);
  const band = magBand(state.minMag);

  useEffect(() => {
    onDerivedChange?.({
      totalCount: allPoints.length,
      shownCount: filteredPoints.length,
      ringOfFireCount,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPoints.length, filteredPoints.length, ringOfFireCount]);

  const [hover, setHover] = useState<QuakePoint | null>(null);

  return (
    <div className="space-y-4">
      <div className="bg-[#0c0c1e] rounded-xl border border-slate-800 overflow-hidden relative">
        <InteractiveGlobe
          dots={dots}
          overlays={state.plateLines ? RING_OVERLAYS : []}
          aspectRatio={16 / 10}
          autoRotateDegPerSec={3}
          onHover={(d) => setHover(d ? filteredPoints[d.id as number] ?? null : null)}
        />
        <div className="absolute bottom-2 left-3 px-3 py-1.5 rounded-md bg-black/55 backdrop-blur">
          <DepthLegend tone="dark" />
        </div>
      </div>

      {hover && (
        <div className="bg-slate-900 text-slate-100 rounded-lg p-3 text-xs font-mono leading-snug">
          <span className="text-amber-300">M{hover.magnitude.toFixed(1)}</span>
          {' · '}
          <span>{hover.depthKm.toFixed(0)} km deep</span>
          {' · '}
          <span className="text-slate-300">{hover.place}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-[10px] font-semibold tracking-widest text-rose-700">MIN MAGNITUDE</div>
            <div className="font-display text-xl font-bold text-rose-700 tabular-nums">M{state.minMag.toFixed(1)}+</div>
          </div>
          <input
            type="range"
            min={2.5}
            max={6}
            step={0.1}
            value={state.minMag}
            onChange={(e) => onChange({ ...state, minMag: Number(e.target.value) })}
            className="w-full accent-rose-600"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>2.5 · felt</span>
            <span>4.5 · damaging</span>
            <span>6.0 · destructive</span>
          </div>
          <div className="text-xs text-slate-600 mt-2">
            <strong className="tabular-nums">{filteredPoints.length}</strong> of{' '}
            <strong className="tabular-nums">{allPoints.length}</strong> quakes this week ·{' '}
            <strong className="tabular-nums text-amber-700">{ringPct}%</strong> on the Ring.
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <div className="text-[10px] font-semibold tracking-widest text-amber-700">{band.label.toUpperCase()}</div>
            <div className="text-xs text-slate-700 leading-snug">{band.story}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-[10px] font-semibold tracking-widest text-rose-700 mb-2">OVERLAY</div>
          <button
            onClick={() => onChange({ ...state, plateLines: !state.plateLines })}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              state.plateLines
                ? 'bg-amber-500 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {state.plateLines ? 'Hide Ring of Fire arcs' : 'Show Ring of Fire arcs'}
          </button>
          <div className="text-xs text-slate-600 mt-2 leading-snug">
            Geologists call the curve hugging the Pacific the <em>Ring of Fire</em>.
            Toggle it on — does it line up with what you're seeing?
          </div>
        </div>
      </div>
    </div>
  );
}
