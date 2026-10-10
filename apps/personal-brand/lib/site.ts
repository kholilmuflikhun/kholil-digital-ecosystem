import { normalizeWhatsAppNumber } from "./whatsapp";

const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

/** URL publik situs tanpa garis miring akhir. Jangan dikodekan keras: atur NEXT_PUBLIC_SITE_URL. */
export const siteUrl = (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3001").replace(/\/+$/, "");

/** Nomor WhatsApp valid (62...) atau undefined bila belum dikonfigurasi. */
export const whatsappNumber = normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

/** Email publik yang ditampilkan ke pengunjung (opsional). */
export const publicEmail = clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL);

/** Tautan masuk ke Growth OS. Hanya tautan, tidak ada data. */
export const growthOsUrl = clean(process.env.NEXT_PUBLIC_GROWTH_OS_URL);

export const plausibleDomain = clean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);

export const absoluteUrl = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
