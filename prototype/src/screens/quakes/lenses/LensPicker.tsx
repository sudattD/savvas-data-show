import type { LensId } from './types';

interface LensPickerProps {
  enabled: Record<LensId, boolean>;
  onToggle: (lens: LensId) => void;
}

interface LensCard {
  id: LensId;
  title: string;
  icon: string;
  good: string;
  example: string;
}

const CARDS: readonly LensCard[] = [
  {
    id: 'map',
    title: 'Map',
    icon: '🗺️',
    good: 'Good for: WHERE.',
    example: 'Where do they cluster? Where don\'t they happen?',
  },
  {
    id: 'histogram',
    title: 'Histogram',
    icon: '📊',
    good: 'Good for: SHAPE of one variable.',
    example: 'How are magnitudes (or depths) distributed?',
  },
  {
    id: 'scatter',
    title: 'Scatter',
    icon: '🟣',
    good: 'Good for: RELATIONSHIPS between two variables.',
    example: 'Are deeper quakes also stronger?',
  },
];

export default function LensPicker({ enabled, onToggle }: LensPickerProps) {
  const anyOn = Object.values(enabled).some(Boolean);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="text-[10px] font-semibold tracking-widest text-rose-700 mb-1">
        STEP 1 · PICK YOUR LENS
      </div>
      <h3 className="font-display text-lg font-bold text-ink mb-1">
        How will you investigate your wondering?
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Pick one or more. Different groups will pick differently — that's the point.
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        {CARDS.map((card) => {
          const active = enabled[card.id];
          return (
            <button
              key={card.id}
              onClick={() => onToggle(card.id)}
              className={`text-left rounded-xl border p-3 transition ${
                active
                  ? 'border-rose-500 ring-2 ring-rose-100 bg-rose-50'
                  : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-2xl leading-none">{card.icon}</div>
                <div
                  className={`text-[10px] font-bold tracking-widest ${
                    active ? 'text-rose-700' : 'text-slate-400'
                  }`}
                >
                  {active ? '✓ PICKED' : 'TAP TO PICK'}
                </div>
              </div>
              <div className="font-display text-base font-bold text-ink mt-2">{card.title}</div>
              <div className="text-[11px] font-semibold tracking-wide text-rose-700 mt-1">{card.good}</div>
              <div className="text-xs text-slate-600 leading-snug mt-1 italic">{card.example}</div>
            </button>
          );
        })}
      </div>
      {!anyOn && (
        <div className="mt-3 text-xs text-amber-700 italic">
          Pick at least one lens to begin investigating.
        </div>
      )}
    </div>
  );
}
