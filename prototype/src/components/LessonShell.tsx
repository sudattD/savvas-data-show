import type { ReactNode } from 'react';
import Masthead from './Masthead';
import SeeAllDataLink from './SeeAllDataLink';
import EnvisionVideoLink from './EnvisionVideoLink';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { CourseId } from '../data/chapters';

interface LessonShellProps {
  number: string;
  family: string;
  title: string;
  concept: string;
  children: ReactNode;
  accent?: string;
  /** When set, render a prominent "Explore the data →" link in the masthead
   *  that opens the Explorer with this dataset id. */
  exploreDataset?: string;
  /** When set, render a "▶ enVision 3-Act video" link in the masthead pointing
   *  at the Savvas-official QR target for this chapter. */
  envisionChapter?: { course: CourseId; topic: number };
}

const SPINE: Record<string, string> = {
  rose: 'bg-rose-500', amber: 'bg-accent-500', emerald: 'bg-emerald-500',
  sky: 'bg-sky-500', violet: 'bg-violet-500',
};

const FAMILY_TONE: Record<string, string> = {
  'VISUAL DECEPTION': 'text-rose-700',
  'STATISTICAL THINKING': 'text-accent-700',
  'DATA HYGIENE': 'text-emerald-700',
};

export default function LessonShell({ number, family, title, concept, children, accent = 'sky', exploreDataset, envisionChapter }: LessonShellProps) {
  useDocumentTitle(title);
  const right = (exploreDataset || envisionChapter) ? (
    <div className="flex items-center gap-2">
      {exploreDataset && <SeeAllDataLink datasetId={exploreDataset} label="Explore the data" compact />}
      {envisionChapter && <EnvisionVideoLink course={envisionChapter.course} topic={envisionChapter.topic} />}
    </div>
  ) : undefined;
  return (
    <div className="min-h-screen">
      <Masthead
        section={title}
        eyebrow={`Lesson ${number} · ${concept}`}
        right={right}
      />
      <div className={`h-1 ${SPINE[accent] ?? 'bg-brand-500'}`} />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6 eyebrow flex items-center gap-3">
          <span className="font-mono text-ink-muted">{number}</span>
          <span className={FAMILY_TONE[family] ?? 'text-brand-700'}>{family}</span>
        </div>
        {children}
      </main>
    </div>
  );
}
