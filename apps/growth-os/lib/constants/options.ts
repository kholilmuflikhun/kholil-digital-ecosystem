const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

export const GOAL_CATEGORY = toOptions({
  REVENUE: "Pendapatan", PROFIT: "Profit", SALES: "Penjualan", CUSTOMERS: "Pelanggan", LEADS: "Lead",
  CONTENT: "Konten", PROJECTS: "Proyek", PERSONAL_DEVELOPMENT: "Pengembangan diri", MARKETING: "Pemasaran",
  PRODUCT_DEVELOPMENT: "Pengembangan produk", CUSTOM: "Kustom",
});
export const GOAL_STATUS = toOptions({ ACTIVE: "Aktif", ACHIEVED: "Tercapai", PAUSED: "Dijeda", CANCELLED: "Dibatalkan" });
export const PRIORITY = toOptions({ LOW: "Rendah", MEDIUM: "Sedang", HIGH: "Tinggi", CRITICAL: "Kritis" });
export const TASK_CATEGORY = toOptions({
  REVENUE: "Pendapatan", SALES: "Penjualan", PROSPECTING: "Pencarian prospek", FOLLOW_UP: "Tindak lanjut",
  CONTENT: "Konten", DELIVERY: "Pengerjaan", STRATEGIC: "Strategis", OTHER: "Lainnya",
});
export const PROSPECT_STATUS = toOptions({
  NEW: "Baru", CONTACTED: "Dihubungi", RESPONDED: "Merespons", QUALIFIED: "Terkualifikasi",
  PROPOSAL_SENT: "Proposal dikirim", NEGOTIATION: "Negosiasi", WON: "Berhasil", LOST: "Tidak berhasil", DORMANT: "Tidak aktif",
});
export const DEAL_STAGE = toOptions({
  LEAD: "Lead", CONTACTED: "Dihubungi", QUALIFIED: "Terkualifikasi", DISCOVERY: "Penjajakan",
  PROPOSAL: "Proposal", NEGOTIATION: "Negosiasi", WON: "Berhasil", LOST: "Tidak berhasil",
});
export const PROJECT_STATUS = toOptions({
  PLANNING: "Perencanaan", WAITING_FOR_CONTENT: "Menunggu materi", IN_PROGRESS: "Dikerjakan",
  REVIEW: "Ditinjau", REVISION: "Revisi", COMPLETED: "Selesai", ARCHIVED: "Diarsipkan",
});
export const PILLAR = toOptions({
  EDUCATION: "Edukasi", PORTFOLIO: "Portofolio", CASE_STUDY: "Studi kasus", BEHIND_THE_SCENES: "Di balik layar",
  SELLING: "Promosi", PERSONAL_BRAND: "Brand personal", THOUGHT_LEADERSHIP: "Wawasan",
});
export const PLATFORM = toOptions({
  INSTAGRAM: "Instagram", TIKTOK: "TikTok", FACEBOOK: "Facebook", LINKEDIN: "LinkedIn",
  THREADS: "Threads", YOUTUBE: "YouTube", WEBSITE: "Website", OTHER: "Lainnya",
});
export const CONTENT_STATUS = toOptions({
  IDEA: "Ide", DRAFT: "Draf", READY: "Siap", SCHEDULED: "Terjadwal",
  PUBLISHED: "Terbit", REPURPOSED: "Diadaptasi", ARCHIVED: "Diarsipkan",
});
export const PAYMENT_STATUS = toOptions({
  PENDING: "Menunggu", PARTIAL: "Sebagian", PAID: "Lunas", OVERDUE: "Terlambat", CANCELLED: "Dibatalkan",
});
export const CAMPAIGN_DURATION = [7, 14, 30, 60, 90].map((d) => ({ value: String(d), label: `${d} hari` }));

export const label = (opts: { value: string; label: string }[], v: string) => opts.find((o) => o.value === v)?.label ?? v;
export const pick = (rows: { id: string; name: string }[]) => rows.map((r) => ({ value: r.id, label: r.name }));
