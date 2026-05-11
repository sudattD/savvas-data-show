import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Masthead from '../components/Masthead';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import {
  CHAPTERS,
  COURSE_TITLE,
  FORMAT_LABEL,
  FORMAT_BLURB,
  BUILT_COUNT,
  chaptersForCourse,
  chapterAnchorId,
} from '../data/chapters';
import type { CourseId, FormatCode, ChapterEntry } from '../data/chapters';
import { DATASETS } from '../data/registry';

const COURSE_ACCENT: Record<CourseId, { bar: string; chip: string; text: string }> = {
  algebra1: { bar: 'bg-sky-500', chip: 'bg-sky-50 text-sky-800 border-sky-200', text: 'text-sky-700' },
  geometry: { bar: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'text-emerald-700' },
  algebra2: { bar: 'bg-violet-500', chip: 'bg-violet-50 text-violet-800 border-violet-200', text: 'text-violet-700' },
};

const FORMAT_TONE: Record<FormatCode, string> = {
  CDS: 'bg-brand-50 text-brand-800 border-brand-200',
  SEN: 'bg-amber-50 text-amber-800 border-amber-200',
  GAM: 'bg-rose-50 text-rose-800 border-rose-200',
  POL: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  SIM: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  IMP: 'bg-pink-50 text-pink-800 border-pink-200',
  TML: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

type CourseFilter = 'all' | CourseId;

export default function ChaptersPage() {
  useDocumentTitle('Scope & sequence');
  const [filter, setFilter] = useState<CourseFilter>('all');
  const location = useLocation();

  // If we arrived with a chapter anchor in the URL, auto-select that
  // chapter's course so the row isn't filtered out, then scroll it into view.
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) return;
    const target = CHAPTERS.find((c) => chapterAnchorId(c) === hash);
    if (target) setFilter('all');
    requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-accent-400');
        window.setTimeout(() => el.classList.remove('ring-2', 'ring-accent-400'), 2200);
      }
    });
  }, [location.hash]);

  const courses = useMemo<CourseId[]>(
    () => filter === 'all' ? ['algebra1', 'geometry', 'algebra2'] : [filter],
    [filter],
  );

  const totals = useMemo(() => ({
    chapters: CHAPTERS.length,
    built: BUILT_COUNT,
    datasets: new Set(CHAPTERS.flatMap((c) => c.datasets)).size,
  }), []);

  return (
    <div className="min-h-screen">
      <Masthead section="Scope & Sequence" eyebrow="One activity per chapter · 3 courses · 35 chapters" />

      <section className="border-b border-surface-line bg-surface">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
          <div className="grid md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <div className="eyebrow text-accent-600 mb-3">The map</div>
              <h1 className="editorial-hero text-4xl md:text-5xl text-brand-900 leading-tight">
                Every chapter. <em className="not-italic text-accent-600">One activity.</em>
              </h1>
              <p className="mt-4 text-base md:text-lg text-ink-soft max-w-prose leading-relaxed">
                Across enVision Algebra 1, Geometry, and Algebra 2. Each
                activity earns its chapter through one of three rules: the
                chapter math fits the data's shape, the chapter math is how
                the data was made, or the chapter math is the lens that makes
                the activity readable.
              </p>
            </div>
            <div className="md:col-span-4 grid grid-cols-3 gap-2">
              <Tile label="chapters" value={totals.chapters} big />
              <Tile label="built" value={totals.built} />
              <Tile label="datasets" value={totals.datasets} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="eyebrow text-ink-muted mr-2">Filter:</span>
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterChip>
            <FilterChip active={filter === 'algebra1'} onClick={() => setFilter('algebra1')} accent="sky">Algebra 1</FilterChip>
            <FilterChip active={filter === 'geometry'} onClick={() => setFilter('geometry')} accent="emerald">Geometry</FilterChip>
            <FilterChip active={filter === 'algebra2'} onClick={() => setFilter('algebra2')} accent="violet">Algebra 2</FilterChip>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {courses.map((c) => (
          <CourseSection key={c} course={c} />
        ))}

        <FormatLegend />
      </main>

      <footer className="border-t border-surface-line py-6 text-center text-xs text-ink-muted">
        Source: <code className="font-mono">chapter_activities.md</code>. Built activities link to the prototype; concept activities link to the underlying dataset where one exists.
      </footer>
    </div>
  );
}

function CourseSection({ course }: { course: CourseId }) {
  const entries = chaptersForCourse(course);
  const accent = COURSE_ACCENT[course];

  return (
    <section>
      <div className="flex items-baseline gap-4 mb-5">
        <div className={`h-1 w-12 ${accent.bar} rounded`} />
        <h2 className={`font-display text-2xl md:text-3xl font-bold ${accent.text}`}>
          {COURSE_TITLE[course]}
        </h2>
        <div className="text-xs text-ink-muted font-mono">{entries.length} topics</div>
      </div>

      <div className="grid gap-3">
        {entries.map((entry) => (
          <ChapterRow key={`${entry.course}-${entry.topic}`} entry={entry} />
        ))}
      </div>
    </section>
  );
}

