import { Link } from 'react-router-dom';
import Masthead from '../components/Masthead';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import {
  CHAPTERS,
  COURSE_TITLE,
  FORMAT_LABEL,
  FORMAT_BLURB,
  chaptersForCourse,
  chapterAnchorId,
  envisionVideoUrl,
} from '../data/chapters';
import type { CourseId, ChapterEntry, FormatCode } from '../data/chapters';
import { DATASETS } from '../data/registry';

// "Reimagined chapters" pitch: the chapter is rebuilt from the dataset up.
// The Savvas video is no longer the centerpiece — it's a reference link at
// most. The pitch is on the variety and integrity of the new activities.

const COURSE_TONE: Record<CourseId, { ring: string; text: string; soft: string; pill: string }> = {
  algebra1: { ring: 'ring-sky-400/60', text: 'text-sky-700', soft: 'bg-sky-50', pill: 'bg-sky-900 text-sky-50' },
  geometry: { ring: 'ring-emerald-400/60', text: 'text-emerald-700', soft: 'bg-emerald-50', pill: 'bg-emerald-900 text-emerald-50' },
  algebra2: { ring: 'ring-violet-400/60', text: 'text-violet-700', soft: 'bg-violet-50', pill: 'bg-violet-900 text-violet-50' },
};

const FORMAT_TONE: Record<FormatCode, string> = {
  CDS: 'bg-brand-900 text-white',
  SEN: 'bg-amber-600 text-white',
  GAM: 'bg-rose-600 text-white',
  POL: 'bg-cyan-700 text-white',
  SIM: 'bg-indigo-700 text-white',
  IMP: 'bg-pink-700 text-white',
  TML: 'bg-emerald-700 text-white',
};

const FORMATS_USED: FormatCode[] = ['CDS', 'SEN', 'GAM', 'POL', 'SIM', 'IMP', 'TML'];

