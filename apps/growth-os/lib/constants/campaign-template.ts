export type CampaignPhase = {
  phase: number;
  title: string;
  startDay: number;
  endDay: number;
  objectives: string[];
  kpis: string[];
};

/** Template bawaan 30 hari. Hanya contoh: pengguna bebas mengubah durasi, fase, dan target. */
export const DEFAULT_30_DAY_PHASES: CampaignPhase[] = [
  {
    phase: 1,
    title: "Bangun fondasi",
    startDay: 1,
    endDay: 7,
    objectives: [
      "Posisi brand",
      "Susun penawaran",
      "Portfolio",
      "Daftar harga",
      "Siapkan CRM",
      "Kanal penjualan",
      "Basis data prospek",
      "Kontak awal",
    ],
    kpis: ["Prospek", "Percakapan", "Proposal", "Konten", "Penjualan awal"],
  },
  {
    phase: 2,
    title: "Jangkau pelanggan",
    startDay: 8,
    endDay: 14,
    objectives: ["Cari prospek", "Tindak lanjut", "Konten", "Penjualan", "Testimoni", "Studi kasus"],
    kpis: ["Prospek baru", "Tingkat respons", "Konversi", "Pendapatan", "Testimoni"],
  },
  {
    phase: 3,
    title: "Tingkatkan nilai pesanan",
    startDay: 15,
    endDay: 21,
    objectives: ["Paket layanan", "Penjualan lanjutan", "Penjualan silang", "Cetak dan apparel", "Bundel", "Penawaran bernilai tinggi"],
    kpis: ["Nilai pesanan rata-rata", "Pendapatan per pelanggan", "Tingkat penjualan lanjutan", "Tingkat penjualan silang"],
  },
  {
    phase: 4,
    title: "Kembangkan",
    startDay: 22,
    endDay: 30,
    objectives: ["Website", "Produk digital", "Otomatisasi", "AI", "Pesanan ulang", "Sistem rujukan", "Dokumentasi proses"],
    kpis: ["Pelanggan berulang", "Pelanggan rujukan", "Penjualan produk digital", "Otomatisasi", "Margin profit"],
  },
];

export const CAMPAIGN_DURATIONS = [7, 14, 30, 60, 90] as const;

/** Skala fase template ke durasi kampanye lain secara proporsional. */
export function scalePhases(durationDays: number): CampaignPhase[] {
  if (durationDays === 30) return DEFAULT_30_DAY_PHASES;
  const ratio = durationDays / 30;
  return DEFAULT_30_DAY_PHASES.map((p, idx, arr) => {
    const startDay = idx === 0 ? 1 : Math.round((p.startDay - 1) * ratio) + 1;
    const endDay = idx === arr.length - 1 ? durationDays : Math.max(startDay, Math.round(p.endDay * ratio));
    return { ...p, startDay, endDay };
  });
}
