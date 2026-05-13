import { Link, useParams } from 'react-router-dom';
import Masthead from '../components/Masthead';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import {
  COURSE_TITLE,
  FORMAT_LABEL,
  chapterAnchorId,
  chapterById,
  envisionVideoUrl,
  resolveTeacherInfo,
} from '../data/chapters';
import type { ChapterEntry } from '../data/chapters';
import { getDataset } from '../data/registry';
import type { ChapterFit, Dataset } from '../lib/dataset';

// Generic chapter ↔ dataset tee-up. Lands here when a student clicks
// "Explore [dataset]" on /chapters — explains why this dataset fits this
// chapter and what to do in it, then sends them on. If the chapter has a
// built activity, that's the primary CTA; the raw Explorer is a back door.

const COURSE_TONE: Record<ChapterEntry['course'], { eyebrow: string; accent: string; chip: string }> = {
  algebra1: { eyebrow: 'text-sky-700', accent: 'border-sky-300 bg-sky-50', chip: 'bg-sky-100 text-sky-900' },
  geometry: { eyebrow: 'text-emerald-700', accent: 'border-emerald-300 bg-emerald-50', chip: 'bg-emerald-100 text-emerald-900' },
  algebra2: { eyebrow: 'text-violet-700', accent: 'border-violet-300 bg-violet-50', chip: 'bg-violet-100 text-violet-900' },
};

