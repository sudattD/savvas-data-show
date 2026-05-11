import { useState } from 'react';
import Masthead from '../components/Masthead';
import ProgressDots from '../components/ProgressDots';
import ReactionIdentify from './reaction/ReactionIdentify';
import ReactionPlay from './reaction/ReactionPlay';
import ReactionInterpret from './reaction/ReactionInterpret';
import type { IdentifyState } from './reaction/ReactionIdentify';
import type { ReactionTrials } from './reaction/ReactionPlay';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

const EMPTY: IdentifyState = {
  firstQuestion: '', mainQuestion: '', conjecture: 0, reasoning: '', tooLow: 0, tooHigh: 0,
};

const EMPTY_TRIALS: ReactionTrials = { visual: [], audio: [] };

export default function ReactionTimePage() {
  useDocumentTitle('Reaction Time');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [identify, setIdentify] = useState<IdentifyState>(EMPTY);
  const [trials, setTrials] = useState<ReactionTrials>(EMPTY_TRIALS);

  const restart = () => {
    setAct(1);
    setIdentify(EMPTY);
    setTrials(EMPTY_TRIALS);
  };

  return (
    <div className="min-h-screen">
      <Masthead
        section="Reaction Time Arena"
        eyebrow="Algebra 1 · Topic 11 · Statistics"
        right={<ProgressDots current={act} />}
      />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {act === 1 && (
          <ReactionIdentify
            onNext={(s) => {
              setIdentify(s);
              setAct(2);
            }}
          />
        )}
        {act === 2 && (
          <ReactionPlay
            onNext={(t) => {
              setTrials(t);
              setAct(3);
            }}
          />
        )}
        {act === 3 && <ReactionInterpret identify={identify} trials={trials} onRestart={restart} />}

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('marathon')} pin={{ course: 'algebra1', topic: 11 }} />
        </div>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6 text-center text-xs text-ink-muted">
        Prototype · all data stays on your device · visual ~270 ms · audio ~160 ms (Woods et al. 2015).
      </footer>
    </div>
  );
}
