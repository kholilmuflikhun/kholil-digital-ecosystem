import { defineList, processStepSchema, type ProcessStep } from "./schemas";

/** Alur kerja umum. Gunakan `appliesTo` bila sebuah langkah hanya berlaku untuk pilar tertentu. */
export const processSteps: ProcessStep[] = defineList(processStepSchema, [
  {
    id: "discovery",
    title: "Diskusi awal",
    description: "Tentukan bisnis, audiens, dan kebutuhan.",
  },
  {
    id: "briefing",
    title: "Brief",
    description: "Susun tujuan, referensi, materi, dan ruang lingkup.",
  },
  {
    id: "strategy",
    title: "Strategi",
    description: "Tetapkan arah desain, konten, atau sistem.",
    appliesTo: ["brand-design", "content-creative", "digital-technology"],
  },
  {
    id: "proposal",
    title: "Proposal",
    description: "Sepakati hasil kerja, tahapan, jadwal, dan biaya.",
  },
  {
    id: "deposit",
    title: "Pembayaran dan jadwal",
    description: "Konfirmasi pembayaran awal dan jadwal kerja.",
  },
  {
    id: "production",
    title: "Produksi",
    description: "Kerjakan sesuai jadwal. Produksi fisik dikonfirmasi terpisah.",
  },
  {
    id: "review",
    title: "Tinjauan dan revisi",
    description: "Tinjau hasil dan revisi sesuai proposal.",
  },
  {
    id: "delivery",
    title: "Penyerahan",
    description: "Terima file dan panduan penggunaan.",
  },
  {
    id: "followup",
    title: "Tindak lanjut",
    description: "Bahas penyesuaian dan kebutuhan lanjutan.",
  },
]);
