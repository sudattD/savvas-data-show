// All selectable observations and claims for the Map Earth's Anger activity.
//
// Two flavors:
//   - Static chips: `text` is a fixed string.
//   - Data-derived chips: `text(ctx)` reads from a context object and
//     interpolates live values, so picking "Most quakes are on the Ring
//     of Fire (X%)" commits the student to the real number from their
//     filtered data.
//
// State stores chip IDs (stable across re-renders); display calls .text(ctx)
// at render time so values stay current as the underlying data changes.

// --------------------------------------------------------------------------
// Context shapes — one per chip group that needs live data.
// --------------------------------------------------------------------------

export interface MapClaimContext {
  totalCount: number;
  shownCount: number;
  ringOfFireCount: number;
  ringPct: number;
  minMag: number;
}

export interface HistogramClaimContext {
  variable: 'magnitude' | 'depthKm';
  shallowPct: number; // for depth: % of events under 70km
  smallPct: number; // for magnitude: % of events below M4
  maxMag: number;
  maxDepth: number;
  totalCount: number;
}

export interface ScatterClaimContext {
  xKey: 'magnitude' | 'depthKm' | 'lat' | 'lon';
  yKey: 'magnitude' | 'depthKm' | 'lat' | 'lon';
}

// --------------------------------------------------------------------------
// Chip shape — id is stable, text/render produces what students read.
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
// Act 1: Notice chips (~10) — what students saw on the reveal map.
// --------------------------------------------------------------------------

export const NOTICE_CHIPS: readonly StaticChip[] = [
  { id: 'not-random', text: "The dots aren't random — they form patterns." },
  { id: 'curve-pacific', text: 'There\'s a clear curve around the Pacific Ocean.' },
  { id: 'land-water-edge', text: 'Most dots are along the edges of land and water.' },
  { id: 'empty-oceans', text: 'Big areas of the open ocean are mostly empty.' },
  { id: 'lines-arcs', text: 'The dots form lines or arcs in places.' },
  { id: 'thick-clusters', text: 'Some spots have dots stacked thick together.' },
  { id: 'empty-continents', text: 'Parts of Africa, Australia and Antarctica have very few dots.' },
  { id: 'safe-places', text: "Some places look 'safe' — almost no dots at all." },
  { id: 'horseshoe', text: 'The pattern around the Pacific looks like a horseshoe.' },
  { id: 'islands-string', text: 'Some islands sit on long strings of dots.' },
];

// --------------------------------------------------------------------------
// Act 1: Wonder chips — what each group could ask the dataset. Replaces
// the old "starter chips" + free wonder textarea.
// --------------------------------------------------------------------------

export const WONDER_CHIPS: readonly StaticChip[] = [
  { id: 'where-cluster', text: 'Where do quakes cluster?' },
  { id: 'strongest-coasts', text: 'Are the strongest ones near coasts?' },
  { id: 'depth-where', text: 'Does depth tell you where?' },
  { id: 'next-big', text: 'Where would the next big one be?' },
  { id: 'not-shaking', text: "What's NOT shaking — and why?" },
  { id: 'safer-places', text: 'Are some places safer than others?' },
  { id: 'time-random', text: 'Do quakes happen at random times?' },
  { id: 'deep-strong', text: 'Are deep quakes also strong?' },
];

// --------------------------------------------------------------------------
// Act 2 · Map lens claim chips (context-aware, data-derived).
// --------------------------------------------------------------------------

export const MAP_CLAIM_CHIPS: readonly DerivedChip<MapClaimContext>[] = [
  {
    id: 'most-on-ring',
    render: (ctx) =>
      `Most quakes are on the Pacific Ring of Fire — about ${ctx.ringPct}% of the ${ctx.shownCount} we plotted.`,
  },
  {
    id: 'pacific-empty',
    render: () => 'The middle of the Pacific Ocean is mostly empty.',
  },
  {
    id: 'big-continents-quiet',
    render: () => 'Big continents like Africa and Australia have very few quakes.',
  },
  {
    id: 'edges-not-random',
    render: () =>
      "Quakes happen where plates meet — they follow edges, not random geography.",
  },
  {
    id: 'strong-trace-curve',
    render: (ctx) =>
      `Even at the M${ctx.minMag.toFixed(1)}+ filter, the strongest quakes still trace the same curve.`,
  },
  {
    id: 'lines-of-dots',
    render: () => 'There are clear lines of dots — like the US West Coast and the Andes.',
  },
];

