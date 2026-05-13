import { useState } from 'react';

// Visual calibrator: drag the magnitude slider, see the energy bar grow
// exponentially. Each whole-magnitude step is ~31.6× more energy.
// Anchored to real reference quakes so the numbers stay tangible.

interface Reference {
  mag: number;
  name: string;
  blurb: string;
}

const REFERENCES: Reference[] = [
  { mag: 2.5, name: 'Just felt', blurb: 'A truck rolling past, or a small quake under your feet.' },
  { mag: 4.0, name: 'Walls rattle', blurb: 'Pictures move, you notice. Rarely damaging.' },
  { mag: 5.5, name: 'Napa 2014', blurb: 'Real damage in older buildings. Bottles fall.' },
  { mag: 6.7, name: 'Northridge 1994', blurb: '60 deaths, $20B. Collapsed freeway.' },
  { mag: 7.8, name: 'San Francisco 1906', blurb: 'City-flattening fire after. ~3,000 deaths.' },
  { mag: 9.1, name: 'Tōhoku 2011', blurb: 'Sendai tsunami. Fukushima meltdown. ~20,000 deaths.' },
  { mag: 9.5, name: 'Valdivia 1960', blurb: 'Largest ever recorded. Half of Chile.' },
];

// Energy in joules — log₁₀(E) = 4.8 + 1.5·M
function energyJoules(mag: number): number {
  return Math.pow(10, 4.8 + 1.5 * mag);
}

// Equivalent kilotons of TNT (1 kt ≈ 4.184e12 J)
function energyKilotons(mag: number): number {
  return energyJoules(mag) / 4.184e12;
}

function formatEnergy(joules: number): string {
  const exp = Math.floor(Math.log10(joules));
  const m = joules / Math.pow(10, exp);
  return `${m.toFixed(1)} × 10^${exp}`;
}

function formatTNT(kt: number): string {
  if (kt < 1e-6) return `${(kt * 1e6).toFixed(1)} g TNT`;
  if (kt < 0.001) return `${(kt * 1e6).toFixed(1)} g TNT`;
  if (kt < 1) return `${(kt * 1000).toFixed(0)} kg TNT`;
  if (kt < 1000) return `${kt.toFixed(1)} kt TNT`;
  return `${(kt / 1000).toFixed(1)} Mt TNT`;
}

interface QuakeEnergyMeterProps {
  /** Slim variant for tight embeds. */
  compact?: boolean;
}

export default function QuakeEnergyMeter({ compact = false }: QuakeEnergyMeterProps) {
  const [mag, setMag] = useState(6.0);
  const energy = energyJoules(mag);
  const kt = energyKilotons(mag);

  // Log-scaled bar fill: 0 at M2, full at M10
  const barT = Math.max(0, Math.min(1, (mag - 2) / 8));

  // "What this equals" — count of smaller quakes
  const smallerEq = Math.pow(31.62, Math.max(0, mag - 3));

  return (
    <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden ${compact ? '' : 'shadow-sm'}`}>
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="text-[10px] font-semibold tracking-widest text-rose-700">
          CALIBRATOR · QUAKE ENERGY
        </div>
        <div className="font-display font-semibold text-ink text-sm">
          M6 isn't "a little more than M5." It's <strong>32 times more</strong>.
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Slider with reference ticks */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="text-[10px] font-semibold tracking-widest text-rose-700">MAGNITUDE</div>
            <div className="font-display text-3xl font-black text-rose-700 tabular-nums">
              M{mag.toFixed(1)}
            </div>
          </div>
          <input
            type="range"
            min={2}
            max={9.5}
            step={0.1}
            value={mag}
            onChange={(e) => setMag(Number(e.target.value))}
            className="w-full accent-rose-600"
          />
          {/* Reference tick row */}
          <div className="relative h-5 mt-1">
            {REFERENCES.map((r) => {
              const t = (r.mag - 2) / 7.5;
              return (
                <button
                  key={r.mag}
                  onClick={() => setMag(r.mag)}
                  className="absolute -translate-x-1/2 text-[9px] font-mono text-slate-500 hover:text-rose-700 transition"
                  style={{ left: `${t * 100}%` }}
                  title={`${r.name} — set to M${r.mag}`}
                >
                  M{r.mag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy bar */}
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-slate-600 mb-1">
            ENERGY RELEASED (LOG SCALE)
          </div>
          <div className="h-7 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-rose-800 transition-all"
              style={{ width: `${barT * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-0.5">
            <span>M2</span>
            <span>M4</span>
            <span>M6</span>
            <span>M8</span>
            <span>M10</span>
          </div>
        </div>

        {/* Numbers */}
        <div className="grid sm:grid-cols-3 gap-2">
          <Cell label="JOULES" value={formatEnergy(energy)} />
          <Cell label="TNT EQUIVALENT" value={formatTNT(kt)} />
          <Cell
            label="VS. AN M3"
            value={
              smallerEq < 1
                ? '—'
                : smallerEq < 1000
                  ? `≈ ${smallerEq.toFixed(0)} of them`
                  : `≈ ${(smallerEq / 1000).toFixed(1)}k of them`
            }
          />
        </div>

        {/* Reference snapshot */}
        <ReferenceMatch mag={mag} />
      </div>
    </div>
  );
}

function ReferenceMatch({ mag }: { mag: number }) {
  // Find nearest reference
  let nearest = REFERENCES[0];
  for (const r of REFERENCES) {
    if (Math.abs(r.mag - mag) < Math.abs(nearest.mag - mag)) nearest = r;
  }
  const close = Math.abs(nearest.mag - mag) < 0.25;
  return (
    <div
      className={`rounded-lg p-3 transition ${
        close ? 'bg-rose-50 border border-rose-200' : 'bg-slate-50 border border-slate-200'
      }`}
    >
      <div className="text-[10px] font-semibold tracking-widest text-slate-500 mb-0.5">
        {close ? 'YOU MATCHED' : 'NEAREST REAL QUAKE'}
      </div>
      <div className="font-semibold text-ink text-sm">
        M{nearest.mag} · {nearest.name}
      </div>
      <div className="text-xs text-slate-600 leading-snug mt-0.5">{nearest.blurb}</div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-rose-50 border border-rose-100 p-2.5">
      <div className="text-[10px] font-semibold tracking-widest text-rose-700">{label}</div>
      <div className="font-display text-sm font-bold text-rose-900 tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
