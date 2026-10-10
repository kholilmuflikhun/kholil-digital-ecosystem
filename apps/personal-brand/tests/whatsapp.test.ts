import { describe, expect, it } from "vitest";
import { buildWhatsAppText, buildWhatsAppUrl, normalizeWhatsAppNumber } from "@/lib/whatsapp";

describe("normalizeWhatsAppNumber", () => {
  it.each([
    ["081234567890", "6281234567890"],
    ["+62 812-3456-7890", "6281234567890"],
    ["6281234567890", "6281234567890"],
  ])("%s → %s", (raw, out) => expect(normalizeWhatsAppNumber(raw)).toBe(out));

  it.each([undefined, null, "", "abc", "123", "0"])("menolak %s", (raw) => expect(normalizeWhatsAppNumber(raw as string)).toBeUndefined());
});

describe("buildWhatsAppUrl", () => {
  it("mengembalikan null bila nomor belum dikonfigurasi", () => {
    expect(buildWhatsAppUrl(undefined, { name: "A" })).toBeNull();
  });

  it("meng-encode pesan dengan benar", () => {
    const url = buildWhatsAppUrl("081234567890", { name: "Budi & Ani", service: "Logo", message: "Butuh logo?\nCepat!" }) as string;
    expect(url.startsWith("https://wa.me/6281234567890?text=")).toBe(true);
    const text = decodeURIComponent(url.split("?text=")[1]);
    expect(text).toContain("Budi & Ani");
    expect(text).toContain("Butuh logo?\nCepat!");
    expect(url).not.toMatch(/\s/);
    expect(url.split("?text=")[1]).not.toContain("&");
  });

  it("memotong pesan sangat panjang", () => {
    const text = buildWhatsAppText({ message: "x".repeat(5000) });
    expect(text.length).toBeLessThan(1100);
  });

  it("memakai teks bawaan bila tidak ada layanan", () => {
    expect(buildWhatsAppText({})).toContain("kebutuhan bisnis");
  });
});
