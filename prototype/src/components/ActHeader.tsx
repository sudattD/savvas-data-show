interface ActHeaderProps {
  act: 1 | 2 | 3;
  title: string;
  subtitle: string;
}

const ACT_LABELS = {
  1: 'IDENTIFY',
  2: 'MODEL',
  3: 'INTERPRET',
};

export default function ActHeader({ act, title, subtitle }: ActHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="shrink-0 grid place-items-center w-14 h-14 rounded-xl bg-gradient-to-br from-sky-600 to-sky-800 text-white shadow-lg">
        <div className="text-[10px] font-semibold tracking-widest opacity-80">ACT</div>
        <div className="text-2xl font-display font-bold leading-none -mt-0.5">{act}</div>
      </div>
      <div>
        <div className="text-xs font-semibold tracking-widest text-sky-700">
          {ACT_LABELS[act]}
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
