import { z } from "zod";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung");

export const pillarIds = ["brand-design", "content-creative", "printing-apparel", "digital-technology"] as const;
export const pillarIdSchema = z.enum(pillarIds);
export type PillarId = z.infer<typeof pillarIdSchema>;

/** ready: siap dikerjakan · by-request: dikerjakan sesuai pesanan, dikonfirmasi saat konsultasi · coming-soon: belum tersedia */
export const availabilitySchema = z.enum(["available", "by-request", "coming-soon", "unavailable"]);
export type Availability = z.infer<typeof availabilitySchema>;

export const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(5, "Alt text wajib deskriptif"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type ImageAsset = z.infer<typeof imageSchema>;

// ─────────── Layanan ───────────
export const pillarSchema = z.object({
  id: pillarIdSchema,
  name: z.string().min(2),
  tagline: z.string().min(10),
  description: z.string().min(30),
  kind: z.enum(["design", "production", "digital"]),
});
export type Pillar = z.infer<typeof pillarSchema>;

export const serviceSchema = z.object({
  slug,
  pillar: pillarIdSchema,
  name: z.string().min(2),
  summary: z.string().min(20),
  deliverables: z.array(z.string().min(3)).min(2),
  idealFor: z.string().optional(),
  availability: availabilitySchema.default("by-request"),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(170).optional(),
});
export type Service = z.infer<typeof serviceSchema>;

// ─────────── Produk ───────────
export const productCategories = [
  "branding",
  "social-media",
  "printing-apparel",
  "digital-products",
  "technology",
] as const;
export const productCategorySchema = z.enum(productCategories);
export type ProductCategory = z.infer<typeof productCategorySchema>;

export const productTypes = [
  "one-time-service",
  "service-package",
  "digital-download",
  "template",
  "design-asset",
  "mockup",
  "business-template",
  "custom-project",
  "web-package",
  "print-order",
] as const;

export const pricingSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("fixed"), amount: z.number().positive(), currency: z.string().length(3) }),
  z.object({ mode: z.literal("starting-from"), amount: z.number().positive(), currency: z.string().length(3) }),
  z.object({ mode: z.literal("custom-quotation") }),
  z.object({ mode: z.literal("contact") }),
]);
export type Pricing = z.infer<typeof pricingSchema>;

export const productSchema = z.object({
  id: z.string().min(2),
  slug,
  name: z.string().min(2),
  shortDescription: z.string().min(20).max(220),
  fullDescription: z.string().min(40),
  category: productCategorySchema,
  type: z.enum(productTypes),
  pricing: pricingSchema,
  featured: z.boolean().default(false),
  availability: availabilitySchema,
  /** Isi hanya bila estimasi sudah terverifikasi. */
  deliveryEstimate: z.string().optional(),
  features: z.array(z.string().min(3)).default([]),
  deliverables: z.array(z.string().min(3)).default([]),
  revisionPolicy: z.string().optional(),
  gallery: z.array(imageSchema).default([]),
  ctaLabel: z.string().min(3),
  /** "inquiry" = formulir kontak dengan konteks produk; atau URL penuh (mis. halaman checkout eksternal). */
  ctaDestination: z.union([z.literal("inquiry"), z.string().url()]).default("inquiry"),
  relatedServices: z.array(slug).default([]),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(170).optional(),
  published: z.boolean().default(true),
});
export type Product = z.infer<typeof productSchema>;

// ─────────── Portofolio ───────────
export const projectTypes = ["client", "internal-brand", "personal-experiment", "concept", "open-source"] as const;
export const projectCategories = [
  "branding",
  "packaging",
  "social-media",
  "marketing",
  "printing-apparel",
  "website-digital",
  "business-systems",
] as const;

