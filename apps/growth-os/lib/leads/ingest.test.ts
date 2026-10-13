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

function fakeDb(opts: { owner?: boolean; duplicate?: boolean; fail?: boolean } = {}) {
  const { owner = true, duplicate = false, fail = false } = opts;
  const tx = {
    prospect: {
      create: vi.fn().mockImplementation(async () => {
        if (duplicate) throw Object.assign(new Error("Unique constraint"), { code: "P2002" });
        if (fail) throw new Error("db down");
        return { id: "p1" };
      }),
    },
    activityLog: { create: vi.fn().mockResolvedValue({}) },
    notification: { create: vi.fn().mockResolvedValue({}) },
  };
  return {
    tx,
    user: { findUnique: vi.fn().mockResolvedValue(owner ? { id: "u1" } : null) },
    $transaction: vi.fn(async (fn: (t: typeof tx) => Promise<unknown>) => fn(tx)),
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
  it("membuat prospek, log aktivitas, dan notifikasi dalam satu transaksi", async () => {
    const db = fakeDb();
    const r = await ingestLead(db as never, payload, "owner@example.com");
    expect(r).toEqual({ ok: true, duplicate: false });
    expect(db.$transaction).toHaveBeenCalledOnce();
    expect(db.tx.prospect.create.mock.calls[0]![0].data.externalId).toBe(payload.externalId);
    expect(db.tx.activityLog.create).toHaveBeenCalledOnce();
    const n = db.tx.notification.create.mock.calls[0]![0].data;
    expect(n.dedupeKey).toBe(`lead:${payload.externalId}`);
    expect(n.userId).toBe("u1");
  });

  it("idempoten: pelanggaran constraint unik dianggap duplikat, bukan error", async () => {
    const db = fakeDb({ duplicate: true });
    const r = await ingestLead(db as never, payload, "owner@example.com");
    expect(r).toEqual({ ok: true, duplicate: true });
    expect(db.tx.activityLog.create).not.toHaveBeenCalled();
  });

  it("error database lain tetap dilempar (tidak ditelan sebagai duplikat)", async () => {
    const db = fakeDb({ fail: true });
    await expect(ingestLead(db as never, payload, "owner@example.com")).rejects.toThrow("db down");
  });

  it("gagal bila akun pemilik tidak ada, tanpa menulis data", async () => {
    const db = fakeDb({ owner: false });
    const r = await ingestLead(db as never, payload, "x@example.com");
    expect(r).toEqual({ ok: false, reason: "owner_not_found" });
    expect(db.$transaction).not.toHaveBeenCalled();
  });
});
