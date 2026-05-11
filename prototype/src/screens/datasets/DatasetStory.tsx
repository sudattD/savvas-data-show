import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DATASETS } from '../../data/registry';
import type { Provenance, StoryBeat, DatasetFamily } from '../../lib/dataset';
import { datasetAccent, FAMILY_LABEL } from '../../lib/dataset';
import Masthead from '../../components/Masthead';
import DatasetSparkline from '../../components/DatasetSparkline';
import ChapterFitsSection from '../../components/ChapterFitsSection';
import { chaptersForDataset, chapterAnchorId, COURSE_TITLE } from '../../data/chapters';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

const ACCENT_BAR: Record<string, string> = {
  sky: 'bg-sky-500', emerald: 'bg-emerald-500', cyan: 'bg-cyan-500', amber: 'bg-accent-500',
  rose: 'bg-rose-500', violet: 'bg-violet-500', indigo: 'bg-indigo-500', pink: 'bg-pink-500',
  orange: 'bg-orange-500', teal: 'bg-teal-500', slate: 'bg-brand-700',
};

const ACCENT_HIGHLIGHT: Record<string, string> = {
  sky: 'bg-sky-50 text-sky-900 border-sky-200',
  emerald: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  cyan: 'bg-cyan-50 text-cyan-900 border-cyan-200',
  amber: 'bg-accent-50 text-accent-900 border-accent-200',
  rose: 'bg-rose-50 text-rose-900 border-rose-200',
  violet: 'bg-violet-50 text-violet-900 border-violet-200',
  indigo: 'bg-indigo-50 text-indigo-900 border-indigo-200',
  pink: 'bg-pink-50 text-pink-900 border-pink-200',
  orange: 'bg-orange-50 text-orange-900 border-orange-200',
  teal: 'bg-teal-50 text-teal-900 border-teal-200',
  slate: 'bg-brand-50 text-brand-900 border-brand-200',
};