export const projectSchema = z.object({
  slug,
  title: z.string().min(3),
  summary: z.string().min(30),
  type: z.enum(projectTypes),
  category: z.enum(projectCategories),
  year: z.number().int().min(2000).max(2100).optional(),
  /** Nama klien hanya boleh tampil bila `clientVerified` = true dan ada izin publikasi. */
  client: z.string().optional(),
  clientVerified: z.boolean().default(false),
  context: z.string().min(20),
  problem: z.string().min(20),
  approach: z.string().min(20),
  deliverables: z.array(z.string().min(3)).min(1),
  /** Hasil nyata. Biarkan kosong bila belum ada data terverifikasi. */
  outcome: z.string().optional(),
  tools: z.array(z.string()).default([]),
  relatedServices: z.array(slug).default([]),
  images: z.array(imageSchema).default([]),
  /** Ilustrasi prosedural untuk proyek konsep yang belum punya aset asli. */
  art: z.object({ variant: z.enum(["packaging", "identity", "social", "apparel", "web", "system"]) }).optional(),
  url: z.string().url().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});
export type Project = z.infer<typeof projectSchema>;

// ─────────── Artikel ───────────
export const articleBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string().min(1) }),
  z.object({ type: z.literal("h2"), text: z.string().min(1) }),
  z.object({ type: z.literal("ul"), items: z.array(z.string().min(1)).min(1) }),
]);
export type ArticleBlock = z.infer<typeof articleBlockSchema>;

export const articleSchema = z.object({
  slug,
  title: z.string().min(10).max(110),
  description: z.string().min(40).max(200),
  category: z.string().min(3),
  publishedAt: z.string().date(),
  updatedAt: z.string().date().optional(),
  readingMinutes: z.number().int().positive(),
  author: z.string().min(2),
  body: z.array(articleBlockSchema).min(3),
  relatedServices: z.array(slug).default([]),
  published: z.boolean().default(true),
});
export type Article = z.infer<typeof articleSchema>;

// ─────────── Testimoni ───────────
/** Hanya tampil bila `consent` true dan teks asli dari pelanggan. */
export const testimonialSchema = z.object({
  id: z.string().min(2),
  quote: z.string().min(20),
  name: z.string().min(2),
  role: z.string().optional(),
  business: z.string().optional(),
  consent: z.literal(true),
  givenAt: z.string().date(),
});
export type Testimonial = z.infer<typeof testimonialSchema>;

// ─────────── Profil, proses, navigasi, pengaturan ───────────
export const profileSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(5),
  headline: z.string().min(10),
  heroSupport: z.string().min(30),
  valueProposition: z.string().min(30),
  intro: z.array(z.string().min(20)).min(1),
  story: z.array(z.string().min(20)).min(1),
  philosophy: z.array(z.object({ title: z.string(), text: z.string().min(20) })).min(1),
  capabilities: z.array(z.string().min(3)).min(3),
  audiences: z.array(z.string().min(3)).min(3),
  /** Isi hanya dengan aset asli. Kosong = tampilkan inisial. */
  portrait: imageSchema.optional(),
});
export type Profile = z.infer<typeof profileSchema>;

export const processStepSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string().min(20),
  /** Pilar yang melewati langkah ini; kosong = semua. */
  appliesTo: z.array(pillarIdSchema).default([]),
});
export type ProcessStep = z.infer<typeof processStepSchema>;

export const navItemSchema = z.object({ label: z.string(), href: z.string().startsWith("/") });

export const settingsSchema = z.object({
  siteName: z.string(),
  siteDescription: z.string().min(40),
  locale: z.literal("id-ID"),
  /** Konfigurasi model produksi fisik. "unset" = jangan menjanjikan kapasitas/estimasi. */
  productionModel: z.enum(["unset", "internal", "vendor", "hybrid"]),
  /** Kosong = jangan gunakan SEO lokal. */
  serviceArea: z.string().optional(),
  social: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  legalUpdatedAt: z.string().date(),
});
export type Settings = z.infer<typeof settingsSchema>;

/** Validasi daftar konten saat modul dimuat: nilai default diisi, konten tidak valid menggagalkan build. */
export function defineList<S extends z.ZodTypeAny>(schema: S, items: z.input<S>[]): z.output<S>[] {
  return z.array(schema).parse(items);
}
