# Explorer URL parameters

The Explorer at `/explorer` treats the URL as the source of truth for its
view shape. Any view a teacher or student lands on is shareable by copying
the URL — paste it into a class chat, a slide, or a lesson plan and the
recipient opens exactly the same chart.

Source of record: `src/screens/ExplorerPage.tsx` (top-of-file comment +
`readConfigFromURL` / `configToParams`).

## Parameters

| Param     | Required | Values                                        | Effect |
|-----------|----------|-----------------------------------------------|--------|
| `dataset` | yes      | dataset id (see `data/registry.ts`)           | Loads the dataset. |
| `type`    | no       | `scatter` \| `histogram` \| `bar` \| `box` \| `map` | Chart type. `map` falls back to scatter when the dataset has no `geo`. |
| `x`       | no       | attribute key                                 | X axis. Ignored if the key isn't in the dataset. |
| `y`       | no       | attribute key                                 | Y axis. Scatter / box only. |
| `color`   | no       | attribute key, or `none`                      | Color encoding. `none` explicitly disables. |
| `xScale`  | no       | `linear` \| `log`                             | Scatter X-axis scale. Auto-falls-back to linear if data ≤ 0. |
| `yScale`  | no       | `linear` \| `log`                             | Scatter Y-axis scale. Auto-falls-back to linear if data ≤ 0. |

## Defaults

Every param except `dataset` defaults to the dataset's `featured` config
declared on the dataset object. Examples:

- `mooreLawDataset.featured = { x: 'year', y: 'transistors', color: 'manufacturer', yScale: 'log' }`
- `earthquakesDataset.featured = { type: 'map', x: 'lon', y: 'lat', color: 'type' }`
- `exoplanetsDataset.featured = { x: 'orbitalPeriod', y: 'radiusEarth', color: 'method', xScale: 'log', yScale: 'log' }`

The URL only **writes** params whose value differs from the featured
default. That keeps canonical URLs short — `?dataset=moore` already gets
you log-Y and manufacturer colors because they're moore's defaults.

## Examples

| URL | Lands on |
|-----|----------|
| `/explorer?dataset=moore` | Year × transistors (log Y) colored by manufacturer — moore's featured default. |
| `/explorer?dataset=moore&yScale=linear` | Same but flipped to linear Y, exposing how flat the early decades look. |
| `/explorer?dataset=marathon&color=gender` | Marathon scatter colored by gender. |
| `/explorer?dataset=earthquakes&type=scatter` | Force scatter view (earthquakes defaults to map). |
| `/explorer?dataset=exoplanets&y=massEarth` | Switch Y to mass instead of radius; xScale/yScale stay log because that's the exoplanets default. |
| `/explorer?dataset=penguins&color=none` | Penguins scatter with the species coloring disabled. |

## What's NOT encoded

Fine-grained interactive state is intentionally session-only:

- Regression on/off, slope, intercept, "show best fit"
- Marker x position
- Mean/median crosshairs on/off
- Histogram bin count
- Box-plot group selection beyond what `x` covers
- **Filter chips** in the left panel

Sharable URLs encode the chart **frame**, not the in-flight tool state.
If you need a regression-with-slope snapshot to live in a lesson, capture
a screenshot — the URL won't carry it. (If this becomes painful, the
escape hatch is a `view` param holding a base64-encoded JSON blob; we
deliberately avoided that for now.)

## Adding a new param

1. Add the field to `ChartConfig` in `src/components/explorer/ChartToolbar.tsx`.
2. Add a `featured.*` default in `src/lib/dataset.ts` (`Dataset['featured']`).
3. Add to `readConfigFromURL` and `configToParams` in
   `src/screens/ExplorerPage.tsx`.
4. Update this doc.
5. Add a row to `testing_plan_browser.md` if the behavior should be
   regression-tested by the browser pass.
