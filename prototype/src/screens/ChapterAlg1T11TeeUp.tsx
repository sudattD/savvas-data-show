import { Link } from 'react-router-dom';
import Masthead from '../components/Masthead';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { chapterById, envisionVideoUrl } from '../data/chapters';

// Tee-up page for the Reaction Time Arena (Algebra 1 · Topic 11 · Statistics).
// Mimics the enVision "Mathematical Modeling in 3 Acts" textbook page layout
// so the student lands on something they recognize after scanning the QR.
// Single "Start Act 1" CTA routes them into the existing /reaction-time flow.

const STANDARDS = ['HSS-ID.A.1', 'HSS-ID.A.2', 'HSS-ID.A.3', 'MP.4'];

const HOOK_TITLE = 'Quick on the Draw';
const HOOK_PARAGRAPHS = [
  'A traffic light flicks from red to green and you hit the gas. A starter pistol fires and a sprinter explodes off the blocks. A goalkeeper guesses left as the ball is still on the kicker\'s foot. In every case, the world changes and a body has to respond — and that gap, measured in milliseconds, is reaction time.',
  'Researchers put the typical adult around 270 ms for sight and 160 ms for sound. Are you faster than the average? Are your ears really quicker than your eyes? Before we measure it, take a guess. Then we\'ll generate the data — twenty trials at a time — and you\'ll find out where you fall.',
];

