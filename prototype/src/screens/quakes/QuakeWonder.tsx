import { useState } from 'react';
import HostBubble from '../../components/HostBubble';

interface QuakeWonderProps {
  onStart: (prediction: PredictionShape | null) => void;
}

export type PredictionShape = 'random' | 'even' | 'lines' | 'one-blob';

interface PredictionOption {
  id: PredictionShape;
  label: string;
  description: string;
  preview: 'random' | 'even' | 'lines' | 'blob';
}

const OPTIONS: PredictionOption[] = [
  {
    id: 'random',
    label: 'Random scatter',
    description: 'Dots all over — no pattern at all.',
    preview: 'random',
  },
  {
    id: 'even',
    label: 'Evenly spread',
    description: 'About one per region — fair distribution.',
    preview: 'even',
  },
  {
    id: 'lines',
    label: 'Clusters along curves',
    description: 'Lines and arcs — like rivers on a map.',
    preview: 'lines',
  },
  {
    id: 'one-blob',
    label: 'One giant blob',
    description: 'All the quakes pile in one spot.',
    preview: 'blob',
  },
];

export default function QuakeWonder({ onStart }: QuakeWonderProps) {
  const [picked, setPicked] = useState<PredictionShape | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A1
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-rose-700">
            ACT 1 · WONDER
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Right now, somewhere, the ground is shaking.
          </h1>
          <p className="text-sm text-slate-600">
            About 150 earthquakes per day worldwide. Where do they happen?
          </p>
        </div>
      </div>

      <HostBubble accent="rose">
        The USGS publishes a real-time feed of every earthquake at magnitude
        2.5 or larger anywhere on Earth. The dataset you're about to plot
        is the past seven days — almost four hundred dots, each one a real
        place that shook. Before you see the map, pick a guess.
      </HostBubble>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-rose-700 mb-1">
            TODAY'S QUESTION
          </div>
          <div className="text-base font-semibold text-ink">
            If we plotted every quake on a world map, what would it look like?
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => setPicked(o.id)}
              className={`text-left rounded-xl border p-3 flex gap-3 items-center transition ${
                picked === o.id
                  ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50'
                  : 'border-slate-200 bg-white hover:border-rose-200'
              }`}
            >
              <PreviewMini kind={o.preview} active={picked === o.id} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink text-sm">{o.label}</div>
                <div className="text-xs text-slate-600 leading-snug">{o.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-slate-500">
          USGS Earthquake Hazards Program · past-week feed.
        </div>
        <button
          onClick={() => onStart(picked)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
        >
          Plot the world →
        </button>
      </div>
    </div>
  );
}

function PreviewMini({ kind, active }: { kind: 'random' | 'even' | 'lines' | 'blob'; active: boolean }) {
  const W = 56;
  const H = 36;
  const fill = active ? '#e11d48' : '#94a3b8';
  // Deterministic dot positions per kind
  const dots: Array<[number, number]> = [];
  if (kind === 'random') {
    for (let i = 0; i < 18; i++) {
      const seed = i * 9301 + 49297;
      dots.push([(seed % 100) / 100 * W, ((seed * 7) % 100) / 100 * H]);
    }
  } else if (kind === 'even') {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 6; c++) {
        dots.push([(c + 0.5) * W / 6, (r + 0.5) * H / 3]);
      }
    }
  } else if (kind === 'lines') {
    // Two arc-ish curves
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      dots.push([t * W * 0.9 + W * 0.05, H * 0.25 + Math.sin(t * Math.PI) * H * 0.15]);
    }
    for (let i = 0; i < 8; i++) {
      const t = i / 7;
      dots.push([W * 0.1 + t * W * 0.6, H * 0.65 + (1 - t) * H * 0.15]);
    }
  } else {
    // blob
    for (let i = 0; i < 22; i++) {
      const a = i * 0.43;
      const r = 4 + (i % 5);
      dots.push([W * 0.5 + Math.cos(a) * r, H * 0.5 + Math.sin(a) * r]);
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-14 h-9 shrink-0 rounded bg-slate-50 border border-slate-100">
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.4} fill={fill} fillOpacity={0.8} />
      ))}
    </svg>
  );
}
