import type { ReactNode } from 'react';

interface HostBubbleProps {
  children: ReactNode;
  /** Tailwind hue family for the accent — e.g. 'sky', 'purple', 'emerald'. */
  accent?: string;
  /** Ignored. Kept for source-compatibility with old callers; the bubble is
   *  no longer narrated by a named character. */
  name?: string;
}

const HUES: Record<string, [string, string, string, string]> = {
  // [gradient-from, gradient-to, border-color, accent-text-for-glyph]
  sky: ['from-sky-100', 'to-sky-50', 'border-sky-200', 'text-sky-600'],
  purple: ['from-purple-100', 'to-pink-50', 'border-purple-200', 'text-purple-600'],
  emerald: ['from-emerald-100', 'to-emerald-50', 'border-emerald-200', 'text-emerald-600'],
  amber: ['from-amber-100', 'to-orange-50', 'border-amber-200', 'text-amber-600'],
  slate: ['from-slate-100', 'to-slate-50', 'border-slate-200', 'text-slate-600'],
  rose: ['from-rose-100', 'to-rose-50', 'border-rose-200', 'text-rose-600'],
  pink: ['from-pink-100', 'to-pink-50', 'border-pink-200', 'text-pink-600'],
};

export default function HostBubble({ children, accent = 'sky' }: HostBubbleProps) {
  const [from, to, border, glyph] = HUES[accent] ?? HUES.sky;
  return (
    <div className="flex gap-3 items-start">
      <div
        aria-hidden
        className={`shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${from} ${to} border ${border} grid place-items-center ${glyph}`}
      >
        {/* Pull-quote glyph — a generic "voice of the text" mark, not a character. */}
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
          <path d="M7.5 5.5C5.0 5.5 3 7.5 3 10c0 2.5 1.7 4 4 4.3-.4 1.4-1.4 2-2.6 2.2-.3 0-.4.3-.2.5C5.5 18.4 8 17.5 9.5 15c1.3-2 1.6-4 1.6-5.5 0-2.2-1.6-4-3.6-4Zm9 0c-2.5 0-4.5 2-4.5 4.5 0 2.5 1.7 4 4 4.3-.4 1.4-1.4 2-2.6 2.2-.3 0-.4.3-.2.5 1.3 1.4 3.8.5 5.3-2 1.3-2 1.6-4 1.6-5.5 0-2.2-1.6-4-3.6-4Z" />
        </svg>
      </div>
      <div className={`relative bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border ${border} max-w-2xl`}>
        <div className="text-ink leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
