// All selectable observations and claims for the Wind Power Curve activity.
//
// Two flavors:
//   - Static chips: `text` is a fixed string.
//   - Data-derived chips: `render(ctx)` reads from a context object and
//     interpolates live values, so picking "R² ≈ X" commits the student to
//     the real number from their own fit.
//
// State stores chip IDs (stable across re-renders); display calls render at
// render time so values stay current as the underlying data changes.

// --------------------------------------------------------------------------
// Chip shapes.
// --------------------------------------------------------------------------

export interface StaticChip {
  id: string;
  text: string;
}

export interface DerivedChip<C> {
  id: string;
  render: (ctx: C) => string;
}

// --------------------------------------------------------------------------
// Context shapes — one per lens that needs live data.
// --------------------------------------------------------------------------

export interface FitClaimContext {
  a: number;
  b: number;
  c: number;
  r2: number;
  predictedAt10: number; // model(10), kW
}

export interface DiffClaimContext {
  /** Mean of the second differences across the binned ramp-up data. */
  meanSecondDiff: number;
  /** How tightly the second differences cluster (lower = more constant). */
  spread: number;
  roughlyConstant: boolean;
}

export interface RegimeClaimContext {
  /** R² of a quadratic fit on the ramp-up zone alone. */
  rampUpR2: number;
  /** R² of the same quadratic stretched across every regime. */
  allDataR2: number;
}

// --------------------------------------------------------------------------
// Act 1 · Notice chips — what students saw on the reveal.
// --------------------------------------------------------------------------

export const NOTICE_CHIPS: readonly StaticChip[] = [
  { id: 'climbs-then-flat', text: 'Power climbs steeply, then flattens near the top.' },
  { id: 'min-wind', text: 'There seems to be a minimum wind speed before any power.' },
  { id: 'curved-not-line', text: 'The relationship looks curved, not a straight line.' },
  { id: 'cloud-scatter', text: "It's a cloud of dots, not a clean line — lots of scatter." },
  { id: 'flat-ceiling', text: 'The top of the curve is a flat ceiling.' },
  { id: 'doubling', text: 'Doubling the wind seems to more than double the power.' },
  { id: 'gets-steeper', text: 'The curve gets steeper as the wind picks up.' },
  { id: 'low-wind-little', text: 'Low wind speeds barely make any power.' },
  { id: 'more-wind-no-gain', text: "Past a point, more wind doesn't add any power." },
];

// --------------------------------------------------------------------------
// Act 1 · Wonder chips — what each group could ask the dataset.
// --------------------------------------------------------------------------

export const WONDER_CHIPS: readonly StaticChip[] = [
  { id: 'what-shape', text: 'What shape is this curve?' },
  { id: 'why-flatten', text: 'Why does it flatten out at the top?' },
  { id: 'lowest-wind', text: 'Is there a lowest wind speed that makes power?' },
  { id: 'predict-10', text: 'Could we predict the power at 10 m/s?' },
  { id: 'why-scatter', text: 'Why is there so much scatter?' },
  { id: 'max-power', text: 'What is the most power this turbine can make?' },
  { id: 'line-or-parabola', text: 'Is it a line, a parabola, or something else?' },
  { id: 'come-back-down', text: 'Does the curve ever come back down?' },
];

// --------------------------------------------------------------------------
// Act 2 · Fit lens claim chips (data-derived).
// --------------------------------------------------------------------------

export const FIT_CLAIM_CHIPS: readonly DerivedChip<FitClaimContext>[] = [
  {
    id: 'fit-good-r2',
    render: (ctx) =>
      `Our quadratic hugs the ramp-up data well — R² ≈ ${ctx.r2.toFixed(2)}.`,
  },
  {
    id: 'fit-opens-up',
    render: (ctx) =>
      ctx.a > 0
        ? 'The parabola opens upward (a > 0) — power curves up faster and faster.'
        : 'We needed a positive a to make the curve bend the right way.',
  },
  {
    id: 'fit-predict-10',
    render: (ctx) => `At 10 m/s our model predicts about ${Math.round(ctx.predictedAt10 / 10) * 10} kW.`,
  },
  {
    id: 'fit-no-line',
    render: () => 'No straight line could do this — the data genuinely curves.',
  },
  {
    id: 'fit-a-is-steepness',
    render: () => 'Small changes in a swing the curve a lot — a controls the curvature.',
  },
];

// --------------------------------------------------------------------------
// Act 2 · Differences lens claim chips (data-derived).
// --------------------------------------------------------------------------

