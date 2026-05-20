import type { ReactNode } from 'react';
import { WIND_DATA } from '../../../data/windTurbine';
import { quadratic, rSquared } from '../../../lib/fit';
import PowerCurveScatter from '../PowerCurveScatter';
import { RegimeLegend } from '../windColors';
import { CUT_IN_SPEED, RATED_SPEED, RATED_POWER } from '../regimes';
import { fitQuadratic } from '../quadFit';

// Each wonder chip the class can pick in Act 1 maps to a "reveal" — a
// visualization that uses the data to answer the question, plus a written
// take-away. Take-aways are pitched at students: they say what the data
// shows, not what to believe.
//
// `viz` is a function so the heavier charts only mount for wonders the
// class actually picked.

export interface Reveal {
  question: string;
  viz: () => ReactNode;
  takeaway: ReactNode;
  source: string;
}

// --- Reference fits, computed once ---------------------------------------

const RAMP_UP_DATA = WIND_DATA.filter(
  (d) => d.windSpeed >= CUT_IN_SPEED && d.windSpeed < RATED_SPEED,
);
const BEST = fitQuadratic(RAMP_UP_DATA);
const BEST_MODEL = quadratic(BEST.a, BEST.b, BEST.c);
const BEST_R2 = rSquared(RAMP_UP_DATA, BEST_MODEL);

// Exported so Act 3's Revelation card can show the same canonical fit.
export const RAMP_UP_FIT_INFO = { ...BEST, r2: BEST_R2, model: BEST_MODEL };

const PRED_10 = BEST_MODEL(10);
const NEAR_10 = WIND_DATA.filter((d) => d.windSpeed >= 9.5 && d.windSpeed <= 10.5);
const MEASURED_10 =
  NEAR_10.length > 0 ? NEAR_10.reduce((s, d) => s + d.power, 0) / NEAR_10.length : 0;
const MAX_POWER = Math.max(...WIND_DATA.map((d) => d.power));

function round10(v: number): number {
  return Math.round(v / 10) * 10;
}

// --- Reusable scatter dressing -------------------------------------------

function RevealScatter(props: {
  model?: typeof BEST_MODEL | null;
  modelDomain?: [number, number];
  fitZone?: [number, number] | null;
  regimeBands?: boolean;
  colorByRegime?: boolean;
  ratedLine?: boolean;
  highlightX?: number | null;
  legend?: boolean;
}) {
  const { legend = false, ...scatter } = props;
  return (
    <div className="bg-white">
      <PowerCurveScatter points={WIND_DATA} aspectRatio={16 / 9} {...scatter} />
      {legend && (
        <div className="px-5 pb-4 pt-1">
          <RegimeLegend />
        </div>
      )}
    </div>
  );
}

// --- The catalog ---------------------------------------------------------

