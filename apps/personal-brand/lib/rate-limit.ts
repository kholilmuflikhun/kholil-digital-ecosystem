/**
 * Rate limiter in-memory (jendela geser). Cukup untuk satu instance dan sebagai lapisan tambahan.
 * Di Vercel (banyak instance serverless) batasnya bersifat per instance. Untuk batas global,
 * ganti isi fungsi ini dengan Upstash Redis atau Vercel KV; antarmukanya tidak perlu berubah.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false as const, retryAfterMs: windowMs - (now - hits[0]) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return { ok: true as const, retryAfterMs: 0 };
}

export function resetRateLimits() {
  buckets.clear();
}
