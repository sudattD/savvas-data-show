import { Link } from 'react-router-dom';
import Masthead from '../components/Masthead';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import {
  CHAPTERS,
  COURSE_TITLE,
  chaptersForCourse,
  chapterAnchorId,
  envisionVideoUrl,
} from '../data/chapters';
import type { CourseId, ChapterEntry } from '../data/chapters';
import { DATASETS } from '../data/registry';

// "Layer onto enVision" pitch: the existing Savvas 3-Act video stays the
// centerpiece of each chapter. Our contribution is the data-exploration
// extension that slots in *after* the existing content — typically as
// Act 3's "now go look at the real data" move.

const COURSE_TONE: Record<CourseId, { accent: string; bar: string; chip: string }> = {
  algebra1: { accent: 'text-sky-700', bar: 'bg-sky-500', chip: 'bg-sky-50 border-sky-200 text-sky-800' },
  geometry: { accent: 'text-emerald-700', bar: 'bg-emerald-500', chip: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  algebra2: { accent: 'text-violet-700', bar: 'bg-violet-500', chip: 'bg-violet-50 border-violet-200 text-violet-800' },
};

export default function AugmentChaptersPage() {
  useDocumentTitle('Layer onto enVision');

  const withVideo = CHAPTERS.filter((c) => envisionVideoUrl(c) !== null);
  const videoCount = withVideo.length;
  const builtCount = CHAPTERS.filter((c) => c.route).length;

  return (
    <div className="min-h-screen bg-surface">
      <Masthead section="Approach A · Augment" eyebrow="Layer data exploration onto existing enVision chapters" />

      {/* Editorial hero — conservative, respectful tone */}
      <section className="border-b border-surface-line bg-white">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14">
          <div className="eyebrow text-brand-700 mb-5">Approach A · One of two pitches</div>
          <h1 className="editorial-hero text-4xl md:text-6xl text-brand-900 leading-tight">
            Keep your enVision chapter.<br />
            <em className="not-italic text-brand-700">Add the data.</em>
          </h1>
          <p className="mt-6 text-lg text-ink-soft max-w-prose leading-relaxed">
            enVision Algebra 1, Geometry, and Algebra 2 already ship with a
            3-Act Math video for every chapter. This pitch keeps those videos
            as the chapter's centerpiece and adds <strong className="text-brand-900">one
            data-exploration extension per chapter</strong> — a hands-on
            activity that slots in where Act 3 used to ask <em>"now what?"</em>
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-2xl">
            <Stat n={videoCount} label="enVision videos preserved" />
            <Stat n={CHAPTERS.length} label="chapters · 1 extension each" />
            <Stat n={builtCount} label="extensions built so far" />
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              to="/chapters/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-surface-raised border border-surface-line text-ink-soft hover:bg-surface-subtle"
            >
              See Approach B · Reimagined chapters <span aria-hidden>→</span>
            </Link>
            <Link
              to="/chapters"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-ink-soft hover:text-brand-700"
            >
              Or the full scope &amp; sequence map <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* The pitch, in three beats */}
      <section className="border-b border-surface-line bg-surface-subtle/40">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            <Beat
              n={1}
              title="Act 1 — Your video opens it"
              body="The existing enVision 3-Act Math video plays as it does today. Same hook, same setup, same teacher motion."
            />
            <Beat
              n={2}
              title="Act 2 — Your textbook teaches it"
              body="The chapter math is taught as today. No change to lesson plans, no new pedagogy to learn, no scope-and-sequence rewrites."
            />
            <Beat
              n={3}
              title="Act 3 — Data exploration extends it"
              body="A one-page interactive launches from a QR code in the textbook. Students apply the chapter math to a real dataset and see why it matters."
            />
          </div>
        </div>
      </section>

      {/* The chapter-by-chapter list — video first, our extension second */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-14">
        {(['algebra1', 'geometry', 'algebra2'] as CourseId[]).map((course) => (
          <CourseBlock key={course} course={course} />
        ))}
      </main>

      <footer className="border-t border-surface-line py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-4 text-xs text-ink-muted">
          <div>
            enVision 3-Act video URLs sourced from official QR codes in
            the May 2026 textbook printing.
          </div>
          <Link to="/chapters/new" className="eyebrow text-brand-700 hover:underline">
            Compare to Approach B →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function CourseBlock({ course }: { course: CourseId }) {
  const tone = COURSE_TONE[course];
  const entries = chaptersForCourse(course);

  return (
    <section>
      <header className="flex items-baseline gap-4 mb-6">
        <div className={`h-1 w-16 ${tone.bar} rounded`} />
        <h2 className={`font-display text-3xl md:text-4xl font-bold ${tone.accent}`}>
          {COURSE_TITLE[course]}
        </h2>
        <div className="text-xs text-ink-muted font-mono">{entries.length} chapters</div>
      </header>

      <div className="space-y-3">
        {entries.map((entry) => (
          <AugmentRow key={`${entry.course}-${entry.topic}`} entry={entry} />
        ))}
      </div>
    </section>
  );
}

function AugmentRow({ entry }: { entry: ChapterEntry }) {
  const tone = COURSE_TONE[entry.course];
  const videoUrl = envisionVideoUrl(entry);
  const datasetObjs = entry.datasets
    .map((id) => DATASETS.find((d) => d.id === id))
    .filter(Boolean) as { id: string; name: string }[];

  return (
    <article
      id={chapterAnchorId(entry)}
      className="bg-white border border-surface-line rounded-lg overflow-hidden scroll-mt-24"
    >
      <div className="grid md:grid-cols-[80px_1fr_1fr] gap-0 items-stretch">
        {/* Topic number */}
        <div className={`px-4 py-5 border-b md:border-b-0 md:border-r border-surface-line ${tone.chip} flex md:flex-col items-baseline md:items-start gap-2 md:gap-1`}>
          <div className="eyebrow text-[10px] opacity-70">Topic</div>
          <div className="font-display text-2xl font-bold leading-none tabular-nums">{entry.topic}</div>
        </div>

        {/* Column 1 — the EXISTING enVision Act-1 video (the centerpiece) */}
        <div className="px-5 py-5 border-b md:border-b-0 md:border-r border-surface-line bg-surface-subtle/30">
          <div className="eyebrow text-[10px] text-ink-muted mb-1">enVision · today</div>
          <div className="font-display text-base text-brand-900 font-semibold leading-snug mb-2">
            {entry.topicName}
          </div>
          {videoUrl ? (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-brand-700 hover:text-accent-700 hover:underline"
              title="Open the Savvas enVision 3-Act Math video for this chapter"
            >
              <span aria-hidden className="inline-grid place-items-center w-7 h-7 rounded-full bg-brand-900 text-white text-[10px] group-hover:bg-accent-700 transition">
                ▶
              </span>
              <span>3-Act Math video</span>
              <span aria-hidden className="opacity-50">↗</span>
            </a>
          ) : (
            <div className="text-xs text-ink-muted italic">No enVision video catalogued for this chapter.</div>
          )}
          <p className="text-[11px] text-ink-muted mt-3 leading-relaxed italic">
            Plays as today — same Act 1 hook, same teacher routine.
          </p>
        </div>

        {/* Column 2 — OUR extension (the addition) */}
        <div className="px-5 py-5 bg-accent-50/40 relative">
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 hidden md:grid place-items-center w-7 h-7 rounded-full bg-accent-500 text-white text-sm font-bold shadow">
            +
          </div>
          <div className="eyebrow text-[10px] text-accent-700 mb-1">Add · data exploration</div>
          <div className="font-display text-base text-brand-900 font-semibold leading-snug mb-1.5">
            {entry.activity}
          </div>
          <p className="text-xs text-ink leading-relaxed mb-3">{entry.blurb}</p>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {entry.route ? (
              <Link
                to={entry.route}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-brand-900 text-white font-semibold hover:bg-brand-700 transition"
              >
                Try it <span aria-hidden>→</span>
              </Link>
            ) : (
              <span className="px-2 py-0.5 rounded border border-surface-line text-ink-muted eyebrow text-[10px]">
                Design brief
              </span>
            )}
            {datasetObjs.slice(0, 1).map((d) => (
              <Link
                key={d.id}
                to={`/explorer?dataset=${d.id}`}
                className="text-ink-soft hover:text-accent-700 hover:underline"
                title={`Open the explorer with ${d.name}`}
              >
                or roam {d.name} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function Beat({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="bg-white border border-surface-line rounded-lg p-5">
      <div className="font-display font-black text-brand-700 text-3xl leading-none tabular-nums">
        {n}
      </div>
      <div className="font-display font-bold text-brand-900 mt-3 mb-1.5 text-base">{title}</div>
      <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="bg-white border border-surface-line rounded p-3">
      <div className="font-display font-black text-brand-900 text-2xl leading-none tabular-nums">{n}</div>
      <div className="eyebrow text-ink-muted mt-2">{label}</div>
    </div>
  );
}