// --------------------------------------------------------------------------
// Act 2 · Histogram lens claim chips — different sets by variable.
// --------------------------------------------------------------------------

const HISTOGRAM_MAGNITUDE_CHIPS: readonly DerivedChip<HistogramClaimContext>[] = [
  {
    id: 'mag-mostly-small',
    render: (ctx) => `Most quakes are small — about ${ctx.smallPct}% are below M4.`,
  },
  {
    id: 'mag-long-tail',
    render: () => 'The distribution has a long right tail — huge quakes are rare.',
  },
  {
    id: 'mag-doubles-rarity',
    render: () =>
      'Each step up in magnitude makes quakes far rarer (long-tail / power-law shape).',
  },
  {
    id: 'mag-largest',
    render: (ctx) => `The largest event this week was M${ctx.maxMag.toFixed(1)}.`,
  },
  {
    id: 'mag-few-strong',
    render: () => 'M5+ events are noticeable but uncommon.',
  },
];

const HISTOGRAM_DEPTH_CHIPS: readonly DerivedChip<HistogramClaimContext>[] = [
  {
    id: 'depth-mostly-shallow',
    render: (ctx) => `Most quakes are shallow — about ${ctx.shallowPct}% are within 70 km of the surface.`,
  },
  {
    id: 'depth-bimodal',
    render: () => 'Depth is bimodal — a big shallow cluster and a smaller deep cluster, with little in between.',
  },
  {
    id: 'depth-mid-empty',
    render: () => 'Mid-depth quakes (around 100–300 km) are rare.',
  },
  {
    id: 'depth-deepest',
    render: (ctx) => `The deepest event sat ${Math.round(ctx.maxDepth)} km below the surface.`,
  },
  {
    id: 'depth-subduction',
    render: () => 'The deep ones are where one plate dives under another.',
  },
];

export function histogramClaimChipsFor(ctx: HistogramClaimContext) {
  return ctx.variable === 'magnitude' ? HISTOGRAM_MAGNITUDE_CHIPS : HISTOGRAM_DEPTH_CHIPS;
}

// --------------------------------------------------------------------------
// Act 2 · Scatter lens claim chips — different sets by axis pair. We key
// the chip set on the sorted pair so swapping axes still picks the same
// chip set.
// --------------------------------------------------------------------------

const SCATTER_DEPTH_MAGNITUDE: readonly DerivedChip<ScatterClaimContext>[] = [
  { id: 'sc-no-relation', render: () => "There's almost no relationship between depth and magnitude." },
  { id: 'sc-flat-line', render: () => 'A best-fit line comes out nearly flat — depth doesn\'t predict magnitude.' },
  { id: 'sc-low-r2', render: () => 'R² is very low — you can fit a line, but it explains very little.' },
  { id: 'sc-shallow-all', render: () => 'Shallow quakes range from tiny to huge.' },
  { id: 'sc-fit-meaningless', render: () => 'Fitting a line works, but the data is too scattered for it to mean much.' },
];

const SCATTER_LAT_DEPTH: readonly DerivedChip<ScatterClaimContext>[] = [
  { id: 'lat-bands', render: () => 'Certain latitude bands have only shallow quakes.' },
  { id: 'lat-southern-deep', render: () => 'Deep quakes cluster in the southern hemisphere subduction zones.' },
  { id: 'lat-no-line', render: () => 'Latitude alone doesn\'t predict depth — it\'s about where on the map, not just how far north.' },
  { id: 'lat-empty-bands', render: () => 'There are latitude bands with hardly any quakes at all.' },
];

const SCATTER_LAT_LON: readonly DerivedChip<ScatterClaimContext>[] = [
  { id: 'll-is-a-map', render: () => 'This plot is basically a map — the dots trace land/water boundaries.' },
  { id: 'll-ring-shows-up', render: () => 'The Ring of Fire shows up here, just like on the Map lens.' },
  { id: 'll-clusters', render: () => 'The clusters here match the clusters on the world map.' },
];

