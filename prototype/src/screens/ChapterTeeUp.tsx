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
import type { ChapterEntry, FormatCode } from '../data/chapters';
import { getDataset } from '../data/registry';
import type { ChapterFit, Dataset } from '../lib/dataset';

// Tee-up page for every chapter. For BUILT chapters (chapter.route present),
// renders the enVision "Mathematical Modeling in 3 Acts" textbook page layout
// driven entirely from chapter data — MM3A badge, hook image, standards,
// Act 1/2/3 prompts, Start CTA into the activity. For UNBUILT chapters,
// falls back to the lighter dataset-connection format so design briefs still
// land somewhere readable.

const COURSE_TONE: Record<ChapterEntry['course'], { eyebrow: string; chip: string; gradient: string; ring: string }> = {
  algebra1: {
    eyebrow: 'text-sky-700',
    chip: 'bg-sky-100 text-sky-900',
    gradient: 'from-sky-900 via-sky-700 to-cyan-600',
    ring: 'border-sky-300',
  },
  geometry: {
    eyebrow: 'text-emerald-700',
    chip: 'bg-emerald-100 text-emerald-900',
    gradient: 'from-emerald-900 via-emerald-700 to-teal-600',
    ring: 'border-emerald-300',
  },
  algebra2: {
    eyebrow: 'text-violet-700',
    chip: 'bg-violet-100 text-violet-900',
    gradient: 'from-violet-950 via-brand-900 to-violet-700',
    ring: 'border-violet-300',
  },
};

// Textbook-standard 3-Acts prompts (verbatim from the enVision page format,
// with one media-neutral tweak: "the scenario above" replaces "the video").
const ACT1_PROMPTS = [
  'What is the first question that comes to mind when you think about the scenario above?',
  'Write down the main question you want this activity to answer.',
  'Make an initial conjecture that answers this main question.',
  'Explain how you arrived at your conjecture.',
  'What information would be useful to know to answer the main question? How might you get it? How will you use that information?',
];
const ACT2_PROMPT = 'Use the math that you have learned in this Topic to refine your conjecture.';
const ACT3_PROMPT = 'Did your refined conjecture match the actual answer exactly? If not, what might explain the difference?';

export default function ChapterTeeUp() {
  const { anchor } = useParams<{ anchor: string }>();
  const chapter = anchor ? chapterById(anchor) : null;

  useDocumentTitle(chapter ? `${chapter.activity} · Mathematical Modeling in 3 Acts` : 'Chapter');

  if (!chapter) return <NotFound anchor={anchor} />;

  return chapter.route
    ? <TextbookThreeActs chapter={chapter} />
    : <DesignBriefFallback chapter={chapter} />;
}

/* ─── Textbook 3-Acts layout · for chapters with a built activity ─────────── */

