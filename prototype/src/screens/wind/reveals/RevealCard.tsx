import type { ReactNode } from 'react';

interface RevealCardProps {
  index: number;
  question: string;
  takeaway: ReactNode;
  /** Optional one-line subtitle for what data is being shown. */
  source?: string;
  children: ReactNode;
}

// One card per wonder chip the class picked. Reads like:
// [Q index] · Question
// [Viz]
// [Take-away callout]
export default function RevealCard({ index, question, takeaway, source, children }: RevealCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 sm:p-6 border-b border-slate-100">
        <div className="flex items-baseline gap-3">
          <div className="grid place-items-center w-8 h-8 rounded-lg bg-sky-600 text-white font-display font-bold text-sm shrink-0">
            Q{index}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-ink leading-tight">
              {question}
            </h3>
            {source && (
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">{source}</div>
            )}
          </div>
        </div>
      </div>

      <div>{children}</div>

      <div className="p-5 sm:p-6 bg-amber-50 border-t border-amber-100">
        <div className="text-[10px] font-semibold tracking-widest text-amber-700 mb-1">
          WHAT THE DATA SHOWS
        </div>
        <div className="text-sm text-amber-900 leading-relaxed">{takeaway}</div>
      </div>
    </div>
  );
}