function ChapterRow({ entry }: { entry: ChapterEntry }) {
  const accent = COURSE_ACCENT[entry.course];
  const datasetObjs = entry.datasets.map((id) => DATASETS.find((d) => d.id === id)).filter(Boolean) as { id: string; name: string }[];
  const isBuilt = !!entry.route;
  const nothingToDo = !isBuilt && datasetObjs.length === 0;

  return (
    <article
      id={chapterAnchorId(entry)}
      className={`group bg-surface-raised border ${isBuilt ? 'border-surface-line hover:border-brand-300' : 'border-surface-line/70'} rounded-lg overflow-hidden transition scroll-mt-24`}
    >
      <div className="grid md:grid-cols-[120px_1fr_220px] gap-0 items-stretch">
        {/* Topic label */}
        <div className={`px-4 py-4 md:py-5 border-b md:border-b-0 md:border-r border-surface-line ${accent.chip} flex md:flex-col md:items-start items-baseline gap-2 md:gap-1`}>
          <div className="eyebrow text-[10px] opacity-70">Topic</div>
          <div className="font-display text-2xl font-bold leading-none tabular-nums">{entry.topic}</div>
          {entry.flagship && (
            <div className="ml-auto md:ml-0 text-[9px] eyebrow bg-accent-500 text-white px-1.5 py-0.5 rounded">
              flagship
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-4 min-w-0">
          <div className="flex items-baseline gap-3 mb-1">
            <div className="eyebrow text-ink-muted">{entry.topicName}</div>
            {!isBuilt && (
              <span className="text-[9px] eyebrow text-ink-muted bg-surface-subtle border border-surface-line px-1.5 py-0.5 rounded">
                Design brief
              </span>
            )}
          </div>
          <h3 className="font-display text-lg font-bold text-brand-900 leading-snug mb-1.5">
            {entry.activity}
          </h3>
          <p className="text-sm text-ink leading-relaxed mb-2">{entry.blurb}</p>
          <p className="text-xs text-ink-muted leading-relaxed italic">{entry.connection}</p>

          {entry.design && (
            <details className="mt-3 group/brief">
              <summary className="cursor-pointer text-[11px] eyebrow text-brand-700 hover:text-accent-700 select-none inline-flex items-center gap-1">
                <span className="group-open/brief:hidden">Read the design brief ▾</span>
                <span className="hidden group-open/brief:inline">Hide design brief ▴</span>
              </summary>
              <div className="mt-2.5 space-y-2 pl-3 border-l-2 border-surface-line">
                <div>
                  <div className="text-[10px] eyebrow text-ink-muted mb-0.5">Act 1 · The opening</div>
                  <p className="text-xs text-ink leading-relaxed">{entry.design.hook}</p>
                </div>
                <div>
                  <div className="text-[10px] eyebrow text-ink-muted mb-0.5">Act 3 · The reveal</div>
                  <p className="text-xs text-ink leading-relaxed">{entry.design.reveal}</p>
                </div>
              </div>
            </details>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {entry.format.map((f) => (
              <span
                key={f}
                title={`${FORMAT_LABEL[f]} — ${FORMAT_BLURB[f]}`}
                className={`text-[10px] eyebrow px-2 py-0.5 rounded border ${FORMAT_TONE[f]}`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* CTA stack */}
        <div className="px-4 py-4 md:py-5 border-t md:border-t-0 md:border-l border-surface-line bg-surface-subtle/30 flex flex-col gap-2 items-stretch justify-center">
          {isBuilt && (
            <Link
              to={entry.route!}
              className="inline-flex items-center justify-between gap-1.5 px-3 py-2 rounded-md bg-brand-900 text-white text-sm font-semibold hover:bg-brand-700 transition shadow-sm"
            >
              <span>Open activity</span>
              <span aria-hidden>→</span>
            </Link>
          )}
          {datasetObjs.map((d) => (
            <Link
              key={d.id}
              to={`/explorer?dataset=${d.id}`}
              className="inline-flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-md bg-surface-raised border border-surface-line text-ink-soft text-xs font-semibold hover:bg-surface-subtle hover:text-brand-700 hover:border-brand-300 transition"
              title={`Open the explorer with the ${d.name} dataset`}
            >
              <span className="truncate">Explore {d.name}</span>
              <span aria-hidden className="shrink-0">→</span>
            </Link>
          ))}
          {nothingToDo && (
            <span className="text-[10px] eyebrow text-ink-muted text-center italic px-2 py-2">
              Concept · not yet built
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function FormatLegend() {
  const codes: FormatCode[] = ['CDS', 'SEN', 'GAM', 'POL', 'SIM', 'IMP', 'TML'];
  return (
    <section className="bg-surface-raised border border-surface-line rounded-lg p-5">
      <div className="eyebrow text-ink-muted mb-3">Format codes</div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {codes.map((c) => (
          <div key={c} className="flex items-start gap-2.5">
            <span className={`text-[10px] eyebrow px-2 py-0.5 rounded border ${FORMAT_TONE[c]} shrink-0`}>{c}</span>
            <div>
              <div className="text-xs font-semibold text-ink">{FORMAT_LABEL[c]}</div>
              <div className="text-[11px] text-ink-muted leading-snug">{FORMAT_BLURB[c]}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
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

function FilterChip({
  active, onClick, children, accent,
}: { active: boolean; onClick: () => void; children: React.ReactNode; accent?: 'sky' | 'emerald' | 'violet' }) {
  const activeBg =
    accent === 'sky' ? 'bg-sky-600 text-white border-sky-600' :
    accent === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600' :
    accent === 'violet' ? 'bg-violet-600 text-white border-violet-600' :
    'bg-brand-900 text-white border-brand-900';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition ${
        active ? activeBg : 'bg-surface-raised border-surface-line text-ink-soft hover:bg-surface-subtle'
      }`}
    >
      {children}
    </button>
  );
}
