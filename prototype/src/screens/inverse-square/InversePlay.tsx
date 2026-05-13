import { useMemo, useState } from 'react';
import HostBubble from '../../components/HostBubble';
import { getDataset } from '../../data/registry';

export interface InversePick {
  starName: string;
  actualDistancePc: number;
  trueBrightnessLsun: number;
  newDistancePc: number;
  apparentBrightnessNow: number;
  apparentBrightnessOriginal: number;
}

interface InversePlayProps {
  onNext: (pick: InversePick) => void;
}

// Curated short-list of named bright stars with known distances and approximate
// absolute magnitudes (so we can show "true brightness in L_sun units"). This
// keeps the UI focused — the full HYG dataset is 750 rows.
interface StarPick {
  name: string;
  distancePc: number;
  absMag: number;
  blurb: string;
}

const FAMOUS_STARS: StarPick[] = [
  { name: 'Sun (Sol)', distancePc: 4.85e-6, absMag: 4.83, blurb: 'Our own star at 1 AU.' },
  { name: 'Proxima Centauri', distancePc: 1.30, absMag: 15.5, blurb: 'Closest star besides the Sun.' },
  { name: 'Sirius', distancePc: 2.64, absMag: 1.45, blurb: 'Brightest star in the night sky.' },
  { name: 'Vega', distancePc: 7.68, absMag: 0.6, blurb: 'Pole star in 12,000 years.' },
  { name: 'Arcturus', distancePc: 11.3, absMag: -0.31, blurb: 'Orange giant in Boötes.' },
  { name: 'Aldebaran', distancePc: 20.4, absMag: -0.68, blurb: "The bull's eye in Taurus." },
  { name: 'Betelgeuse', distancePc: 152.7, absMag: -5.47, blurb: "Supergiant in Orion's shoulder." },
  { name: 'Rigel', distancePc: 264.6, absMag: -6.93, blurb: "Blue supergiant in Orion's foot." },
  { name: 'Deneb', distancePc: 432.9, absMag: -6.93, blurb: 'Far-away supergiant in Cygnus.' },
];

// Convert absolute magnitude to luminosity in solar luminosities (rough).
// M_sun = 4.83. ratio = 100^((M_sun - M)/5)
function absMagToLsun(absMag: number): number {
  return Math.pow(100, (4.83 - absMag) / 5);
}

// Apparent brightness scales with L / r². Use arbitrary normalization.
function apparentBrightness(lsun: number, distancePc: number): number {
  return lsun / (distancePc * distancePc);
}

