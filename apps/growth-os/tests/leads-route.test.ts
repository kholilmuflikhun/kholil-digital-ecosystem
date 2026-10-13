import { beforeEach, describe, expect, it, vi } from "vitest";

const ingestLead = vi.fn();
const rateLimit = vi.fn();
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/utils/rate-limit", () => ({ rateLimit: (...a: unknown[]) => rateLimit(...a) }));
vi.mock("@/lib/leads/ingest", async (orig) => ({ ...(await orig<typeof import("@/lib/leads/ingest")>()), ingestLead: (...a: unknown[]) => ingestLead(...a) }));

import { POST } from "@/app/api/leads/route";

const KEY = "k".repeat(40);
const valid = {
  version: 1,
  externalId: "7b3f2c1e-8a41-4b6e-9d52-0c1a2b3c4d5e",
  source: "website_contact_form",
  submittedAt: "2026-10-09T04:00:00.000Z",
  name: "Budi Santoso",
  whatsapp: "081234567890",
  preferredContact: "whatsapp",
  serviceCategory: "brand-design",
  message: "Saya butuh logo dan kemasan untuk usaha kopi.",
  attribution: {},
};

const req = (body: unknown, headers: Record<string, string> = { authorization: `Bearer ${KEY}` }) =>
  new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

beforeEach(() => {
  vi.stubEnv("LEAD_INGEST_API_KEY", KEY);
  vi.stubEnv("LEAD_INGEST_USER_EMAIL", "owner@example.com");
  ingestLead.mockReset().mockResolvedValue({ ok: true, duplicate: false });
  rateLimit.mockReset().mockResolvedValue({ ok: true, retryAfterMs: 0 });
});

describe("POST /api/leads", () => {
  it("503 bila belum dikonfigurasi (kunci pendek)", async () => {
    vi.stubEnv("LEAD_INGEST_API_KEY", "pendek");
    expect((await POST(req(valid))).status).toBe(503);
  });
  it("401 tanpa header atau dengan kunci salah, dan tidak menyentuh database", async () => {
    expect((await POST(req(valid, {}))).status).toBe(401);
    expect((await POST(req(valid, { authorization: `Bearer ${"x".repeat(40)}` }))).status).toBe(401);
    expect(ingestLead).not.toHaveBeenCalled();
  });
  it("429 bila rate limit terlampaui", async () => {
    rateLimit.mockResolvedValue({ ok: false, retryAfterMs: 1000 });
    expect((await POST(req(valid))).status).toBe(429);
  });
  it("413 untuk badan terlalu besar", async () => {
    const big = { ...valid, message: "a".repeat(40_000) };
    expect((await POST(req(big))).status).toBe(413);
  });
  it("400 untuk JSON rusak", async () => {
    expect((await POST(req("{bukan json"))).status).toBe(400);
  });
  it("422 untuk payload tidak valid, hanya menyebut nama field", async () => {
    const res = await POST(req({ ...valid, whatsapp: "abc", message: "x" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toBe("invalid_payload");
    expect(JSON.stringify(body)).not.toContain("Budi");
  });
  it("201 untuk lead baru dan 200 untuk duplikat (idempoten)", async () => {
    const created = await POST(req(valid));
    expect(created.status).toBe(201);
    ingestLead.mockResolvedValue({ ok: true, duplicate: true });
    const dup = await POST(req(valid));
    expect(dup.status).toBe(200);
    expect(await dup.json()).toEqual({ ok: true, duplicate: true });
  });
  it("pemilik ditentukan server dari env, bukan payload", async () => {
    await POST(req({ ...valid, userId: "attacker", ownerEmail: "evil@example.com" }));
    expect(ingestLead.mock.calls[0]![2]).toBe("owner@example.com");
  });
  it("503 bila akun pemilik tidak ditemukan", async () => {
    ingestLead.mockResolvedValue({ ok: false, reason: "owner_not_found" });
    expect((await POST(req(valid))).status).toBe(503);
  });
  it("500 tanpa membocorkan detail error", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    ingestLead.mockRejectedValue(new Error("password=secret"));
    const res = await POST(req(valid));
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("secret");
    spy.mockRestore();
  });
});
