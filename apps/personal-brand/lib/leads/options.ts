import type { ServiceCategory } from "@kholil/shared";

export const serviceCategoryOptions: { value: ServiceCategory; label: string }[] = [
  { value: "brand-design", label: "Brand & Design" },
  { value: "content-creative", label: "Content & Creative" },
  { value: "printing-apparel", label: "Printing & Apparel" },
  { value: "digital-technology", label: "Digital & Technology" },
  { value: "lainnya", label: "Belum yakin / lainnya" },
];

/** Pilihan pengunjung, bukan daftar harga. Ubah sesuai kebutuhan. */
export const budgetOptions = [
  "Belum ditentukan",
  "Di bawah Rp1 juta",
  "Rp1 juta – Rp3 juta",
  "Rp3 juta – Rp10 juta",
  "Di atas Rp10 juta",
];

export const timelineOptions = ["Fleksibel", "Mendesak (dalam 1–2 minggu)", "Dalam 1 bulan", "Lebih dari 1 bulan"];
