import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Masthead from '../components/Masthead';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import {
  COURSE_TITLE,
  chaptersForCourse,
  chapterAnchorId,
  envisionVideoUrl,
} from '../data/chapters';
import type { CourseId, ChapterEntry } from '../data/chapters';
import { ALIGNMENT, alignmentFor, strengthCount } from '../data/act1Alignment';
import type { AlignmentStrength } from '../data/act1Alignment';
import { DATASETS } from '../data/registry';

const COURSE_ACCENT: Record<CourseId, { bar: string; text: string }> = {
  algebra1: { bar: 'bg-sky-500', text: 'text-sky-700' },
  geometry: { bar: 'bg-emerald-500', text: 'text-emerald-700' },
  algebra2: { bar: 'bg-violet-500', text: 'text-violet-700' },
};

const STRENGTH_LABEL: Record<AlignmentStrength, string> = {
  strong: 'Strong fit',
  possible: 'Possible fit',
  weak: 'Pure math · no data extension',
};
const STRENGTH_TONE: Record<AlignmentStrength, string> = {
  strong: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  possible: 'bg-accent-50 text-accent-800 border-accent-200',
  weak: 'bg-surface-subtle text-ink-muted border-surface-line',
};
const STRENGTH_DOT: Record<AlignmentStrength, string> = {
  strong: 'bg-emerald-500',
  possible: 'bg-accent-500',
  weak: 'bg-slate-300',
};

type StrengthFilter = 'all' | AlignmentStrength;

