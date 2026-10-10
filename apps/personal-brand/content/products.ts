import type { Product, ProductCategory, Availability } from "./schemas";

/**
 * Katalog produk. SEMUA harga sengaja belum diisi (mode "contact" / "custom-quotation").
 * Item di sini adalah contoh yang dapat dikonfigurasi, bukan klaim bahwa produk sudah dijual.
 * Untuk menampilkan harga, ubah `pricing`, contoh:
 *   pricing: { mode: "starting-from", amount: 0, currency: "IDR" }   // isi dengan angka asli
 */
const REVISION = "Batas revisi ditetapkan di proposal sebelum pengerjaan dimulai.";

type Def = {
  slug: string;
  name: string;
  category: ProductCategory;
  type: Product["type"];
  short: string;
  full: string;
  features: string[];
  deliverables: string[];
  availability?: Availability;
  pricing?: Product["pricing"];
  featured?: boolean;
  related?: string[];
  cta?: string;
  revision?: string;
};

const make = (d: Def): Product => ({
  id: `prd-${d.slug}`,
  slug: d.slug,
  name: d.name,
  shortDescription: d.short,
  fullDescription: d.full,
  category: d.category,
  type: d.type,
  pricing: d.pricing ?? { mode: "contact" },
  featured: d.featured ?? false,
  availability: d.availability ?? "by-request",
  features: d.features,
  deliverables: d.deliverables,
  revisionPolicy: d.revision ?? (d.type === "digital-download" || d.type === "template" ? undefined : REVISION),
  gallery: [],
  ctaLabel: d.cta ?? (d.availability === "coming-soon" ? "Kabari saya saat tersedia" : "Tanyakan paket ini"),
  ctaDestination: "inquiry",
  relatedServices: d.related ?? [],
  published: true,
});

