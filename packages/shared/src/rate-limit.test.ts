import { describe, expect, it, vi } from "vitest";
import { createRateLimiter } from "./rate-limit";

const upstashEnv = { UPSTASH_REDIS_REST_URL: "https://x.upstash.io", UPSTASH_REDIS_REST_TOKEN: "tok" };
const reply = (count: number, ttl = 30000) =>
  new Response(JSON.stringify([{ result: count }, { result: 1 }, { result: ttl }]), { status: 200 });

describe("rate limiter in-memory", () => {
  it("memblokir setelah melewati batas lalu pulih setelah jendela", async () => {
    const { rateLimit } = createRateLimiter({ env: {} });
    const t = 1_000_000;
    expect((await rateLimit("a", 2, 1000, t)).ok).toBe(true);
    expect((await rateLimit("a", 2, 1000, t + 1)).ok).toBe(true);
    const blocked = await rateLimit("a", 2, 1000, t + 2);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
    expect((await rateLimit("a", 2, 1000, t + 1500)).ok).toBe(true);
  });
  it("kunci berbeda tidak saling memengaruhi", async () => {
    const { rateLimit } = createRateLimiter({ env: {} });
    await rateLimit("a", 1, 1000);
    expect((await rateLimit("b", 1, 1000)).ok).toBe(true);
  });
});

describe("rate limiter Upstash", () => {
  it("mengizinkan sampai batas dan memblokir di atasnya, dengan header Bearer", async () => {
    const f = vi.fn().mockResolvedValueOnce(reply(5)).mockResolvedValueOnce(reply(6, 12000));
    const { rateLimit } = createRateLimiter({ env: upstashEnv, fetchImpl: f as never, prefix: "t" });
    expect((await rateLimit("k", 5, 60000)).ok).toBe(true);
    const r = await rateLimit("k", 5, 60000);
    expect(r).toEqual({ ok: false, retryAfterMs: 12000 });
    const [url, init] = f.mock.calls[0]!;
    expect(url).toBe("https://x.upstash.io/pipeline");
    expect((init as RequestInit).headers).toMatchObject({ Authorization: "Bearer tok" });
    expect(JSON.parse((init as RequestInit).body as string)[0]).toEqual(["INCR", "t:k"]);
  });
  it("jatuh ke in-memory bila Upstash error (tidak membuka seluruh batas)", async () => {
    const f = vi.fn().mockRejectedValue(new Error("network"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { rateLimit } = createRateLimiter({ env: upstashEnv, fetchImpl: f as never });
    expect((await rateLimit("k", 1, 1000)).ok).toBe(true);
    expect((await rateLimit("k", 1, 1000)).ok).toBe(false);
    spy.mockRestore();
  });
  it("respons non-200 juga memakai cadangan", async () => {
    const f = vi.fn().mockResolvedValue(new Response("nope", { status: 500 }));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { rateLimit } = createRateLimiter({ env: upstashEnv, fetchImpl: f as never });
    expect((await rateLimit("z", 1, 1000)).ok).toBe(true);
    spy.mockRestore();
  });
});
