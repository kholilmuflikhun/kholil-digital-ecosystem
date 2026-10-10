import { beforeEach, describe, expect, it, vi } from "vitest";
import { GrowthOsSink, ResendEmailSink, formatEmailText } from "@/lib/leads/sinks";
import { deliverLead } from "@/lib/leads/deliver";
import type { LeadSink } from "@/lib/leads/sinks";
import type { LeadPayload } from "@kholil/shared";

const payload: LeadPayload = {
  version: 1,
  externalId: "3f9c1a36-6d63-4f0e-9a31-0d0c1d6c8d11",
  source: "website_contact_form",
  submittedAt: "2026-10-10T00:00:00.000Z",
  name: "Budi\r\nBcc: x@evil.com",
  email: "budi@example.com",
  preferredContact: "email",
  serviceCategory: "brand-design",
  message: "Butuh logo untuk usaha.",
  context: {},
  attribution: {},
};

const ok = () => Promise.resolve(new Response("{}", { status: 200 }));

describe("sink Growth OS", () => {
  it("tidak terkonfigurasi tanpa URL dan kunci", () => {
    expect(new GrowthOsSink({}).isConfigured()).toBe(false);
    expect(new GrowthOsSink({ GROWTH_OS_API_URL: "https://x" }).isConfigured()).toBe(false);
  });

  it("mengirim ke /api/leads dengan Bearer dan menghapus garis miring akhir", async () => {
    const f = vi.fn(ok);
    await new GrowthOsSink({ GROWTH_OS_API_URL: "https://os.example.com/", GROWTH_OS_API_KEY: "k".repeat(40) }, f as never).send(payload);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://os.example.com/api/leads");
    expect((init.headers as Record<string, string>).Authorization).toBe(`Bearer ${"k".repeat(40)}`);
    expect(JSON.parse(init.body as string).externalId).toBe(payload.externalId);
  });

  it("melempar error pada respons non-2xx", async () => {
    const f = vi.fn(() => Promise.resolve(new Response("", { status: 503 })));
    await expect(new GrowthOsSink({ GROWTH_OS_API_URL: "https://a", GROWTH_OS_API_KEY: "k" }, f as never).send(payload)).rejects.toThrow("503");
  });
});

describe("sink email", () => {
  const env = { RESEND_API_KEY: "re_x", CONTACT_EMAIL: "me@example.com", CONTACT_FROM_EMAIL: "web@example.com" };

  it("subjek tidak memuat karakter baris baru (anti header injection)", async () => {
    const f = vi.fn(ok);
    await new ResendEmailSink(env, f as never).send(payload);
    const body = JSON.parse(((f.mock.calls[0] as unknown as [string, RequestInit])[1]).body as string);
    expect(body.subject).not.toMatch(/[\r\n]/);
    expect(body.reply_to).toBe("budi@example.com");
  });

  it("teks email memuat atribusi bila ada", () => {
    const t = formatEmailText({ ...payload, attribution: { utmSource: "ig" } });
    expect(t).toContain("ig");
  });
});

describe("deliverLead", () => {
  const sink = (name: string, configured: boolean, fail = false): LeadSink => ({
    name,
    isConfigured: () => configured,
    send: fail ? () => Promise.reject(new Error("gagal")) : () => Promise.resolve(),
  });
  beforeEach(() => void vi.spyOn(console, "error").mockImplementation(() => {}));

  it("not_configured bila tidak ada sink aktif (tidak pernah sukses palsu)", async () => {
    expect(await deliverLead(payload, [sink("a", false)])).toEqual({ status: "not_configured" });
  });

  it("sukses bila minimal satu sink berhasil, walau Growth OS mati", async () => {
    const r = await deliverLead(payload, [sink("email", true), sink("growth-os", true, true)]);
    expect(r).toEqual({ status: "delivered", delivered: ["email"], failed: ["growth-os"] });
  });

  it("failed bila semua sink aktif gagal", async () => {
    const r = await deliverLead(payload, [sink("email", true, true)]);
    expect(r.status).toBe("failed");
  });
});
