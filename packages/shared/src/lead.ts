import { z } from "zod";

/** Pengenal sumber lead yang stabil. Jangan diganti nama setelah ada data. */
export const LEAD_SOURCES = [
  "website_contact_form",
  "website_whatsapp",
  "website_service_inquiry",
  "website_product_inquiry",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const SERVICE_CATEGORIES = [
  "brand-design",
  "content-creative",
  "printing-apparel",
  "digital-technology",
  "lainnya",
] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const CONTACT_METHODS = ["whatsapp", "email"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

const trimmed = (max: number) => z.string().trim().max(max);
const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

/** Nomor internasional tanpa spasi/tanda baca, mis. 6281234567890 */
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => {
    const digits = v.replace(/[\s\-().]/g, "").replace(/^\+/, "");
    return digits.startsWith("0") ? `62${digits.slice(1)}` : digits; // 0812... → 62812...
  })
  .refine((v) => /^[1-9]\d{7,14}$/.test(v), "Nomor WhatsApp tidak valid (gunakan format 62812...)");

export const attributionSchema = z.object({
  utmSource: optionalTrimmed(100),
  utmMedium: optionalTrimmed(100),
  utmCampaign: optionalTrimmed(150),
  utmContent: optionalTrimmed(150),
  utmTerm: optionalTrimmed(150),
  referrer: optionalTrimmed(500),
  landingPage: optionalTrimmed(500),
});
export type Attribution = z.infer<typeof attributionSchema>;

/**
 * Kontrak lead dari website ke Growth OS (versi 1).
 * `externalId` dipakai sebagai kunci idempotensi: pengiriman ulang tidak membuat prospek ganda.
 */
export const leadPayloadSchema = z
  .object({
    version: z.literal(1),
    externalId: z.string().uuid(),
    source: z.enum(LEAD_SOURCES),
    submittedAt: z.string().datetime(),
    name: trimmed(120).min(2, "Nama minimal 2 karakter"),
    email: z.string().trim().toLowerCase().email().max(200).optional(),
    whatsapp: phoneSchema.optional(),
    preferredContact: z.enum(CONTACT_METHODS),
    businessName: optionalTrimmed(150),
    serviceCategory: z.enum(SERVICE_CATEGORIES),
    message: trimmed(3000).min(10, "Deskripsi minimal 10 karakter"),
    budgetRange: optionalTrimmed(100),
    timeline: optionalTrimmed(100),
    context: z
      .object({
        page: optionalTrimmed(300),
        serviceSlug: optionalTrimmed(120),
        productSlug: optionalTrimmed(120),
      })
      .default({}),
    attribution: attributionSchema.default({}),
  })
  .refine((v) => Boolean(v.email || v.whatsapp), {
    path: ["email"],
    message: "Isi email atau nomor WhatsApp",
  })
  .refine((v) => (v.preferredContact === "email" ? Boolean(v.email) : Boolean(v.whatsapp)), {
    path: ["preferredContact"],
    message: "Metode kontak pilihan harus punya datanya",
  });

export type LeadPayload = z.infer<typeof leadPayloadSchema>;
