import { useState } from 'react';
import SavvasVideoEmbed from '../components/SavvasVideoEmbed';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { COURSE_TITLE, chaptersForCourse } from '../data/chapters';
import type { CourseId, ChapterEntry } from '../data/chapters';
import { DATASETS } from '../data/registry';
import { ALIGNMENT, alignmentFor, strengthCount } from '../data/act1Alignment';
import type { AlignmentStrength } from '../data/act1Alignment';

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

  const courses: CourseId[] =
    courseFilter === 'all' ? ['algebra1', 'geometry', 'algebra2'] : [courseFilter];

  const visibleCount = ALIGNMENT.filter((r) => {
    if (courseFilter !== 'all' && r.course !== courseFilter) return false;
    if (strengthFilter !== 'all' && r.strength !== strengthFilter) return false;
    return true;
  }).length;

  return (
    <div className="min-h-screen">
      <header className="border-b border-surface-line bg-surface/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-baseline gap-4">
          <div className="font-display font-black text-brand-900 text-lg leading-none">
            3-Act + real data
          </div>
          <div className="hidden md:block text-xs text-ink-muted">
            An alignment proposal for enVision AGA 2024
          </div>
          <div className="ml-auto text-[11px] eyebrow text-ink-muted">working draft</div>
        </div>
      </header>

      <section className="border-b border-surface-line bg-surface">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-6">
          <div className="grid md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <div className="eyebrow text-accent-600 mb-3">A proposal for enVision AGA 2024</div>
              <h1 className="editorial-hero text-4xl md:text-5xl text-brand-900 leading-tight">
                In a 3-Act structure, let's add{' '}
                <em className="not-italic text-emerald-700">Act 1.5</em> — real data science.
              </h1>
              <p className="mt-4 text-base text-ink-soft max-w-prose leading-relaxed">
                Every enVision chapter ships with a dramatized 3-Act hook. The hook works.
                What if we kept it — and added a real-data exploration that picks up where it leaves off?
              </p>
            </div>
            <div className="md:col-span-4">
              <div className="grid grid-cols-3 gap-2">
                <Tile label="strong fits" value={strengthCount('strong')} tone="emerald" />
                <Tile label="possible" value={strengthCount('possible')} tone="accent" />
                <Tile label="abstract" value={strengthCount('weak')} tone="muted" />
              </div>
              <div className="text-[10px] eyebrow text-ink-muted mt-2 text-center md:text-right">
                of 35 chapters
              </div>
              <a
                href="https://prototype-five-iota.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block rounded-md bg-surface-raised border border-surface-line px-3 py-2 hover:border-brand-300 hover:bg-surface-subtle transition"
              >
                <div className="eyebrow text-ink-muted text-[10px]">Companion proposal</div>
                <div className="text-xs font-semibold text-brand-900 mt-0.5 leading-snug">
                  Savvas Data Show <span className="text-ink-muted">→</span>
                </div>
                <div className="text-[11px] text-ink-soft leading-snug mt-0.5">
                  The full data-exploration prototype: Explorer, {DATASETS.length} datasets, 9 lessons, 7 built activities.
                </div>
              </a>
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
        {strengthFilter === 'all' && courseFilter === 'all' && <FlagshipRail />}

        {(strengthFilter !== 'all' || courseFilter !== 'all') && (
          <div className="text-xs eyebrow text-ink-muted">
            All {ALIGNMENT.length} chapters · filtered
          </div>
        )}

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

      <footer className="border-t border-surface-line py-8 text-center text-xs text-ink-muted space-y-2">
        <div>
          Companion proposal:{' '}
          <a
            href="https://prototype-five-iota.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-700 hover:text-accent-700 hover:underline"
          >
            Savvas Data Show — full prototype ↗
          </a>
        </div>
        <div>
          Source: 35 official Savvas enVision AGA 2024 3-Act Math videos captured from textbook QR codes · Transcribed with Gemini 3 Flash · Working draft, not for distribution
        </div>
      </footer>
    </div>
  );
}

// Three demo-ready alignments where Savvas's Act-1 hook and our parallel
// real-data activity both exist, are strong fits, and click through to
// something that actually works. The argument of the page lives or dies
// on these three; everything below this rail is supporting evidence.
interface Flagship {
  course: CourseId;
  topic: number;
  savvasTitle: string;       // e.g. "The Long Shot"
  ourActivity: string;       // e.g. "Wind Power Curve"
  builtRoute: string;        // e.g. "/wind-turbine"
  oneLiner: string;          // the alignment in one bold sentence
  mathTopic: string;         // e.g. "Quadratic functions"
}

const FLAGSHIPS: Flagship[] = [
  {
    course: 'algebra1', topic: 8,
    savvasTitle: 'The Long Shot',
    ourActivity: 'Wind Power Curve',
    builtRoute: '/wind-turbine',
    mathTopic: 'Quadratic functions',
    oneLiner: 'Six basketball arcs in the textbook → slider-fit a real quadratic to live SCADA data from a 1.5 MW turbine.',
  },
  {
    course: 'algebra2', topic: 7,
    savvasTitle: 'What Note Was That?',
    ourActivity: 'Voice DNA',
    builtRoute: '/voice-dna',
    mathTopic: 'Trigonometric functions',
    oneLiner: 'A flute and a sine wave in the textbook → record your own voice and watch the harmonics appear as a sum of sines.',
  },
  {
    course: 'algebra2', topic: 12,
    savvasTitle: 'Place Your Guess',
    ourActivity: 'The Rare Disease Test',
    builtRoute: '/lessons/rare-disease',
    mathTopic: 'Conditional probability',
    oneLiner: '"Is the coin-flip game fair?" → "Is your positive test result actually positive?" Bayes\' theorem with stakes.',
  },
];

