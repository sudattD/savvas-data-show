interface ProgressDotsProps {
  current: number;
  total?: number;
}

export default function ProgressDots({ current, total = 3 }: ProgressDotsProps) {
  const dots = Array.from({ length: total }, (_, i) => i + 1);
  const compact = total > 3;
  const dotSize = compact ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';
  const lineWidth = compact ? 'w-3' : 'w-8';
  const gap = compact ? 'gap-1.5' : 'gap-2';
  const ring = compact ? 'ring-2' : 'ring-4';
  return (
    <div className={`flex items-center ${gap}`}>
      {dots.map((n) => (
        <div key={n} className={`flex items-center ${gap}`}>
          <div
            className={`${dotSize} rounded-full grid place-items-center font-semibold transition-all ${
              n < current
                ? 'bg-sky-600 text-white'
                : n === current
                ? `bg-sky-600 text-white ${ring} ring-sky-200`
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {n}
          </div>
          {n < total && (
            <div
              className={`${lineWidth} h-0.5 ${n < current ? 'bg-sky-600' : 'bg-slate-200'}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
