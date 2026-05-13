import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DATASETS } from '../data/registry';
import { applyFilters, attrByKey } from '../lib/dataset';
import type { Filter, Dataset } from '../lib/dataset';
import ChartToolbar from '../components/explorer/ChartToolbar';
import type { ChartConfig, ChartType, AxisScale } from '../components/explorer/ChartToolbar';
import ScatterView from '../components/explorer/ScatterView';
import HistogramView from '../components/explorer/HistogramView';
import BarView from '../components/explorer/BarView';
import BoxPlotView from '../components/explorer/BoxPlotView';
import MapView from '../components/explorer/MapView';
import DataTable from '../components/explorer/DataTable';
import StatsPanel from '../components/explorer/StatsPanel';
import FilterPanel from '../components/explorer/FilterPanel';
import Masthead from '../components/Masthead';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { datasetAccent } from '../lib/dataset';
import { Link } from 'react-router-dom';

// ───────────────────────────────────────────────────────────────────────────
//  Explorer URL parameters
//  ────────────────────────
//  The Explorer treats the URL as the source of truth for its view shape, so
//  any view a teacher or student lands on is shareable by copying the URL.
//
//  Param      Meaning                                       Example
//  ─────      ────────                                       ───────
//  dataset    Dataset id (required)                         dataset=moore
//  type       Chart type — scatter|histogram|bar|box|map    type=map
//  x          X attribute key                                x=year
//  y          Y attribute key                                y=transistors
//  color      Color attribute key, or "none" to disable      color=manufacturer
//  xScale     Scatter X scale — linear|log                   xScale=log
//  yScale     Scatter Y scale — linear|log                   yScale=log
//
//  Defaults come from `dataset.featured` (per-dataset opening view). The URL
//  only encodes values that DIFFER from those defaults, so canonical URLs
//  stay short (e.g. /explorer?dataset=moore is enough to land on log-Y).
//
//  Fine-grained interactive state (regression toggle, slope/intercept slider
//  values, marker x, filter chips, histogram bins) is intentionally NOT
//  encoded — those stay session-local. If you want a regression snapshot
//  shareable, screenshot it for now.
// ───────────────────────────────────────────────────────────────────────────

const CHART_TYPES = new Set<ChartType>(['scatter', 'histogram', 'bar', 'box', 'map']);

function defaultConfig(d: Dataset): ChartConfig {
  const num = d.attributes.filter((a) => a.kind === 'numeric');
  const cat = d.attributes.filter((a) => a.kind === 'categorical');
  const featuredX = d.featured?.x && num.find((a) => a.key === d.featured!.x)?.key;
  const featuredY = d.featured?.y && num.find((a) => a.key === d.featured!.y)?.key;
  const featuredColor = d.featured?.color && cat.find((a) => a.key === d.featured!.color)?.key;
  // Honor featured.type only if the prereq is met (e.g. map needs dataset.geo).
  const featuredType = d.featured?.type;
  const type =
    featuredType === 'map' && d.geo
      ? 'map'
      : featuredType ?? 'scatter';
  return {
    type,
    xKey: featuredX ?? num[0]?.key ?? null,
    yKey: featuredY ?? num[1]?.key ?? num[0]?.key ?? null,
    colorKey: featuredColor ?? null,
    xScale: d.featured?.xScale ?? 'linear',
    yScale: d.featured?.yScale ?? 'linear',
  };
}

function attrExists(d: Dataset, key: string | null): boolean {
  if (!key) return false;
  return d.attributes.some((a) => a.key === key);
}

// Build the cold-open Filter[] from a dataset's featured.defaultFilter. For
// each "include only [vals]" hint, compute the categorical filter as
// "exclude everything else" — the storage shape used by FilterPanel.
function defaultFilters(d: Dataset): Filter[] {
  const hints = d.featured?.defaultFilter;
  if (!hints || hints.length === 0) return [];
  const out: Filter[] = [];
  for (const hint of hints) {
    const attr = d.attributes.find((a) => a.key === hint.attrKey);
    if (!attr || attr.kind !== 'categorical') continue;
    const allValues = new Set<string>();
    for (const row of d.rows) {
      const v = row[hint.attrKey];
      if (typeof v === 'string') allValues.add(v);
    }
    const include = new Set(hint.include);
    const excluded = new Set<string>();
    for (const v of allValues) {
      if (!include.has(v)) excluded.add(v);
    }
    if (excluded.size > 0) {
      out.push({ kind: 'categorical', attrKey: hint.attrKey, excluded });
    }
  }
  return out;
}