export default function AlignmentPage() {
  useDocumentTitle('3-Act + real data');
  const [strengthFilter, setStrengthFilter] = useState<StrengthFilter>('all');
  const [courseFilter, setCourseFilter] = useState<'all' | CourseId>('all');

  const courses: CourseId[] = useMemo(
    () => courseFilter === 'all' ? ['algebra1', 'geometry', 'algebra2'] : [courseFilter],
    [courseFilter],
  );

  const visibleCount = ALIGNMENT.filter((r) => {
    if (courseFilter !== 'all' && r.course !== courseFilter) return false;
    if (strengthFilter !== 'all' && r.strength !== strengthFilter) return false;
    return true;
  }).length;

  return (
    <div className="min-h-screen">
      <Masthead section="3-Act + real data" eyebrow="An alignment between Savvas's Act 1 and a real-data Act 1.5" />

      <section className="border-b border-surface-line bg-surface">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
          <div className="grid md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <div className="eyebrow text-accent-600 mb-3">The alternative approach</div>
              <h1 className="editorial-hero text-4xl md:text-5xl text-brand-900 leading-tight">
                Keep their <em className="not-italic text-accent-600">Act 1.</em><br />
                Add <em className="not-italic text-emerald-700">Act 1.5</em> — real data.
              </h1>
              <p className="mt-4 text-base md:text-lg text-ink-soft max-w-prose leading-relaxed">
                Every chapter of enVision Algebra 1, Geometry, and Algebra 2 already
                ships with a dramatized Savvas 3-Act Math video — the kids in the
                classroom, the cans clinking, the basketball arcs, the flute on a
                sine wave. The hook works. What if we kept that hook and added a
                real-data exploration that picks up where it leaves off?
              </p>
              <p className="mt-3 text-base md:text-lg text-ink-soft max-w-prose leading-relaxed">
                Below: every Savvas Act 1 video paired with the real-data
                continuation it implies. Strong fits ({strengthCount('strong')})
                are ready or near-ready in our prototype. Possible fits
                ({strengthCount('possible')}) need a small new dataset.
                The rest ({strengthCount('weak')}) are pure-math hooks
                without a natural real-world extension.
              </p>
            </div>
            <div className="md:col-span-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Tile label="strong" value={strengthCount('strong')} tone="emerald" />
                <Tile label="possible" value={strengthCount('possible')} tone="accent" />
                <Tile label="abstract" value={strengthCount('weak')} tone="muted" />
              </div>
              <Link
                to="/chapters"
                className="block text-center text-xs font-semibold text-brand-700 hover:text-accent-700 hover:underline"
              >
                See the full scope-and-sequence on /chapters →
              </Link>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow text-ink-muted mr-2 w-14">Course</span>
              <FilterChip active={courseFilter === 'all'} onClick={() => setCourseFilter('all')}>All</FilterChip>
              <FilterChip active={courseFilter === 'algebra1'} onClick={() => setCourseFilter('algebra1')} accent="sky">Algebra 1</FilterChip>
              <FilterChip active={courseFilter === 'geometry'} onClick={() => setCourseFilter('geometry')} accent="emerald">Geometry</FilterChip>
              <FilterChip active={courseFilter === 'algebra2'} onClick={() => setCourseFilter('algebra2')} accent="violet">Algebra 2</FilterChip>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow text-ink-muted mr-2 w-14">Strength</span>
              <FilterChip active={strengthFilter === 'all'} onClick={() => setStrengthFilter('all')}>All</FilterChip>
              <FilterChip active={strengthFilter === 'strong'} onClick={() => setStrengthFilter('strong')} accent="emerald">Strong fit</FilterChip>
              <FilterChip active={strengthFilter === 'possible'} onClick={() => setStrengthFilter('possible')} accent="accent">Possible fit</FilterChip>
              <FilterChip active={strengthFilter === 'weak'} onClick={() => setStrengthFilter('weak')}>Pure math</FilterChip>
              {(strengthFilter !== 'all' || courseFilter !== 'all') && (
                <span className="text-[11px] text-ink-muted ml-2">
                  showing {visibleCount} of {ALIGNMENT.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {courses.map((c) => (
          <CourseSection
            key={c}
            course={c}
            strengthFilter={strengthFilter}
          />
        ))}
        {visibleCount === 0 && (
          <div className="bg-surface-raised border border-surface-line rounded-lg p-8 text-center">
            <div className="font-display text-lg text-ink mb-1">No chapters match these filters.</div>
            <div className="text-sm text-ink-muted">Try widening the strength filter.</div>
          </div>
        )}
      </main>

      <footer className="border-t border-surface-line py-6 text-center text-xs text-ink-muted">
        Source: 35 official Savvas enVision AGA 2024 3-Act Math videos, captured from textbook QR codes and transcribed with Gemini 3 Flash · alignment analysis hand-authored in <code className="font-mono">data/act1Alignment.ts</code>
      </footer>
    </div>
  );
}

function CourseSection({
  course, strengthFilter,
}: { course: CourseId; strengthFilter: StrengthFilter }) {
  const entries = chaptersForCourse(course).filter((e) => {
    if (strengthFilter === 'all') return true;
    const a = alignmentFor(course, e.topic);
    return a?.strength === strengthFilter;
  });
  if (entries.length === 0) return null;
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

      <div className="grid gap-4">
        {entries.map((entry) => (
          <AlignmentCard key={`${entry.course}-${entry.topic}`} entry={entry} />
        ))}
      </div>
    </section>
  );
}

function AlignmentCard({ entry }: { entry: ChapterEntry }) {
  const a = alignmentFor(entry.course, entry.topic);
  if (!a) return null;
  const videoUrl = envisionVideoUrl(entry);
  const datasetObjs = a.datasetIds
    .map((id) => DATASETS.find((d) => d.id === id))
    .filter(Boolean) as { id: string; name: string }[];

  return (
    <article className="bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
      {/* Header strip */}
      <header className="flex flex-wrap items-baseline gap-3 px-5 py-3 border-b border-surface-line bg-surface-subtle/30">
        <span className="font-mono text-xs text-ink-muted tabular-nums">
          {entry.course === 'algebra1' ? 'A1' : entry.course === 'algebra2' ? 'A2' : 'GM'} · T{String(entry.topic).padStart(2, '0')}
        </span>
        <span className="eyebrow text-ink-muted">{entry.topicName}</span>
        <span className={`inline-flex items-center gap-1.5 text-[10px] eyebrow px-2 py-0.5 rounded border ${STRENGTH_TONE[a.strength]} ml-auto`}>
          <span className={`w-1.5 h-1.5 rounded-full ${STRENGTH_DOT[a.strength]}`} />
          {STRENGTH_LABEL[a.strength]}
        </span>
      </header>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-surface-line">
        {/* Savvas Act 1 side */}
        <div className="px-5 py-4">
          <div className="eyebrow text-rose-700 mb-1.5">Savvas · Act 1</div>
          <p className="text-sm text-ink leading-relaxed mb-2">{a.savvasPremise}</p>
          <div className="text-xs text-ink-muted italic mb-3">
            Question: <span className="text-ink not-italic font-semibold">"{a.savvasQuestion}"</span>
          </div>
          {videoUrl && (
            <div className="pt-2 border-t border-surface-line/60">
              <EnvisionVideoLink course={entry.course} topic={entry.topic} compact />
            </div>
          )}
        </div>

        {/* Our continuation */}
        <div className="px-5 py-4 bg-emerald-50/20">
          <div className="eyebrow text-emerald-700 mb-1.5">
            Real data · Act 1.5 {entry.activity ? `· ${entry.activity}` : ''}
          </div>
          <p className="text-sm text-ink leading-relaxed mb-3">{a.exploration}</p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {entry.route && (
              <Link
                to={entry.route}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-900 text-white text-xs font-semibold hover:bg-brand-700 transition shadow-sm"
              >
                <span>Open activity</span>
                <span aria-hidden>→</span>
              </Link>
            )}
            {datasetObjs.map((d) => (
              <Link
                key={d.id}
                to={`/explorer?dataset=${d.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-raised border border-surface-line text-ink-soft text-[11px] font-semibold hover:bg-surface-subtle hover:text-brand-700 hover:border-brand-300 transition"
                title={`Open the explorer with the ${d.name} dataset`}
              >
                <span>Explore {d.name}</span>
                <span aria-hidden className="shrink-0">→</span>
              </Link>
            ))}
            {a.needsDataset && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-50 border border-accent-200 text-accent-800 text-[11px] font-semibold"
                title="Conceptually clear but the dataset isn't in our library yet"
              >
                Needs: {a.needsDataset}
              </span>
            )}
            {datasetObjs.length === 0 && !a.needsDataset && !entry.route && (
              <span className="text-[11px] text-ink-muted italic">No data extension</span>
            )}
            <Link
              to={`/chapters#${chapterAnchorId(entry)}`}
              className="ml-auto text-[11px] text-ink-muted hover:text-brand-700 hover:underline"
            >
              Chapter row →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function Tile({ label, value, tone }: { label: string; value: number; tone: 'emerald' | 'accent' | 'muted' }) {
  const ring =
    tone === 'emerald' ? 'ring-2 ring-emerald-200' :
    tone === 'accent' ? 'ring-2 ring-accent-200' :
    'ring-1 ring-surface-line';
  return (
    <div className={`rounded-lg bg-surface-raised border border-surface-line p-3 ${ring}`}>
      <div className="font-display font-black text-brand-900 text-3xl tabular-nums leading-none">{value}</div>
      <div className="eyebrow text-ink-muted mt-2">{label}</div>
    </div>
  );
}

function FilterChip({
  active, onClick, children, accent,
}: { active: boolean; onClick: () => void; children: React.ReactNode; accent?: 'sky' | 'emerald' | 'violet' | 'accent' }) {
  const activeBg =
    accent === 'sky' ? 'bg-sky-600 text-white border-sky-600' :
    accent === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600' :
    accent === 'violet' ? 'bg-violet-600 text-white border-violet-600' :
    accent === 'accent' ? 'bg-accent-600 text-white border-accent-600' :
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