export default function ChapterTeeUp() {
  const { anchor } = useParams<{ anchor: string }>();
  const chapter = anchor ? chapterById(anchor) : null;

  useDocumentTitle(chapter ? `${chapter.activity} · Chapter connection` : 'Chapter connection');

  if (!chapter) {
    return (
      <div className="min-h-screen">
        <Masthead section="Chapter not found" />
        <main className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-ink mb-2">No chapter at this address.</h1>
          <p className="text-sm text-slate-600 mb-6">
            The address <code className="font-mono text-xs bg-slate-100 px-1 rounded">/c/{anchor}</code> doesn't match
            any chapter in the scope-and-sequence.
          </p>
          <Link
            to="/chapters"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand-900 text-white font-semibold hover:bg-brand-700 transition"
          >
            ← Back to chapters
          </Link>
        </main>
      </div>
    );
  }

  const tone = COURSE_TONE[chapter.course];
  const datasets = chapter.datasets.map((id) => {
    try {
      return getDataset(id);
    } catch {
      return null;
    }
  }).filter(Boolean) as Dataset[];

  const builtRoute = chapter.route && !chapter.route.startsWith('/lessons/') ? chapter.route : null;
  const lessonRoute = chapter.route && chapter.route.startsWith('/lessons/') ? chapter.route : null;
  const videoUrl = envisionVideoUrl(chapter);
  const teacher = resolveTeacherInfo(chapter);

  return (
    <div className="min-h-screen">
      <Masthead
        section="Chapter connection"
        eyebrow={`${COURSE_TITLE[chapter.course]} · Topic ${chapter.topic} · ${chapter.topicName}`}
      />

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <header>
          <Link
            to={`/chapters#${chapterAnchorId(chapter)}`}
            className="text-xs eyebrow text-ink-muted hover:text-brand-700 mb-3 inline-flex items-center gap-1"
          >
            ← back to all chapters
          </Link>
          <div className={`eyebrow ${tone.eyebrow} mb-2`}>
            {COURSE_TITLE[chapter.course]} · Topic {chapter.topic}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-ink leading-tight">
            {chapter.activity}
          </h1>
          <p className="text-base text-slate-700 mt-2 max-w-prose">{chapter.blurb}</p>
          <p className="text-sm text-slate-600 mt-2 italic max-w-prose">{chapter.connection}</p>

          <div className="flex flex-wrap items-center gap-1.5 mt-4">
            {chapter.format.map((f) => (
              <span
                key={f}
                className={`text-[10px] eyebrow px-2 py-0.5 rounded ${tone.chip}`}
                title={FORMAT_LABEL[f]}
              >
                {f} · {FORMAT_LABEL[f]}
              </span>
            ))}
          </div>
        </header>

        {/* Primary CTA — built activity, if any */}
        {builtRoute && (
          <section className={`rounded-xl border-2 ${tone.accent} p-5`}>
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
              <div>
                <div className={`text-[10px] font-semibold tracking-widest ${tone.eyebrow}`}>
                  GUIDED ACTIVITY — RECOMMENDED PATH
                </div>
                <div className="font-display text-xl font-bold text-ink mt-0.5">
                  {chapter.activity}
                </div>
              </div>
              {chapter.flagship && (
                <span className="text-[10px] eyebrow bg-accent-500 text-white px-2 py-0.5 rounded">flagship</span>
              )}
            </div>
            {chapter.design?.hook && (
              <p className="text-sm text-slate-700 leading-relaxed mb-4">{chapter.design.hook}</p>
            )}
            <Link
              to={builtRoute}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand-900 text-white font-bold hover:bg-brand-700 transition"
            >
              Start the activity <span aria-hidden>→</span>
            </Link>
          </section>
        )}

        {lessonRoute && (
          <section className={`rounded-xl border-2 ${tone.accent} p-5`}>
            <div className={`text-[10px] font-semibold tracking-widest ${tone.eyebrow} mb-1`}>
              COMPANION LESSON
            </div>
            <div className="font-display text-xl font-bold text-ink mb-2">{chapter.activity}</div>
            {chapter.design?.hook && (
              <p className="text-sm text-slate-700 leading-relaxed mb-3">{chapter.design.hook}</p>
            )}
            <Link
              to={lessonRoute}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand-900 text-white font-bold hover:bg-brand-700 transition"
            >
              Open the lesson <span aria-hidden>→</span>
            </Link>
          </section>
        )}

        {/* Design brief — if no built activity yet */}
        {!builtRoute && !lessonRoute && chapter.design && (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-2">
              DESIGN BRIEF — ACTIVITY NOT YET BUILT
            </div>
            <p className="text-sm text-slate-800 leading-relaxed mb-2">
              <strong>Act 1 opening:</strong> {chapter.design.hook}
            </p>
            <p className="text-sm text-slate-800 leading-relaxed">
              <strong>Act 3 reveal:</strong> {chapter.design.reveal}
            </p>
            <p className="text-xs text-amber-800 italic mt-3">
              No guided activity built yet for this chapter. Use the dataset(s) below — they're the working
              material this activity will be built from.
            </p>
          </section>
        )}

        {/* Dataset blocks — one per linked dataset */}
        {datasets.length > 0 && (
          <section>
            <div className="text-[10px] font-semibold tracking-widest text-ink-muted mb-3">
              {datasets.length === 1 ? 'THE DATASET' : `${datasets.length} CONNECTED DATASETS`}
            </div>
            <div className="space-y-4">
              {datasets.map((d) => (
                <DatasetConnectionCard key={d.id} dataset={d} chapter={chapter} />
              ))}
            </div>
          </section>
        )}

        {/* Teacher panel */}
        {teacher.source !== 'none' && (
          <section className="bg-surface-raised border border-surface-line rounded-xl p-5">
            <div className="text-[10px] font-semibold tracking-widest text-ink-muted mb-2">
              FOR TEACHERS — WHAT STUDENTS WILL DO
            </div>
            {teacher.objective && (
              <p className="text-sm text-slate-800 leading-relaxed mb-3">{teacher.objective}</p>
            )}
            <div className="flex flex-wrap items-baseline gap-1.5 mb-3">
              {teacher.standards.map((s) => (
                <code key={s} className="font-mono text-[10px] bg-surface-subtle border border-surface-line rounded px-1.5 py-0.5">
                  {s}
                </code>
              ))}
              {typeof teacher.minutes === 'number' && (
                <span className="text-[10px] eyebrow text-ink-muted ml-2">~{teacher.minutes} min</span>
              )}
            </div>
            {teacher.discussion.length > 0 && (
              <details>
                <summary className="cursor-pointer text-[11px] eyebrow text-brand-700 hover:text-accent-700 select-none">
                  Discussion prompts ▾
                </summary>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-700">
                  {teacher.discussion.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        )}

        {/* enVision video link */}
        {videoUrl && (
          <div className="border-t border-surface-line pt-5 text-xs text-ink-muted flex flex-wrap items-baseline justify-between gap-3">
            <span>Pairs with the Savvas enVision 3-Act Math video for this Topic.</span>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 hover:text-accent-700 hover:underline"
            >
              Open enVision video ↗
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

// Per-dataset connection block. Reads the dataset's chapterFits entry (if it
// has one matching this chapter) for the richest math-fit copy; falls back to
// the dataset's own description otherwise.
function DatasetConnectionCard({ dataset, chapter }: { dataset: Dataset; chapter: ChapterEntry }) {
  const fits = (dataset as { chapterFits?: ChapterFit[] }).chapterFits ?? [];
  const fit = fits.find((f) => f.course === chapter.course && f.topic === chapter.topic) ?? null;

  // "What to look for" prompts — pull from the fit's discussion questions if
  // available; otherwise stitch together from chapter design fields.
  const prompts: string[] = [];
  if (fit?.discussion?.length) {
    prompts.push(...fit.discussion.slice(0, 3));
  } else if (chapter.design) {
    prompts.push(chapter.design.hook, chapter.design.reveal);
  } else if (chapter.teacher?.discussion?.length) {
    prompts.push(...chapter.teacher.discussion.slice(0, 3));
  }

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <header className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-slate-600">
            DATASET
          </div>
          <div className="font-display text-lg font-bold text-ink mt-0.5">{dataset.name}</div>
        </div>
        <div className="text-xs text-slate-500 tabular-nums">
          {dataset.rows.length.toLocaleString()} rows
        </div>
      </header>

      <div className="p-5 space-y-4">
        {/* Why it fits */}
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-slate-600 mb-1">
            HOW IT FITS THE CHAPTER MATH
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            {fit?.mathFit ?? chapter.connection}
          </p>
          {fit?.studentWhy && (
            <p className="text-sm text-slate-700 leading-relaxed mt-2 italic border-l-2 border-slate-200 pl-3">
              "{fit.studentWhy}"
            </p>
          )}
        </div>

        {/* What to look for */}
        {prompts.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold tracking-widest text-slate-600 mb-2">
              WHAT TO TRY IN THE DATA
            </div>
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-800 marker:text-brand-700 marker:font-bold">
              {prompts.map((p, i) => (
                <li key={i} className="leading-relaxed">{p}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Source */}
        {dataset.source && (
          <div className="text-xs text-slate-500 italic border-t border-slate-100 pt-3">
            Source: {dataset.source}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Link
            to={`/explorer?dataset=${dataset.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand-900 text-white text-sm font-semibold hover:bg-brand-700 transition"
          >
            Open in Explorer <span aria-hidden>→</span>
          </Link>
          <Link
            to={`/datasets/${dataset.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:border-brand-300 hover:text-brand-700 transition"
          >
            Read the dataset story
          </Link>
        </div>
      </div>
    </article>
  );
}