function readConfigFromURL(d: Dataset, params: URLSearchParams): ChartConfig {
  const base = defaultConfig(d);
  const t = params.get('type');
  const type =
    t && CHART_TYPES.has(t as ChartType) && (t !== 'map' || d.geo) ? (t as ChartType) : base.type;

  const x = params.get('x');
  const y = params.get('y');
  const color = params.get('color');
  const xScale = params.get('xScale');
  const yScale = params.get('yScale');

  return {
    type,
    xKey: attrExists(d, x) ? x : base.xKey,
    yKey: attrExists(d, y) ? y : base.yKey,
    colorKey: color === 'none' ? null : attrExists(d, color) ? color : base.colorKey,
    xScale: xScale === 'linear' || xScale === 'log' ? (xScale as AxisScale) : base.xScale,
    yScale: yScale === 'linear' || yScale === 'log' ? (yScale as AxisScale) : base.yScale,
  };
}

// Serialize a config to URL params. Only writes params that differ from the
// dataset's featured defaults, so the URL stays minimal for canonical views.
function configToParams(datasetId: string, c: ChartConfig, d: Dataset): URLSearchParams {
  const base = defaultConfig(d);
  const out = new URLSearchParams();
  out.set('dataset', datasetId);
  if (c.type !== base.type) out.set('type', c.type);
  if (c.xKey && c.xKey !== base.xKey) out.set('x', c.xKey);
  if (c.yKey && c.yKey !== base.yKey) out.set('y', c.yKey);
  if (c.colorKey !== base.colorKey) {
    out.set('color', c.colorKey ?? 'none');
  }
  if (c.xScale && c.xScale !== base.xScale) out.set('xScale', c.xScale);
  if (c.yScale && c.yScale !== base.yScale) out.set('yScale', c.yScale);
  return out;
}

