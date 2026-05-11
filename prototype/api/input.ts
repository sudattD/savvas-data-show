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
import { put, list } from '@vercel/blob';

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

const BLOB_KEY = 'input/feedback.json';
const RING: FeedbackItem[] = [];
const MAX_RING = 500;

function blobEnabled(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

async function readAll(): Promise<FeedbackItem[]> {
  if (!blobEnabled()) return [...RING];
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    const match = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!match) return [];
    const res = await fetch(match.url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = (await res.json()) as FeedbackItem[];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[input] blob read failed:', e);
    return [];
  }
}

async function append(item: FeedbackItem): Promise<number> {
  if (!blobEnabled()) {
    RING.push(item);
    if (RING.length > MAX_RING) RING.shift();
    return RING.length;
  }
  const current = await readAll();
  current.push(item);
  await put(BLOB_KEY, JSON.stringify(current), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return current.length;
}

async function clearAll(): Promise<void> {
  if (!blobEnabled()) {
    RING.length = 0;
    return;
  }
  await put(BLOB_KEY, '[]', {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
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
