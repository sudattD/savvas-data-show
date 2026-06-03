import { useCallback, useState } from 'react';
import Masthead from '../components/Masthead';
import SeeAllDataLink from '../components/SeeAllDataLink';
import EnvisionVideoLink from '../components/EnvisionVideoLink';
import ProgressDots from '../components/ProgressDots';
import ReactionIdentify from './reaction/classic/ReactionIdentify';
import ReactionPlay from './reaction/classic/ReactionPlay';
import ReactionInterpret from './reaction/ReactionInterpret';
import type { IdentifyState } from './reaction/ReactionIdentify';
import type { ReactionTrials } from './reaction/ReactionPlay';
import {
  ReactionClassicBackdrop,
  ReactionNextRow,
  ReactionProgressRail,
} from './reaction/classic/ReactionClassicShell';
import type { ReactionAdvanceState } from './reaction/classic/ReactionClassicShell';
import ChapterFitsSection from '../components/ChapterFitsSection';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { getDataset } from '../data/registry';

const EMPTY: IdentifyState = {
  firstQuestion: '', mainQuestion: '', conjecture: 0, reasoning: '', tooLow: 0, tooHigh: 0,
};

const EMPTY_TRIALS: ReactionTrials = { visual: [], audio: [] };

export default function ReactionTimeClassicPage() {
  useDocumentTitle('Reaction Time Arena · Statistics');
  const [act, setAct] = useState<1 | 2 | 3>(1);
  const [identify, setIdentify] = useState<IdentifyState>(EMPTY);
  const [trials, setTrials] = useState<ReactionTrials>(EMPTY_TRIALS);
  const [advance, setAdvance] = useState<ReactionAdvanceState | null>(null);

  const restart = () => {
    setAct(1);
    setIdentify(EMPTY);
    setTrials(EMPTY_TRIALS);
    setAdvance(null);
  };

  const handleAdvanceStateChange = useCallback((next: ReactionAdvanceState) => {
    setAdvance(next);
  }, []);

  // Cross-Act Back fallback
  const fallbackBack =
    act === 2 ? () => { setAct(1); setAdvance(null); } :
    act === 3 ? () => { setAct(2); setAdvance(null); } :
    undefined;
  const fallbackBackLabel =
    act === 2 ? 'Back to notice & wonder' :
    act === 3 ? 'Back to investigate' :
    undefined;

  return (
    <ReactionClassicBackdrop>
      <Masthead
        section="Reaction Time Arena"
        eyebrow="Algebra 1 · Topic 11 · Statistics"
        right={
          <div className="flex items-center gap-4">
            <EnvisionVideoLink course="algebra1" topic={11} />
            <SeeAllDataLink datasetId="marathon" label="Explore the data" compact />
            <ProgressDots current={act} />
          </div>
        }
      />
      <ReactionProgressRail current={act} step={advance?.step} stepLabels={advance?.stepLabels} />
      <main className="max-w-5xl mx-auto px-6 py-8 xl:ml-80">
        {act === 1 && (
          <ReactionIdentify
            onNext={(s) => {
              setIdentify(s);
              setAct(2);
              setAdvance(null);
            }}
            onAdvanceStateChange={handleAdvanceStateChange}
          />
        )}
        {act === 2 && (
          <ReactionPlay
            onNext={(t) => {
              setTrials(t);
              setAct(3);
              setAdvance(null);
            }}
            onAdvanceStateChange={handleAdvanceStateChange}
          />
        )}
        {act === 3 && (
          <ReactionInterpret
            identify={identify}
            trials={trials}
            onRestart={restart}
            narrator="sarah"
          />
        )}

        <div className="mt-8">
          <ReactionNextRow
            advance={advance}
            fallbackBack={fallbackBack}
            fallbackBackLabel={fallbackBackLabel}
          />
        </div>

        <div className="mt-12">
          <ChapterFitsSection dataset={getDataset('marathon')} pin={{ course: 'algebra1', topic: 11 }} />
        </div>
      </main>
      <footer className="border-t border-surface-line mt-16 py-6 text-center text-xs text-ink-muted">
        Prototype · all data stays on your device · visual ~270 ms · audio ~160 ms (Woods et al. 2015).
      </footer>
    </ReactionClassicBackdrop>
  );
}
