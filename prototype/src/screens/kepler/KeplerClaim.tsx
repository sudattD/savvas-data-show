import { useState } from 'react';
import HostBubble from '../../components/HostBubble';
import type { KeplerPick } from './KeplerPlot';

interface KeplerClaimProps {
  pick: KeplerPick;
  exponent: number;
  onRestart: () => void;
}

export default function KeplerClaim({ pick, exponent, onRestart }: KeplerClaimProps) {
  const [caption, setCaption] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const closeTo1p5 = Math.abs(exponent - 1.5) < 0.05;
  const cubedPeriod = Math.pow(pick.periodYears, 2);
  const cubedAxis = Math.pow(pick.distanceAU, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg font-display text-base font-bold tracking-tight">
          A3
        </div>
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-amber-700">
            ACT 3 · KEPLER
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            The exponent is three-halves.
          </h1>
          <p className="text-sm text-slate-600">
            Discovered 1619. Still true. Every planet, every solar system.
          </p>
        </div>
      </div>

      <HostBubble accent="amber" name="Tycho">
        You found{' '}
        <strong className="tabular-nums">k = {exponent.toFixed(2)}</strong>
        {closeTo1p5 ? ' — bang on. ' : '. The exact answer is 1.5, which is the rational exponent 3/2. '}
        That means <code className="font-mono bg-amber-100 px-1 rounded">T = a<sup>3/2</sup></code>{' '}
        — or, squaring both sides, <code className="font-mono bg-amber-100 px-1 rounded">T² = a³</code>.
        Kepler stared at Tycho Brahe's tables for years before he saw it.
        Newton would prove it from gravity 60 years later. You found it in a
        couple of minutes with a slider.
      </HostBubble>

      {/* The equation in big type */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border border-amber-200 rounded-2xl p-8 text-center">
        <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-3">
          KEPLER'S THIRD LAW
        </div>
        <div className="font-display text-5xl md:text-6xl font-black text-ink mb-4 tracking-tight">
          T<sup className="text-3xl">2</sup> = a<sup className="text-3xl">3</sup>
        </div>
        <div className="text-sm text-slate-600 max-w-md mx-auto">
          where <strong>T</strong> is the orbital period in years and{' '}
          <strong>a</strong> is the distance from the Sun in AU.
        </div>
      </div>

      {/* The check — for the planet they chose */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="text-[10px] font-semibold tracking-widest text-slate-600 mb-2">
          DOES IT HOLD FOR {pick.body.toUpperCase()}?
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <NumberCard label="T²" value={cubedPeriod.toFixed(2)} subtle={`(${pick.periodYears} yr)²`} />
          <div className="grid place-items-center text-3xl font-display text-amber-600 font-black">=</div>
          <NumberCard label="a³" value={cubedAxis.toFixed(2)} subtle={`(${pick.distanceAU} AU)³`} />
        </div>
        <div className="text-xs text-slate-600 mt-3 leading-relaxed">
          Within rounding error — that's two real measurements, taken with
          telescopes 400 years apart, agreeing to two decimal places. The
          relationship is so tight that NASA uses it backwards: when we
          measure an exoplanet's period, we get its distance from the same
          equation.
        </div>
      </div>

      {/* Data card */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-700 to-rose-700 rounded-2xl shadow-lg p-6 text-white">
        <div className="text-[10px] font-semibold tracking-widest text-amber-100 mb-1">
          DATA CARD · ALG 2 · TOPIC 5 · RATIONAL EXPONENTS
        </div>
        <h3 className="font-display text-3xl font-bold mb-3">Kepler's Third Law</h3>
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-3 border border-white/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-amber-100">YOUR FIT</div>
              <div className="font-display text-2xl font-bold tabular-nums">k = {exponent.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-amber-100">TRUTH</div>
              <div className="font-display text-2xl font-bold tabular-nums">k = 1.50</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold tracking-widest text-amber-100">{pick.body.toUpperCase()}</div>
              <div className="font-display text-base font-bold tabular-nums leading-tight">
                T² = {cubedPeriod.toFixed(1)}<br />
                a³ = {cubedAxis.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write one line about what surprised you most…"
          className="w-full px-3 py-2 rounded-lg bg-white/10 backdrop-blur text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:border-white/50 text-sm resize-none"
          rows={2}
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={caption.trim().length === 0}
              className="px-4 py-2 rounded-lg bg-white text-amber-800 font-semibold hover:bg-amber-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save to my notebook
            </button>
          ) : (
            <div className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold">
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

function NumberCard({ label, value, subtle }: { label: string; value: string; subtle: string }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
      <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-1">{label}</div>
      <div className="font-display text-3xl font-bold text-amber-900 tabular-nums">{value}</div>
      <div className="text-[10px] text-slate-600 mt-0.5">{subtle}</div>
    </div>
  );
}
