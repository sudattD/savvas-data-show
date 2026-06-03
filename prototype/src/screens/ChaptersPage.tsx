import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import Masthead from '../components/Masthead';
import Tour, { type TourStep } from '../components/Tour';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import {
  CHAPTERS,
  COURSE_TITLE,
  FORMAT_LABEL,
  FORMAT_BLURB,
  BUILT_COUNT,
  chaptersForCourse,
  chapterAnchorId,
  resolveTeacherInfo,
  envisionVideoUrl,
} from '../data/chapters';
import type { CourseId, FormatCode, ChapterEntry } from '../data/chapters';
import { DATASETS } from '../data/registry';
import { COMPANION_LESSONS, companionLessonsFor } from '../data/lessonRules';

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
type FormatFilter = 'all' | FormatCode;
type ViewMode = 'student' | 'teacher';

export default function ChaptersPage() {
  useDocumentTitle('Scope & sequence');
  const [filter, setFilter] = useState<CourseFilter>('all');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
  const [builtOnly, setBuiltOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('student');
  const location = useLocation();

  // If we arrived with a chapter anchor in the URL, auto-clear filters so the
  // target row isn't filtered out, then scroll it into view.
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) return;
    const target = CHAPTERS.find((c) => chapterAnchorId(c) === hash);
    if (target) {
      setFilter('all');
      setFormatFilter('all');
      setBuiltOnly(false);
    }
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

  const passes = (c: ChapterEntry): boolean => {
    if (formatFilter !== 'all' && !c.format.includes(formatFilter)) return false;
    if (builtOnly && !c.route) return false;
    return true;
  };

  const totals = useMemo(() => ({
    chapters: CHAPTERS.length,
    built: BUILT_COUNT,
    datasets: new Set(CHAPTERS.flatMap((c) => c.datasets)).size,
  }), []);

  const visibleCount = CHAPTERS.filter((c) => {
    if (filter !== 'all' && c.course !== filter) return false;
    return passes(c);
  }).length;

  const formatsInUse = useMemo(() => {
    const set = new Set<FormatCode>();
    CHAPTERS.forEach((c) => c.format.forEach((f) => set.add(f)));
    return Array.from(set);
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const tourActive = searchParams.get('tour') === '1';
  const closeTour = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('tour');
    setSearchParams(next, { replace: true });
  };

  const tourSteps: TourStep[] = [
    {
      eyebrow: 'Get oriented · 1 of 2',
      title: `${CHAPTERS.length} chapters, three courses`,
      body: `Every row is one enVision chapter. ${BUILT_COUNT} of them link to a built prototype; the rest link to the underlying dataset. Each activity earns its chapter through one of three math-fit rules — shape, source, or lens.`,
    },
    {
      eyebrow: '2 of 2',
      title: 'Narrow with the filters',
      selector: '[data-tour="filters"]',
      points: [
        'Toggle "Built only" to see just the prototyped activities.',
        'Filter by course (Algebra 1 / Geometry / Algebra 2).',
        'Filter by format — seven distinct activity shapes.',
      ],
      cta: 'Got it →',
    },
  ];

  return (
    <div className="min-h-screen">
      <Masthead section="Scope & Sequence" eyebrow={`One activity per chapter · 3 courses · ${CHAPTERS.length} chapters`} />

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
            <div className="md:col-span-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Tile label="chapters" value={totals.chapters} big />
                <Tile label="built" value={totals.built} />
                <Tile label="datasets" value={totals.datasets} />
              </div>
              <ViewToggle mode={viewMode} onChange={setViewMode} />
            </div>
          </div>

          <div data-tour="filters" className="mt-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow text-ink-muted mr-2 w-14">Course</span>
              <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterChip>
              <FilterChip active={filter === 'algebra1'} onClick={() => setFilter('algebra1')} accent="sky">Algebra 1</FilterChip>
              <FilterChip active={filter === 'geometry'} onClick={() => setFilter('geometry')} accent="emerald">Geometry</FilterChip>
              <FilterChip active={filter === 'algebra2'} onClick={() => setFilter('algebra2')} accent="violet">Algebra 2</FilterChip>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow text-ink-muted mr-2 w-14">Format</span>
              <FilterChip active={formatFilter === 'all'} onClick={() => setFormatFilter('all')}>All</FilterChip>
              {formatsInUse.map((f) => (
                <FilterChip
                  key={f}
                  active={formatFilter === f}
                  onClick={() => setFormatFilter(formatFilter === f ? 'all' : f)}
                  title={`${FORMAT_LABEL[f]} — ${FORMAT_BLURB[f]}`}
                >
                  <span className="font-mono opacity-70 mr-1">{f}</span>
                  {FORMAT_LABEL[f]}
                </FilterChip>
              ))}
              <span className="text-surface-line mx-1">·</span>
              <FilterChip
                active={builtOnly}
                onClick={() => setBuiltOnly((v) => !v)}
                accent="emerald"
              >
                Built only
              </FilterChip>
              {(formatFilter !== 'all' || builtOnly || filter !== 'all') && (
                <span className="text-[11px] text-ink-muted ml-2">
                  showing {visibleCount} of {CHAPTERS.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        <CompanionLessonsRail />

        {courses.map((c) => (
          <CourseSection key={c} course={c} predicate={passes} viewMode={viewMode} />
        ))}

        {visibleCount === 0 && (
          <div className="bg-surface-raised border border-surface-line rounded-lg p-8 text-center">
            <div className="font-display text-lg text-ink mb-1">No chapters match these filters.</div>
            <div className="text-sm text-ink-muted">Try widening the format or turning off "Built only".</div>
          </div>
        )}

        <FormatLegend />
      </main>

      <footer className="border-t border-surface-line py-6 text-center text-xs text-ink-muted">
        Source: <code className="font-mono">chapter_activities.md</code>. Built activities link to the prototype; concept activities link to the underlying dataset where one exists.
      </footer>

      {tourActive && <Tour steps={tourSteps} onClose={closeTour} />}
    </div>
  );
}

function CourseSection({
  course, predicate, viewMode,
}: { course: CourseId; predicate: (c: ChapterEntry) => boolean; viewMode: ViewMode }) {
  const allEntries = chaptersForCourse(course);
  const entries = allEntries.filter(predicate);
  const accent = COURSE_ACCENT[course];

  if (entries.length === 0) return null;

  return (
    <section>
      <div className="flex items-baseline gap-4 mb-5">
        <div className={`h-1 w-12 ${accent.bar} rounded`} />
        <h2 className={`font-display text-2xl md:text-3xl font-bold ${accent.text}`}>
          {COURSE_TITLE[course]}
        </h2>
        <div className="text-xs text-ink-muted font-mono">
          {entries.length === allEntries.length
            ? `${entries.length} topics`
            : `${entries.length} of ${allEntries.length} topics`}
        </div>
      </div>

      <div className="grid gap-3">
        {entries.map((entry) => (
          <ChapterRow key={`${entry.course}-${entry.topic}`} entry={entry} viewMode={viewMode} />
        ))}
      </div>
    </section>
  );
}

function ChapterRow({ entry, viewMode }: { entry: ChapterEntry; viewMode: ViewMode }) {
  const accent = COURSE_ACCENT[entry.course];
  const datasetObjs = entry.datasets.map((id) => DATASETS.find((d) => d.id === id)).filter(Boolean) as { id: string; name: string }[];
  const isBuilt = !!entry.route;
  const videoUrl = envisionVideoUrl(entry);
  const nothingToDo = !isBuilt && datasetObjs.length === 0;

  return (
    <article
      id={chapterAnchorId(entry)}
      className={`group bg-surface-raised border ${isBuilt ? 'border-surface-line hover:border-brand-300' : 'border-surface-line/70'} rounded-lg overflow-hidden transition scroll-mt-24`}
    >
      <div className={`flex ${isBuilt && entry.flagship ? 'border-l-4 border-accent-500' : ''}`}>
      <div className="grid md:grid-cols-[120px_1fr_220px] gap-0 items-stretch flex-1">
        {/* Topic label */}
        <div className={`px-4 py-4 md:py-5 border-b md:border-b-0 md:border-r border-surface-line ${accent.chip} flex md:flex-col md:items-start items-baseline gap-2 md:gap-1`}>
          <div className="eyebrow text-[10px] opacity-70">Topic</div>
          <div className="font-display text-2xl font-bold leading-none tabular-nums">{entry.topic}</div>
          {entry.flagship && (
            <div className="ml-auto md:ml-0 text-[9px] eyebrow bg-accent-500 text-white px-1.5 py-0.5 rounded">
              POC
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

          {viewMode === 'teacher' && <TeacherPanel entry={entry} />}

          <CompanionLessonChips entry={entry} />
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
          {!isBuilt && datasetObjs.length > 0 && (
            <Link
              to={`/c/${chapterAnchorId(entry)}`}
              className="inline-flex items-center justify-between gap-1.5 px-3 py-2 rounded-md bg-brand-900 text-white text-sm font-semibold hover:bg-brand-700 transition shadow-sm"
              title="See how this chapter connects to its dataset, then open the Explorer"
            >
              <span>Open chapter</span>
              <span aria-hidden>→</span>
            </Link>
          )}
          {isBuilt && datasetObjs.length > 0 && (
            <Link
              to={`/c/${chapterAnchorId(entry)}`}
              className="inline-flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-md bg-surface-raised border border-surface-line text-ink-soft text-xs font-semibold hover:bg-surface-subtle hover:text-brand-700 hover:border-brand-300 transition"
              title="See how this chapter connects to its dataset"
            >
              <span className="truncate">How it fits the data</span>
              <span aria-hidden className="shrink-0">→</span>
            </Link>
          )}
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-md bg-surface-raised border border-surface-line text-ink-soft text-xs font-semibold hover:bg-surface-subtle hover:text-brand-700 hover:border-brand-300 transition"
              title="Open the Savvas enVision 3-Act Math video for this chapter (textbook QR target)"
            >
              <span className="truncate">enVision 3-Act video</span>
              <span aria-hidden className="shrink-0">↗</span>
            </a>
          )}
          {nothingToDo && (
            <span className="text-[10px] eyebrow text-ink-muted text-center italic px-2 py-2">
              Concept · not yet built
            </span>
          )}
        </div>
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
  active, onClick, children, accent, title,
}: { active: boolean; onClick: () => void; children: React.ReactNode; accent?: 'sky' | 'emerald' | 'violet'; title?: string }) {
  const activeBg =
    accent === 'sky' ? 'bg-sky-600 text-white border-sky-600' :
    accent === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600' :
    accent === 'violet' ? 'bg-violet-600 text-white border-violet-600' :
    'bg-brand-900 text-white border-brand-900';
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition ${
        active ? activeBg : 'bg-surface-raised border-surface-line text-ink-soft hover:bg-surface-subtle'
      }`}
    >
      {children}
    </button>
  );
}

const LESSON_FAMILY_TONE: Record<string, string> = {
  'Visual deception': 'bg-rose-50 text-rose-800 border-rose-200',
  'Statistical thinking': 'bg-accent-50 text-accent-800 border-accent-200',
  'Data hygiene': 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

function CompanionLessonChips({ entry }: { entry: ChapterEntry }) {
  const matches = companionLessonsFor(entry);
  if (matches.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-surface-line/60 flex flex-wrap items-baseline gap-1.5">
      <span className="text-[10px] eyebrow text-ink-muted mr-1">Pair with</span>
      {matches.map(({ lesson, reason }) => (
        <Link
          key={lesson.id}
          to={`/lessons/${lesson.id}`}
          title={`${lesson.title} (${lesson.concept}) — ${reason}`}
          className={`text-[10px] eyebrow px-2 py-0.5 rounded border ${LESSON_FAMILY_TONE[lesson.family] ?? 'bg-surface-subtle border-surface-line'} hover:underline whitespace-nowrap`}
        >
          <span className="font-mono opacity-60 mr-1">{lesson.number}</span>
          {lesson.concept}
        </Link>
      ))}
    </div>
  );
}

function CompanionLessonsRail() {
  return (
    <section className="bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
      <header className="px-5 py-3 border-b border-surface-line bg-surface-subtle/40 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="eyebrow text-ink-muted">Companion lessons</div>
          <div className="text-xs text-ink-muted mt-0.5">
            Six transferable data-literacy lessons that pair across multiple chapters. Each row below tags the lessons that fit.
          </div>
        </div>
        <Link
          to="/lessons"
          className="text-xs eyebrow text-brand-700 hover:text-accent-700 hover:underline whitespace-nowrap"
        >
          All lessons →
        </Link>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x lg:divide-x divide-surface-line">
        {COMPANION_LESSONS.map((l) => (
          <Link
            key={l.id}
            to={`/lessons/${l.id}`}
            className="px-4 py-3 hover:bg-surface-subtle/40 transition flex items-start gap-3 group/lesson"
          >
            <div className="font-mono text-xs text-ink-muted shrink-0 w-7 pt-0.5">{l.number}</div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-brand-900 group-hover/lesson:text-accent-700 truncate">{l.title}</div>
              <div className="text-[11px] text-ink-muted truncate">{l.concept} · {l.duration}</div>
            </div>
            <span
              className={`text-[9px] eyebrow px-1.5 py-0.5 rounded border self-start mt-0.5 shrink-0 ${LESSON_FAMILY_TONE[l.family] ?? 'bg-surface-subtle border-surface-line'}`}
            >
              {l.family.split(' ')[0]}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div className="bg-surface-raised border border-surface-line rounded-lg p-1 flex text-xs font-semibold" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'student'}
        onClick={() => onChange('student')}
        className={`flex-1 px-3 py-1.5 rounded-md transition ${
          mode === 'student' ? 'bg-brand-900 text-white shadow-sm' : 'text-ink-soft hover:text-ink'
        }`}
      >
        Student view
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'teacher'}
        onClick={() => onChange('teacher')}
        className={`flex-1 px-3 py-1.5 rounded-md transition ${
          mode === 'teacher' ? 'bg-brand-900 text-white shadow-sm' : 'text-ink-soft hover:text-ink'
        }`}
      >
        Teacher view
      </button>
    </div>
  );
}

const FORMAT_SETUP: Record<FormatCode, string> = {
  CDS: 'Curated dataset — no extra prep beyond a browser.',
  SEN: 'Students need phones or laptops with sensors enabled.',
  GAM: 'Interactive simulation in the browser; no external setup.',
  POL: 'Whole-class live poll — works best on a shared display.',
  SIM: 'Browser simulation; no curated dataset needed.',
  IMP: 'Students bring their own data (Spotify export, song file, etc.).',
  TML: 'Trains a tiny model in the browser; demands ~30 MB and a few seconds of CPU.',
};

// Default class-time estimate per format when no teacher.minutes is set.
const FORMAT_DEFAULT_MINUTES: Record<FormatCode, number> = {
  CDS: 30, SEN: 35, GAM: 25, POL: 30, SIM: 25, IMP: 30, TML: 40,
};

function estimateMinutes(entry: ChapterEntry): number {
  if (entry.teacher?.minutes) return entry.teacher.minutes;
  // Take the max of the default minutes across the chapter's formats.
  return Math.max(...entry.format.map((f) => FORMAT_DEFAULT_MINUTES[f]));
}

function TeacherPanel({ entry }: { entry: ChapterEntry }) {
  const info = resolveTeacherInfo(entry);
  const minutes = info.minutes ?? estimateMinutes(entry);
  const sourceLabel = info.source === 'chapterFit'
    ? 'authored on dataset'
    : info.source === 'embedded'
    ? 'authored on chapter'
    : 'not yet drafted';

  return (
    <div className="mt-4 pt-4 border-t border-surface-line space-y-3 bg-surface-subtle/30 -mx-5 px-5 pb-3 rounded-b-lg">
      <div className="flex items-center gap-2 text-[10px] eyebrow text-brand-700">
        <span>Teacher notes</span>
        <span className="font-mono text-ink-muted">~{minutes} min</span>
        <span className="font-mono text-ink-muted opacity-70">· {sourceLabel}</span>
      </div>

      {info.objective ? (
        <div>
          <div className="text-[10px] eyebrow text-ink-muted mb-0.5">Objective</div>
          <p className="text-xs text-ink leading-relaxed">{info.objective}</p>
        </div>
      ) : (
        <div className="text-[11px] text-ink-muted italic">
          Objective not yet drafted — student-facing connection above is the starting point.
        </div>
      )}

      {info.mathFit && (
        <div>
          <div className="text-[10px] eyebrow text-ink-muted mb-0.5">Why this dataset fits this topic</div>
          <p className="text-xs text-ink-soft leading-relaxed italic">{info.mathFit}</p>
        </div>
      )}

      <div>
        <div className="text-[10px] eyebrow text-ink-muted mb-0.5">Class setup</div>
        <ul className="text-xs text-ink leading-relaxed list-disc pl-4 space-y-0.5">
          {entry.format.map((f) => (
            <li key={f}>
              <strong>{FORMAT_LABEL[f]}</strong> — {FORMAT_SETUP[f]}
            </li>
          ))}
        </ul>
      </div>

      {info.standards.length > 0 && (
        <div>
          <div className="text-[10px] eyebrow text-ink-muted mb-1">Standards (CCSS-M)</div>
          <div className="flex flex-wrap gap-1.5">
            {info.standards.map((s) => (
              <code
                key={s}
                className="font-mono text-[10px] bg-surface-raised border border-surface-line rounded px-1.5 py-0.5 text-ink"
              >
                {s}
              </code>
            ))}
          </div>
        </div>
      )}

      {info.discussion.length > 0 && (
        <div>
          <div className="text-[10px] eyebrow text-ink-muted mb-1">Discussion prompts</div>
          <ol className="text-xs text-ink leading-relaxed pl-5 space-y-1 list-decimal marker:text-ink-muted marker:font-mono">
            {info.discussion.map((d, i) => <li key={i}>{d}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}