function TextbookThreeActs({ chapter }: { chapter: ChapterEntry }) {
  const tone = COURSE_TONE[chapter.course];
  const videoUrl = envisionVideoUrl(chapter);
  const teacher = resolveTeacherInfo(chapter);
  const standards = teacher.standards.length > 0 ? teacher.standards : ['MP.4'];

  return (
    <div className="min-h-screen bg-surface">
      <Masthead
        section="Mathematical Modeling in 3 Acts"
        eyebrow={`${COURSE_TITLE[chapter.course]} · Topic ${chapter.topic} · ${chapter.topicName}`}
      />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 text-[11px] text-ink-muted mb-6">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>You scanned this from your enVision {COURSE_TITLE[chapter.course]} textbook · Topic {chapter.topic}.</span>
        </div>

        <div className="grid md:grid-cols-[180px_1fr_minmax(0,280px)] gap-5 items-start mb-8">
          <ThreeActsBadge />
          <StandardsBlock standards={standards} />
          <HookImage chapter={chapter} />
        </div>

        <h1 className={`font-display text-4xl md:text-5xl font-bold ${tone.eyebrow} leading-tight mb-4`}>
          {chapter.activity}
        </h1>
        <div className="max-w-prose space-y-3 text-ink leading-relaxed mb-10">
          <p className="text-base">{chapter.blurb}</p>
          <p className="text-base text-ink-soft italic">{chapter.connection}</p>
          {chapter.design?.hook && (
            <p className="text-sm text-ink-soft">
              <strong className="text-ink not-italic">The scenario:</strong> {chapter.design.hook}
            </p>
          )}
          <p className="text-sm text-ink-soft italic">
            Think about this during the Mathematical Modeling in 3 Acts lesson.
          </p>
        </div>

        <hr className="border-t border-dashed border-surface-line mb-10" />

        <div className="space-y-8 mb-12">
          <ActBlock n={1} title="Identify the Problem" prompts={ACT1_PROMPTS} tone={tone} startIndex={1} />
          <ActBlock n={2} title="Develop a Model" prompts={[ACT2_PROMPT]} tone={tone} startIndex={6} />
          <ActBlock n={3} title="Interpret the Results"
            prompts={chapter.design?.reveal
              ? [ACT3_PROMPT, `Think about: ${chapter.design.reveal}`]
              : [ACT3_PROMPT]
            }
            tone={tone}
            startIndex={7}
          />
        </div>

        <div className={`bg-gradient-to-br ${tone.gradient} text-white rounded-lg p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 shadow-editorial`}>
          <div>
            <div className="eyebrow text-accent-300 mb-1">Ready when you are</div>
            <div className="font-display text-2xl font-bold leading-tight">
              Begin Act 1 — make your prediction
            </div>
            <p className="text-sm text-white/70 mt-1.5 max-w-md">
              The activity guides you through all three Acts. Stays on your device.
            </p>
          </div>
          <Link
            to={chapter.route!}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-accent-400 text-brand-950 font-bold text-base shadow-editorial hover:bg-accent-300 transition"
          >
            Start <span aria-hidden>→</span>
          </Link>
        </div>

        {videoUrl && (
          <div className="mt-8 flex items-center justify-between flex-wrap gap-3 text-xs text-ink-muted border-t border-surface-line pt-5">
            <span>For your teacher — the original enVision 3-Act video for this Topic.</span>
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:text-accent-700 hover:underline">
              Open enVision {chapter.course === 'algebra1' ? 'A1' : chapter.course === 'algebra2' ? 'A2' : 'GM'} · T{chapter.topic} video ↗
            </a>
          </div>
        )}
      </main>

      <footer className="border-t border-surface-line py-6 mt-6 text-center text-xs text-ink-muted">
        {COURSE_TITLE[chapter.course]} · Topic {chapter.topic} · Mathematical Modeling in 3 Acts
      </footer>
    </div>
  );
}

/* ─── Design-brief fallback · for chapters without a built activity ───────── */

