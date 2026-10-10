import { describe, expect, it } from "vitest";
import { contactFormSchema, parseAttribution, pickSource, toLeadPayload } from "@/lib/leads/schema";
import { leadPayloadSchema } from "@kholil/shared";

const valid = {
  name: "Budi Santoso",
  email: "Budi@Example.com",
  whatsapp: "",
  preferredContact: "email",
  serviceCategory: "brand-design",
  message: "Saya butuh desain logo untuk usaha kopi.",
  startedAt: "1700000000000",
};

describe("contactFormSchema", () => {
  it("menerima input valid dan menormalkan email", () => {
    const r = contactFormSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("budi@example.com");
  });

  it("mengubah nomor 08 menjadi 62", () => {
    const r = contactFormSchema.safeParse({ ...valid, email: "", whatsapp: "081234567890", preferredContact: "whatsapp" });
    expect(r.success && r.data.whatsapp).toBe("6281234567890");
  });

  it("menolak bila tidak ada email maupun WhatsApp", () => {
    expect(contactFormSchema.safeParse({ ...valid, email: "" }).success).toBe(false);
  });

  it("menolak bila metode pilihan tidak diisi datanya", () => {
    expect(contactFormSchema.safeParse({ ...valid, preferredContact: "whatsapp" }).success).toBe(false);
  });

  it("menolak pesan pendek, nama pendek, dan email salah", () => {
    expect(contactFormSchema.safeParse({ ...valid, message: "pendek" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...valid, email: "bukan-email" }).success).toBe(false);
  });

  it("menolak honeypot terisi dan pesan penuh tautan", () => {
    expect(contactFormSchema.safeParse({ ...valid, company_website: "spam" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...valid, message: "cek http://a.co http://b.co http://c.co ya" }).success).toBe(false);
  });

  it("menolak kategori atau metode di luar daftar", () => {
    expect(contactFormSchema.safeParse({ ...valid, serviceCategory: "hack" }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...valid, preferredContact: "sms" }).success).toBe(false);
  });
});

describe("lead payload", () => {
  const input = contactFormSchema.parse({
    ...valid,
    productSlug: "paket-landing-page",
    attribution: JSON.stringify({ utmSource: "instagram", utmCampaign: "oktober", landingPage: "/products" }),
  });

  it("menghasilkan payload yang lolos kontrak bersama", () => {
    const payload = toLeadPayload(input, "3f9c1a36-6d63-4f0e-9a31-0d0c1d6c8d11", new Date("2026-10-10T00:00:00Z"));
    expect(leadPayloadSchema.safeParse(payload).success).toBe(true);
    expect(payload.source).toBe("website_product_inquiry");
    expect(payload.attribution.utmSource).toBe("instagram");
    expect(payload.submittedAt).toBe("2026-10-10T00:00:00.000Z");
  });

  it("pickSource memprioritaskan produk, lalu layanan, lalu formulir umum", () => {
    expect(pickSource({ productSlug: "a", serviceSlug: "b" })).toBe("website_product_inquiry");
    expect(pickSource({ serviceSlug: "b" })).toBe("website_service_inquiry");
    expect(pickSource({})).toBe("website_contact_form");
  });

  it("atribusi rusak atau tidak dikenal diabaikan, bukan menggagalkan", () => {
    expect(parseAttribution("{bukan json")).toEqual({});
    expect(parseAttribution(undefined)).toEqual({});
    expect(parseAttribution(JSON.stringify({ utmSource: "x", evil: "y" }))).toEqual({ utmSource: "x" });
  });
});
