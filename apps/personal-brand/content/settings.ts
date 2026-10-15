import type { Settings } from "./schemas";

/**
 * Pengaturan situs yang dapat diedit pemilik.
 * Kontak (WhatsApp, email) dikonfigurasi lewat environment variable, bukan di sini.
 */
export const settings: Settings = {
  siteName: "Kholil Muflikhun",
  siteDescription: "Strategi brand, desain, dan solusi digital oleh Kholil Muflikhun.",
  locale: "id-ID",
  // Ubah ke "internal", "vendor", atau "hybrid" setelah model produksi dipastikan.
  productionModel: "unset",
  // Contoh: "Pemalang dan sekitarnya". Biarkan kosong bila tidak memakai SEO lokal.
  serviceArea: undefined,
  // Tambahkan akun sosial yang sudah aktif, contoh: { label: "Instagram", url: "https://instagram.com/..." }
  social: [],
  legalUpdatedAt: "2026-10-09",
};