export default function DatasetStory() {
  const { id } = useParams<{ id: string }>();
  const dataset = DATASETS.find((d) => d.id === id);
  const [step, setStep] = useState(0);
  useDocumentTitle(dataset ? dataset.name : 'Dataset');

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

  const accent = datasetAccent(dataset);
  const familyLabel = dataset.family ? FAMILY_LABEL[dataset.family as DatasetFamily] : null;
  const story = dataset.story ?? [];
  const totalSteps = story.length;
  const visibleBeats = story.slice(0, step + 1);
  const moreToShow = step < totalSteps - 1;
  const numericAttrs = dataset.attributes.filter((x) => x.kind === 'numeric');
  const catAttrs = dataset.attributes.filter((x) => x.kind === 'categorical');

  return (
    <div className="min-h-screen">
      <Masthead section={dataset.name} eyebrow="Dataset story" />

      {/* Hero — editorial */}
      <section className="border-b border-surface-line bg-surface relative overflow-hidden">
        <div className={`absolute inset-x-0 top-0 h-1 ${ACCENT_BAR[accent]}`} />
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-12">
          <div className="eyebrow text-accent-600 mb-4">
            Dataset · #{String(DATASETS.findIndex((d) => d.id === dataset.id) + 1).padStart(2, '0')}
            {familyLabel && <span className="text-ink-muted"> · {familyLabel}</span>}
          </div>
          <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
            <div>
              <h1 className="editorial-hero text-4xl md:text-6xl text-brand-900 mb-5">
                {dataset.name}
              </h1>
              <p className="text-lg md:text-xl text-ink-soft max-w-prose leading-relaxed mb-6">
                {dataset.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Link
                  to={`/explorer?dataset=${dataset.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand-900 text-white font-semibold shadow-editorial hover:bg-brand-700 transition text-sm"
                >
                  Explore in table + charts <span aria-hidden>→</span>
                </Link>
                <span className="text-xs text-ink-muted">Tabular view · scatter · histogram · bar · box plot · filters</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl">
                <Stat label="Rows" value={dataset.rows.length.toLocaleString()} mono />
                <Stat label="Numeric" value={numericAttrs.length} mono />
                <Stat label="Categorical" value={catAttrs.length} mono />
                <Stat label="Source" value={dataset.provenance.primarySource.split('—')[0].trim()} />
              </div>
            </div>
            <div className="md:pt-1">
              <div className="eyebrow text-ink-muted mb-2">A first look</div>
              <DatasetSparkline dataset={dataset} height={220} />
              {dataset.featured && (
                <div className="font-mono text-[10px] text-ink-muted mt-2 leading-relaxed">
                  {dataset.featured.x} × {dataset.featured.y}
                  {dataset.featured.color && ` · grouped by ${dataset.featured.color}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {/* Story beats */}
        {story.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-6 gap-4">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-900">The story</h2>
              <BeatDots total={totalSteps} current={step} onJump={setStep} accent={accent} />
            </div>
            <div className="space-y-5">
              {visibleBeats.map((b, i) => <Beat key={i} beat={b} accent={accent} />)}
            </div>
            <div className="mt-6 min-h-[44px] relative flex justify-center items-center">
              <button
                onClick={() => setStep((s) => Math.min(s + 1, totalSteps - 1))}
                aria-hidden={!moreToShow}
                tabIndex={moreToShow ? 0 : -1}
                className={`px-6 py-2.5 rounded-md bg-brand-900 text-white font-semibold text-sm hover:bg-brand-700 transition-opacity duration-200 flex items-center gap-2 ${
                  moreToShow ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'
                }`}
              >
                Continue <span aria-hidden>→</span>
              </button>
              <div
                aria-hidden={moreToShow}
                className={`text-center text-xs eyebrow text-ink-muted transition-opacity duration-200 ${
                  moreToShow ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'
                }`}
              >
                End of story · provenance below
              </div>
            </div>
          </section>
        )}

        {/* Chapters that use this dataset (cross-link into /chapters) */}
        <ChapterCrosslink datasetId={dataset.id} />

        {/* Chapter fits — teacher + student views */}
        <ChapterFitsSection dataset={dataset} />

        {/* Provenance */}
        <ProvenanceCard provenance={dataset.provenance} />

        {/* Attributes */}
        <section className="bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-line bg-surface-subtle/40">
            <div className="eyebrow text-ink-muted">Shape of the data</div>
            <div className="font-display text-lg font-bold text-brand-900 mt-0.5">{dataset.attributes.length} columns × {dataset.rows.length.toLocaleString()} rows</div>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-surface-line">
              <tr>
                <th className="text-left eyebrow text-ink-muted px-5 py-2">Column</th>
                <th className="text-left eyebrow text-ink-muted px-5 py-2">Kind</th>
                <th className="text-left eyebrow text-ink-muted px-5 py-2">Unit</th>
              </tr>
            </thead>
            <tbody>
              {dataset.attributes.map((attr) => (
                <tr key={attr.key} className="border-b border-surface-line last:border-0">
                  <td className="px-5 py-2 font-semibold text-ink">{attr.label}</td>
                  <td className="px-5 py-2">
                    <span className={`text-[10px] eyebrow px-2 py-0.5 rounded ${attr.kind === 'numeric' ? 'bg-brand-50 text-brand-700' : 'bg-accent-50 text-accent-700'}`}>
                      {attr.kind === 'numeric' ? 'numeric' : 'category'}
                    </span>
                  </td>
                  <td className="px-5 py-2 text-ink-muted font-mono text-xs">{attr.unit ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Action */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to={`/explorer?dataset=${dataset.id}`}
            className="px-7 py-3 rounded-md bg-brand-900 text-white font-semibold shadow-editorial hover:bg-brand-700 transition flex items-center gap-2"
          >
            Open in the Explorer <span aria-hidden>→</span>
          </Link>
          <Link
            to={`/datasets/${dataset.id}/dictionary`}
            className="px-5 py-3 rounded-md bg-surface-raised border border-surface-line text-ink-soft font-semibold hover:bg-surface-subtle transition"
          >
            Data dictionary
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

function BeatDots({
  total, current, onJump, accent,
}: { total: number; current: number; onJump: (n: number) => void; accent: string }) {
  const onColor = ACCENT_BAR[accent] ?? 'bg-brand-700';
  return (
    <div className="flex items-center gap-2 shrink-0" role="tablist" aria-label="Story beats">
      {Array.from({ length: total }, (_, i) => {
        const seen = i <= current;
        const isCurrent = i === current;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isCurrent}
            aria-label={`Beat ${i + 1} of ${total}`}
            onClick={() => onJump(i)}
            className={`transition-all rounded-full ${
              isCurrent
                ? `w-6 h-2.5 ${onColor}`
                : seen
                  ? `w-2.5 h-2.5 ${onColor} opacity-60 hover:opacity-100`
                  : 'w-2.5 h-2.5 bg-surface-line hover:bg-ink-muted/40'
            }`}
          />
        );
      })}
      <span className="font-mono text-[10px] text-ink-muted ml-2 tabular-nums">
        {current + 1}/{total}
      </span>
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div className="bg-surface-raised border border-surface-line rounded-lg px-3 py-2.5">
      <div className="eyebrow text-ink-muted text-[9px] mb-1">{label}</div>
      <div className={`font-display font-bold text-brand-900 ${mono ? 'tabular-nums text-xl' : 'text-sm leading-tight'}`}>
        {value}
      </div>
    </div>
  );
}

function Beat({ beat, accent }: { beat: StoryBeat; accent: string }) {
  return (
    <div className="bg-surface-raised border border-surface-line rounded-lg p-6">
      {beat.heading && (
        <h3 className="font-display text-xl md:text-2xl font-bold text-brand-900 mb-3 leading-tight">{beat.heading}</h3>
      )}
      <p className="text-base text-ink leading-relaxed">{beat.body}</p>
      {beat.highlight && (
        <div className={`mt-4 inline-block px-3 py-1.5 rounded-md font-mono text-xs border ${ACCENT_HIGHLIGHT[accent] ?? ACCENT_HIGHLIGHT.sky}`}>
          {beat.highlight}
        </div>
      )}
    </div>
  );
}

function ProvenanceCard({ provenance: p }: { provenance: Provenance }) {
  return (
    <section className="bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-surface-line bg-surface-subtle/40">
        <div className="eyebrow text-ink-muted">Data provenance</div>
        <div className="text-xs text-ink-muted mt-0.5">Where this came from. How to verify it.</div>
      </div>
      <div className="px-5 py-5 grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
        <Row label="Primary source">
          <a href={p.primarySourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:text-accent-700 hover:underline font-semibold">
            {p.primarySource}
          </a>
        </Row>
        {p.collector && <Row label="Collected by">{p.collector}</Row>}
        {p.collectionMethod && <Row label="How it's measured" wide>{p.collectionMethod}</Row>}
        {p.collectionPeriod && <Row label="When collected">{p.collectionPeriod}</Row>}
        <Row label="When we pulled it">{p.retrievalDate}</Row>
        <Row label="How we pulled it" wide><span className="font-mono text-xs">{p.retrievalMethod}</span></Row>
        <Row label="License">{p.license}</Row>
        {p.citation && <Row label="Citation" wide><span className="text-xs italic">{p.citation}</span></Row>}
      </div>
      {p.caveats && p.caveats.length > 0 && (
        <div className="px-5 py-4 bg-accent-50 border-t border-accent-200">
          <div className="eyebrow text-accent-800 mb-2">Caveats</div>
          <ul className="text-xs text-accent-900 space-y-1.5 pl-4 list-disc leading-relaxed">
            {p.caveats.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

function Row({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <div className="eyebrow text-ink-muted mb-1">{label}</div>
      <div className="text-ink leading-relaxed">{children}</div>
    </div>
  );
}


function ChapterCrosslink({ datasetId }: { datasetId: string }) {
  const fits = chaptersForDataset(datasetId);
  if (fits.length === 0) return null;

  return (
    <section className="bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
      <header className="px-5 py-3 border-b border-surface-line bg-surface-subtle/40 flex items-baseline justify-between gap-3">
        <div>
          <div className="eyebrow text-ink-muted">Chapters that use this dataset</div>
          <div className="text-xs text-ink-muted mt-0.5">
            {fits.length === 1 ? '1 chapter draws on this data' : `${fits.length} chapters draw on this data`}
          </div>
        </div>
        <Link
          to="/chapters"
          className="text-xs eyebrow text-brand-700 hover:text-accent-700 hover:underline whitespace-nowrap"
        >
          Full scope &amp; sequence →
        </Link>
      </header>
      <ul className="divide-y divide-surface-line">
        {fits.map((c) => (
          <li key={chapterAnchorId(c)} className="px-5 py-3 flex items-baseline gap-3">
            <div className="text-[10px] eyebrow text-ink-muted font-mono shrink-0 w-20">
              {COURSE_TITLE[c.course]} · T{c.topic}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink truncate">{c.activity}</div>
              <div className="text-xs text-ink-muted truncate">{c.topicName}</div>
            </div>
            {c.route ? (
              <Link
                to={c.route}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline whitespace-nowrap shrink-0"
              >
                Open activity →
              </Link>
            ) : (
              <Link
                to={`/chapters#${chapterAnchorId(c)}`}
                className="text-xs font-semibold text-brand-700 hover:text-accent-700 hover:underline whitespace-nowrap shrink-0"
              >
                See concept →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