export const products: Product[] = [
  // ── Branding ──
  make({ slug: "paket-logo", name: "Paket Logo", category: "branding", type: "service-package", featured: true,
    short: "Logo untuk usaha Anda, lengkap dengan file siap pakai dan versi warna maupun monokrom.",
    full: "Paket untuk bisnis yang membutuhkan logo yang rapi dan mudah dikenali. Ruang lingkup, jumlah opsi konsep, dan batas revisi dikonfirmasi di proposal sesuai kebutuhan Anda.",
    features: ["Konsep berdasarkan brief", "Versi warna dan monokrom", "Pemeriksaan keterbacaan di ukuran kecil"],
    deliverables: ["File logo dalam format siap pakai", "Versi untuk cetak dan digital"], related: ["desain-logo"] }),
  make({ slug: "mini-brand-identity", name: "Mini Brand Identity", category: "branding", type: "service-package",
    short: "Identitas visual ringkas: logo, palet warna, tipografi, dan contoh penerapan dasar.",
    full: "Untuk usaha yang belum membutuhkan sistem identitas lengkap, tetapi ingin tampil konsisten di media sosial dan materi cetak sederhana.",
    features: ["Logo dan variasi utama", "Palet warna dan tipografi", "Contoh penerapan dasar"],
    deliverables: ["File logo dan aset identitas", "Ringkasan panduan penggunaan"], related: ["desain-logo", "brand-identity"] }),
  make({ slug: "complete-brand-identity", name: "Complete Brand Identity", category: "branding", type: "service-package", featured: true,
    short: "Sistem identitas visual menyeluruh untuk bisnis yang siap tampil konsisten di semua media.",
    full: "Mencakup riset arah visual, logo, sistem warna dan huruf, elemen pendukung, serta penerapan pada materi utama. Cakupan akhir ditentukan setelah diskusi kebutuhan.",
    features: ["Arah dan konsep identitas", "Logo, warna, tipografi, elemen pendukung", "Penerapan pada materi utama"],
    deliverables: ["Seluruh aset identitas", "Dokumen panduan penggunaan"], related: ["brand-identity", "brand-guidelines"] }),
  make({ slug: "paket-desain-kemasan", name: "Paket Desain Kemasan", category: "branding", type: "service-package",
    short: "Desain kemasan atau label produk, dari konsep sampai file siap cetak sesuai dieline.",
    full: "Untuk produk yang membutuhkan kemasan atau label baru. Bahan, ukuran, dan teknik cetak dibahas di awal agar desain bisa diproduksi.",
    features: ["Desain sesuai dieline", "Pertimbangan bahan dan teknik cetak", "Mockup untuk persetujuan"],
    deliverables: ["File siap cetak", "Mockup presentasi"], related: ["desain-kemasan-label", "desain-cetak-kemasan"] }),
  make({ slug: "paket-brand-guideline", name: "Paket Brand Guideline", category: "branding", type: "service-package",
    short: "Dokumen panduan agar tim dan vendor Anda memakai identitas brand dengan benar.",
    full: "Merangkum aturan penggunaan logo, warna, huruf, dan contoh penerapan dalam satu dokumen yang mudah dirujuk.",
    features: ["Aturan logo, warna, tipografi", "Contoh penerapan benar dan salah"],
    deliverables: ["Dokumen brand guideline (PDF)"], related: ["brand-guidelines"] }),

  // ── Media sosial ──
  make({ slug: "social-media-starter", name: "Social Media Starter", category: "social-media", type: "service-package", featured: true,
    short: "Fondasi tampilan media sosial: template unggahan dan story yang konsisten dengan brand Anda.",
    full: "Untuk usaha yang ingin mulai rutin mengunggah dengan tampilan yang seragam. Isi paket dan jumlah template dikonfirmasi di proposal.",
    features: ["Template unggahan dan story", "Elemen visual pendukung", "File sumber yang dapat diedit"],
    deliverables: ["Template siap pakai", "Panduan singkat penggunaan"], related: ["desain-media-sosial"] }),
  make({ slug: "paket-konten-bulanan", name: "Paket Desain Konten Bulanan", category: "social-media", type: "service-package",
    short: "Desain konten media sosial berkelanjutan dengan perencanaan tema dan jadwal.",
    full: "Kerja sama berkala untuk menjaga konten tetap konsisten. Volume dan jadwal ditentukan bersama sesuai kapasitas yang tersedia saat itu.",
    features: ["Perencanaan tema konten", "Desain konten sesuai jadwal", "Evaluasi berkala"],
    deliverables: ["Desain konten siap unggah"], related: ["desain-konten-media-sosial", "perencanaan-konten"] }),
  make({ slug: "paket-kampanye-promosi", name: "Paket Kampanye Promosi", category: "social-media", type: "service-package",
    short: "Visual kampanye beserta turunannya untuk media sosial dan materi cetak.",
    full: "Untuk peluncuran produk, promo musiman, atau acara. Mencakup visual utama dan turunan di berbagai media.",
    features: ["Key visual kampanye", "Turunan untuk beberapa media"],
    deliverables: ["Aset kampanye siap pakai"], related: ["visual-kampanye", "konten-promosi"] }),
  make({ slug: "bundel-template-media-sosial", name: "Bundel Template Media Sosial", category: "social-media", type: "template", availability: "coming-soon",
    short: "Kumpulan template media sosial yang dapat Anda edit sendiri. Belum tersedia untuk dibeli.",
    full: "Produk digital yang sedang dalam perencanaan. Daftarkan minat Anda agar dikabari saat tersedia. Belum ada tanggal rilis atau harga yang ditetapkan.",
    features: ["Template dapat diedit", "Beragam format unggahan"], deliverables: [], related: ["desain-media-sosial"] }),

  // ── Cetak dan apparel ──
  make({ slug: "pesanan-kaos-custom", name: "Pesanan Kaos Custom", category: "printing-apparel", type: "print-order", featured: true,
    short: "Desain dan pemesanan kaos sablon custom untuk brand, komunitas, atau acara.",
    full: "Layanan desain dibedakan dari produksi fisik. Setelah desain disetujui, bahan, jumlah, estimasi, dan biaya produksi dikonfirmasi per pesanan.",
    features: ["Desain siap sablon", "Mockup untuk persetujuan", "Koordinasi produksi per pesanan"],
    deliverables: ["File desain siap produksi", "Kaos hasil produksi sesuai kesepakatan"], related: ["kaos-sablon-custom", "desain-apparel-custom"] }),
  make({ slug: "desain-jersey-paket", name: "Desain Jersey", category: "printing-apparel", type: "one-time-service",
    short: "Desain jersey tim atau komunitas: pola, warna, nomor, dan nama, siap diproduksi.",
    full: "Hanya mencakup layanan desain. Bila Anda memerlukan produksi, kapasitas dan estimasi dikonfirmasi terpisah.",
    features: ["Desain depan, belakang, dan lengan", "Mockup untuk persetujuan"],
    deliverables: ["File desain siap produksi"], related: ["desain-jersey"] }),
  make({ slug: "pesanan-jersey-custom", name: "Pesanan Jersey Custom", category: "printing-apparel", type: "print-order",
    short: "Jersey custom dari desain sampai koordinasi produksi, dikonfirmasi per pesanan.",
    full: "Produksi fisik bergantung pada model produksi dan kapasitas saat pesanan masuk. Tidak ada janji jadwal sebelum konfirmasi tertulis.",
    features: ["Desain jersey", "Koordinasi produksi per pesanan"],
    deliverables: ["Jersey hasil produksi sesuai kesepakatan"], related: ["jersey-custom", "desain-jersey"] }),
  make({ slug: "pesanan-banner-cetak", name: "Pesanan Banner dan Cetak", category: "printing-apparel", type: "print-order",
    short: "Desain dan persiapan cetak banner, brosur, flyer, stiker, dan label.",
    full: "Mulai dari desain hingga file siap cetak. Pencetakan dikoordinasikan sesuai model produksi yang disepakati per pesanan.",
    features: ["Desain sesuai ukuran", "File siap cetak"],
    deliverables: ["File siap cetak", "Hasil cetak sesuai kesepakatan"], related: ["banner-cetak", "digital-printing", "stiker-label"] }),

  // ── Produk digital ──
  make({ slug: "template-canva", name: "Template Canva", category: "digital-products", type: "template", availability: "coming-soon",
    short: "Template Canva untuk kebutuhan visual bisnis kecil. Belum tersedia untuk dibeli.",
    full: "Contoh produk digital yang sedang dalam perencanaan. Belum ada daftar template, harga, atau tanggal rilis yang final.",
    features: ["Dapat diedit di Canva"], deliverables: [] }),
  make({ slug: "template-proposal-bisnis", name: "Template Proposal Bisnis", category: "digital-products", type: "business-template", availability: "coming-soon",
    short: "Template proposal dan penawaran yang rapi untuk usaha jasa. Belum tersedia untuk dibeli.",
    full: "Sedang dalam perencanaan. Minat Anda membantu menentukan format dan prioritas pengembangan.",
    features: ["Struktur proposal yang runtut"], deliverables: [], related: ["desain-presentasi"] }),
  make({ slug: "template-menu-katalog", name: "Template Menu dan Katalog", category: "digital-products", type: "template", availability: "coming-soon",
    short: "Template menu dan katalog produk yang mudah diperbarui. Belum tersedia untuk dibeli.",
    full: "Sedang dalam perencanaan. Belum ada harga atau tanggal rilis yang ditetapkan.",
    features: ["Mudah diperbarui sendiri"], deliverables: [], related: ["desain-menu-daftar-harga", "desain-katalog-produk"] }),

  // ── Teknologi ──
  make({ slug: "paket-landing-page", name: "Paket Landing Page", category: "technology", type: "web-package", featured: true,
    short: "Satu halaman fokus yang mengarahkan pengunjung mengirim inquiry atau menghubungi Anda.",
    full: "Cocok untuk satu penawaran, promosi, atau peluncuran. Isi halaman, formulir, dan integrasi dikonfirmasi di proposal.",
    features: ["Desain responsif", "Formulir atau tombol kontak", "Pengaturan dasar SEO"],
    deliverables: ["Landing page yang dapat diakses publik", "Panduan pembaruan konten"], related: ["pengembangan-landing-page"] }),
  make({ slug: "paket-website-bisnis", name: "Paket Website Bisnis", category: "technology", type: "web-package",
    short: "Website multi-halaman yang menjelaskan layanan Anda dan memudahkan pelanggan menghubungi.",
    full: "Struktur halaman, konten, dan fitur ditentukan setelah diskusi kebutuhan.",
    features: ["Beberapa halaman responsif", "Struktur konten dan navigasi", "Pengaturan dasar SEO"],
    deliverables: ["Website siap online"], related: ["pengembangan-website-bisnis"] }),
  make({ slug: "paket-company-profile", name: "Paket Company Profile", category: "technology", type: "web-package",
    short: "Website profil perusahaan yang rapi untuk membangun kepercayaan calon klien.",
    full: "Memuat profil, layanan, dan kontak dalam tampilan yang profesional.",
    features: ["Halaman profil, layanan, kontak"], deliverables: ["Website company profile siap online"], related: ["website-company-profile"] }),
  make({ slug: "aplikasi-web-custom", name: "Aplikasi Web Custom", category: "technology", type: "custom-project", pricing: { mode: "custom-quotation" },
    short: "Aplikasi web sesuai alur kerja bisnis Anda. Ruang lingkup dan biaya ditentukan lewat penawaran.",
    full: "Setiap kebutuhan berbeda. Setelah diskusi, saya menyusun penawaran berisi cakupan versi pertama, tahapan, dan biaya.",
    features: ["Dirancang dari alur kerja Anda", "Pengembangan bertahap"], deliverables: ["Aplikasi web berfungsi", "Dokumentasi penggunaan"], related: ["pengembangan-aplikasi-web"] }),
  make({ slug: "implementasi-otomasi", name: "Implementasi Otomasi", category: "technology", type: "custom-project", pricing: { mode: "custom-quotation" },
    short: "Otomasi pekerjaan manual yang berulang, dari pemetaan proses sampai implementasi.",
    full: "Dimulai dari memetakan proses yang ada, lalu memilih langkah yang paling layak diotomasi.",
    features: ["Pemetaan proses", "Implementasi otomasi", "Dokumentasi alur"], deliverables: ["Otomasi berjalan sesuai kesepakatan"], related: ["otomasi-alur-kerja", "alur-kerja-ai"] }),
];

export const productCategoryLabels: Record<ProductCategory, string> = {
  branding: "Branding",
  "social-media": "Media Sosial",
  "printing-apparel": "Cetak dan Apparel",
  "digital-products": "Produk Digital",
  technology: "Teknologi",
};

export const publishedProducts = () => products.filter((p) => p.published);
export const getProduct = (slug: string) => publishedProducts().find((p) => p.slug === slug);
