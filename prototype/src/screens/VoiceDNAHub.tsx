import { Link } from 'react-router-dom';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function VoiceDNAHub() {
  useDocumentTitle('Voice DNA');
  return (
    <div className="min-h-screen">
      <Masthead
        section="Voice DNA"
        eyebrow="Algebra 2 · Topic 7 · Trigonometric Functions"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="algebra2" topic={7} />
            <SeeAllDataLink datasetId="tides" label="Explore the data" compact />
          </div>
        }
      />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="max-w-2xl">
          <div className="eyebrow text-ink-muted mb-2">Chapter activity · choose your path</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-900">
            Voice DNA
          </h1>
          <p className="mt-3 text-ink-soft leading-relaxed">
            What makes your voice sound like <em>you</em>? Students capture their own
            vowel sounds, watch live spectrograms, and discover the trigonometric
            building blocks hiding in ordinary speech. We're building this two ways —
            same content, two experiences.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <EntryCard
            to="/voice-dna/classic"
            kicker="Full guided experience"
            title="The Classic Activity"
            body="A guided 3-Act experience with Dr. Lena Vasquez. Notice the spectrogram patterns, capture your own vowel sounds, and discover the sine waves inside your voice."
            features={[
              'Guided 3-Act flow with step progression',
              'Narrator audio from Dr. Lena Vasquez',
              'Live spectrogram capture + math deep dive',
            ]}
            cta="Launch the activity"
            tone="classic"
          />
          <EntryCard
            to="/voice-dna/quick"
            kicker="Current build"
            title="Quick Play"
            body="Jump straight into the existing 5-act Voice DNA experience. Capture vowel spectrograms, read a script, explore the sine waves behind your voice."
            features={[
              '5-act flow — wonder, capture, script, math, share',
              'Live WebAudio spectrogram',
              'All data stays on your device',
            ]}
            cta="Open quick play"
            tone="quick"
          />
        </div>

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('tides')} pin={{ course: 'algebra2', topic: 7 }} />
        </div>
      </main>

      <footer className="border-t border-surface-line mt-16 py-6 text-center text-xs text-ink-muted">
        Prototype · live spectrogram via WebAudio · audio never leaves your device.
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
  disabled,
}: {
  to: string;
  kicker: string;
  title: string;
  body: string;
  features: string[];
  cta: string;
  tone: 'classic' | 'quick';
  disabled?: boolean;
}) {
  const styles =
    tone === 'classic'
      ? {
          header: 'bg-gradient-to-br from-amber-700 via-orange-700 to-yellow-800',
          kicker: 'text-amber-700',
          tick: 'text-amber-600',
          button: 'bg-amber-600 group-hover:bg-amber-500',
        }
      : {
          header: 'bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700',
          kicker: 'text-emerald-700',
          tick: 'text-emerald-600',
          button: 'bg-emerald-600 group-hover:bg-emerald-500',
        };

  const inner = (
    <>
      <div className={`relative h-36 ${styles.header}`}>
        <svg viewBox="0 0 400 144" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
          {tone === 'classic' ? (
            <>
              {/* Sine wave — the voice as a trig function */}
              <path
                d="M20,72 Q40,20 60,72 T100,72 T140,72 T180,72 T220,72 T260,72 T300,72 T340,72 T380,72"
                fill="none"
                stroke="#fde68a"
                strokeWidth="3"
                opacity={0.7}
              />
              <path
                d="M20,92 Q35,72 50,92 T80,92 T110,92 T140,92 T170,92 T200,92 T230,92 T260,92 T290,92 T320,92 T350,92 T380,92"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                opacity={0.5}
              />
            </>
          ) : (
            <>
              {/* Spectrogram-like bars */}
              {[40, 70, 100, 130, 160, 190, 220, 250, 280, 310, 340, 370].map((x, i) => (
                <rect
                  key={i}
                  x={x - 8}
                  y={20 + (i % 3) * 12}
                  width={16}
                  height={100 - (i % 4) * 20}
                  rx={3}
                  fill="#94a3b8"
                  opacity={0.3 + (10 - i) * 0.05}
                />
              ))}
              {/* Axis */}
              <line x1={20} y1={132} x2={380} y2={132} stroke="#64748b" strokeWidth={1.5} opacity={0.5} />
            </>
          )}
        </svg>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className={`eyebrow ${styles.kicker} mb-1`}>{kicker}</div>
        <h2 className="font-display text-2xl font-bold text-brand-900">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
        <ul className="mt-4 space-y-1.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-soft">
              <span className={`mt-0.5 font-bold ${styles.tick}`} aria-hidden="true">✓</span>
              {f}
            </li>
          ))}
        </ul>
        <div
          className={`mt-5 inline-flex items-center justify-center self-start rounded-full px-5 py-2 text-sm font-semibold text-white shadow transition ${disabled ? 'bg-gray-400 cursor-not-allowed' : styles.button}`}
        >
          {cta} {!disabled && '→'}
        </div>
      </div>
    </>
  );

  if (disabled) {
    return <div className="group flex flex-col overflow-hidden rounded-xl border border-surface-line bg-surface-raised opacity-70 cursor-not-allowed">{inner}</div>;
  }

  return (
    <Link to={to} className="group flex flex-col overflow-hidden rounded-xl border border-surface-line bg-surface-raised transition hover:shadow-editorial">
      {inner}
    </Link>
  );
}
