interface ProgressDotsProps {
  current: 1 | 2 | 3;
}

export default function ProgressDots({ current }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full grid place-items-center text-sm font-semibold transition-all ${
              n < current
                ? 'bg-sky-600 text-white'
                : n === current
                ? 'bg-sky-600 text-white ring-4 ring-sky-200'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {n}
          </div>
          {n < 3 && (
            <div
              className={`w-8 h-0.5 ${n < current ? 'bg-sky-600' : 'bg-slate-200'}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