export default function NewChaptersPage() {
  useDocumentTitle('Reimagined chapters');

  const builtCount = CHAPTERS.filter((c) => c.route).length;
  const formatCount = new Set(CHAPTERS.flatMap((c) => c.format)).size;
  const datasetCount = new Set(CHAPTERS.flatMap((c) => c.datasets)).size;

  return (
    <div className="min-h-screen bg-brand-950 text-surface">
      <Masthead section="Approach B · Reimagined" eyebrow="A new generation of chapter activities, built from the dataset up" />

      {/* Bolder hero — this pitch is the "what if we built fresh" option */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(251,191,36,0.45), transparent 50%), radial-gradient(circle at 80% 70%, rgba(99,102,241,0.5), transparent 50%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="eyebrow text-accent-300 mb-5">Approach B · One of two pitches</div>
          <h1 className="editorial-hero text-5xl md:text-7xl text-white leading-[0.95] max-w-4xl">
            A new chapter, <em className="not-italic text-accent-400">built from the data up.</em>
          </h1>
          <p className="mt-7 text-lg md:text-xl text-surface/85 max-w-2xl leading-relaxed">
            What if every enVision chapter had a new flagship activity —
            designed for the dataset, not retrofitted around a 12-year-old
            video? {CHAPTERS.length} chapters. {formatCount} different
            interaction formats. {datasetCount} real-world datasets. Each
            activity earns its chapter the hard way.
          </p>
          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <BigStat n={CHAPTERS.length} label="chapters reimagined" />
            <BigStat n={builtCount} label="built &amp; playable" />
            <BigStat n={formatCount} label="interaction formats" />
            <BigStat n={datasetCount} label="datasets, sourced" />
          </div>
          <div className="mt-9 flex flex-wrap gap-3 text-sm">
            <Link
              to="/chapters/augment"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-surface/30 text-surface hover:border-surface/60"
            >
              <span aria-hidden>←</span> See Approach A · Layer onto enVision
            </Link>
            <Link
              to="/chapters"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-surface/70 hover:text-white"
            >
              Or the full scope &amp; sequence map →
            </Link>
          </div>
        </div>
      </section>

      {/* Format legend — variety is the message */}
      <section className="bg-brand-900/60 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="eyebrow text-accent-300 mb-3">Variety, on purpose</div>
          <p className="text-surface/80 mb-6 max-w-2xl text-sm leading-relaxed">
            Different math wants different interactions. A quadratic wants a
            slider. A linear regression wants a phone in your pocket. A
            normal distribution wants a thousand classmates pressing SPACE.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FORMATS_USED.map((f) => (
              <div key={f} className="bg-brand-950/60 border border-white/10 rounded p-3">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-[10px] eyebrow px-1.5 py-0.5 rounded ${FORMAT_TONE[f]}`}>{f}</span>
                  <span className="text-xs font-semibold text-white">{FORMAT_LABEL[f]}</span>
                </div>
                <p className="text-[11px] text-surface/70 leading-snug">{FORMAT_BLURB[f]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter grid — activities front and centre */}
      <main className="max-w-6xl mx-auto px-6 py-14 space-y-16">
        {(['algebra1', 'geometry', 'algebra2'] as CourseId[]).map((course) => (
          <CourseBlock key={course} course={course} />
        ))}
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-4 text-xs text-surface/60">
          <div>
            Each activity is a design brief; built activities open in-app.
            Concept-only activities link to the dataset they hinge on.
          </div>
          <Link to="/chapters/augment" className="eyebrow text-accent-300 hover:text-accent-200 hover:underline">
            ← Compare to Approach A
          </Link>
        </div>
      </footer>
    </div>
  );
}

function CourseBlock({ course }: { course: CourseId }) {
  const tone = COURSE_TONE[course];
  const entries = chaptersForCourse(course);
  const built = entries.filter((e) => e.route).length;

  return (
    <section>
      <header className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mb-7">
        <h2 className={`font-display text-4xl md:text-5xl font-black text-white`}>
          {COURSE_TITLE[course]}
        </h2>
        <span className={`eyebrow ${tone.text}`}>
          {entries.length} chapters · {built} built
        </span>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <NewChapterCard key={`${entry.course}-${entry.topic}`} entry={entry} />
        ))}
      </div>
    </section>
  );
}

function NewChapterCard({ entry }: { entry: ChapterEntry }) {
  const tone = COURSE_TONE[entry.course];
  const videoUrl = envisionVideoUrl(entry);
  const datasetObjs = entry.datasets
    .map((id) => DATASETS.find((d) => d.id === id))
    .filter(Boolean) as { id: string; name: string }[];
  const built = !!entry.route;

  const Body = (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-3">
        <span className={`text-[10px] eyebrow px-2 py-0.5 rounded font-mono ${tone.pill}`}>
          T{entry.topic}
        </span>
        <div className="flex gap-1">
          {entry.format.map((f) => (
            <span
              key={f}
              title={`${FORMAT_LABEL[f]} — ${FORMAT_BLURB[f]}`}
              className={`text-[9px] eyebrow px-1.5 py-0.5 rounded ${FORMAT_TONE[f]}`}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="text-[11px] text-surface/55 mb-1.5">{entry.topicName}</div>
      <h3 className="font-display text-xl font-bold text-white leading-snug mb-2">
        {entry.activity}
        {entry.flagship && (
          <span className="ml-2 text-[9px] eyebrow bg-accent-500 text-brand-950 px-1.5 py-0.5 rounded align-middle">
            flagship
          </span>
        )}
      </h3>
      <p className="text-sm text-surface/80 leading-relaxed mb-3 flex-1">{entry.blurb}</p>

      {datasetObjs.length > 0 && (
        <div className="text-[11px] text-surface/60 mb-3">
          <span className="opacity-70">dataset · </span>
          {datasetObjs.map((d) => d.name).join(' · ')}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10">
        {built ? (
          <span className="text-sm font-semibold text-accent-300">
            Open activity →
          </span>
        ) : (
          <span className="text-[11px] eyebrow text-surface/55">Design brief</span>
        )}
        {videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] eyebrow text-surface/50 hover:text-surface/80 hover:underline"
            title="For reference — current enVision video"
          >
            current enVision ↗
          </a>
        )}
      </div>
    </div>
  );

  const className = `block bg-brand-900/50 border border-white/10 rounded-lg p-5 ring-2 ring-transparent hover:${tone.ring} hover:bg-brand-900 transition scroll-mt-24 h-full`;

  return built ? (
    <Link id={chapterAnchorId(entry)} to={entry.route!} className={className}>
      {Body}
    </Link>
  ) : (
    <div id={chapterAnchorId(entry)} className={className.replace('hover:bg-brand-900', '')}>
      {Body}
    </div>
  );
}

function BigStat({ n, label }: { n: number; label: React.ReactNode }) {
  return (
    <div>
      <div className="font-display font-black text-white text-3xl tabular-nums leading-none">{n}</div>
      <div className="eyebrow text-surface/60 mt-1.5">{label}</div>
    </div>
  );
}
