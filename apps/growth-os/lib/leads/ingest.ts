import { createHash, timingSafeEqual } from "node:crypto";
import type { PrismaClient, Prisma } from "@prisma/client";
import type { LeadPayload } from "@kholil/shared";

/** Perbandingan konstan-waktu untuk API key (hash dulu agar panjang sama). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function extractBearer(header: string | null): string | null {
  if (!header) return null;
  const m = /^Bearer\s+(.+)$/i.exec(header.trim());
  return m ? m[1] : null;
}

const CATEGORY_LABEL: Record<LeadPayload["serviceCategory"], string> = {
  "brand-design": "Brand & Design",
  "content-creative": "Content & Creative",
  "printing-apparel": "Printing & Apparel",
  "digital-technology": "Digital & Technology",
  lainnya: "Lainnya",
};

/** Ubah payload website menjadi data Prospect. Tidak ada field skema baru. */
export function buildProspectData(p: LeadPayload, userId: string): Prisma.ProspectUncheckedCreateInput {
  const a = p.attribution;
  const lines = [
    `[Website] ${p.message}`,
    `Layanan: ${CATEGORY_LABEL[p.serviceCategory]}`,
    p.context.serviceSlug ? `Halaman layanan: ${p.context.serviceSlug}` : null,
    p.context.productSlug ? `Produk: ${p.context.productSlug}` : null,
    p.budgetRange ? `Budget: ${p.budgetRange}` : null,
    p.timeline ? `Timeline: ${p.timeline}` : null,
    `Kontak pilihan: ${p.preferredContact}`,
    a.utmSource || a.utmMedium || a.utmCampaign
      ? `UTM: ${[a.utmSource, a.utmMedium, a.utmCampaign].filter(Boolean).join(" / ")}`
      : null,
    a.referrer ? `Referrer: ${a.referrer}` : null,
    a.landingPage ? `Landing page: ${a.landingPage}` : null,
  ].filter(Boolean);

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return {
    userId,
    name: p.name,
    businessName: p.businessName,
    email: p.email,
    whatsapp: p.whatsapp,
    source: a.utmSource ? `website:${a.utmSource}` : p.source,
    status: "NEW",
    probability: 10,
    nextFollowUpAt: tomorrow,
    notes: lines.join("\n").slice(0, 4000),
  };
}

export type IngestResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; reason: "owner_not_found" };

type IngestDb = Pick<PrismaClient, "user" | "$transaction">;

/** Pelanggaran constraint unik Prisma (P2002), dideteksi tanpa bergantung pada kelas error. */
export function isUniqueViolation(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "P2002";
}

/**
 * Simpan lead ke akun pemilik (ditentukan server lewat env, tidak pernah dari payload).
 * Idempotensi dijamin database lewat constraint unik (userId, externalId), sehingga
 * dua permintaan bersamaan dengan externalId sama tidak pernah menghasilkan dua prospek.
 * Prospek, log aktivitas, dan notifikasi in-app ditulis dalam satu transaksi.
 */
export async function ingestLead(
  db: IngestDb,
  payload: LeadPayload,
  ownerEmail: string,
): Promise<IngestResult> {
  const owner = await db.user.findUnique({ where: { email: ownerEmail }, select: { id: true } });
  if (!owner) return { ok: false, reason: "owner_not_found" };

  try {
    await db.$transaction(async (tx) => {
      const prospect = await tx.prospect.create({
        data: { ...buildProspectData(payload, owner.id), externalId: payload.externalId },
      });
      await tx.activityLog.create({
        data: {
          userId: owner.id,
          action: "lead.ingested",
          entityType: "Prospect",
          entityId: prospect.id,
          metadata: { externalId: payload.externalId, source: payload.source },
        },
      });
      await tx.notification.create({
        data: {
          userId: owner.id,
          type: "FOLLOW_UP",
          title: `Lead baru dari website: ${payload.name}`,
          body: `Layanan: ${CATEGORY_LABEL[payload.serviceCategory]}. Hubungi dalam 24 jam.`,
          entityType: "Prospect",
          entityId: prospect.id,
          dedupeKey: `lead:${payload.externalId}`,
        },
      });
    });
  } catch (e) {
    if (isUniqueViolation(e)) return { ok: true, duplicate: true };
    throw e;
  }
  return { ok: true, duplicate: false };
}
