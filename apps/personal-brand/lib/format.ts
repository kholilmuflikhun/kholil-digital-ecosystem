import type { Availability, Pricing } from "@/content";

/** Teks harga. Tidak pernah mengarang angka: mode tanpa harga menampilkan penjelasan jujur. */
export function formatPricing(pricing: Pricing): { label: string; prefix?: string } {
  switch (pricing.mode) {
    case "fixed":
      return { label: formatMoney(pricing.amount, pricing.currency) };
    case "starting-from":
      return { prefix: "Mulai dari", label: formatMoney(pricing.amount, pricing.currency) };
    case "custom-quotation":
      return { label: "Penawaran khusus" };
    case "contact":
      return { label: "Harga: hubungi saya" };
  }
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export const availabilityLabels: Record<Availability, string> = {
  available: "Tersedia",
  "by-request": "Sesuai pesanan",
  "coming-soon": "Segera hadir",
  unavailable: "Belum tersedia",
};

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
