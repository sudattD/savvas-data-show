import { useState } from 'react';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ProgressDots from '../components/ProgressDots';
import KeplerWonder from './kepler/KeplerWonder';
import KeplerPlot from './kepler/KeplerPlot';
import KeplerClaim from './kepler/KeplerClaim';
import type { KeplerPick } from './kepler/KeplerPlot';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function KeplersLawPage() {
  useDocumentTitle("Kepler's Third Law");
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [guess, setGuess] = useState<number | null>(null);
  const [pick, setPick] = useState<KeplerPick | null>(null);
  const [exponent, setExponent] = useState<number>(1.5);

  const restart = () => {
    setAct(1);
    setGuess(null);
    setPick(null);
    setExponent(1.5);
  };

  return (
    <div className="min-h-screen">
      <Masthead
        section="Kepler's Third Law"
        eyebrow="Algebra 2 · Topic 5 · Rational Exponents and Radical Functions"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="algebra2" topic={5} />
            <SeeAllDataLink datasetId="solarSystem" label="Explore the data" compact />
            <ProgressDots current={act} />
          </div>
        }
      />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && (
          <KeplerWonder
            onStart={(g) => {
              setGuess(g);
              setAct(2);
            }}
          />
        )}
        {act === 2 && (
          <KeplerPlot
            guess={guess}
            onNext={(p, k) => {
              setPick(p);
              setExponent(k);
              setAct(3);
            }}
          />
        )}
        {act === 3 && pick && <KeplerClaim pick={pick} exponent={exponent} onRestart={restart} />}

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('solarSystem')} pin={{ course: 'algebra2', topic: 5 }} />
        </div>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>Prototype · IAU/NASA Horizons orbital parameters · 8 planets + 3 dwarf planets, J2000.0.</div>
          <SeeAllDataLink datasetId="solarSystem" compact />
        </div>
      </footer>
    </div>
  );
}