const SCATTER_MAG_LAT: readonly DerivedChip<ScatterClaimContext>[] = [
  { id: 'mag-lat-no-favor', render: () => 'Stronger quakes don\'t favor any particular latitude.' },
  { id: 'mag-lat-polar-few', render: () => 'Polar regions have far fewer quakes overall.' },
  { id: 'mag-lat-equator-mix', render: () => 'Around the equator, magnitudes are a mix — no obvious pattern.' },
];

const SCATTER_DEFAULT: readonly DerivedChip<ScatterClaimContext>[] = [
  { id: 'sc-default-1', render: () => "There's a relationship — the dots cluster, not scatter." },
  { id: 'sc-default-2', render: () => "There's no clear relationship — the dots scatter widely." },
  { id: 'sc-default-3', render: () => 'A best-fit line tells us very little here.' },
  { id: 'sc-default-4', render: () => 'A best-fit line captures the trend pretty well.' },
];

export function scatterClaimChipsFor(ctx: ScatterClaimContext) {
  const has = (a: ScatterClaimContext['xKey'], b: ScatterClaimContext['xKey']) =>
    (ctx.xKey === a && ctx.yKey === b) || (ctx.xKey === b && ctx.yKey === a);
  if (has('magnitude', 'depthKm')) return SCATTER_DEPTH_MAGNITUDE;
  if (has('lat', 'depthKm')) return SCATTER_LAT_DEPTH;
  if (has('lat', 'lon')) return SCATTER_LAT_LON;
  if (has('magnitude', 'lat')) return SCATTER_MAG_LAT;
  return SCATTER_DEFAULT;
}

// --------------------------------------------------------------------------
// Act 2 · Synthesis chips — class-level pull-it-together.
// --------------------------------------------------------------------------

export const SYNTHESIS_CHIPS: readonly StaticChip[] = [
  { id: 's-tectonic', text: 'Earthquakes trace tectonic plate boundaries, mostly around the Pacific.' },
  { id: 's-not-random', text: "Quakes aren't random — they happen where Earth's plates meet." },
  { id: 's-coords-predict', text: 'Coordinates predict where quakes happen better than anything else.' },
  { id: 's-different-views', text: 'Different lenses show different parts of the same pattern.' },
  { id: 's-small-cluster-strong', text: 'Most quakes are small, but the big ones cluster in the same places.' },
  { id: 's-quiet-earth', text: 'Most of the Earth is quiet — only the plate edges shake.' },
];

// --------------------------------------------------------------------------
// Act 3 · Final claim chips.
// --------------------------------------------------------------------------

export const FINAL_CLAIM_CHIPS: readonly StaticChip[] = [
  { id: 'fc-plates', text: 'Earthquakes happen where tectonic plates meet, not at random.' },
  { id: 'fc-coords', text: 'Latitude and longitude together reveal a hidden physical structure.' },
  { id: 'fc-ring-of-fire', text: 'The Pacific Ring of Fire is where most of the world\'s quakes happen.' },
  { id: 'fc-edges-only', text: 'Quakes are concentrated at plate boundaries — most of the Earth is quiet.' },
  { id: 'fc-two-numbers', text: 'Two numbers — lat and lon — carry the whole story of earthquake risk.' },
];

// --------------------------------------------------------------------------
// Act 3 · Notebook headline chips.
// --------------------------------------------------------------------------

export const NOTEBOOK_HEADLINE_CHIPS: readonly StaticChip[] = [
  { id: 'h-patterns', text: 'The planet shakes in patterns.' },
  { id: 'h-coords-physics', text: 'Coordinates reveal hidden physics.' },
  { id: 'h-plate-edges', text: 'Earthquakes trace plate edges.' },
  { id: 'h-two-numbers', text: 'Two numbers, one big pattern.' },
  { id: 'h-quiet-earth', text: 'Most of Earth is quiet — the edges aren\'t.' },
];

// --------------------------------------------------------------------------
// Helpers — turn a list of selected ids back into rendered text. Used by
// Act 3 to display what was picked across Acts 1 and 2.
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
