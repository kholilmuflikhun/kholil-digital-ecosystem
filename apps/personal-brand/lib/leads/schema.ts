import { z } from "zod";
import {
  CONTACT_METHODS, SERVICE_CATEGORIES, attributionSchema, phoneSchema,
  type LeadPayload, type LeadSource,
} from "@kholil/shared";

const emptyToUndefined = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);
const opt = <T extends z.ZodTypeAny>(s: T) => z.preprocess(emptyToUndefined, s.optional());

/** Validasi data mentah dari formulir kontak (sisi server). */
export const contactFormSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120, "Nama terlalu panjang"),
    email: opt(z.string().trim().toLowerCase().email("Format email tidak valid").max(200)),
    whatsapp: opt(phoneSchema),
    preferredContact: z.enum(CONTACT_METHODS, { errorMap: () => ({ message: "Pilih metode kontak" }) }),
    businessName: opt(z.string().trim().max(150)),
    serviceCategory: z.enum(SERVICE_CATEGORIES, { errorMap: () => ({ message: "Pilih kategori layanan" }) }),
    message: z.string().trim().min(10, "Ceritakan kebutuhan Anda minimal 10 karakter").max(3000, "Maksimal 3000 karakter"),
    budgetRange: opt(z.string().trim().max(100)),
    timeline: opt(z.string().trim().max(100)),
    // konteks
    page: opt(z.string().trim().max(300)),
    serviceSlug: opt(z.string().trim().max(120)),
    productSlug: opt(z.string().trim().max(120)),
    // anti-spam
    company_website: z.string().max(0).optional(), // honeypot: harus kosong
    startedAt: z.coerce.number().int().positive(),
    // atribusi: JSON string dari sessionStorage
    attribution: opt(z.string().max(2000)),
  })
  .refine((v) => Boolean(v.email || v.whatsapp), { path: ["email"], message: "Isi email atau nomor WhatsApp" })
  .refine((v) => (v.preferredContact === "email" ? Boolean(v.email) : Boolean(v.whatsapp)), {
    path: ["preferredContact"],
    message: "Isi data untuk metode kontak yang Anda pilih",
  })
  .refine((v) => (v.message.match(/https?:\/\//gi) ?? []).length <= 2, {
    path: ["message"],
    message: "Pesan memuat terlalu banyak tautan",
  });

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export function parseAttribution(raw: string | undefined) {
  if (!raw) return {};
  try {
    const parsed = attributionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}

export function pickSource(input: Pick<ContactFormInput, "productSlug" | "serviceSlug">): LeadSource {
  if (input.productSlug) return "website_product_inquiry";
  if (input.serviceSlug) return "website_service_inquiry";
  return "website_contact_form";
}

/** Susun payload lead bertipe dari input formulir yang sudah valid. */
export function toLeadPayload(input: ContactFormInput, externalId: string, now = new Date()): LeadPayload {
  return {
    version: 1,
    externalId,
    source: pickSource(input),
    submittedAt: now.toISOString(),
    name: input.name,
    email: input.email,
    whatsapp: input.whatsapp,
    preferredContact: input.preferredContact,
    businessName: input.businessName,
    serviceCategory: input.serviceCategory,
    message: input.message,
    budgetRange: input.budgetRange,
    timeline: input.timeline,
    context: { page: input.page, serviceSlug: input.serviceSlug, productSlug: input.productSlug },
    attribution: parseAttribution(input.attribution),
  };
}
