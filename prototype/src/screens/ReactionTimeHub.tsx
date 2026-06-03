import { Link } from 'react-router-dom';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function ReactionTimeHub() {
  useDocumentTitle('Reaction Time Arena');
  return (
    <div className="min-h-screen">
      <Masthead
        section="Reaction Time Arena"
        eyebrow="Algebra 1 · Topic 11 · Statistics"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="algebra1" topic={11} />
            <SeeAllDataLink datasetId="marathon" label="Explore the data" compact />
          </div>
        }
      />

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="max-w-2xl">
          <div className="eyebrow text-ink-muted mb-2">Chapter activity · choose your path</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-900">
            Reaction Time Arena
          </h1>
          <p className="mt-3 text-ink-soft leading-relaxed">
            How fast is your nervous system? Students generate their own visual and audio
            reaction-time distributions, compute summary statistics, and compare against
            published research. We built this chapter activity two ways — same data, same
            3-Act spine, two experiences.
          </p>
        </div>

        {/* The two entry points */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <EntryCard
            to="/reaction-time/classic"
            kicker="Full guided experience"
            title="The Classic Activity"
            body="A guided 3-Act journey with Dr. Sarah Reyes, a cognitive neuroscientist. Make a prediction, run 10 visual and 10 audio trials, and compare your distributions against published benchmarks."
            features={[
              'Guided 3-Act flow with step progression',
              'Narrator audio from Dr. Sarah Reyes',
              'Compare visual vs audio distributions',
            ]}
            cta="Launch the activity"
            tone="classic"
            decoration={<ClassicArt />}
          />
          <EntryCard
            to="/reaction-time/quick"
            kicker="Quick version"
            title="Quick Play"
            body="Jump straight into the game. Predict your reaction time, run 10 visual and 10 audio trials, then see your stats. No narration, no steps — just the data."
            features={[
              'Single-page, straight to the game',
              'Visual + audio reaction time trials',
              'Summary stats & research comparison',
            ]}
            cta="Open quick play"
            tone="quick"
            decoration={<QuickArt />}
          />
        </div>

        <p className="mt-6 text-xs text-ink-muted">
          Both paths target the same standards (HSS-ID.A.1 · HSS-ID.A.2 · HSS-ID.A.3)
          and run about 30 minutes. The classic activity adds a narrator and step-by-step
          guidance; quick play gets you straight to the reaction time game.
        </p>

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('marathon')} pin={{ course: 'algebra1', topic: 11 }} />
        </div>
      </main>

      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>Prototype · all data stays on your device · visual ~270 ms · audio ~160 ms (Woods et al. 2015).</div>
          <SeeAllDataLink datasetId="marathon" compact />
        </div>
      </footer>
    </div>
  );
}

function EntryCard({
  to,
  kicker,
  title,
  body,
  features,
  cta,
  tone,
  decoration,
}: {
  to: string;
  kicker: string;
  title: string;
  body: string;
  features: string[];
  cta: string;
  tone: 'classic' | 'quick';
  decoration: React.ReactNode;
}) {
  const styles =
    tone === 'classic'
      ? {
          header: 'bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800',
          kicker: 'text-violet-700',
          tick: 'text-violet-600',
          button: 'bg-violet-600 group-hover:bg-violet-500',
        }
      : {
          header: 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900',
          kicker: 'text-slate-600',
          tick: 'text-slate-500',
          button: 'bg-slate-800 group-hover:bg-slate-700',
        };
  return (
    <Link
      to={to}
      className="group flex flex-col overflow-hidden rounded-xl border border-surface-line bg-surface-raised transition hover:shadow-editorial"
    >
      <div className={`relative h-36 ${styles.header}`}>{decoration}</div>
      <div className="flex flex-1 flex-col p-6">
        <div className={`eyebrow ${styles.kicker} mb-1`}>{kicker}</div>
        <h2 className="font-display text-2xl font-bold text-brand-900">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
        <ul className="mt-4 space-y-1.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
              <span className={`mt-0.5 font-bold ${styles.tick}`} aria-hidden="true">
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>
        <div
          className={`mt-5 inline-flex items-center justify-center self-start rounded-full px-5 py-2 text-sm font-semibold text-white shadow transition ${styles.button}`}
        >
          {cta} →
        </div>
      </div>
    </Link>
  );
}

function ClassicArt() {
  return (
    <svg viewBox="0 0 400 144" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <circle cx="200" cy="52" r="32" fill="none" stroke="#c4b5fd" strokeWidth="2.5" opacity={0.5} />
      <circle cx="200" cy="52" r="18" fill="none" stroke="#a78bfa" strokeWidth="2" opacity={0.7} />
      <circle cx="200" cy="52" r="6" fill="#a78bfa" opacity={0.9} />
      {/* brain signal arcs */}
      <path d="M170,52 Q155,30 140,40" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="4 3" opacity={0.6} />
      <path d="M230,52 Q245,30 260,40" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="4 3" opacity={0.6} />
      {/* pulsing dots */}
      {[140, 260].map((x) => (
        <circle key={x} cx={x} cy={40} r="3" fill="#fde68a" />
      ))}
      {/* trial bars */}
      {[60, 90, 120, 150, 180, 220, 250, 280, 310, 340].map((x, i) => (
        <rect
          key={i}
          x={x - 3}
          y={90 + (i % 5) * 4}
          width={6}
          height={40 - (i % 3) * 8}
          rx={2}
          fill="#a78bfa"
          opacity={0.5 + (10 - i) * 0.04}
        />
      ))}
      {/* axis */}
      <line x1="40" y1="130" x2="370" y2="130" stroke="#c4b5fd" strokeWidth="1.5" opacity={0.5} />
    </svg>
  );
}

function QuickArt() {
  return (
    <svg viewBox="0 0 400 144" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      {/* flash panel */}
      <rect x="40" y="24" width="320" height="64" rx="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <rect x="148" y="44" width="104" height="24" rx="4" fill="#22c55e" opacity={0.9} />
      <text x="200" y="60" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">GO!</text>
      {/* trial bars at bottom */}
      {[60, 94, 128, 162, 196, 230, 264, 298, 332, 366].map((x, i) => (
        <rect key={i} x={x - 4} y={106} width={8} height={24 - i * 1.5} rx={2} fill="#94a3b8" opacity={0.6} />
      ))}
      <line x1="40" y1="132" x2="370" y2="132" stroke="#64748b" strokeWidth="1.5" opacity={0.5} />
    </svg>
  );
}