export default function ChapterAlg1T11TeeUp() {
  useDocumentTitle('Reaction Time · Mathematical Modeling in 3 Acts');
  const chapter = chapterById('alg1-t11');
  const videoUrl = chapter ? envisionVideoUrl(chapter) : null;

  return (
    <div className="min-h-screen bg-surface">
      <Masthead
        section="Mathematical Modeling in 3 Acts"
        eyebrow="Algebra 1 · Topic 11 · Statistics"
      />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* From your textbook · page tag (replaces the QR's loop — you already scanned) */}
        <div className="flex items-center gap-2 text-[11px] text-ink-muted mb-6">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>You scanned this from your enVision Algebra 1 textbook · Topic 11.</span>
        </div>

        {/* ── Header strip · badge + standards + hook image ──────────────────── */}
        <div className="grid md:grid-cols-[180px_1fr_minmax(0,260px)] gap-5 items-start mb-8">
          <ThreeActsBadge />

          <div className="bg-white border border-surface-line rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookGlyph />
              <div className="text-[11px] font-semibold text-brand-900 leading-tight">
                Common Core State Standards
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STANDARDS.map((s) => (
                <code key={s} className="font-mono text-[10px] bg-surface-subtle border border-surface-line rounded px-1.5 py-0.5 text-ink">
                  {s}
                </code>
              ))}
            </div>
          </div>

          <HookImage />
        </div>

        {/* ── Title + setup paragraphs ───────────────────────────────────────── */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-violet-700 leading-tight mb-4">
          {HOOK_TITLE}
        </h1>
        <div className="prose-feel max-w-prose space-y-3 text-ink leading-relaxed mb-10">
          {HOOK_PARAGRAPHS.map((p, i) => (
            <p key={i} className="text-base">{p}</p>
          ))}
          <p className="text-sm text-ink-soft italic">
            Think about this during the Mathematical Modeling in 3 Acts lesson.
          </p>
        </div>

        <hr className="border-t border-dashed border-surface-line mb-10" />

        {/* ── Three Acts outline ─────────────────────────────────────────────── */}
        <div className="space-y-8 mb-12">
          <ActBlock
            n={1}
            title="Identify the Problem"
            prompts={[
              'What is the first question that comes to mind when you think about reacting fast?',
              'Write down the main question you want this lesson to answer.',
              'Make an initial conjecture: how fast (in ms) do you think you can react?',
              'Explain how you arrived at your conjecture.',
              'What information would be useful to know to answer the main question? How might you get it?',
            ]}
          />
          <ActBlock
            n={2}
            title="Develop a Model"
            prompts={[
              'Generate your own data — 10 trials with your eyes, then 10 with your ears — and use the math from this Topic (median, mean, range, spread) to summarize each one.',
            ]}
          />
          <ActBlock
            n={3}
            title="Interpret the Results"
            prompts={[
              'Did your refined conjecture match the actual answer exactly? If not, what might explain the difference?',
              'Compare your visual and audio distributions. Which is faster? By how much? Is that gap big enough to be real, or could it be noise?',
            ]}
          />
        </div>

        {/* ── Start CTA ──────────────────────────────────────────────────────── */}
        <div className="bg-brand-900 text-white rounded-lg p-6 md:p-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="eyebrow text-accent-300 mb-1">Ready when you are</div>
            <div className="font-display text-2xl font-bold leading-tight">
              Begin Act 1 — make your prediction
            </div>
            <p className="text-sm text-surface/70 mt-1.5 max-w-md">
              The Arena will guide you through all three Acts. Stays on your device.
            </p>
          </div>
          <Link
            to="/reaction-time"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-accent-400 text-brand-950 font-bold text-base shadow-editorial hover:bg-accent-300 transition"
          >
            Start <span aria-hidden>→</span>
          </Link>
        </div>

        {/* ── Reference: the existing enVision video ─────────────────────────── */}
        {videoUrl && (
          <div className="mt-8 flex items-center justify-between flex-wrap gap-3 text-xs text-ink-muted border-t border-surface-line pt-5">
            <span>For your teacher — the original enVision 3-Act video for this Topic.</span>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-700 hover:text-accent-700 hover:underline"
            >
              Open enVision A1 · T11 video ↗
            </a>
          </div>
        )}
      </main>

      <footer className="border-t border-surface-line py-6 mt-6 text-center text-xs text-ink-muted">
        Page 398 · Topic 9 of your Mathematical Modeling in 3 Acts series.
      </footer>
    </div>
  );
}

/* ─── Visual components ─────────────────────────────────────────────────────── */

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

function BookGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-emerald-700 shrink-0">
      <path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4V4Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M20 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8V4Z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function HookImage() {
  // Stylized "ready to react" hero: a deep panel with a single glowing target
  // and a sweep of motion lines. Conveys "tap when this turns green" without
  // a stock photo. SVG keeps it crisp at any size.
  return (
    <div
      className="relative aspect-[4/3] rounded-md overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-violet-950 shadow-editorial"
      aria-label="Stylized reaction target — a green dot waiting to be tapped."
    >
      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
        {/* sweep lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={0}
            y1={50 + i * 50}
            x2={400}
            y2={50 + i * 50 - 30}
            stroke="white"
            strokeOpacity={0.04}
            strokeWidth="1"
          />
        ))}
        {/* target glow */}
        <circle cx="200" cy="150" r="80" fill="url(#glow)" />
        <circle cx="200" cy="150" r="44" fill="#22c55e" />
        <circle cx="200" cy="150" r="44" fill="none" stroke="#86efac" strokeWidth="2" strokeOpacity="0.5" />
        {/* tap label */}
        <text
          x="200" y="156"
          textAnchor="middle"
          fontFamily="'Source Serif Pro', Georgia, serif"
          fontWeight="900"
          fontSize="20"
          fill="white"
          letterSpacing="0.05em"
        >
          GO
        </text>
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      {/* benchmark stats overlay */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] font-mono text-white/70">
        <span>visual · 270 ms</span>
        <span>audio · 160 ms</span>
      </div>
    </div>
  );
}

function ActBlock({ n, title, prompts }: { n: number; title: string; prompts: string[] }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <div className="inline-flex items-center gap-2 bg-violet-700 text-white px-3 py-1.5 rounded-md font-display font-bold text-sm shadow-sm">
          <span className="text-[10px] eyebrow opacity-80">ACT</span>
          <span className="text-base leading-none">{n}</span>
        </div>
        <h2 className="font-display text-lg md:text-xl font-bold text-brand-900">{title}</h2>
      </div>
      <ol className="space-y-2 pl-1 marker:text-violet-600 marker:font-mono">
        {prompts.map((p, i) => (
          <li key={i} className="flex gap-3 items-baseline">
            <span className="font-mono text-xs text-violet-700 font-bold tabular-nums w-6 shrink-0">
              {n === 1 ? i + 1 : n === 2 ? 6 : 6 + i + 1}.
            </span>
            <span className="text-sm md:text-base text-ink leading-relaxed">{p}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
