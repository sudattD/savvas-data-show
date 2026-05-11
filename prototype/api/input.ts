// Vercel serverless function for collecting feedback from the InputWidget.
// POST appends a feedback item; GET returns recent items.
//
// Storage strategy: persist to Vercel Blob if BLOB_READ_WRITE_TOKEN is set,
// otherwise log to stdout (visible via `vercel logs --follow`) and keep an
// in-memory ring buffer for the duration of the function instance. The
// in-memory store is enough for live-demo feedback collection; Blob is the
// path to persistent multi-session capture.

import type { VercelRequest, VercelResponse } from '@vercel/node';

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

// In-memory store for the lifetime of this function instance. Cold starts
// reset this — fine for short demo windows; Blob is the upgrade path.
const RING: FeedbackItem[] = [];
const MAX_RING = 500;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — the widget lives on the same origin, but be permissive for review URLs.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(RING);
  }

  if (req.method === 'POST') {
    try {
      const item = (req.body ?? {}) as FeedbackItem;
      if (!item.type || !item.timestamp) {
        return res.status(400).json({ error: 'Invalid feedback item' });
      }
      RING.push(item);
      if (RING.length > MAX_RING) RING.shift();
      // Log a compact line so it's easy to scan in `vercel logs`.
      const summary =
        item.type === 'text-edit'
          ? `EDIT [${item.path}] "${truncate(item.original)}" → "${truncate(item.edited)}"`
          : `COMMENT [${item.path}] "${truncate(item.elementText)}": ${truncate(item.comment)}`;
      console.log(`[input] ${item.timestamp} ${summary}`);
      return res.status(200).json({ success: true, count: RING.length });
    } catch (e) {
      console.error('[input] failed to save:', e);
      return res.status(500).json({ error: 'Failed to save' });
    }
  }

  if (req.method === 'DELETE') {
    RING.length = 0;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

function truncate(s: string | undefined, max = 120): string {
  if (!s) return '';
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}
