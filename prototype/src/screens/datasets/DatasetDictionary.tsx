import { Link, useParams } from 'react-router-dom';
import { DATASETS } from '../../data/registry';
import {
  numericStats,
  categoricalCounts,
  type Attribute,
  type Dataset,
  type Provenance,
  type Row,
} from '../../lib/dataset';
import Masthead from '../../components/Masthead';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

const ACCENT_BAR: Record<string, string> = {
  sky: 'bg-sky-500', emerald: 'bg-emerald-500', cyan: 'bg-cyan-500', amber: 'bg-accent-500',
  rose: 'bg-rose-500', violet: 'bg-violet-500', indigo: 'bg-indigo-500', pink: 'bg-pink-500',
  orange: 'bg-orange-500', teal: 'bg-teal-500', slate: 'bg-brand-700',
};

export default function DatasetDictionary() {
  const { id } = useParams<{ id: string }>();
  const dataset = DATASETS.find((d) => d.id === id);
  useDocumentTitle(dataset ? `${dataset.name} · Dictionary` : 'Dictionary');

  if (!dataset) {
    return (
      <div className="min-h-screen">
        <Masthead />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="font-display text-2xl font-bold text-brand-900 mb-2">Dataset not found</div>
          <Link to="/datasets" className="text-accent-700 underline font-semibold">Back to library</Link>
        </div>
      </div>
    );
  }

  const accent = dataset.accent ?? 'sky';

  return (
    <div className="min-h-screen">
      <Masthead section={dataset.name} eyebrow="Data dictionary" />

      <section className="border-b border-surface-line bg-surface relative overflow-hidden">
        <div className={`absolute inset-x-0 top-0 h-1 ${ACCENT_BAR[accent]}`} />
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-10">
          <div className="eyebrow text-accent-600 mb-3">What every column means</div>
          <h1 className="editorial-hero text-3xl md:text-5xl text-brand-900 mb-4">
            {dataset.name}
            <span className="text-ink-muted"> · </span>
            <em className="not-italic text-accent-600">data dictionary</em>
          </h1>
          <p className="text-base md:text-lg text-ink-soft max-w-prose leading-relaxed">
            Every column in this dataset, with its meaning, units, and the range
            of values you'll see. Read this before plotting anything.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mt-6">
            <Stat label="Columns" value={dataset.attributes.length} />
            <Stat label="Rows" value={dataset.rows.length.toLocaleString()} />
            <Stat label="Numeric" value={dataset.attributes.filter((a) => a.kind === 'numeric').length} />
            <Stat label="Categorical" value={dataset.attributes.filter((a) => a.kind === 'categorical').length} />
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <ProvenanceStrip provenance={dataset.provenance} datasetId={dataset.id} />

        <section className="space-y-3">
          {dataset.attributes.map((attr) => (
            <AttributeCard key={attr.key} attr={attr} dataset={dataset} />
          ))}
        </section>

        <SampleRowsTable dataset={dataset} />

        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <Link
            to={`/explorer?dataset=${dataset.id}`}
            className="px-7 py-3 rounded-md bg-brand-900 text-white font-semibold shadow-editorial hover:bg-brand-700 transition flex items-center gap-2"
          >
            Open in the Explorer <span aria-hidden>→</span>
          </Link>
          <Link
            to={`/datasets/${dataset.id}`}
            className="px-5 py-3 rounded-md bg-surface-raised border border-surface-line text-ink-soft font-semibold hover:bg-surface-subtle transition"
          >
            Read the story
          </Link>
          <Link
            to="/datasets"
            className="px-5 py-3 rounded-md bg-surface-raised border border-surface-line text-ink-soft font-semibold hover:bg-surface-subtle transition"
          >
            Back to library
          </Link>
        </div>
      </main>
    </div>
  );
}

function AttributeCard({ attr, dataset }: { attr: Attribute; dataset: Dataset }) {
  const values = dataset.rows.map((r) => r[attr.key]);

  return (
    <article className="bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
      <header className="px-5 py-3 border-b border-surface-line bg-surface-subtle/40 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-display text-lg font-bold text-brand-900">{attr.label}</h3>
        <code className="font-mono text-xs text-ink-muted bg-surface-subtle px-1.5 py-0.5 rounded">
          {attr.key}
        </code>
        <span
          className={`text-[10px] eyebrow px-2 py-0.5 rounded ${
            attr.kind === 'numeric' ? 'bg-brand-50 text-brand-700' : 'bg-accent-50 text-accent-700'
          }`}
        >
          {attr.kind === 'numeric' ? 'numeric' : 'categorical'}
        </span>
        {attr.unit && (
          <span className="font-mono text-xs text-ink-muted">unit: {attr.unit}</span>
        )}
      </header>

      <div className="px-5 py-4 grid md:grid-cols-[1fr_auto] gap-x-8 gap-y-4">
        <div>
          <div className="eyebrow text-ink-muted mb-1">Meaning</div>
          {attr.description ? (
            <p className="text-sm text-ink leading-relaxed">{attr.description}</p>
          ) : (
            <p className="text-sm text-ink-muted italic leading-relaxed">
              No description authored yet — see the dataset story for context, or
              the primary source link above.
            </p>
          )}
        </div>
        <div className="md:min-w-[280px]">
          {attr.kind === 'numeric' ? (
            <NumericSummary values={values} unit={attr.unit} />
          ) : (
            <CategoricalSummary values={values} />
          )}
        </div>
      </div>
    </article>
  );
}

