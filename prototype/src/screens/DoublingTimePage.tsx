import { useState } from 'react';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ProgressDots from '../components/ProgressDots';
import MooreWonder from './moore/MooreWonder';
import MoorePlot from './moore/MoorePlot';
import MooreClaim from './moore/MooreClaim';
import type { MooreFit } from './moore/MoorePlot';
import ChapterFitsSection from '../components/ChapterFitsSection';
import LogAxisLens from '../components/calibrators/LogAxisLens';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function DoublingTimePage() {
  useDocumentTitle('Doubling Time');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [guess, setGuess] = useState<number | null>(null);
  const [fit, setFit] = useState<MooreFit | null>(null);

  const restart = () => {
    setAct(1);
    setGuess(null);
    setFit(null);
  };

  return (
    <div className="min-h-screen">
      <Masthead
        section="Doubling Time"
        eyebrow="Algebra 1 · Topic 6 · Exponents and Exponential Functions"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="algebra1" topic={6} />
            <SeeAllDataLink datasetId="moore" label="Explore the data" compact />
            <ProgressDots current={act} />
          </div>
        }
      />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && (
          <MooreWonder
            onStart={(g) => {
              setGuess(g);
              setAct(2);
            }}
          />
        )}
        {act === 2 && (
          <MoorePlot
            guess={guess}
            onNext={(f) => {
              setFit(f);
              setAct(3);
            }}
          />
        )}
        {act === 3 && fit && (
          <>
            <MooreClaim fit={fit} guess={guess} onRestart={restart} />
            <div className="mt-10">
              <div className="text-[10px] font-semibold tracking-widest text-slate-500 mb-2">
                ALSO USEFUL — A LITTLE CALIBRATOR
              </div>
              <LogAxisLens defaultSeries="moore" compact />
            </div>
          </>
        )}

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('moore')} pin={{ course: 'algebra1', topic: 6 }} />
        </div>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>Prototype · 219 microprocessors · Wikipedia transistor-count compilations.</div>
          <SeeAllDataLink datasetId="moore" compact />
        </div>
      </footer>
    </div>
  );
}
