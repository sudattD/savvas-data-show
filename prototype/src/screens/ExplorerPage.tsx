import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DATASETS } from '../data/registry';
import { applyFilters, attrByKey } from '../lib/dataset';
import type { Filter, Dataset } from '../lib/dataset';
import ChartToolbar from '../components/explorer/ChartToolbar';
import type { ChartConfig } from '../components/explorer/ChartToolbar';
import ScatterView from '../components/explorer/ScatterView';
import HistogramView from '../components/explorer/HistogramView';
import BarView from '../components/explorer/BarView';
import BoxPlotView from '../components/explorer/BoxPlotView';
import DataTable from '../components/explorer/DataTable';
import StatsPanel from '../components/explorer/StatsPanel';
import FilterPanel from '../components/explorer/FilterPanel';
import Masthead from '../components/Masthead';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { Link } from 'react-router-dom';

function defaultConfig(d: Dataset): ChartConfig {
  const num = d.attributes.filter((a) => a.kind === 'numeric');
  const cat = d.attributes.filter((a) => a.kind === 'categorical');
  const featuredX = d.featured?.x && num.find((a) => a.key === d.featured!.x)?.key;
  const featuredY = d.featured?.y && num.find((a) => a.key === d.featured!.y)?.key;
  const featuredColor = d.featured?.color && cat.find((a) => a.key === d.featured!.color)?.key;
  return {
    type: 'scatter',
    xKey: featuredX ?? num[0]?.key ?? null,
    yKey: featuredY ?? num[1]?.key ?? num[0]?.key ?? null,
    colorKey: featuredColor ?? null,
  };
}

export default function ExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('dataset');
  const initial = DATASETS.find((d) => d.id === initialId) ?? DATASETS[0];
  const [datasetId, setDatasetId] = useState(initial.id);
  const dataset = DATASETS.find((d) => d.id === datasetId)!;

  const [config, setConfig] = useState<ChartConfig>(() => defaultConfig(dataset));
  const [filters, setFilters] = useState<Filter[]>([]);

  useDocumentTitle(`Explorer · ${dataset.name}`);

  // Update URL when dataset changes
  useEffect(() => {
    if (searchParams.get('dataset') !== datasetId) {
      setSearchParams({ dataset: datasetId }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetId]);

  // reset chart config + filters when dataset changes
  const handleDatasetChange = (id: string) => {
    const next = DATASETS.find((d) => d.id === id)!;
    setDatasetId(id);
    setConfig(defaultConfig(next));
    setFilters([]);
  };

  const filteredRows = useMemo(() => applyFilters(dataset.rows, filters), [dataset, filters]);

  const xAttr = config.xKey ? attrByKey(dataset, config.xKey) : null;
  const yAttr = config.yKey ? attrByKey(dataset, config.yKey) : null;
  const colorAttr = config.colorKey ? attrByKey(dataset, config.colorKey) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Masthead
        section={dataset.name}
        eyebrow="Dataset Explorer"
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
          <div className="flex-1 min-h-[420px] bg-surface-subtle/30 p-2">
            <div className="w-full h-full bg-surface-raised rounded-lg shadow-editorial border border-surface-line" style={{ minHeight: 400 }}>
              {config.type === 'scatter' && xAttr && yAttr && (
                <ScatterView dataset={dataset} rows={filteredRows} xAttr={xAttr} yAttr={yAttr} colorAttr={colorAttr} />
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
      <span className="eyebrow text-ink-muted absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden sm:block whitespace-nowrap">Dataset</span>
      <select
        value={datasetId}
        onChange={(e) => onChange(e.target.value)}
        className="pl-7 pr-8 py-1.5 rounded-md border border-surface-line bg-surface-raised font-medium text-ink text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none appearance-none"
      >
        {DATASETS.map((d) => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>
      <div
        className={`absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${ACCENT_DOT[current.accent ?? 'sky'] ?? 'bg-ink-muted'}`}
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
