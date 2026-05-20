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
    id: 'fit',
    title: 'Fit a curve',
    icon: '📈',
    good: 'Good for: WHAT EQUATION matches.',
    example: 'Drag a, b and c until a parabola hugs the dots.',
  },
  {
    id: 'differences',
    title: 'Differences',
    icon: '🔢',
    good: 'Good for: IS IT really a parabola.',
    example: 'Constant second differences are the fingerprint of a quadratic.',
  },
  {
    id: 'regime',
    title: 'Regimes',
    icon: '🚦',
    good: 'Good for: WHERE the model holds.',
    example: 'Toggle operating zones in and out — watch R² react.',
  },
];

export default function LensPicker({ enabled, onToggle }: LensPickerProps) {
  const anyOn = Object.values(enabled).some(Boolean);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="text-[10px] font-semibold tracking-widest text-sky-700 mb-1">
        STEP 1 · PICK YOUR LENS
      </div>
      <h3 className="font-display text-lg font-bold text-ink mb-1">
        How will you investigate the curve?
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Each tool tests a different idea. Turn on as many as you want — you can
        change your mind later.
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        {CARDS.map((card) => {
          const on = enabled[card.id];
          return (
            <button
              key={card.id}
              onClick={() => onToggle(card.id)}
              aria-pressed={on}
              className={`text-left rounded-xl border-2 p-4 transition ${
                on
                  ? 'border-sky-500 bg-sky-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl" aria-hidden="true">{card.icon}</span>
                <span
                  className={`grid place-items-center w-6 h-6 rounded-full text-xs font-bold transition ${
                    on
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {on ? '✓' : '+'}
                </span>
              </div>
              <div className="font-display text-base font-bold text-ink mt-2">{card.title}</div>
              <div className="text-[11px] font-semibold tracking-wide text-sky-700 mt-1">
                {card.good}
              </div>
              <div className="text-xs text-slate-600 leading-snug mt-1">{card.example}</div>
            </button>
          );
        })}
      </div>
      {!anyOn && (
        <div className="text-xs text-amber-700 mt-3 font-semibold">
          Turn on at least one lens to continue.
        </div>
      )}
    </div>
  );
}
