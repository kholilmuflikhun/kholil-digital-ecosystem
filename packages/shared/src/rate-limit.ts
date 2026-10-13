/**
 * Rate limiter dengan dua backend:
 *  - Upstash Redis (REST) bila UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN diatur: batas global lintas instance.
 *  - In-memory (jendela geser) sebagai cadangan: dipakai bila Upstash tidak dikonfigurasi atau sedang gagal.
 * Tanpa dependensi tambahan (memakai fetch). Jendela Upstash bersifat tetap (fixed window).
 */
export type RateLimitResult = { ok: boolean; retryAfterMs: number };

type Env = Record<string, string | undefined>;

export type RateLimiterOptions = {
  env?: Env;
  fetchImpl?: typeof fetch;
  /** Prefiks kunci agar aplikasi berbeda tidak berbagi ember. */
  prefix?: string;
  timeoutMs?: number;
};

export function createRateLimiter(opts: RateLimiterOptions = {}) {
  const buckets = new Map<string, number[]>();

  function memory(key: string, limit: number, windowMs: number, now: number): RateLimitResult {
    const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
    if (hits.length >= limit) {
      buckets.set(key, hits);
      return { ok: false, retryAfterMs: windowMs - (now - hits[0]!) };
    }
    hits.push(now);
    buckets.set(key, hits);
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
    return { ok: true, retryAfterMs: 0 };
  }

  async function upstash(url: string, token: string, key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
    const f = opts.fetchImpl ?? fetch;
    const k = `${opts.prefix ?? "rl"}:${key}`;
    const res = await f(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", k], ["PEXPIRE", k, String(windowMs), "NX"], ["PTTL", k]]),
      signal: AbortSignal.timeout(opts.timeoutMs ?? 1500),
    });
    if (!res.ok) throw new Error(`upstash ${res.status}`);
    const out = (await res.json()) as { result?: unknown; error?: string }[];
    if (!Array.isArray(out) || out[0]?.error || typeof out[0]?.result !== "number") throw new Error("upstash bad response");
    const count = out[0].result;
    const ttl = typeof out[2]?.result === "number" && out[2].result > 0 ? out[2].result : windowMs;
    return count > limit ? { ok: false, retryAfterMs: ttl } : { ok: true, retryAfterMs: 0 };
  }

  async function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): Promise<RateLimitResult> {
    const env = opts.env ?? (typeof process !== "undefined" ? process.env : {});
    const url = env.UPSTASH_REDIS_REST_URL;
    const token = env.UPSTASH_REDIS_REST_TOKEN;
    if (url && token) {
      try {
        return await upstash(url, token, key, limit, windowMs);
      } catch (e) {
        console.error("rate limit: Upstash gagal, memakai cadangan in-memory", e instanceof Error ? e.message : e);
      }
    }
    return memory(key, limit, windowMs, now);
  }

  return { rateLimit, reset: () => buckets.clear() };
}