function NumericSummary({ values, unit }: { values: (number | string | null)[]; unit?: string }) {
  const nums = values.map((v) => (typeof v === 'number' ? v : Number(v))).filter((n) => Number.isFinite(n));
  const stats = numericStats(nums);
  const fmt = (n: number) => {
    if (!Number.isFinite(n)) return '—';
    const abs = Math.abs(n);
    if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    if (abs >= 10000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (abs >= 1) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return n.toFixed(3);
  };

  if (!stats) {
    return <div className="text-xs text-ink-muted italic">No numeric values.</div>;
  }

  const u = unit ? ` ${unit}` : '';
  return (
    <div className="bg-surface-subtle/50 border border-surface-line rounded-md p-3 text-xs">
      <div className="eyebrow text-ink-muted mb-2">Range across {stats.count.toLocaleString()} rows</div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono tabular-nums text-ink">
        <Cell k="min">{fmt(stats.min)}{u}</Cell>
        <Cell k="max">{fmt(stats.max)}{u}</Cell>
        <Cell k="mean">{fmt(stats.mean)}{u}</Cell>
        <Cell k="median">{fmt(stats.median)}{u}</Cell>
        <Cell k="q1">{fmt(stats.q1)}{u}</Cell>
        <Cell k="q3">{fmt(stats.q3)}{u}</Cell>
      </div>
    </div>
  );
}

function CategoricalSummary({ values }: { values: (number | string | null)[] }) {
  const counts = categoricalCounts(values);
  const total = Array.from(counts.values()).reduce((s, n) => s + n, 0);
  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 5);
  const more = sorted.length - top.length;

  return (
    <div className="bg-surface-subtle/50 border border-surface-line rounded-md p-3 text-xs">
      <div className="eyebrow text-ink-muted mb-2">
        {sorted.length.toLocaleString()} unique value{sorted.length === 1 ? '' : 's'} · {total.toLocaleString()} rows
      </div>
      <ul className="space-y-1">
        {top.map(([val, count]) => {
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <li key={val} className="flex items-center justify-between gap-3">
              <span className="text-ink truncate" title={val}>{val || <span className="italic text-ink-muted">(empty)</span>}</span>
              <span className="font-mono tabular-nums text-ink-muted shrink-0">
                {count.toLocaleString()} · {pct.toFixed(0)}%
              </span>
            </li>
          );
        })}
        {more > 0 && (
          <li className="pt-1 mt-1 border-t border-surface-line text-ink-muted italic">
            …and {more.toLocaleString()} more
          </li>
        )}
      </ul>
    </div>
  );
}

function Cell({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[10px] eyebrow text-ink-muted">{k}</span>
      <span className="text-ink">{children}</span>
    </div>
  );
}

function SampleRowsTable({ dataset }: { dataset: Dataset }) {
  const sample: Row[] = dataset.rows.slice(0, 5);
  return (
    <section className="bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
      <header className="px-5 py-3 border-b border-surface-line bg-surface-subtle/40">
        <div className="eyebrow text-ink-muted">First 5 rows</div>
        <div className="text-xs text-ink-muted mt-0.5">
          What the raw data looks like. Open the Explorer for the full table.
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-surface-subtle/30 border-b border-surface-line">
            <tr>
              {dataset.attributes.map((a) => (
                <th key={a.key} className="text-left px-3 py-2 font-mono text-ink-muted whitespace-nowrap">
                  {a.key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sample.map((row, i) => (
              <tr key={i} className="border-b border-surface-line last:border-0">
                {dataset.attributes.map((a) => {
                  const v = row[a.key];
                  return (
                    <td key={a.key} className="px-3 py-1.5 text-ink whitespace-nowrap">
                      {v === null || v === undefined || v === ''
                        ? <span className="text-ink-muted italic">—</span>
                        : typeof v === 'number'
                          ? <span className="font-mono tabular-nums">{v}</span>
                          : String(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProvenanceStrip({ provenance: p, datasetId }: { provenance: Provenance; datasetId: string }) {
  return (
    <section className="bg-surface-raised border border-surface-line rounded-lg px-5 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
        <div>
          <div className="eyebrow text-ink-muted">Where this data came from</div>
          <div className="text-sm text-ink mt-0.5">
            <a
              href={p.primarySourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 hover:text-accent-700 hover:underline font-semibold"
            >
              {p.primarySource}
            </a>
            {p.collectionPeriod && <span className="text-ink-muted"> · {p.collectionPeriod}</span>}
          </div>
        </div>
        <Link
          to={`/datasets/${datasetId}`}
          className="text-xs eyebrow text-accent-700 hover:underline"
        >
          Full provenance →
        </Link>
      </div>
      {p.caveats && p.caveats.length > 0 && (
        <div className="text-xs text-ink-soft border-t border-surface-line pt-3 mt-1">
          <span className="eyebrow text-ink-muted mr-2">Caveats:</span>
          {p.caveats[0]}
          {p.caveats.length > 1 && (
            <Link to={`/datasets/${datasetId}`} className="text-ink-muted ml-1 underline-offset-2 hover:underline">
              (+{p.caveats.length - 1} more)
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface-raised border border-surface-line rounded-lg px-3 py-2.5">
      <div className="eyebrow text-ink-muted text-[9px] mb-1">{label}</div>
      <div className="font-display font-bold text-brand-900 tabular-nums text-xl">{value}</div>
    </div>
  );
}
