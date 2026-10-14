export const NAV_ITEMS = [
  { href: "/dashboard", label: "Ringkasan", icon: "LayoutDashboard" },
  { href: "/goals", label: "Target", icon: "Target" },
  { href: "/daily", label: "Aktivitas Harian", icon: "CalendarCheck" },
  { href: "/prospects", label: "Prospek", icon: "Users" },
  { href: "/pipeline", label: "Pipeline Penjualan", icon: "Kanban" },
  { href: "/customers", label: "Pelanggan", icon: "Heart" },
  { href: "/retention", label: "Testimoni & Rujukan", icon: "Award" },
  { href: "/offers", label: "Penawaran", icon: "Package" },
  { href: "/projects", label: "Proyek", icon: "FolderKanban" },
  { href: "/content", label: "Konten", icon: "Megaphone" },
  { href: "/revenue", label: "Pendapatan", icon: "Wallet" },
  { href: "/analytics", label: "Analitik", icon: "BarChart3" },
  { href: "/notifications", label: "Notifikasi", icon: "Bell" },
  { href: "/strategy", label: "Strategi", icon: "Compass" },
  { href: "/settings", label: "Pengaturan", icon: "Settings" },
] as const;

export const DEAL_STAGES = [
  "LEAD",
  "CONTACTED",
  "QUALIFIED",
  "DISCOVERY",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const;

export const DEAL_STAGE_LABELS: Record<(typeof DEAL_STAGES)[number], string> = {
  LEAD: "Lead",
  CONTACTED: "Dihubungi",
  QUALIFIED: "Terkualifikasi",
  DISCOVERY: "Penjajakan",
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negosiasi",
  WON: "Berhasil",
  LOST: "Tidak berhasil",
};

/** Probabilitas default per tahap; dapat diubah per deal. */
export const DEAL_STAGE_PROBABILITY: Record<(typeof DEAL_STAGES)[number], number> = {
  LEAD: 5,
  CONTACTED: 10,
  QUALIFIED: 25,
  DISCOVERY: 40,
  PROPOSAL: 55,
  NEGOTIATION: 75,
  WON: 100,
  LOST: 0,
};

export const FLYWHEEL_STEPS = [
  "Brand Personal",
  "Konten",
  "Audiens",
  "Prospek",
  "Percakapan",
  "Penawaran",
  "Penjualan",
  "Layanan",
  "Testimoni",
  "Rujukan",
  "Pesanan Ulang",
  "Produk Digital",
  "Pendapatan Terukur",
  "Investasi Ulang",
] as const;

export const DEMO_LABEL = "DEMO";
