const hits = new Map<string, number[]>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

/** Память процесса. На нескольких инстансах Vercel лимит не общий. */
export function rateLimit(key: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
    hits.set(key, recent);
    return { ok: false, retryAfterSec };
  }
  recent.push(now);
  hits.set(key, recent);
  return { ok: true };
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
