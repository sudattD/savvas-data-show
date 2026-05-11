// Vercel serverless function for collecting feedback from the InputWidget.
// POST appends a feedback item; GET returns all persisted items.
//
// Storage strategy:
//   - If BLOB_READ_WRITE_TOKEN is set, persist to Vercel Blob (recommended).
//     Each POST reads the current array, appends, and writes it back.
//   - Otherwise, fall back to an in-memory ring buffer + stdout logging.
//     The in-memory store is lossy across cold starts; logs are durable
//     for the Vercel log-retention window.
//
// To enable real persistence: open the Vercel dashboard → Storage → Blob,
// connect a Blob store to this project, and redeploy. The token gets
// auto-provisioned; no code change needed.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put, list, del } from '@vercel/blob';

interface FeedbackItem {
  type: 'text-edit' | 'comment';
  selector: string;
  path: string;
  timestamp: string;
  // text-edit fields
  original?: string;
  edited?: string;
  // comment fields
  elementText?: string;
  comment?: string;
}

// One blob per item — keys sort lexicographically by timestamp + suffix so
// GET enumerates in order. This avoids the read-modify-write race that bit
// us with the single-blob-array pattern (Vercel Blob's CDN serves stale
// reads of public URLs, so two POSTs in rapid succession each saw [] and
// the last write won).
const PREFIX = 'input/items/';
const RING: FeedbackItem[] = [];
const MAX_RING = 500;

function blobEnabled(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function itemKey(item: FeedbackItem): string {
  // ts then random suffix lets duplicate-timestamp posts coexist.
  const rand = Math.random().toString(36).slice(2, 8);
  return `${PREFIX}${item.timestamp}-${rand}.json`;
}

async function readAll(): Promise<FeedbackItem[]> {
  if (!blobEnabled()) return [...RING];
  try {
    const { blobs } = await list({ prefix: PREFIX });
    if (blobs.length === 0) return [];
    // Sort newest-first by pathname (which starts with the ISO timestamp).
    const sorted = [...blobs].sort((a, b) => (a.pathname < b.pathname ? 1 : -1));
    const items = await Promise.all(
      sorted.map(async (b) => {
        try {
          const res = await fetch(`${b.url}?t=${Date.now()}`, { cache: 'no-store' });
          if (!res.ok) return null;
          return (await res.json()) as FeedbackItem;
        } catch {
          return null;
        }
      }),
    );
    return items.filter((i): i is FeedbackItem => i !== null);
  } catch (e) {
    console.error('[input] blob list failed:', e);
    return [];
  }
}

async function append(item: FeedbackItem): Promise<number> {
  if (!blobEnabled()) {
    RING.push(item);
    if (RING.length > MAX_RING) RING.shift();
    return RING.length;
  }
  await put(itemKey(item), JSON.stringify(item), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
  // Don't re-list to get the count; that's another CDN hit. Just return -1
  // to signal "stored, count unknown from this request".
  return -1;
}

async function clearAll(): Promise<void> {
  if (!blobEnabled()) {
    RING.length = 0;
    return;
  }
  const { blobs } = await list({ prefix: PREFIX });
  if (blobs.length === 0) return;
  await del(blobs.map((b) => b.url));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — the widget lives on the same origin, but be permissive for review URLs.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    const items = await readAll();
    return res.status(200).json(items);
  }

  if (req.method === 'POST') {
    try {
      const item = (req.body ?? {}) as FeedbackItem;
      if (!item.type || !item.timestamp) {
        return res.status(400).json({ error: 'Invalid feedback item' });
      }
      const count = await append(item);
      // Log a compact line so it's also visible in `vercel logs`.
      const summary =
        item.type === 'text-edit'
          ? `EDIT [${item.path}] "${truncate(item.original)}" → "${truncate(item.edited)}"`
          : `COMMENT [${item.path}] "${truncate(item.elementText)}": ${truncate(item.comment)}`;
      console.log(`[input] ${item.timestamp} ${summary} (store=${blobEnabled() ? 'blob' : 'memory'} total=${count})`);
      return res.status(200).json({ success: true, count, store: blobEnabled() ? 'blob' : 'memory' });
    } catch (e) {
      console.error('[input] failed to save:', e);
      return res.status(500).json({ error: 'Failed to save' });
    }
  }

  if (req.method === 'DELETE') {
    await clearAll();
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function truncate(s: string | undefined, max = 120): string {
  if (!s) return '';
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}
