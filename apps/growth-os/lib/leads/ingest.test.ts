import { describe, expect, it, vi } from "vitest";
import { leadPayloadSchema } from "@kholil/shared";
import { buildProspectData, extractBearer, ingestLead, safeEqual } from "./ingest";

const payload = leadPayloadSchema.parse({
  version: 1,
  externalId: "7b3f2c1e-8a41-4b6e-9d52-0c1a2b3c4d5e",
  source: "website_contact_form",
  submittedAt: "2026-10-09T04:00:00.000Z",
  name: "Budi Santoso",
  whatsapp: "0812 3456 7890",
  preferredContact: "whatsapp",
  businessName: "Kopi Senja",
  serviceCategory: "brand-design",
  message: "Saya butuh logo dan kemasan untuk usaha kopi.",
  budgetRange: "2-5 juta",
  attribution: { utmSource: "instagram", utmCampaign: "okt" },
});

function fakeDb(opts: { owner?: boolean; existing?: boolean } = {}) {
  const { owner = true, existing = false } = opts;
  return {
    user: { findUnique: vi.fn().mockResolvedValue(owner ? { id: "u1" } : null) },
    activityLog: {
      findFirst: vi.fn().mockResolvedValue(existing ? { id: "a1" } : null),
      create: vi.fn().mockResolvedValue({}),
    },
    prospect: { create: vi.fn().mockResolvedValue({ id: "p1" }) },
  };
}

describe("safeEqual / extractBearer", () => {
  it("membandingkan kunci dengan benar", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "abcd")).toBe(false);
  });
  it("mengekstrak token Bearer", () => {
    expect(extractBearer("Bearer xyz")).toBe("xyz");
    expect(extractBearer("bearer  xyz ")).toBe("xyz");
    expect(extractBearer("Basic xyz")).toBeNull();
    expect(extractBearer(null)).toBeNull();
  });
});

describe("buildProspectData", () => {
  it("memetakan payload ke prospek dengan atribusi", () => {
    const d = buildProspectData(payload, "u1");
    expect(d.userId).toBe("u1");
    expect(d.whatsapp).toBe("6281234567890");
    expect(d.source).toBe("website:instagram");
    expect(d.status).toBe("NEW");
    expect(d.notes).toContain("UTM: instagram / okt");
    expect(d.notes).toContain("Brand & Design");
  });
});

describe("ingestLead", () => {
  it("membuat prospek dan mencatat externalId", async () => {
    const db = fakeDb();
    const r = await ingestLead(db as never, payload, "owner@example.com");
    expect(r).toEqual({ ok: true, duplicate: false });
    expect(db.prospect.create).toHaveBeenCalledOnce();
    expect(db.activityLog.create).toHaveBeenCalledOnce();
  });

  it("idempoten: pengiriman ulang tidak membuat prospek ganda", async () => {
    const db = fakeDb({ existing: true });
    const r = await ingestLead(db as never, payload, "owner@example.com");
    expect(r).toEqual({ ok: true, duplicate: true });
    expect(db.prospect.create).not.toHaveBeenCalled();
  });

  it("gagal bila akun pemilik tidak ada, tanpa menulis data", async () => {
    const db = fakeDb({ owner: false });
    const r = await ingestLead(db as never, payload, "x@example.com");
    expect(r).toEqual({ ok: false, reason: "owner_not_found" });
    expect(db.prospect.create).not.toHaveBeenCalled();
  });
});
