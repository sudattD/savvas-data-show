import { useState } from 'react';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ProgressDots from '../components/ProgressDots';
import InverseWonder from './inverse-square/InverseWonder';
import InversePlay from './inverse-square/InversePlay';
import InverseClaim from './inverse-square/InverseClaim';
import type { InversePick } from './inverse-square/InversePlay';
import ChapterFitsSection from '../components/ChapterFitsSection';
import ParsecRuler from '../components/calibrators/ParsecRuler';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

export default function InverseSquarePage() {
  useDocumentTitle('Inverse Square');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [guess, setGuess] = useState<number | null>(null);
  const [pick, setPick] = useState<InversePick | null>(null);

  const restart = () => {
    setAct(1);
    setGuess(null);
    setPick(null);
  };

  return (
    <div className="min-h-screen">
      <Masthead
        section="Inverse Square"
        eyebrow="Algebra 2 · Topic 4 · Rational Functions"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="algebra2" topic={4} />
            <SeeAllDataLink datasetId="stars" label="Explore the data" compact />
            <ProgressDots current={act} />
          </div>
        }
      />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && (
          <InverseWonder
            onStart={(g) => {
              setGuess(g);
              setAct(2);
            }}
          />
        )}
        {act === 2 && (
          <InversePlay
            onNext={(p) => {
              setPick(p);
              setAct(3);
            }}
          />
        )}
        {act === 3 && pick && (
          <>
            <InverseClaim pick={pick} guess={guess} onRestart={restart} />
            <div className="mt-10">
              <div className="text-[10px] font-semibold tracking-widest text-slate-500 mb-2">
                CONTEXT — HOW BIG ARE THESE DISTANCES?
              </div>
              <ParsecRuler compact />
            </div>
          </>
        )}

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('stars')} pin={{ course: 'algebra2', topic: 4 }} />
        </div>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>Prototype · HYG Database (Hipparcos parallax measurements) · curated to 9 famous stars.</div>
          <SeeAllDataLink datasetId="stars" compact />
        </div>
      </footer>
    </div>
  );
}