function FlagshipRail() {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="eyebrow text-emerald-700 mb-1">Demo-ready · three flagships</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-900 leading-tight">
            Three chapters where it all works <em className="not-italic text-emerald-700">today.</em>
          </h2>
        </div>
        <div className="text-xs text-ink-muted hidden md:block max-w-xs text-right leading-snug">
          Savvas's official Act-1 video on the left, our real-data Act 1.5 on the right. Both built. Both clickable.
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {FLAGSHIPS.map((f) => (
          <FlagshipCard key={`${f.course}-${f.topic}`} flagship={f} />
        ))}
      </div>
    </section>
  );
}

function FlagshipCard({ flagship: f }: { flagship: Flagship }) {
  const courseLabel =
    f.course === 'algebra1' ? 'Algebra 1' :
    f.course === 'algebra2' ? 'Algebra 2' : 'Geometry';
  return (
    <article className="bg-surface-raised border-2 border-emerald-200 rounded-lg overflow-hidden hover:border-emerald-300 hover:shadow-md transition flex flex-col">
      <div className="p-4 border-b border-surface-line bg-emerald-50/40">
        <div className="eyebrow text-emerald-700 text-[10px]">
          {courseLabel} · Topic {f.topic} · {f.mathTopic}
        </div>
        <h3 className="font-display text-lg font-bold text-brand-900 leading-tight mt-1">
          {f.ourActivity}
        </h3>
        <div className="text-xs text-ink-muted mt-0.5">
          Paired with Savvas Act 1: <em className="not-italic font-semibold text-ink">"{f.savvasTitle}"</em>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-surface-line">
        <SavvasVideoEmbed course={f.course} topic={f.topic} />
      </div>

      <p className="px-4 py-3 text-sm text-ink leading-relaxed flex-1">
        {f.oneLiner}
      </p>

      <a
        href={f.builtRoute}
        target="_blank"
        rel="noopener noreferrer"
        className="block px-4 py-3 bg-brand-900 text-white text-sm font-semibold hover:bg-brand-700 transition text-center"
      >
        Open the Act-1.5 activity →
      </a>
    </article>
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
  const datasetObjs = a.datasetIds
    .map((id) => DATASETS.find((d) => d.id === id))
    .filter(Boolean) as { id: string; name: string }[];

  // Pull Common Core HS Math standards from each wired dataset's chapterFit
  // for this course + topic. Deduplicate across datasets so a chapter wired
  // to multiple datasets doesn't show the same code twice.
  const standards: string[] = [];
  for (const id of a.datasetIds) {
    const ds = DATASETS.find((d) => d.id === id);
    const fit = ds?.chapterFits?.find((f) => f.course === entry.course && f.topic === entry.topic);
    if (fit?.standards) {
      for (const s of fit.standards) if (!standards.includes(s)) standards.push(s);
    }
  }

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
          <div className="eyebrow text-rose-700 mb-2">Savvas · Act 1</div>
          <SavvasVideoEmbed course={entry.course} topic={entry.topic} />
          <p className="text-sm text-ink leading-relaxed mt-3 mb-2">{a.savvasPremise}</p>
          <div className="text-xs text-ink-muted italic">
            Question: <span className="text-ink not-italic font-semibold">"{a.savvasQuestion}"</span>
          </div>
        </div>

        {/* Our continuation */}
        <div className="px-5 py-4 bg-emerald-50/20">
          <div className="eyebrow text-emerald-700 mb-1.5">
            Real data · Act 1.5 {entry.activity ? `· ${entry.activity}` : ''}
          </div>
          <p className="text-sm text-ink leading-relaxed mb-3">{a.exploration}</p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {datasetObjs.length > 0 && (
              <span className="text-[11px] text-ink-muted">
                Real data:{' '}
                {datasetObjs.map((d, i) => (
                  <span key={d.id}>
                    <a
                      href={`https://prototype-five-iota.vercel.app/explorer?dataset=${d.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink font-semibold underline decoration-emerald-300 decoration-1 underline-offset-2 hover:text-emerald-700 hover:decoration-emerald-500"
                    >
                      {d.name}
                      <span aria-hidden className="opacity-60 ml-0.5">↗</span>
                    </a>
                    {i < datasetObjs.length - 1 ? ' · ' : ''}
                  </span>
                ))}
              </span>
            )}
            {a.needsDataset && (
              <a
                href={a.needsDataset.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={a.needsDataset.note || `${a.needsDataset.name} — ${a.needsDataset.source}`}
                className="inline-flex items-baseline gap-1.5 px-2.5 py-1 rounded-md bg-accent-50 border border-accent-200 text-accent-800 text-[11px] font-semibold hover:bg-accent-100 hover:border-accent-300 transition"
              >
                <span className="opacity-70 font-normal">Candidate:</span>
                <span>{a.needsDataset.name}</span>
                <span aria-hidden className="opacity-60">↗</span>
              </a>
            )}
            {datasetObjs.length === 0 && !a.needsDataset && (
              <span className="text-[11px] text-ink-muted italic">No data extension</span>
            )}
          </div>

          {standards.length > 0 && (
            <div className="mt-3 pt-2 border-t border-emerald-100/60 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
              <span className="eyebrow text-emerald-700/80 text-[10px] mr-1">Standards</span>
              {standards.map((code) => (
                <span
                  key={code}
                  className="font-mono text-[10px] text-emerald-900/80 bg-emerald-100/40 border border-emerald-200/60 px-1.5 py-0.5 rounded"
                >
                  {code}
                </span>
              ))}
            </div>
          )}
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

