import { useState } from 'react';
import HostBubble from '../../components/HostBubble';
import type { MooreFit } from './MoorePlot';

interface MooreClaimProps {
  fit: MooreFit;
  guess: number | null;
  onRestart: () => void;
}

export default function MooreClaim({ fit, guess, onRestart }: MooreClaimProps) {
  const [caption, setCaption] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const closeToCanon = Math.abs(fit.doublingMonths - 24) <= 2;
  const guessWasClose = guess !== null && Math.abs(guess - 24) <= 6;

  // Project current rate forward and backward
  const fitYearsPerDoubling = fit.doublingMonths / 12;
  const tenYearMultiplier = Math.pow(2, 10 / fitYearsPerDoubling);
  const tenYears2034 = (60e9 * tenYearMultiplier) / 1e9; // billions

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A3
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-emerald-700">
            ACT 3 · MOORE
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            Two years per doubling. For sixty years.
          </h1>
          <p className="text-sm text-slate-600">
            One of the most stubbornly accurate predictions in all of engineering.
          </p>
        </div>
      </div>

      <HostBubble accent="emerald">
        Your fit:{' '}
        <strong className="tabular-nums">{fit.doublingMonths} months</strong> per doubling.{' '}
        {closeToCanon
          ? 'Spot on — Moore proposed two years in 1965 and the slope held.'
          : 'The famous answer is about 24 months. The slope shifts a little over the decades, but two years is the long-run average.'}{' '}
        That single number — "double every 24 months" — is the same as
        saying{' '}
        <code className="font-mono bg-emerald-100 px-1 rounded">T(year) = T₀ · 2^((year-1971)/2)</code>.
        Exponential growth has one number that matters: its doubling time.
      </HostBubble>

      <div className="grid md:grid-cols-3 gap-3">
        <ResultCard
          label="YOUR FIT"
          value={`${fit.doublingMonths} mo`}
          subtle={`R² = ${fit.r2.toFixed(3)}`}
        />
        <ResultCard label="MOORE 1965" value="24 mo" subtle="proposed in a 4-page paper" tone="emerald" />
        <ResultCard
          label="YOUR ACT-1 GUESS"
          value={guess !== null ? `${guess} mo` : '—'}
          subtle={
            guess === null
              ? 'no guess saved'
              : guessWasClose
                ? 'within 6 months of canon'
                : Math.abs(guess - 24) <= 18
                  ? 'in the right ballpark'
                  : 'far from canon — but you found the truth'
          }
          tone="slate"
        />
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl p-6">
        <div className="text-[10px] font-semibold tracking-widest text-emerald-700 mb-2">
          THE FORECAST
        </div>
        <div className="text-sm text-slate-700 leading-relaxed mb-3">
          If your doubling time holds, by <strong>2034</strong> the leading chip would have{' '}
          <strong className="font-display text-emerald-800 tabular-nums">
            ~{tenYears2034.toFixed(0)} billion
          </strong>{' '}
          transistors. Today's best is 60 billion. The pattern says we
          should expect another doubling, then another. Whether that
          actually happens is the open question of the decade.
        </div>
        <div className="text-xs text-slate-500 italic">
          Note: every decade has predicted Moore's Law would break. Every decade so far has been wrong. The exponent has slowed but not stopped.
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700 rounded-2xl shadow-lg p-6 text-white">
        <div className="text-[10px] font-semibold tracking-widest text-emerald-100 mb-1">
          DATA CARD · ALG 1 · TOPIC 6 · EXPONENTIAL FUNCTIONS
        </div>
        <h3 className="font-display text-3xl font-bold mb-3">Doubling Time</h3>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-3 border border-white/20">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-emerald-100">YOUR FIT</div>
              <div className="font-display text-2xl font-bold tabular-nums">{fit.doublingMonths} mo</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-emerald-100">MOORE'S 1965</div>
              <div className="font-display text-2xl font-bold tabular-nums">24 mo</div>
            </div>
          </div>
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="One line — what would change if your phone's chip doubled again?"
          className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:border-white/50 text-sm resize-none"
          rows={2}
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={caption.trim().length === 0}
              className="px-4 py-2 rounded-lg bg-white text-emerald-800 font-semibold hover:bg-emerald-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save to my notebook
            </button>
          ) : (
            <div className="px-4 py-2 rounded-lg bg-emerald-400 text-white font-semibold">
              Saved to notebook
            </div>
          )}
          <button
            onClick={onRestart}
            className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur text-white font-semibold hover:bg-white/20 transition border border-white/20"
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  subtle,
  tone = 'cyan',
}: {
  label: string;
  value: string;
  subtle: string;
  tone?: 'cyan' | 'emerald' | 'slate';
}) {
  const palette = {
    cyan: ['border-cyan-200', 'bg-cyan-50', 'text-cyan-700', 'text-cyan-900'],
    emerald: ['border-emerald-200', 'bg-emerald-50', 'text-emerald-700', 'text-emerald-900'],
    slate: ['border-slate-200', 'bg-slate-50', 'text-slate-600', 'text-slate-800'],
  }[tone];
  return (
    <div className={`rounded-xl border ${palette[0]} ${palette[1]} p-4`}>
      <div className={`text-[10px] font-semibold tracking-widest ${palette[2]}`}>{label}</div>
      <div className={`font-display text-2xl font-bold ${palette[3]} tabular-nums mt-0.5`}>{value}</div>
      <div className="text-[10px] text-slate-500 mt-0.5">{subtle}</div>
    </div>
  );
}
