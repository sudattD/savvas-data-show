import type { ReactNode } from 'react';

interface HostBubbleProps {
  name?: string;
  children: ReactNode;
  /** Tailwind hue family for the avatar — e.g. 'sky', 'purple', 'emerald'. */
  accent?: string;
}

const HUES: Record<string, [string, string, string]> = {
  sky: ['from-sky-500', 'to-sky-700', 'border-sky-100'],
  purple: ['from-purple-500', 'to-pink-500', 'border-purple-100'],
  emerald: ['from-emerald-500', 'to-emerald-700', 'border-emerald-100'],
  amber: ['from-amber-500', 'to-orange-500', 'border-amber-100'],
  slate: ['from-slate-500', 'to-slate-700', 'border-slate-100'],
  rose: ['from-rose-500', 'to-rose-700', 'border-rose-100'],
};

export default function HostBubble({ name = 'Casey', children, accent = 'sky' }: HostBubbleProps) {
  const [from, to, border] = HUES[accent] ?? HUES.sky;
  const initials = name.charAt(0).toUpperCase();
  return (
    <div className="flex gap-3 items-start">
      <div
        className={`shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${from} ${to} grid place-items-center text-white font-display font-bold text-lg shadow-md`}
      >
        {initials}
      </div>
      <div className={`relative bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border ${border} max-w-2xl`}>
        <div className="text-xs font-semibold text-slate-700 mb-0.5 uppercase tracking-wider">{name}</div>
        <div className="text-ink leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
