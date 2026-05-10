import { Link } from 'react-router-dom';
import { DATASETS } from '../../data/registry';
import Masthead from '../../components/Masthead';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

const ACCENT_BAR: Record<string, string> = {
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

export default function DatasetsHub() {
  useDocumentTitle('Datasets');
  return (
    <div className="min-h-screen">
      <Masthead section="The Dataset Library" eyebrow="Real · sourced · IP-clean" />

      <section className="border-b border-surface-line bg-surface">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-10">
          <div className="grid md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <div className="eyebrow text-accent-600 mb-3">The library</div>
              <h1 className="editorial-hero text-4xl md:text-6xl text-brand-900">
                {DATASETS.length} real datasets.<br />
                <em className="not-italic text-accent-600">Every value</em> verifiable.
              </h1>
              <p className="mt-5 text-lg text-ink-soft max-w-prose leading-relaxed">
                NOAA, NASA, USGS, World Bank, the Social Security Administration,
                Wikipedia, the Boston Athletic Association, the Palmer LTER. Click a
                dataset to read where it came from before you start exploring.
              </p>
            </div>
            <div className="md:col-span-4 grid grid-cols-3 gap-2">
              <Tile label="datasets" value={DATASETS.length} big />
              <Tile label="rows total" value={DATASETS.reduce((s, d) => s + d.rows.length, 0)} />
              <Tile label="cc-clean" value={'100%'} />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DATASETS.map((d) => {
            const accent = d.accent ?? 'sky';
            const numericCount = d.attributes.filter((a) => a.kind === 'numeric').length;
            const catCount = d.attributes.filter((a) => a.kind === 'categorical').length;
            return (
              <Link
                key={d.id}
                to={`/datasets/${d.id}`}
                className="group block bg-surface-raised border border-surface-line rounded-lg overflow-hidden hover:shadow-editorial hover:-translate-y-0.5 transition"
              >
                <div className={`h-1 ${ACCENT_BAR[accent]}`} />
                <div className="p-5">
                  <div className="eyebrow text-ink-muted mb-2">{d.provenance.primarySource.split(' ').slice(0, 4).join(' ').replace(/—.*$/, '').trim()}</div>
                  <h2 className="font-display text-xl font-bold text-brand-900 leading-tight mb-2">
                    {d.name}
                  </h2>
                  <p className="text-sm text-ink-soft leading-relaxed line-clamp-3 mb-4">{d.description}</p>
                  <div className="flex items-center gap-3 text-[10px] eyebrow text-ink-muted pt-3 border-t border-surface-line font-mono">
                    <span><strong className="text-ink">{d.rows.length.toLocaleString()}</strong> rows</span>
                    <span className="text-surface-line">|</span>
                    <span><strong className="text-ink">{numericCount}</strong> num</span>
                    <span className="text-surface-line">|</span>
                    <span><strong className="text-ink">{catCount}</strong> cat</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function Tile({ label, value, big }: { label: string; value: number | string; big?: boolean }) {
  return (
    <div className={`rounded-lg bg-surface-raised border border-surface-line p-3 ${big ? 'ring-2 ring-accent-200' : ''}`}>
      <div className="font-display font-black text-brand-900 text-3xl tabular-nums leading-none">{value}</div>
      <div className="eyebrow text-ink-muted mt-2">{label}</div>
    </div>
  );
}