export const DIFF_CLAIM_CHIPS: readonly DerivedChip<DiffClaimContext>[] = [
  {
    id: 'diff-first-grow',
    render: () => 'First differences keep growing — power rises faster and faster.',
  },
  {
    id: 'diff-second-constant',
    render: (ctx) =>
      ctx.roughlyConstant
        ? 'Second differences stay roughly constant — the fingerprint of a quadratic.'
        : 'Second differences hover near one value, even with the sensor noise.',
  },
  {
    id: 'diff-constant-a',
    render: () => 'Constant second differences mean a constant a — one steady curvature.',
  },
  {
    id: 'diff-noise',
    render: () => 'The differences wobble because real sensor data is noisy — but the trend holds.',
  },
  {
    id: 'diff-not-linear',
    render: () => 'A line would have constant FIRST differences — this one clearly does not.',
  },
];

// --------------------------------------------------------------------------
// Act 2 · Regime lens claim chips (data-derived).
// --------------------------------------------------------------------------

export const REGIME_CLAIM_CHIPS: readonly DerivedChip<RegimeClaimContext>[] = [
  {
    id: 'reg-rampup-only',
    render: () => 'The quadratic only hugs the dots inside the ramp-up zone.',
  },
  {
    id: 'reg-fit-falls-apart',
    render: (ctx) =>
      `Stretch the fit across every zone and it falls apart — R² drops from ${ctx.rampUpR2.toFixed(
        2,
      )} to ${ctx.allDataR2.toFixed(2)}.`,
  },
  {
    id: 'reg-cutin-flat',
    render: () => 'The cut-in zone sits almost flat at zero — no curve there at all.',
  },
  {
    id: 'reg-rated-ceiling',
    render: () => 'The rated zone is a flat ceiling, not part of any parabola.',
  },
  {
    id: 'reg-piecewise',
    render: () => "It's really a piecewise function: flat, then quadratic, then flat.",
  },
];

// --------------------------------------------------------------------------
// Act 2 · Synthesis chips — class-level pull-it-together.
// --------------------------------------------------------------------------

export const SYNTHESIS_CHIPS: readonly StaticChip[] = [
  { id: 's-quad-rampup', text: 'A quadratic models the ramp-up zone of a wind turbine extremely well.' },
  { id: 's-not-a-line', text: "Power doesn't rise in a straight line — it curves, faster and faster." },
  { id: 's-second-diff', text: 'Constant second differences prove the ramp-up data is quadratic.' },
  { id: 's-piecewise', text: 'The full power curve is piecewise — the parabola is only the middle act.' },
  { id: 's-flat-design', text: 'The flat top is a design choice — engineers cap the power on purpose.' },
  { id: 's-tools', text: 'Different tools tested different ideas about the same curve.' },
];

// --------------------------------------------------------------------------
// Act 3 · Final claim chips.
// --------------------------------------------------------------------------

export const FINAL_CLAIM_CHIPS: readonly StaticChip[] = [
  { id: 'fc-quad-predicts', text: 'Between cut-in and rated speed, a quadratic predicts a turbine\'s power.' },
  { id: 'fc-piecewise', text: "A power curve is a piecewise function, not one single equation." },
  { id: 'fc-second-diff', text: 'Constant second differences are how you know data is quadratic.' },
  { id: 'fc-zone', text: 'A model is powerful inside its zone — and wrong outside it.' },
  { id: 'fc-two-numbers', text: 'Two numbers — wind speed and power — carry a turbine\'s whole story.' },
];

// --------------------------------------------------------------------------
// Act 3 · Notebook headline chips.
// --------------------------------------------------------------------------

export const NOTEBOOK_HEADLINE_CHIPS: readonly StaticChip[] = [
  { id: 'h-curves', text: "Power curves — it doesn't climb in a line." },
  { id: 'h-middle', text: 'A parabola — but only in the middle.' },
  { id: 'h-second-diff', text: 'Second differences gave it away.' },
  { id: 'h-zone', text: 'Every model has a zone where it works.' },
  { id: 'h-designed', text: 'The flat top was designed in.' },
];

// --------------------------------------------------------------------------
// Helpers — turn selected ids back into rendered text. Used by Act 3 to
// display what was picked across Acts 1 and 2.
// --------------------------------------------------------------------------

export function renderStaticChips(
  catalog: readonly StaticChip[],
  selectedIds: readonly string[],
): string[] {
  const lookup = new Map(catalog.map((c) => [c.id, c.text]));
  return selectedIds.map((id) => lookup.get(id)).filter((v): v is string => !!v);
}

export function renderDerivedChips<C>(
  catalog: readonly DerivedChip<C>[],
  selectedIds: readonly string[],
  ctx: C,
): string[] {
  const lookup = new Map(catalog.map((c) => [c.id, c.render]));
  return selectedIds.map((id) => lookup.get(id)?.(ctx)).filter((v): v is string => !!v);
}
