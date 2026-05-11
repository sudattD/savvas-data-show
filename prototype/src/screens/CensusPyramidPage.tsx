import { useState } from 'react';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import ProgressDots from '../components/ProgressDots';
import CensusIdentify from './census/CensusIdentify';
import CensusModel from './census/CensusModel';
import CensusInterpret from './census/CensusInterpret';
import type { CensusIdentifyState } from './census/CensusIdentify';
import { useDocumentTitle } from '../lib/useDocumentTitle';

const EMPTY: CensusIdentifyState = {
  firstQuestion: '', mainQuestion: '', whoChangedMore: '', seniorChangePp: 0, reasoning: '', tooLow: 0, tooHigh: 0,
};

export default function CensusPyramidPage() {
  useDocumentTitle('120 Years of America');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [identify, setIdentify] = useState<CensusIdentifyState>(EMPTY);

  const restart = () => {
    setAct(1);
    setIdentify(EMPTY);
  };

  return (
    <div className="min-h-screen">
      <Masthead
        section="120 Years of America"
        eyebrow="Algebra 1 · Topic 12 · Distributions"
        right={
          <div className="flex items-center gap-4">
            <SeeAllDataLink datasetId="population" label="Explore the data" compact />
            <ProgressDots current={act} />
          </div>
        }
      />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && (
          <CensusIdentify
            onNext={(s) => {
              setIdentify(s);
              setAct(2);
            }}
          />
        )}
        {act === 2 && <CensusModel onNext={() => setAct(3)} />}
        {act === 3 && <CensusInterpret identify={identify} onRestart={restart} />}
      </main>
      <footer className="border-t border-surface-line mt-16 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-baseline justify-between gap-3 text-xs text-ink-muted">
          <div>Prototype · US Census Bureau · 1900 decennial census + 2020 population estimates (vintage 2024).</div>
          <SeeAllDataLink datasetId="population" compact />
        </div>
      </footer>
    </div>
  );
}
