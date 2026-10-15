import { defineList, projectSchema, type Project } from "./schemas";

/**
 * Portofolio. Aturan:
 * - `type: "client"` hanya untuk karya yang nyata, dengan `clientVerified: true` bila nama klien ditampilkan dan sudah diizinkan.
 * - Jangan isi `outcome` bila belum ada hasil terverifikasi.
 * - Proyek konsep WAJIB bertipe "concept" agar tidak tertukar dengan pekerjaan klien.
 * - Tambahkan aset asli lewat `images` (simpan berkas di public/portfolio/...). Tanpa gambar, ilustrasi konsep ditampilkan via `art`.
 */
export const projects: Project[] = defineList(projectSchema, [
  {
    slug: "growth-operating-system",
    title: "Growth Operating System",
    summary: "Aplikasi web untuk mengelola prospek, penjualan, proyek, dan target bisnis.",
    type: "personal-experiment",
    category: "business-systems",
    year: 2026,
    context: "Data prospek, pesanan, dan keuangan sering tersebar di beberapa tempat.",
    problem: "Sulit melihat alur penjualan dan kinerja bisnis secara menyeluruh.",
    approach: "Menyatukan CRM, pipeline, proyek, pendapatan, dan target dalam satu aplikasi.",
    deliverables: [
      "Dashboard target, funnel, dan pendapatan",
      "CRM prospek dan pipeline penjualan",
      "Katalog penawaran, pelanggan, dan proyek",
      "Perencana konten dengan atribusi ke lead",
    ],
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
    relatedServices: ["pengembangan-aplikasi-web", "dashboard-bisnis", "alat-internal"],
    art: { variant: "system" },
    featured: true,
    published: true,
  },
  {
    slug: "konsep-identitas-kedai-kopi",
    title: "Studi Konsep: Identitas Kedai Kopi",
    summary: "Konsep identitas kedai kopi: logo, warna, dan penerapan pada cup serta menu.",
    type: "concept",
    category: "branding",
    year: 2026,
    context: "Merancang identitas visual untuk usaha kedai kopi.",
    problem: "Identitas yang tidak konsisten menyulitkan pelanggan mengenali brand.",
    approach: "Menerapkan satu arah visual pada logo, warna, huruf, cup, dan menu.",
    deliverables: ["Konsep logo", "Palet warna dan tipografi", "Contoh penerapan pada cup dan menu"],
    tools: ["Desain grafis vektor"],
    relatedServices: ["desain-logo", "brand-identity", "desain-menu-daftar-harga"],
    art: { variant: "identity" },
    featured: true,
    published: true,
  },
  {
    slug: "konsep-kemasan-camilan",
    title: "Studi Konsep: Kemasan Camilan Rumahan",
    summary: "Konsep kemasan camilan dengan fokus pada keterbacaan informasi produk.",
    type: "concept",
    category: "packaging",
    year: 2026,
    context: "Merancang kemasan informatif untuk produk camilan rumahan.",
    problem: "Informasi produk perlu mudah ditemukan dan dibaca.",
    approach: "Menata informasi utama dan menyiapkan desain untuk teknik cetak umum.",
    deliverables: ["Desain label", "Tata letak sesuai dieline contoh", "Mockup presentasi"],
    tools: ["Desain grafis vektor", "Mockup"],
    relatedServices: ["desain-kemasan-label", "desain-cetak-kemasan", "mockup-produk"],
    art: { variant: "packaging" },
    featured: false,
    published: true,
  },
  {
    slug: "konsep-jersey-komunitas",
    title: "Studi Konsep: Jersey Komunitas",
    summary: "Konsep jersey komunitas dengan pola, warna, nama, dan nomor.",
    type: "concept",
    category: "printing-apparel",
    year: 2026,
    context: "Merancang jersey komunitas yang konsisten dan siap diproduksi.",
    problem: "Desain perlu mempertimbangkan warna dan penempatan elemen produksi.",
    approach: "Menetapkan warna, area nama dan nomor, lalu menyiapkan mockup.",
    deliverables: ["Desain jersey depan, belakang, lengan", "Mockup persetujuan"],
    tools: ["Desain grafis vektor", "Mockup apparel"],
    relatedServices: ["desain-jersey", "desain-apparel-custom", "file-desain-siap-cetak"],
    art: { variant: "apparel" },
    featured: false,
    published: true,
  },
  {
    slug: "konsep-landing-page-jasa-lokal",
    title: "Studi Konsep: Landing Page Jasa Lokal",
    summary: "Konsep landing page usaha jasa dengan informasi layanan dan kontak.",
    type: "concept",
    category: "website-digital",
    year: 2026,
    context: "Menyusun halaman informasi untuk usaha jasa.",
    problem: "Pengunjung membutuhkan layanan dan kontak yang mudah ditemukan.",
    approach: "Menata informasi berdasarkan kebutuhan pengunjung dan menonjolkan ajakan bertindak.",
    deliverables: ["Struktur halaman", "Desain responsif", "Prototipe halaman"],
    tools: ["Next.js", "Tailwind CSS"],
    relatedServices: ["pengembangan-landing-page", "implementasi-ui"],
    art: { variant: "web" },
    featured: false,
    published: true,
  },
  {
    slug: "konsep-konten-promosi",
    title: "Studi Konsep: Rangkaian Konten Promosi",
    summary: "Konsep konten media sosial untuk peluncuran produk.",
    type: "concept",
    category: "social-media",
    year: 2026,
    context: "Merancang rangkaian konten untuk peluncuran produk.",
    problem: "Konten yang tidak konsisten mengurangi pengenalan produk.",
    approach: "Menyusun konten dalam tiga tahap: kenalkan, jelaskan, dan ajak.",
    deliverables: ["Kerangka konten tiga tahap", "Sistem template unggahan"],
    tools: ["Desain grafis vektor"],
    relatedServices: ["desain-konten-media-sosial", "aset-peluncuran-produk", "visual-kampanye"],
    art: { variant: "social" },
    featured: false,
    published: true,
  },
]);

export const publishedProjects = () => projects.filter((p) => p.published);
export const getProject = (slug: string) => publishedProjects().find((p) => p.slug === slug);

export const projectTypeLabels: Record<Project["type"], string> = {
  client: "Proyek klien",
  "internal-brand": "Brand internal",
  "personal-experiment": "Proyek pribadi",
  concept: "Proyek konsep",
  "open-source": "Open source",
};

export const projectCategoryLabels: Record<Project["category"], string> = {
  branding: "Branding",
  packaging: "Kemasan",
  "social-media": "Media Sosial",
  marketing: "Kampanye Pemasaran",
  "printing-apparel": "Cetak dan Apparel",
  "website-digital": "Website dan Produk Digital",
  "business-systems": "Sistem Bisnis",
};
