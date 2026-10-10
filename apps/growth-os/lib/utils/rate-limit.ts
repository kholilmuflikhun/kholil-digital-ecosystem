/**
 * Rate limiter in-memory (sliding window sederhana).
 * Cukup untuk satu instance. Di Vercel (serverless, multi-instance) ganti dengan
 * Upstash Redis / @upstash/ratelimit: cukup ubah isi fungsi ini, antarmukanya tetap sama.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false as const, retryAfterMs: windowMs - (now - hits[0]) };
  }
  hits.push(now);
  buckets.set(key, hits);

  // Bersihkan sesekali agar map tidak membesar
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return { ok: true as const, retryAfterMs: 0 };
}
