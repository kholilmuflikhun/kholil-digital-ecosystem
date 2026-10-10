import { describe, expect, it } from "vitest";
import { leadPayloadSchema, phoneSchema } from "./lead";

const base = {
  version: 1 as const,
  externalId: "7b3f2c1e-8a41-4b6e-9d52-0c1a2b3c4d5e",
  source: "website_contact_form" as const,
  submittedAt: "2026-10-09T04:00:00.000Z",
  name: "Budi Santoso",
  email: "Budi@Example.com",
  preferredContact: "email" as const,
  serviceCategory: "brand-design" as const,
  message: "Saya butuh logo dan kemasan untuk usaha kopi.",
};

describe("leadPayloadSchema", () => {
  it("menerima payload valid dan menormalkan email", () => {
    const r = leadPayloadSchema.parse(base);
    expect(r.email).toBe("budi@example.com");
    expect(r.context).toEqual({});
  });

  it("menolak bila email dan WhatsApp sama-sama kosong", () => {
    const { email: _email, ...rest } = base;
    void _email;
    expect(leadPayloadSchema.safeParse({ ...rest, preferredContact: "email" }).success).toBe(false);
  });

  it("menolak metode kontak pilihan tanpa datanya", () => {
    expect(leadPayloadSchema.safeParse({ ...base, preferredContact: "whatsapp" }).success).toBe(false);
  });

  it("menolak versi, sumber, dan id yang tidak dikenal", () => {
    expect(leadPayloadSchema.safeParse({ ...base, version: 2 }).success).toBe(false);
    expect(leadPayloadSchema.safeParse({ ...base, source: "unknown" }).success).toBe(false);
    expect(leadPayloadSchema.safeParse({ ...base, externalId: "abc" }).success).toBe(false);
  });

  it("menolak deskripsi terlalu pendek", () => {
    expect(leadPayloadSchema.safeParse({ ...base, message: "halo" }).success).toBe(false);
  });
});

describe("phoneSchema", () => {
  it("membersihkan spasi, tanda baca, dan plus", () => {
    expect(phoneSchema.parse("+62 812-3456-7890")).toBe("6281234567890");
  });
  it("mengubah awalan 0 menjadi kode negara 62", () => {
    expect(phoneSchema.parse("0812 3456 7890")).toBe("6281234567890");
  });
  it("menolak nomor yang tidak valid", () => {
    expect(phoneSchema.safeParse("0812").success).toBe(false);
    expect(phoneSchema.safeParse("abc").success).toBe(false);
  });
});
