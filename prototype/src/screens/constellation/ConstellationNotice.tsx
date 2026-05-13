import { useState } from 'react';
import HostBubble from '../../components/HostBubble';

interface ConstellationNoticeProps {
  onStart: () => void;
}

export default function ConstellationNotice({ onStart }: ConstellationNoticeProps) {
  const [notice, setNotice] = useState('');
  const [prediction, setPrediction] = useState<number | ''>('');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A1
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-indigo-700">
            ACT 1 · NOTICE
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Every constellation is a polygon.
          </h1>
          <p className="text-sm text-slate-600">Real stars, connected by humans — and the geometry travels with it.</p>
        </div>
      </div>

      <HostBubble accent="purple" name="Nova">
        Three different cultures, three different polygons connecting the same
        sky. The math is yours: count the sides, sum the angles, measure the
        perimeter. In a minute you'll pick your own stars and claim a shape no
        one else has named.
      </HostBubble>

      <ThreeFamousShapes />

      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <label className="text-sm font-semibold text-ink block mb-1.5">
            What do you notice? <span className="text-[10px] text-slate-500 italic font-normal">(one line is fine)</span>
          </label>
          <textarea
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            placeholder="e.g. Two of them have five corners. The 'W' is actually a pentagon if I close it."
            className="w-full p-3 rounded-md border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm resize-none"
            rows={2}
          />
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="text-[10px] font-semibold tracking-widest text-indigo-700 mb-1">
            TODAY'S QUESTION
          </div>
          <div className="text-sm font-semibold text-ink mb-3">
            How many sides will your constellation have?
          </div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Predict first <span className="text-[10px] text-slate-500 italic font-normal">(any number from 3 to 9)</span>
          </label>
          <input
            type="number"
            min={3}
            max={9}
            value={prediction}
            onChange={(e) => setPrediction(e.target.value === '' ? '' : Math.max(3, Math.min(9, Number(e.target.value))))}
            placeholder="e.g. 5"
            className="w-28 px-3 py-2 rounded-md border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm tabular-nums"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-slate-500">
          750 real stars — bright enough to see by eye on a clear night.
        </div>
        <button
          onClick={onStart}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
        >
          Open the sky →
        </button>
      </div>
    </div>
  );
}

interface FamousShape {
  label: string;
  caption: string;
  points: Array<[number, number]>;
  closed: boolean;
}

const SHAPES: FamousShape[] = [
  {
    label: "Orion's Belt",
    caption: 'Three stars. A line — degenerate triangle.',
    points: [
      [18, 60],
      [50, 56],
      [82, 52],
    ],
    closed: false,
  },
  {
    label: 'Cassiopeia',
    caption: 'Five stars. A zigzag — or a pentagon, closed.',
    points: [
      [12, 60],
      [32, 32],
      [50, 56],
      [68, 30],
      [88, 62],
    ],
    closed: false,
  },
  {
    label: 'Big Dipper',
    caption: 'Seven stars. A heptagonal asterism with a handle.',
    points: [
      [16, 70],
      [30, 64],
      [44, 60],
      [56, 58],
      [60, 38],
      [72, 30],
      [86, 24],
    ],
    closed: false,
  },
];

function ThreeFamousShapes() {
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {SHAPES.map((s) => (
        <MiniSky key={s.label} shape={s} />
      ))}
    </div>
  );
}

function MiniSky({ shape }: { shape: FamousShape }) {
  const W = 100;
  const H = 90;
  const pathD = shape.points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`)
    .join(' ');
  return (
    <div className="bg-[#06060e] border border-slate-800 rounded-xl overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
        <Starfield />
        <path
          d={pathD}
          fill="none"
          stroke="#a5b4fc"
          strokeWidth={0.6}
          strokeOpacity={0.85}
        />
        {shape.points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.6} fill="#fef3c7" />
        ))}
      </svg>
      <div className="px-3 py-2 border-t border-slate-800 bg-[#0c0c1e]">
        <div className="text-xs font-semibold text-indigo-200">{shape.label}</div>
        <div className="text-[10px] text-slate-400 leading-snug mt-0.5">{shape.caption}</div>
      </div>
    </div>
  );
}

function Starfield() {
  const stars = Array.from({ length: 40 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const x = (seed % 100);
    const y = ((seed * 7) % 100) * 0.9;
    const r = ((seed * 3) % 8) / 20 + 0.2;
    const op = ((seed * 5) % 100) / 200 + 0.3;
    return { x, y, r, op };
  });
  return (
    <g>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" fillOpacity={s.op} />
      ))}
    </g>
  );
}
