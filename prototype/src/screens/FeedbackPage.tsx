import { useCallback, useEffect, useMemo, useState } from 'react';
import Masthead from '../components/Masthead';
import { useDocumentTitle } from '../lib/useDocumentTitle';

interface FeedbackItem {
  type: 'text-edit' | 'comment';
  selector: string;
  path: string;
  timestamp: string;
  original?: string;
  edited?: string;
  elementText?: string;
  comment?: string;
}

type Filter = 'all' | 'text-edit' | 'comment';

export default function FeedbackPage() {
  useDocumentTitle('Feedback');
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [pathFilter, setPathFilter] = useState('');
  const [confirmingClear, setConfirmingClear] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/input', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as FeedbackItem[];
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const clear = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/input', { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setItems([]);
      setConfirmingClear(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const filtered = useMemo(() => {
    const byType = filter === 'all' ? items : items.filter((i) => i.type === filter);
    const q = pathFilter.trim().toLowerCase();
    return q ? byType.filter((i) => i.path.toLowerCase().includes(q)) : byType;
  }, [items, filter, pathFilter]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)),
    [filtered],
  );

  const counts = useMemo(() => {
    const edits = items.filter((i) => i.type === 'text-edit').length;
    const comments = items.filter((i) => i.type === 'comment').length;
    return { edits, comments };
  }, [items]);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <Masthead section="Feedback" eyebrow="Admin · /api/input contents" />

      <section className="border-b border-surface-line bg-surface">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-6">
          <div className="grid md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <div className="eyebrow text-accent-600 mb-3">Review</div>
              <h1 className="editorial-hero text-3xl md:text-5xl text-brand-900 leading-tight">
                What people <em className="not-italic text-accent-600">said.</em>
              </h1>
              <p className="mt-4 text-base text-ink-soft max-w-prose leading-relaxed">
                Every submission from the <code className="font-mono text-sm bg-surface-subtle px-1.5 py-0.5 rounded">?getinput</code> widget,
                newest first. Inline text edits show the diff; element comments show the original
                text plus the note.
              </p>
            </div>
            <div className="md:col-span-4 grid grid-cols-3 gap-2">
              <Tile big label="total" value={items.length} />
              <Tile label="edits" value={counts.edits} />
              <Tile label="comments" value={counts.comments} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All ({items.length})</FilterChip>
            <FilterChip active={filter === 'text-edit'} onClick={() => setFilter('text-edit')}>Edits ({counts.edits})</FilterChip>
            <FilterChip active={filter === 'comment'} onClick={() => setFilter('comment')}>Comments ({counts.comments})</FilterChip>
            <input
              type="text"
              value={pathFilter}
              onChange={(e) => setPathFilter(e.target.value)}
              placeholder="filter by path…"
              className="ml-2 px-3 py-1.5 text-xs rounded-md border border-surface-line bg-surface-raised text-ink focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none w-48"
            />
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={load}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-surface-line bg-surface-raised text-ink-soft hover:bg-surface-subtle transition"
              >
                {loading ? 'Loading…' : 'Refresh'}
              </button>
              <button
                onClick={downloadJson}
                disabled={items.length === 0}
                className="text-xs font-semibold px-3 py-1.5 rounded-md border border-surface-line bg-surface-raised text-ink-soft hover:bg-surface-subtle transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Download JSON
              </button>
              {!confirmingClear ? (
                <button
                  onClick={() => setConfirmingClear(true)}
                  disabled={items.length === 0}
                  className="text-xs font-semibold px-3 py-1.5 rounded-md border border-rose-200 bg-surface-raised text-rose-700 hover:bg-rose-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Clear all
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-ink-soft">Really?</span>
                  <button
                    onClick={clear}
                    className="text-xs font-semibold px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition"
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setConfirmingClear(false)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-md border border-surface-line bg-surface-raised text-ink-soft hover:bg-surface-subtle transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 px-4 py-3 rounded-md bg-rose-50 border border-rose-200 text-rose-900 text-sm">
            Couldn't load feedback: <code className="font-mono">{error}</code>
          </div>
        )}

        {!error && items.length === 0 && !loading && (
          <EmptyState />
        )}

        {sorted.length > 0 && (
          <div className="space-y-3">
            {sorted.map((item, i) => (
              <FeedbackRow key={`${item.timestamp}-${i}`} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function FeedbackRow({ item }: { item: FeedbackItem }) {
  const date = new Date(item.timestamp);
  const niceTime = date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
  const isEdit = item.type === 'text-edit';

  return (
    <article className="bg-surface-raised border border-surface-line rounded-lg overflow-hidden">
      <header className="px-4 py-2 border-b border-surface-line bg-surface-subtle/40 flex flex-wrap items-baseline gap-3 text-xs">
        <span
          className={`eyebrow px-2 py-0.5 rounded ${
            isEdit ? 'bg-accent-50 text-accent-800' : 'bg-brand-50 text-brand-800'
          }`}
        >
          {isEdit ? 'edit' : 'comment'}
        </span>
        <span className="font-mono text-ink-muted">{niceTime}</span>
        <code className="font-mono text-[10px] text-ink-muted truncate" title={item.selector}>
          {item.selector}
        </code>
        <a
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto font-mono text-[11px] text-brand-700 hover:text-accent-700 hover:underline truncate max-w-[260px]"
          title={item.path}
        >
          {item.path}
        </a>
      </header>
      <div className="px-4 py-3 text-sm">
        {isEdit ? (
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <div className="eyebrow text-ink-muted mb-1">Was</div>
              <div className="text-ink-soft line-through decoration-rose-300 decoration-2 leading-relaxed">
                {item.original || <span className="italic text-ink-muted">(empty)</span>}
              </div>
            </div>
            <div>
              <div className="eyebrow text-emerald-700 mb-1">Now</div>
              <div className="text-ink leading-relaxed">
                {item.edited || <span className="italic text-ink-muted">(empty)</span>}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {item.elementText && (
              <div>
                <div className="eyebrow text-ink-muted mb-1">On this</div>
                <div className="text-ink-soft italic leading-relaxed">"{item.elementText}"</div>
              </div>
            )}
            <div>
              <div className="eyebrow text-brand-700 mb-1">Comment</div>
              <div className="text-ink leading-relaxed whitespace-pre-wrap">{item.comment}</div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface-raised border border-surface-line rounded-lg p-10 text-center">
      <div className="eyebrow text-ink-muted mb-2">No feedback yet</div>
      <div className="text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
        Share any page URL with <code className="font-mono bg-surface-subtle px-1.5 py-0.5 rounded">?getinput</code> appended
        — visitors can click any text to edit it inline or any element to leave a comment.
        Submissions show up here on refresh.
      </div>
    </div>
  );
}

function Tile({ label, value, big }: { label: string; value: number | string; big?: boolean }) {
  return (
    <div className={`rounded-lg bg-surface-raised border border-surface-line p-3 ${big ? 'ring-2 ring-accent-200' : ''}`}>
      <div className="font-display font-black text-brand-900 text-3xl tabular-nums leading-none">{value}</div>
      <div className="eyebrow text-ink-muted mt-2">{label}</div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition ${
        active
          ? 'bg-brand-900 text-white border-brand-900'
          : 'bg-surface-raised border-surface-line text-ink-soft hover:bg-surface-subtle'
      }`}
    >
      {children}
    </button>
  );
}
