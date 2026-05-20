import { useState } from 'react';

// "Create Your Own Problem" — extension prompts students can take into
// independent research. Each poses a question this dataset can't fully
// answer, nudging students to find more data or apply the same modeling
// approach to a different phenomenon.

interface Prompt {
  title: string;
  detail: string;
  hint: string;
}

const PROMPTS: readonly Prompt[] = [
  {
    title: 'A 5 MW offshore turbine is much bigger. How would its power curve differ?',
    detail: 'Same shape, different numbers. Sketch what changes and what stays the same.',
    hint: 'Same three regimes and the same quadratic-then-flat shape — but a higher rated power (a flatter, higher ceiling) and a similar cut-in speed. The parabola would be steeper because the blades sweep more area.',
  },
  {
    title: 'Braking distance vs. car speed is also quadratic. Why?',
    detail: 'Look up a braking-distance table and check the second differences.',
    hint: 'A moving car\'s kinetic energy is ½mv² — proportional to speed squared. The brakes must dissipate all of it, so stopping distance grows with v². Double the speed, quadruple the distance.',
  },
  {
    title: 'Find the real cut-in and rated speeds for a turbine model online.',
    detail: 'Manufacturers publish full power curves. Compare one to what you saw here.',
    hint: 'Typical land turbines: cut-in ≈ 3–4 m/s, rated ≈ 11–15 m/s, cut-out ≈ 25 m/s. Your dataset turbine fits right in that range.',
  },
  {
    title: 'Where does the quadratic model break — and is that a failure?',
    detail: 'Think about the cut-in and rated zones you saw in the Regime lens.',
    hint: 'It "breaks" outside the ramp-up zone — but that\'s not a failure. Every model has a domain where it works. Knowing the boundary is part of using the model well.',
  },
];

export default function ExtensionPrompts() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
      <div className="text-[10px] font-semibold tracking-widest text-sky-700">
        CREATE YOUR OWN PROBLEM · EXTENSION
      </div>
      <h3 className="font-display text-xl font-bold text-ink leading-tight mt-1">
        Take this method somewhere new.
      </h3>
      <p className="text-xs text-slate-600 mt-1 mb-4">
        Tap a prompt to see a hint. The real point is: try one for homework.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {PROMPTS.map((p) => (
          <PromptCard key={p.title} prompt={p} />
        ))}
      </div>
    </div>
  );
}

function PromptCard({ prompt }: { prompt: Prompt }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-sky-300 hover:shadow-sm transition"
    >
      <div className="text-sm font-semibold text-ink leading-snug">{prompt.title}</div>
      <div className="text-xs text-slate-600 mt-1 leading-snug">{prompt.detail}</div>
      {open && (
        <div className="mt-3 pt-3 border-t border-sky-100 text-xs text-sky-900 italic leading-snug">
          <span className="font-semibold not-italic text-sky-700">Hint: </span>
          {prompt.hint}
        </div>
      )}
      <div className="mt-2 text-[10px] font-semibold tracking-widest text-sky-600">
        {open ? '↑ HIDE HINT' : '↓ SHOW HINT'}
      </div>
    </button>
  );
}
