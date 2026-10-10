import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-forwarded-for": "1.2.3.4" }) }));

import { submitContact } from "@/app/contact/actions";
import { initialContactState } from "@/app/contact/state";
import { resetRateLimits } from "@/lib/rate-limit";

const base = () => {
  const fd = new FormData();
  fd.set("name", "Budi Santoso");
  fd.set("email", "budi@example.com");
  fd.set("preferredContact", "email");
  fd.set("serviceCategory", "brand-design");
  fd.set("message", "Saya butuh desain logo untuk usaha kopi.");
  fd.set("startedAt", String(Date.now() - 10_000));
  return fd;
};

const clearEnv = () => {
  for (const k of ["RESEND_API_KEY", "CONTACT_EMAIL", "CONTACT_FROM_EMAIL", "GROWTH_OS_API_URL", "GROWTH_OS_API_KEY"]) vi.stubEnv(k, "");
};

describe("submitContact", () => {
  beforeEach(() => {
    resetRateLimits();
    vi.unstubAllEnvs();
    clearEnv();
  });

  it("tanpa sink terkonfigurasi: not_configured, bukan sukses palsu", async () => {
    const r = await submitContact(initialContactState, base());
    expect(r.status).toBe("not_configured");
  });

  it("input tidak valid mengembalikan galat per kolom", async () => {
    const fd = base();
    fd.set("message", "pendek");
    const r = await submitContact(initialContactState, fd);
    expect(r.status).toBe("invalid");
    if (r.status === "invalid") expect(r.fieldErrors.message).toBeTruthy();
  });

  it("honeypot terisi ditolak", async () => {
    const fd = base();
    fd.set("company_website", "spam");
    expect((await submitContact(initialContactState, fd)).status).not.toBe("success");
  });

  it("pengiriman terlalu cepat ditolak", async () => {
    const fd = base();
    fd.set("startedAt", String(Date.now()));
    expect((await submitContact(initialContactState, fd)).status).toBe("error");
  });

  it("sukses bila Growth OS terkonfigurasi dan merespons OK", async () => {
    vi.stubEnv("GROWTH_OS_API_URL", "https://os.example.com");
    vi.stubEnv("GROWTH_OS_API_KEY", "k".repeat(40));
    const f = vi.fn(async () => new Response("{}", { status: 201 }));
    vi.stubGlobal("fetch", f);
    const r = await submitContact(initialContactState, base());
    vi.unstubAllGlobals();
    expect(r.status).toBe("success");
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("dibatasi laju: percobaan ke-6 dari IP sama ditolak", async () => {
    const results = [];
    for (let i = 0; i < 6; i++) results.push((await submitContact(initialContactState, base())).status);
    expect(results[5]).toBe("rate_limited");
  });
});
