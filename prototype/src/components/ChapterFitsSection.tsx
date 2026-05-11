import { useState } from 'react';
import type { ChapterFit, Dataset } from '../lib/dataset';
import { COURSE_LABEL } from '../lib/dataset';

interface Props {
  dataset: Dataset;
}

type View = 'student' | 'teacher';

export default function ChapterFitsSection({ dataset }: Props) {
  const fits = dataset.chapterFits;
  const [view, setView] = useState<View>('student');
  const [active, setActive] = useState(0);

  if (!fits || fits.length === 0) return null;

  const fit = fits[Math.min(active, fits.length - 1)];

  return (
    <section className="bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
      <header className="px-5 py-3 border-b border-surface-line bg-surface-subtle/40 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="eyebrow text-ink-muted">How this fits the chapter</div>
          <div className="text-xs text-ink-muted mt-0.5">
            {fits.length === 1
              ? 'One chapter, written for both roles below.'
              : `${fits.length} chapters this dataset earns its place in.`}
          </div>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </header>

      {fits.length > 1 && (
        <div className="px-5 py-3 border-b border-surface-line bg-surface-subtle/20 flex flex-wrap gap-2">
          {fits.map((f, i) => {
            const isActive = i === active;
            return (
              <button
                key={`${f.course}-${f.topic}`}
                type="button"
                onClick={() => setActive(i)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'bg-surface-raised border border-surface-line text-ink-soft hover:bg-surface-subtle'
                }`}
              >
                <span className={`font-mono text-[10px] ${isActive ? 'text-white/70' : 'text-ink-muted'}`}>
                  {courseShort(f.course)}·T{f.topic}
                </span>
                <span>{f.topicName}</span>
                {f.flagship && (
                  <span
                    className={`text-[9px] eyebrow px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/15 text-white' : 'bg-accent-50 text-accent-700'
                    }`}
                  >
                    flagship
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="px-5 py-5">
        {view === 'student' ? <StudentView fit={fit} /> : <TeacherView fit={fit} />}
      </div>
    </section>
  );
}

function ViewToggle({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <div className="flex bg-surface-subtle rounded-lg p-0.5 text-xs font-semibold" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={view === 'student'}
        onClick={() => onChange('student')}
        className={`px-3 py-1.5 rounded-md transition ${
          view === 'student' ? 'bg-surface-raised text-brand-900 shadow-sm' : 'text-ink-soft hover:text-ink'
        }`}
      >
        For the student
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={view === 'teacher'}
        onClick={() => onChange('teacher')}
        className={`px-3 py-1.5 rounded-md transition ${
          view === 'teacher' ? 'bg-surface-raised text-brand-900 shadow-sm' : 'text-ink-soft hover:text-ink'
        }`}
      >
        For the teacher
      </button>
    </div>
  );
}

function StudentView({ fit }: { fit: ChapterFit }) {
  return (
    <div className="space-y-5">
      <div>
        <div className="eyebrow text-ink-muted mb-2">Why this is in your chapter</div>
        <p className="text-base text-ink leading-relaxed">{fit.studentWhy}</p>
      </div>
      <div className="bg-accent-50/60 border border-accent-200 rounded-md p-4">
        <div className="eyebrow text-accent-800 mb-1.5">After this, you'll be able to</div>
        <p className="text-sm text-ink leading-relaxed">{studentObjective(fit.objective)}</p>
      </div>
      <div className="text-xs text-ink-muted flex items-center gap-3 pt-1">
        <span className="font-mono">~{fit.minutes} min</span>
        <span className="text-surface-line">·</span>
        <span>{COURSE_LABEL[fit.course]} · Topic {fit.topic} · {fit.topicName}</span>
      </div>
    </div>
  );
}

function TeacherView({ fit }: { fit: ChapterFit }) {
  return (
    <div className="space-y-5 text-sm">
      <div className="grid sm:grid-cols-[1fr_auto] gap-x-6 gap-y-2 items-baseline">
        <div>
          <div className="eyebrow text-ink-muted mb-1">Chapter</div>
          <div className="font-display text-lg font-bold text-brand-900 leading-tight">
            {COURSE_LABEL[fit.course]} · Topic {fit.topic} · {fit.topicName}
          </div>
        </div>
        <div className="text-xs text-ink-muted font-mono">~{fit.minutes} min</div>
      </div>

      <div>
        <div className="eyebrow text-ink-muted mb-1.5">Objective</div>
        <p className="text-ink leading-relaxed">{fit.objective}</p>
      </div>

      <div>
        <div className="eyebrow text-ink-muted mb-1.5">Why this dataset fits this topic</div>
        <p className="text-ink-soft leading-relaxed italic">{fit.mathFit}</p>
      </div>

      <div>
        <div className="eyebrow text-ink-muted mb-1.5">Standards (CCSS-M)</div>
        <div className="flex flex-wrap gap-1.5">
          {fit.standards.map((s) => (
            <code
              key={s}
              className="font-mono text-[11px] bg-surface-subtle border border-surface-line rounded px-2 py-0.5 text-ink"
            >
              {s}
            </code>
          ))}
        </div>
      </div>

      <div>
        <div className="eyebrow text-ink-muted mb-1.5">Discussion prompts</div>
        <ol className="space-y-2 pl-5 list-decimal text-ink leading-relaxed marker:text-ink-muted marker:font-mono">
          {fit.discussion.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function courseShort(c: ChapterFit['course']): string {
  if (c === 'algebra1') return 'Alg 1';
  if (c === 'geometry') return 'Geo';
  return 'Alg 2';
}

// Strip leading "Students will " when showing the objective in student voice.
function studentObjective(objective: string): string {
  const m = objective.match(/^Students will\s+(.*)$/i);
  if (!m) return objective;
  const rest = m[1];
  // capitalize the first character of the trimmed rest
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}
