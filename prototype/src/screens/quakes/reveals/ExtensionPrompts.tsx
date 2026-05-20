import { useState } from 'react';

// "Create Your Own Problem" — extension prompts students can take into
// independent research. Each card poses a question the data we've shown
// can't fully answer, nudging students to find more data or apply the
// same approach to a different phenomenon.

interface Prompt {
  title: string;
  detail: string;
  hint: string;
}

const PROMPTS: readonly Prompt[] = [
  {
    title: 'I want to visit Indonesia — when should I go to avoid earthquake season?',
    detail: 'A real student question. Use the time histogram from earlier to think about it.',
    hint: "Trick question: there's no earthquake season. Quakes are roughly constant year-round because plate motion is constant. So when you go doesn't matter — where you stay does.",
  },
  {
    title: 'Where would you go on the planet to be safest from quakes?',
    detail: 'Use the reveals you just saw. Name three regions and defend each one.',
    hint: 'Plate interiors. Central Africa, central Australia, central Brazil, central Canada — far from any plate boundary.',
  },
  {
    title: 'Could you build a map like this for hurricanes? For tornadoes?',
    detail: 'Same idea, different data. NOAA publishes both. What pattern would you expect to see?',
    hint: 'Hurricanes cluster in warm-ocean bands (Atlantic basin, western Pacific, Indian Ocean). Tornadoes cluster in the US Midwest "Tornado Alley." The method (plot lat/lon, look for clusters) is the same — only the physics changes.',
  },
  {
    title: 'After a big quake, where do aftershocks happen?',
    detail: 'You\'d need a finer dataset (M2.5+ within 100 km of a specific event) but the same tools work.',
    hint: 'Aftershocks cluster near the mainshock and decay over time (Omori\'s law). Same map idea, smaller geographic scale.',
  },
];

export default function ExtensionPrompts() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
      <div className="text-[10px] font-semibold tracking-widest text-rose-700">
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
      className="text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-sm transition"
    >
      <div className="text-sm font-semibold text-ink leading-snug">{prompt.title}</div>
      <div className="text-xs text-slate-600 mt-1 leading-snug">{prompt.detail}</div>
      {open && (
        <div className="mt-3 pt-3 border-t border-rose-100 text-xs text-rose-900 italic leading-snug">
          <span className="font-semibold not-italic text-rose-700">Hint: </span>
          {prompt.hint}
        </div>
      )}
      <div className="mt-2 text-[10px] font-semibold tracking-widest text-rose-600">
        {open ? '↑ HIDE HINT' : '↓ SHOW HINT'}
      </div>
    </button>
  );
}