export default function InversePlay({ onNext }: InversePlayProps) {
  // Just to confirm dataset is reachable (not used directly — we use our curated list).
  getDataset('stars');

  const [pickedName, setPickedName] = useState<string>('Sirius');
  const [factor, setFactor] = useState(2.0);

  const star = FAMOUS_STARS.find((s) => s.name === pickedName) ?? FAMOUS_STARS[2];
  const lsun = useMemo(() => absMagToLsun(star.absMag), [star]);
  const newDistance = star.distancePc * factor;
  const original = apparentBrightness(lsun, star.distancePc);
  const now = apparentBrightness(lsun, newDistance);
  const ratio = original / now; // how many times dimmer

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-indigo-700 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A2
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-indigo-700">
            ACT 2 · PUSH IT
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Push a star away. Watch the brightness collapse.
          </h1>
          <p className="text-sm text-slate-600">
            Same true brightness. Same star. Just farther away.
          </p>
        </div>
      </div>

      <HostBubble accent="slate">
        Pick any star and slide its distance multiplier. Notice the ratio
        on the right — that's how many times dimmer it would look. The
        rule is{' '}
        <code className="font-mono bg-slate-100 px-1 rounded">brightness ∝ 1 / r²</code>{' '}
        — a rational function with r² in the denominator. Move twice as
        far, brightness divides by 4. Move ten times, divides by 100.
      </HostBubble>

      {/* Star picker */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="text-[10px] font-semibold tracking-widest text-indigo-700 mb-2">PICK A STAR</div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {FAMOUS_STARS.map((s) => (
            <button
              key={s.name}
              onClick={() => setPickedName(s.name)}
              className={`text-left rounded-lg p-2 border transition ${
                s.name === pickedName
                  ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-100'
                  : 'bg-white border-slate-200 hover:border-indigo-200'
              }`}
            >
              <div className="text-xs font-semibold text-ink truncate">{s.name}</div>
              <div className="text-[10px] font-mono text-slate-500 tabular-nums">
                {s.distancePc < 0.001 ? `${(s.distancePc * 206265).toFixed(0)} AU` : `${s.distancePc} pc`}
              </div>
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-600 mt-2 italic">{star.blurb}</div>
      </div>

      {/* Visual + slider */}
      <div className="bg-[#06060e] rounded-xl border border-slate-800 p-4">
        <div className="text-[10px] font-semibold tracking-widest text-indigo-300 mb-3">
          BRIGHTNESS AT DISTANCE
        </div>
        <DistanceVisualizer originalDistance={star.distancePc} newDistance={newDistance} ratio={ratio} />
        <div className="mt-4">
          <div className="flex items-baseline justify-between text-xs text-indigo-100 mb-1">
            <span>Push to <strong className="tabular-nums">{factor.toFixed(2)}×</strong> original distance</span>
            <span className="font-mono tabular-nums text-indigo-200">
              {newDistance.toFixed(newDistance < 1 ? 4 : 2)} pc
            </span>
          </div>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.1}
            value={factor}
            onChange={(e) => setFactor(Number(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-indigo-300 mt-1">
            <span>0.5×</span>
            <span>2×</span>
            <span>5×</span>
            <span>10×</span>
          </div>
        </div>
      </div>

      {/* Numbers */}
      <div className="grid sm:grid-cols-3 gap-3">
        <NumCard
          label="ORIGINAL DISTANCE"
          value={star.distancePc < 0.001 ? `${(star.distancePc * 206265).toFixed(0)} AU` : `${star.distancePc} pc`}
        />
        <NumCard
          label="NEW DISTANCE"
          value={newDistance < 0.001 ? `${(newDistance * 206265).toFixed(0)} AU` : `${newDistance.toFixed(newDistance < 1 ? 2 : 1)} pc`}
        />
        <NumCard
          label="DIMMER BY"
          value={ratio >= 1 ? `${ratio.toFixed(2)}×` : `${(1 / ratio).toFixed(2)}× brighter`}
          highlight
        />
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-900 leading-relaxed">
        Quick check: a factor of <strong>{factor.toFixed(2)}</strong> in distance gives a factor of{' '}
        <strong className="tabular-nums">{(factor * factor).toFixed(2)}</strong> in
        dimness. That's <code className="font-mono bg-white px-1 rounded">r²</code> doing
        its job — the rational function from your chapter.
      </div>

      <div className="flex justify-end">
        <button
          onClick={() =>
            onNext({
              starName: star.name,
              actualDistancePc: star.distancePc,
              trueBrightnessLsun: lsun,
              newDistancePc: newDistance,
              apparentBrightnessNow: now,
              apparentBrightnessOriginal: original,
            })
          }
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-slate-700 to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition"
        >
          Show me the equation →
        </button>
      </div>
    </div>
  );
}

function DistanceVisualizer({
  originalDistance,
  newDistance,
  ratio,
}: {
  originalDistance: number;
  newDistance: number;
  ratio: number;
}) {
  const W = 600;
  const H = 130;
  // Star size shrinks with sqrt(brightness ratio) for area metaphor
  const baseSize = 24;
  const newSize = Math.max(2, baseSize / Math.sqrt(Math.max(0.01, ratio)));
  // X positions: original on left, new pushed right
  const x1 = 90;
  const factor = newDistance / Math.max(0.001, originalDistance);
  const x2 = Math.min(W - 60, 90 + (factor - 1) * 70);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
      {/* Earth on the left */}
      <circle cx={32} cy={H / 2} r={11} fill="#2563eb" />
      <circle cx={32} cy={H / 2} r={17} fill="#2563eb" fillOpacity={0.18} />
      <text x={32} y={H - 8} fontSize={10} textAnchor="middle" fill="#bfdbfe" fontFamily="monospace">
        Earth
      </text>

      {/* Connecting lines */}
      <line x1={43} y1={H / 2} x2={x1 - 12} y2={H / 2} stroke="#475569" strokeWidth={0.6} strokeDasharray="2 3" />
      <line x1={x1 + 12} y1={H / 2} x2={x2 - 12} y2={H / 2} stroke="#475569" strokeWidth={0.6} strokeDasharray="2 3" />

      {/* Original star */}
      <circle cx={x1} cy={H / 2} r={baseSize / 2} fill="#fbbf24" fillOpacity={0.85} />
      <circle cx={x1} cy={H / 2} r={baseSize / 2 + 4} fill="#fbbf24" fillOpacity={0.25} />
      <text x={x1} y={H / 2 - baseSize / 2 - 8} fontSize={9} textAnchor="middle" fill="#fde047" fontFamily="monospace">
        original
      </text>

      {/* New star, pushed and dimmer */}
      <circle cx={x2} cy={H / 2} r={newSize / 2} fill="#fbbf24" fillOpacity={0.85} />
      <circle cx={x2} cy={H / 2} r={newSize / 2 + 4} fill="#fbbf24" fillOpacity={0.25} />
      <text x={x2} y={H / 2 - newSize / 2 - 8} fontSize={9} textAnchor="middle" fill="#fde047" fontFamily="monospace">
        pushed
      </text>
    </svg>
  );
}

function NumCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight ? 'border-amber-300 bg-amber-50' : 'border-indigo-100 bg-indigo-50/60'
      }`}
    >
      <div className={`text-[10px] font-semibold tracking-widest ${highlight ? 'text-amber-700' : 'text-indigo-700'}`}>
        {label}
      </div>
      <div
        className={`font-display text-xl font-bold tabular-nums mt-0.5 ${
          highlight ? 'text-amber-900' : 'text-indigo-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