export default function ExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('dataset');
  const initial = DATASETS.find((d) => d.id === initialId) ?? DATASETS[0];
  const [datasetId, setDatasetId] = useState(initial.id);
  const dataset = DATASETS.find((d) => d.id === datasetId)!;

  // Initial config: parse from URL params on first mount so deep-links land
  // on the right view. After mount, config <-> URL stays in sync via the
  // effect below.
  const [config, setConfig] = useState<ChartConfig>(() => readConfigFromURL(dataset, searchParams));
  const [filters, setFilters] = useState<Filter[]>(() => defaultFilters(dataset));

  useDocumentTitle(`Explorer · ${dataset.name}`);

  // Sync the URL to the current config any time it changes. Only non-default
  // values are written (see configToParams) so canonical URLs stay short.
  useEffect(() => {
    const next = configToParams(datasetId, config, dataset);
    // Don't trigger a re-render loop: only update when the serialized form differs.
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetId, config]);

  // reset chart config + filters when dataset changes via the picker.
  // (Deep-link navigation goes through the initial-mount path instead.)
  const handleDatasetChange = (id: string) => {
    const next = DATASETS.find((d) => d.id === id)!;
    setDatasetId(id);
    setConfig(defaultConfig(next));
    setFilters(defaultFilters(next));
  };

  const filteredRows = useMemo(() => applyFilters(dataset.rows, filters), [dataset, filters]);

  const xAttr = config.xKey ? attrByKey(dataset, config.xKey) : null;
  const yAttr = config.yKey ? attrByKey(dataset, config.yKey) : null;
  const colorAttr = config.colorKey ? attrByKey(dataset, config.colorKey) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Masthead
        right={
          <div className="flex items-center gap-3">
            <Link
              to={`/datasets/${datasetId}/dictionary`}
              className="text-xs eyebrow text-brand-700 hover:text-accent-700 hover:underline whitespace-nowrap"
              title="What every column means"
            >
              Data dictionary →
            </Link>
            <DatasetPicker datasetId={datasetId} onChange={handleDatasetChange} />
          </div>
        }
      />

      {/* Body: 3-column layout */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full grid lg:grid-cols-[260px_1fr_280px] gap-0 border-x border-surface-line bg-surface-raised">
        <aside className="border-r border-surface-line bg-surface-subtle/40 p-4 overflow-auto">
          <FilterPanel dataset={dataset} allRows={dataset.rows} filters={filters} onChange={setFilters} />
        </aside>

        <main className="flex flex-col bg-surface-raised border-r border-surface-line min-w-0">
          <ChartToolbar dataset={dataset} config={config} onChange={setConfig} />
          <div className="flex-1 min-h-[420px] max-h-[640px] bg-surface-subtle/30 p-2">
            <div className="w-full h-full bg-surface-raised rounded-lg shadow-editorial border border-surface-line" style={{ minHeight: 400 }}>
              {config.type === 'scatter' && xAttr && yAttr && (
                <ScatterView
                  dataset={dataset}
                  rows={filteredRows}
                  xAttr={xAttr}
                  yAttr={yAttr}
                  colorAttr={colorAttr}
                  xScale={config.xScale ?? 'linear'}
                  yScale={config.yScale ?? 'linear'}
                  onXScaleChange={(s) => setConfig((c) => ({ ...c, xScale: s }))}
                  onYScaleChange={(s) => setConfig((c) => ({ ...c, yScale: s }))}
                />
              )}
              {config.type === 'histogram' && xAttr && (
                <HistogramView dataset={dataset} rows={filteredRows} xAttr={xAttr} />
              )}
              {config.type === 'bar' && xAttr && (
                <BarView dataset={dataset} rows={filteredRows} xAttr={xAttr} />
              )}
              {config.type === 'box' && xAttr && yAttr && (
                <BoxPlotView dataset={dataset} rows={filteredRows} yAttr={yAttr} groupAttr={xAttr} />
              )}
              {config.type === 'map' && dataset.geo && (() => {
                const latAttr = attrByKey(dataset, dataset.geo.lat);
                const lonAttr = attrByKey(dataset, dataset.geo.lon);
                const sizeAttr = dataset.geo.size ? attrByKey(dataset, dataset.geo.size) : null;
                if (!latAttr || !lonAttr) return null;
                return (
                  <MapView
                    dataset={dataset}
                    rows={filteredRows}
                    latAttr={latAttr}
                    lonAttr={lonAttr}
                    colorAttr={colorAttr}
                    sizeAttr={sizeAttr}
                  />
                );
              })()}
            </div>
          </div>
          <DataTable dataset={dataset} rows={filteredRows} totalCount={dataset.rows.length} />
        </main>

        <aside className="bg-surface-subtle/40 p-4 overflow-auto">
          <StatsPanel dataset={dataset} rows={filteredRows} />
        </aside>
      </div>

      <footer className="border-t border-surface-line bg-surface-raised py-3 text-center text-xs text-ink-muted">
        Prototype · {dataset.source}
      </footer>
    </div>
  );
}

const ACCENT_DOT: Record<string, string> = {
  sky: 'bg-sky-500',
  emerald: 'bg-emerald-500',
  cyan: 'bg-cyan-500',
  amber: 'bg-accent-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  indigo: 'bg-indigo-500',
  pink: 'bg-pink-500',
  orange: 'bg-orange-500',
  teal: 'bg-teal-500',
  slate: 'bg-brand-700',
};

function DatasetPicker({ datasetId, onChange }: { datasetId: string; onChange: (id: string) => void }) {
  const current = DATASETS.find((d) => d.id === datasetId)!;
  return (
    <div className="relative">
      <select
        aria-label="Dataset"
        value={datasetId}
        onChange={(e) => onChange(e.target.value)}
        className="pl-7 pr-8 py-1.5 rounded-md border border-surface-line bg-surface-raised font-medium text-ink text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none appearance-none"
      >
        {DATASETS.map((d) => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
      <div
        className={`absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${ACCENT_DOT[datasetAccent(current)] ?? 'bg-ink-muted'}`}
      />
      <svg
        className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-ink-muted pointer-events-none"
        viewBox="0 0 12 12"
      >
        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}