export const REVEALS: Record<string, Reveal> = {
  'what-shape': {
    question: 'What shape is this curve?',
    viz: () => (
      <RevealScatter model={BEST_MODEL} modelDomain={[0, 18]} fitZone={[CUT_IN_SPEED, RATED_SPEED]} />
    ),
    takeaway: (
      <>
        In the ramp-up zone it's a <strong>parabola</strong> — a quadratic,{' '}
        <span className="font-mono">P = a·v² + b·v + c</span>, opening upward.
        The best-fit quadratic hugs the dots with{' '}
        <strong>R² ≈ {BEST_R2.toFixed(2)}</strong>. The full curve is{' '}
        <em>piecewise</em>: flat, then this parabola, then flat again.
      </>
    ),
    source: `Best-fit quadratic on the ramp-up zone · ${RAMP_UP_DATA.length} readings`,
  },

  'line-or-parabola': {
    question: 'Is it a line, a parabola, or something else?',
    viz: () => (
      <RevealScatter model={BEST_MODEL} modelDomain={[0, 18]} fitZone={[CUT_IN_SPEED, RATED_SPEED]} />
    ),
    takeaway: (
      <>
        Not a line — a straight line can't bend, and this curve clearly does.
        A <strong>parabola</strong> fits the ramp-up zone beautifully. But no
        single equation fits the <em>whole</em> curve: it's a piecewise
        function — flat in the cut-in zone, quadratic through ramp-up, flat
        again once the turbine hits its rated ceiling.
      </>
    ),
    source: 'Best-fit quadratic vs. the full curve',
  },

  'why-flatten': {
    question: 'Why does it flatten out at the top?',
    viz: () => <RevealScatter regimeBands colorByRegime ratedLine legend />,
    takeaway: (
      <>
        That flat top is <strong>designed in</strong>. Once the wind reaches
        "rated speed," the turbine stops chasing more power — it pitches its
        blades to spill the extra wind, holding output at the rated{' '}
        <strong>≈ {RATED_POWER} kW</strong>. Pushing harder would overheat
        the generator and gearbox. The physics could give more; the
        engineering says no.
      </>
    ),
    source: 'Power output by operating regime',
  },

  'come-back-down': {
    question: 'Does the curve ever come back down?',
    viz: () => <RevealScatter regimeBands colorByRegime ratedLine legend />,
    takeaway: (
      <>
        Not in this data — it holds flat at the rated ceiling. But a real
        turbine has a <strong>cut-out speed</strong> (around 25 m/s): in a
        storm it shuts down completely to protect itself, and power drops to
        zero. This turbine's twelve hours never got that windy, so we only
        see the flat part.
      </>
    ),
    source: 'Power output across the recorded wind range',
  },

  'lowest-wind': {
    question: 'Is there a lowest wind speed that makes power?',
    viz: () => (
      <RevealScatter regimeBands colorByRegime highlightX={CUT_IN_SPEED} legend />
    ),
    takeaway: (
      <>
        Yes — it's called the <strong>cut-in speed</strong>, about{' '}
        <strong>{CUT_IN_SPEED} m/s</strong> for this turbine. Below it the
        wind can't supply enough force to overcome friction and start the
        heavy blades turning, so output sits near zero. The parabola only
        begins once the turbine wakes up.
      </>
    ),
    source: `Cut-in speed marked at ${CUT_IN_SPEED} m/s`,
  },

  'predict-10': {
    question: 'Could we predict the power at 10 m/s?',
    viz: () => (
      <RevealScatter
        model={BEST_MODEL}
        modelDomain={[0, 18]}
        fitZone={[CUT_IN_SPEED, RATED_SPEED]}
        highlightX={10}
      />
    ),
    takeaway: (
      <>
        Yes — that's the payoff of a model. Plug v = 10 into the best-fit
        quadratic and it predicts <strong>≈ {round10(PRED_10)} kW</strong>.
        The turbine's <em>measured</em> average near 10 m/s is{' '}
        <strong>≈ {round10(MEASURED_10)} kW</strong>. Close — because 10 m/s
        sits inside the ramp-up zone, where the quadratic holds.
      </>
    ),
    source: 'Quadratic prediction vs. measured average at 10 m/s',
  },

  'max-power': {
    question: 'What is the most power this turbine can make?',
    viz: () => <RevealScatter regimeBands colorByRegime ratedLine legend />,
    takeaway: (
      <>
        Its <strong>rated power</strong> — about <strong>{RATED_POWER} kW</strong>{' '}
        (1.5 MW), the number on the turbine's nameplate. The highest reading
        in this whole day was {Math.round(MAX_POWER)} kW. No matter how hard
        the wind blows, the curve never climbs past that ceiling — it's a
        deliberate cap, not a limit of the wind.
      </>
    ),
    source: 'Rated power ceiling vs. the recorded data',
  },

  'why-scatter': {
    question: 'Why is there so much scatter?',
    viz: () => <RevealScatter regimeBands colorByRegime legend />,
    takeaway: (
      <>
        Because this is <strong>real sensor data</strong>, not a tidy
        textbook curve. Each dot is one minute: wind gusts and lulls within
        that minute, shifting air density, turbulence, and the turbine
        constantly adjusting its blade pitch all nudge the power. One reading
        isn't the curve — the <em>trend</em> through the cloud is.
      </>
    ),
    source: 'One 1.5 MW turbine · one reading per minute',
  },
};

export function listRevealsFor(
  wonderIds: readonly string[],
): Array<{ id: string; reveal: Reveal }> {
  const seen = new Set<string>();
  const out: Array<{ id: string; reveal: Reveal }> = [];
  for (const id of wonderIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    const r = REVEALS[id];
    if (r) out.push({ id, reveal: r });
  }
  return out;
}
