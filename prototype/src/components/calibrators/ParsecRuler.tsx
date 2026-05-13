import { useState } from 'react';

// A scale calibrator: pick a step on the cosmic distance ladder and see how
// many of the previous step fit inside it. Builds intuition for how
// shockingly nested the units are — Earth → AU → parsec → kiloparsec.

interface Step {
  id: string;
  label: string;
  unit: string;
  meters: number;
  description: string;
}

const STEPS: Step[] = [
  { id: 'earth', label: 'Earth (diameter)', unit: '12,742 km', meters: 1.2742e7, description: 'Pole-to-pole — the basic size of home.' },
  { id: 'moon', label: 'Earth → Moon', unit: '384,400 km', meters: 3.844e8, description: 'About 30 Earths laid end-to-end.' },
  { id: 'au', label: '1 AU (Earth → Sun)', unit: '149.6 million km', meters: 1.496e11, description: 'The default ruler for our solar system.' },
  { id: 'neptune', label: 'Sun → Neptune', unit: '30 AU', meters: 4.5e12, description: 'The edge of "the planets" if you stop there.' },
  { id: 'lightyear', label: '1 light-year', unit: '9.46 × 10¹² km', meters: 9.461e15, description: 'How far light travels in one year.' },
  { id: 'parsec', label: '1 parsec', unit: '3.26 light-years', meters: 3.086e16, description: 'Astronomers\' default unit. Defined by Earth\'s orbit and a 1-arcsecond angle.' },
  { id: 'alphacen', label: 'To Proxima Centauri', unit: '1.30 pc', meters: 4.0e16, description: 'The closest star besides the Sun.' },
  { id: 'sirius', label: 'To Sirius', unit: '2.64 pc', meters: 8.15e16, description: 'Brightest star in the night sky.' },
  { id: 'betelgeuse', label: 'To Betelgeuse', unit: '152.7 pc', meters: 4.72e18, description: 'Red supergiant in Orion. Could go supernova "any millennium now."' },
  { id: 'galactic-center', label: 'To galactic center', unit: '~8,000 pc', meters: 2.47e20, description: 'The supermassive black hole at the heart of the Milky Way.' },
];

function fmtBig(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} million`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 1) return n.toFixed(0);
  if (n >= 0.01) return n.toFixed(2);
  return n.toExponential(1);
}

interface ParsecRulerProps {
  compact?: boolean;
}

export default function ParsecRuler({ compact = false }: ParsecRulerProps) {
  const [idx, setIdx] = useState(5); // Default: 1 parsec
  const step = STEPS[idx];
  const prev = idx > 0 ? STEPS[idx - 1] : null;
  const next = idx < STEPS.length - 1 ? STEPS[idx + 1] : null;
  const earthsInThis = step.meters / STEPS[0].meters;
  const prevInThis = prev ? step.meters / prev.meters : 1;

  return (
    <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden ${compact ? '' : 'shadow-sm'}`}>
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="text-[10px] font-semibold tracking-widest text-cyan-700">
          CALIBRATOR · PARSEC RULER
        </div>
        <div className="font-display font-semibold text-ink text-sm">
          Each rung is roughly the next one shrunk down.
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Step picker */}
        <div className="space-y-1">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIdx(i)}
              className={`w-full text-left rounded-md px-3 py-2 transition flex items-baseline gap-3 ${
                i === idx
                  ? 'bg-cyan-50 border border-cyan-300 ring-2 ring-cyan-100'
                  : 'border border-transparent hover:bg-slate-50'
              }`}
            >
              <div className="font-mono text-[10px] text-slate-400 tabular-nums w-4">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-ink">{s.label}</div>
              </div>
              <div className="text-xs font-mono text-slate-500 tabular-nums">{s.unit}</div>
            </button>
          ))}
        </div>

        <div className="bg-slate-900 text-white rounded-xl p-4">
          <div className="text-[10px] font-semibold tracking-widest text-cyan-300">YOU PICKED</div>
          <div className="font-display text-xl font-bold mt-1">{step.label}</div>
          <div className="text-sm text-slate-300 mt-1">{step.description}</div>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-700">
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-cyan-200">EARTHS THAT FIT</div>
              <div className="font-display text-2xl font-bold text-cyan-100 tabular-nums">{fmtBig(earthsInThis)}</div>
            </div>
            {prev && (
              <div>
                <div className="text-[10px] font-semibold tracking-widest text-cyan-200">
                  PREV STEPS THAT FIT
                </div>
                <div className="font-display text-2xl font-bold text-cyan-100 tabular-nums">
                  {fmtBig(prevInThis)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">of {prev.label.toLowerCase()}</div>
              </div>
            )}
          </div>
        </div>

        {next && (
          <div className="text-xs text-slate-500 italic text-center">
            Next rung is{' '}
            <strong className="tabular-nums">{fmtBig(next.meters / step.meters)}×</strong> bigger ({next.label}).
            The ladder keeps going.
          </div>
        )}
      </div>
    </div>
  );
}
