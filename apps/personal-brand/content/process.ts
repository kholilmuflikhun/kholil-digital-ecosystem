import { defineList, processStepSchema, type ProcessStep } from "./schemas";

/** Alur kerja umum. Gunakan `appliesTo` bila sebuah langkah hanya berlaku untuk pilar tertentu. */
export const processSteps: ProcessStep[] = defineList(processStepSchema, [
  {
    id: "discovery",
    title: "Discovery",
    description: "Kita mulai dengan percakapan singkat: apa bisnis Anda, siapa pelanggannya, dan masalah apa yang ingin diselesaikan.",
  },
  {
    id: "briefing",
    title: "Briefing",
    description: "Kebutuhan dituangkan ke brief tertulis: tujuan, referensi, materi yang tersedia, ruang lingkup, dan batasan.",
  },
  {
    id: "strategy",
    title: "Strategi",
    description: "Arah visual, struktur konten, atau rancangan sistem disusun lebih dulu agar pengerjaan tidak berputar-putar.",
    appliesTo: ["brand-design", "content-creative", "digital-technology"],
  },
  {
    id: "proposal",
    title: "Proposal",
    description: "Proposal merinci deliverable, tahapan, jadwal, dan biaya sebelum pengerjaan dimulai, sehingga semua pihak menyetujui hal yang sama.",
  },
  {
    id: "deposit",
    title: "Deposit dan penjadwalan",
    description: "Setelah proposal disetujui, ketentuan pembayaran awal dan jadwal pengerjaan dikonfirmasi bersama.",
  },
  {
    id: "production",
    title: "Produksi",
    description: "Pengerjaan berjalan sesuai jadwal. Untuk layanan cetak atau apparel, tahap produksi fisik dikonfirmasi terpisah dari tahap desain.",
  },
  {
    id: "review",
    title: "Review dan revisi",
    description: "Hasil ditinjau bersama dan revisi dikerjakan sesuai batas yang disepakati di proposal.",
  },
  {
    id: "delivery",
    title: "Penyerahan akhir",
    description: "File final diserahkan dalam format yang siap dipakai, lengkap dengan panduan penggunaan bila diperlukan.",
  },
  {
    id: "followup",
    title: "Tindak lanjut",
    description: "Setelah penyerahan, tersedia ruang untuk pertanyaan, penyesuaian kecil, dan perencanaan kebutuhan berikutnya.",
  },
]);