function DesignBriefFallback({ chapter }: { chapter: ChapterEntry }) {
  const tone = COURSE_TONE[chapter.course];
  const datasets = chapter.datasets.map((id) => {
    try { return getDataset(id); } catch { return null; }
  }).filter(Boolean) as Dataset[];
  const videoUrl = envisionVideoUrl(chapter);
  const teacher = resolveTeacherInfo(chapter);

  return (
    <div className="min-h-screen">
      <Masthead
        section="Chapter connection"
        eyebrow={`${COURSE_TITLE[chapter.course]} · Topic ${chapter.topic} · ${chapter.topicName}`}
      />

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <header>
          <Link to={`/chapters#${chapterAnchorId(chapter)}`} className="text-xs eyebrow text-ink-muted hover:text-brand-700 mb-3 inline-flex items-center gap-1">
            ← back to all chapters
          </Link>
          <div className={`eyebrow ${tone.eyebrow} mb-2`}>
            {COURSE_TITLE[chapter.course]} · Topic {chapter.topic}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-ink leading-tight">
            {chapter.activity}
          </h1>
          <p className="text-base text-ink-soft mt-2 max-w-prose">{chapter.blurb}</p>
          <p className="text-sm text-ink-soft mt-2 italic max-w-prose">{chapter.connection}</p>

          <div className="flex flex-wrap items-center gap-1.5 mt-4">
            {chapter.format.map((f) => (
              <span key={f} className={`text-[10px] eyebrow px-2 py-0.5 rounded ${tone.chip}`} title={FORMAT_LABEL[f]}>
                {f} · {FORMAT_LABEL[f]}
              </span>
            ))}
          </div>
        </header>

        {chapter.design && (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-2">
              DESIGN BRIEF — ACTIVITY NOT YET BUILT
            </div>
            <p className="text-sm text-ink leading-relaxed mb-2">
              <strong>Act 1 opening:</strong> {chapter.design.hook}
            </p>
            <p className="text-sm text-ink leading-relaxed">
              <strong>Act 3 reveal:</strong> {chapter.design.reveal}
            </p>
            <p className="text-xs text-amber-800 italic mt-3">
              No guided activity built yet for this chapter. Use the dataset(s) below — they're the working material this activity will be built from.
            </p>
          </section>
        )}

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

        {teacher.source !== 'none' && (
          <section className="bg-surface-raised border border-surface-line rounded-xl p-5">
            <div className="text-[10px] font-semibold tracking-widest text-ink-muted mb-2">
              FOR TEACHERS — WHAT STUDENTS WILL DO
            </div>
            {teacher.objective && <p className="text-sm text-ink leading-relaxed mb-3">{teacher.objective}</p>}
            <div className="flex flex-wrap items-baseline gap-1.5">
              {teacher.standards.map((s) => (
                <code key={s} className="font-mono text-[10px] bg-surface-subtle border border-surface-line rounded px-1.5 py-0.5">
                  {s}
                </code>
              ))}
              {typeof teacher.minutes === 'number' && (
                <span className="text-[10px] eyebrow text-ink-muted ml-2">~{teacher.minutes} min</span>
              )}
            </div>
          </section>
        )}

        {videoUrl && (
          <div className="border-t border-surface-line pt-5 text-xs text-ink-muted flex flex-wrap items-baseline justify-between gap-3">
            <span>Pairs with the Savvas enVision 3-Act Math video for this Topic.</span>
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:text-accent-700 hover:underline">
              Open enVision video ↗
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── Visual components ─────────────────────────────────────────────────────── */

function NotFound({ anchor }: { anchor?: string }) {
  return (
    <div className="min-h-screen">
      <Masthead section="Chapter not found" />
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-ink mb-2">No chapter at this address.</h1>
        <p className="text-sm text-ink-soft mb-6">
          <code className="font-mono text-xs bg-surface-subtle px-1 rounded">/c/{anchor}</code> doesn't match any chapter in the scope-and-sequence.
        </p>
        <Link to="/chapters" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-brand-900 text-white font-semibold hover:bg-brand-700 transition">
          ← Back to chapters
        </Link>
      </main>
    </div>
  );
}

function ThreeActsBadge() {
  return (
    <div className="bg-gradient-to-b from-brand-800 to-brand-950 text-white rounded-md p-4 shadow-editorial">
      <div className="font-display font-black text-base leading-tight tracking-tight">
        MATHEMATICAL<br />
        MODELING<br />
        IN <span className="bg-accent-400 text-brand-950 px-1.5 py-0.5 rounded text-sm">3 ACTS</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        {[1, 2, 3].map((n) => (
          <div key={n} className="w-7 h-7 rounded-full bg-accent-400 grid place-items-center font-display font-black text-brand-950 text-xs">
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

function StandardsBlock({ standards }: { standards: string[] }) {
  return (
    <div className="bg-white border border-surface-line rounded-md p-4">
      <div className="flex items-center gap-2 mb-2">
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-emerald-700 shrink-0">
          <path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4V4Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8V4Z" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <div className="text-[11px] font-semibold text-brand-900 leading-tight">
          Common Core State Standards
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {standards.map((s) => (
          <code key={s} className="font-mono text-[10px] bg-surface-subtle border border-surface-line rounded px-1.5 py-0.5 text-ink">
            {s}
          </code>
        ))}
      </div>
    </div>
  );
}

function HookImage({ chapter }: { chapter: ChapterEntry }) {
  const tone = COURSE_TONE[chapter.course];
  const primaryFormat: FormatCode = chapter.format[0] ?? 'CDS';
  return (
    <div
      className={`relative aspect-[4/3] rounded-md overflow-hidden bg-gradient-to-br ${tone.gradient} shadow-editorial`}
      aria-label={`Hook illustration for ${chapter.activity}.`}
    >
      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={0} y1={50 + i * 50} x2={400} y2={50 + i * 50 - 30} stroke="white" strokeOpacity={0.05} strokeWidth="1" />
        ))}
        <circle cx="200" cy="150" r="90" fill="url(#hookGlow)" />
        <g transform="translate(140, 90)" fill="white" fillOpacity="0.92">
          <FormatGlyph format={primaryFormat} />
        </g>
        <defs>
          <radialGradient id="hookGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      <div className="absolute bottom-2 left-3 right-3 flex justify-between items-baseline text-[10px] font-mono text-white/75">
        <span className="truncate">Topic {chapter.topic} · {FORMAT_LABEL[primaryFormat]}</span>
        {chapter.flagship && <span className="bg-accent-400 text-brand-950 px-1.5 py-0.5 rounded font-bold">flagship</span>}
      </div>
    </div>
  );
}

function FormatGlyph({ format }: { format: FormatCode }) {
  switch (format) {
    case 'CDS':
      return (
        <g>
          <rect x="6" y="80" width="12" height="40" rx="2" />
          <rect x="26" y="55" width="12" height="65" rx="2" />
          <rect x="46" y="30" width="12" height="90" rx="2" />
          <rect x="66" y="10" width="12" height="110" rx="2" />
          <rect x="86" y="40" width="12" height="80" rx="2" />
          <rect x="106" y="60" width="12" height="60" rx="2" />
        </g>
      );
    case 'SEN':
      return (
        <g>
          <rect x="34" y="6" width="52" height="108" rx="8" fill="none" stroke="currentColor" strokeWidth="3" />
          <rect x="42" y="18" width="36" height="64" rx="2" />
          <circle cx="60" cy="100" r="4" fillOpacity="0.6" />
        </g>
      );
    case 'GAM':
      return (
        <g>
          <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="4" />
          <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="4" />
          <circle cx="60" cy="60" r="10" />
        </g>
      );
    case 'POL':
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${i * 24}, ${i % 2 === 0 ? 20 : 40})`}>
              <circle cx="14" cy="14" r="10" />
              <rect x="2" y="28" width="24" height="32" rx="6" />
            </g>
          ))}
        </g>
      );
    case 'SIM':
      return (
        <g>
          <circle cx="60" cy="60" r="12" />
          <ellipse cx="60" cy="60" rx="55" ry="22" fill="none" stroke="currentColor" strokeWidth="3" />
          <ellipse cx="60" cy="60" rx="55" ry="22" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(60 60 60)" />
          <ellipse cx="60" cy="60" rx="55" ry="22" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(-60 60 60)" />
        </g>
      );
    case 'IMP':
      return (
        <g>
          <rect x="20" y="80" width="80" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M60 6 L60 70 M40 26 L60 6 L80 26" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 'TML':
      return (
        <g>
          {[20, 60, 100].map((y) => <circle key={`l1-${y}`} cx="20" cy={y} r="6" />)}
          {[40, 80].map((y) => <circle key={`l2-${y}`} cx="60" cy={y} r="6" />)}
          <circle cx="100" cy="60" r="6" />
          {[20, 60, 100].flatMap((y1) => [40, 80].map((y2) => (
            <line key={`a-${y1}-${y2}`} x1="20" y1={y1} x2="60" y2={y2} stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
          )))}
          {[40, 80].map((y) => (
            <line key={`b-${y}`} x1="60" y1={y} x2="100" y2="60" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
          ))}
        </g>
      );
    default:
      return <circle cx="60" cy="60" r="40" />;
  }
}

function ActBlock({
  n, title, prompts, tone, startIndex,
}: {
  n: number; title: string; prompts: string[];
  tone: { eyebrow: string }; startIndex: number;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-display font-bold text-sm shadow-sm bg-brand-900 text-white">
          <span className="text-[10px] eyebrow opacity-80">ACT</span>
          <span className="text-base leading-none">{n}</span>
        </div>
        <h2 className="font-display text-lg md:text-xl font-bold text-brand-900">{title}</h2>
      </div>
      <ol className="space-y-2 pl-1">
        {prompts.map((p, i) => (
          <li key={i} className="flex gap-3 items-baseline">
            <span className={`font-mono text-xs font-bold tabular-nums w-6 shrink-0 ${tone.eyebrow}`}>
              {startIndex + i}.
            </span>
            <span className="text-sm md:text-base text-ink leading-relaxed">{p}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DatasetConnectionCard({ dataset, chapter }: { dataset: Dataset; chapter: ChapterEntry }) {
  const fits = (dataset as { chapterFits?: ChapterFit[] }).chapterFits ?? [];
  const fit = fits.find((f) => f.course === chapter.course && f.topic === chapter.topic) ?? null;

  const prompts: string[] = [];
  if (fit?.discussion?.length) {
    prompts.push(...fit.discussion.slice(0, 3));
  } else if (chapter.design) {
    prompts.push(chapter.design.hook, chapter.design.reveal);
  } else if (chapter.teacher?.discussion?.length) {
    prompts.push(...chapter.teacher.discussion.slice(0, 3));
  }

  return (
    <article className="bg-white border border-surface-line rounded-xl overflow-hidden">
      <header className="px-5 py-3 border-b border-surface-line bg-surface-subtle/40 flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-ink-muted">DATASET</div>
          <div className="font-display text-lg font-bold text-ink mt-0.5">{dataset.name}</div>
        </div>
        <div className="text-xs text-ink-muted tabular-nums">{dataset.rows.length.toLocaleString()} rows</div>
      </header>
      <div className="p-5 space-y-4">
        <div>
          <div className="text-[10px] font-semibold tracking-widest text-ink-muted mb-1">HOW IT FITS THE CHAPTER MATH</div>
          <p className="text-sm text-ink leading-relaxed">{fit?.mathFit ?? chapter.connection}</p>
          {fit?.studentWhy && (
            <p className="text-sm text-ink-soft leading-relaxed mt-2 italic border-l-2 border-surface-line pl-3">
              "{fit.studentWhy}"
            </p>
          )}
        </div>
        {prompts.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold tracking-widest text-ink-muted mb-2">WHAT TO TRY IN THE DATA</div>
            <ol className="list-decimal pl-5 space-y-1.5 text-sm text-ink marker:text-brand-700 marker:font-bold">
              {prompts.map((p, i) => <li key={i} className="leading-relaxed">{p}</li>)}
            </ol>
          </div>
        )}
        {dataset.source && (
          <div className="text-xs text-ink-muted italic border-t border-surface-line pt-3">
            Source: {dataset.source}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Link to={`/explorer?dataset=${dataset.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand-900 text-white text-sm font-semibold hover:bg-brand-700 transition">
            Open in Explorer <span aria-hidden>→</span>
          </Link>
          <Link to={`/datasets/${dataset.id}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white border border-surface-line text-ink-soft text-sm font-semibold hover:border-brand-300 hover:text-brand-700 transition">
            Read the dataset story
          </Link>
        </div>
      </div>
    </article>
  );
}
