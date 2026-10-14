import { defineList, processStepSchema, type ProcessStep } from "./schemas";

/** Alur kerja umum. Gunakan `appliesTo` bila sebuah langkah hanya berlaku untuk pilar tertentu. */
export const processSteps: ProcessStep[] = defineList(processStepSchema, [
  {
    id: "discovery",
    title: "Diskusi awal",
    description: "Bahas bisnis, audiens, dan kebutuhan yang ingin diselesaikan.",
  },
  {
    id: "briefing",
    title: "Brief",
    description: "Catat tujuan, referensi, materi, ruang lingkup, dan batasan.",
  },
  {
    id: "strategy",
    title: "Strategi",
    description: "Tetapkan arah visual, struktur konten, atau rancangan sistem sebelum produksi.",
    appliesTo: ["brand-design", "content-creative", "digital-technology"],
  },
  {
    id: "proposal",
    title: "Proposal",
    description: "Proposal merinci hasil kerja, tahapan, jadwal, dan biaya untuk disepakati sebelum pengerjaan.",
  },
  {
    id: "deposit",
    title: "Pembayaran dan jadwal",
    description: "Konfirmasi pembayaran awal dan jadwal setelah proposal disetujui.",
  },
  {
    id: "production",
    title: "Produksi",
    description: "Pengerjaan mengikuti jadwal yang disepakati. Produksi fisik dikonfirmasi terpisah dari desain.",
  },
  {
    id: "review",
    title: "Tinjauan dan revisi",
    description: "Tinjau hasil dan lakukan revisi sesuai proposal.",
  },
  {
    id: "delivery",
    title: "Penyerahan",
    description: "Terima file siap pakai dan panduan bila diperlukan.",
  },
  {
    id: "followup",
    title: "Tindak lanjut",
    description: "Bahas pertanyaan, penyesuaian, dan kebutuhan berikutnya.",
  },
]);
