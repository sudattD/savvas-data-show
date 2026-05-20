// Operating regimes of a wind turbine — one source of truth for both the
// shaded bands drawn on the power-curve scatter AND the "which zone is this
// reading in?" classification used by the Regime lens in Act 2 and the
// reveals in Act 3. The visual claim ("the quadratic only hugs the dots in
// the ramp-up band") matches the counted claim ("R² jumps once you fit the
// ramp-up zone alone").
//
// Boundaries are approximate operating points for the 1.5 MW turbine in the
// SCADA dataset, not manufacturer-authoritative.

export type RegimeId = 'cutIn' | 'rampUp' | 'rated';

export interface Regime {
  id: RegimeId;
  /** Full label for headings. */
  label: string;
  /** Compact label for chips and legends. */
  short: string;
  /** Wind-speed band, m/s — [min, max). */
  min: number;
  max: number;
  /** Student-facing one-liner explaining the physics of the zone. */
  blurb: string;
}

// Cut-in: the wind speed below which the turbine makes essentially no power.
export const CUT_IN_SPEED = 3.5;
// Rated: the wind speed at which output reaches the nameplate ceiling.
export const RATED_SPEED = 11.5;
// Nameplate / rated power of this turbine, kW.
export const RATED_POWER = 1500;

export const REGIMES: readonly Regime[] = [
  {
    id: 'cutIn',
    label: 'Cut-in zone',
    short: 'Cut-in',
    min: 0,
    max: CUT_IN_SPEED,
    blurb:
      "Below cut-in speed the blades barely turn — there isn't enough wind to overcome friction, so the turbine makes almost no power.",
  },
  {
    id: 'rampUp',
    label: 'Ramp-up zone',
    short: 'Ramp-up',
    min: CUT_IN_SPEED,
    max: RATED_SPEED,
    blurb:
      'The working zone. Power climbs steeply as the wind picks up — this is the stretch of the curve a quadratic models beautifully.',
  },
  {
    id: 'rated',
    label: 'Rated zone',
    short: 'Rated',
    min: RATED_SPEED,
    max: 30,
    blurb:
      'The wind has more to give, but the turbine holds power flat at its rated output to protect the generator and gearbox.',
  },
];

export function regimeOf(windSpeed: number): Regime {
  for (const r of REGIMES) {
    if (windSpeed >= r.min && windSpeed < r.max) return r;
  }
  // Anything at or beyond the last band's max still counts as rated.
  return REGIMES[REGIMES.length - 1];
}

export function regimeById(id: RegimeId): Regime {
  return REGIMES.find((r) => r.id === id) ?? REGIMES[0];
}
