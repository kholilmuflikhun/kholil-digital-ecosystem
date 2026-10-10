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
    summary:
      "Aplikasi web untuk mengelola prospek, pipeline penjualan, pelanggan, proyek, pendapatan, dan target bisnis dalam satu tempat. Dibangun sebagai alat kerja pribadi dan menjadi lapisan operasional dari website ini.",
    type: "personal-experiment",
    category: "business-systems",
    year: 2026,
    context:
      "Pelaku usaha mandiri sering mencatat prospek, pesanan, dan keuangan di tempat yang berbeda-beda, sehingga sulit melihat apa yang benar-benar menghasilkan penjualan.",
    problem:
      "Tidak ada gambaran terpadu dari alur: konten, prospek, penawaran, penjualan, pengerjaan, sampai pendapatan, sehingga keputusan sering berdasarkan perkiraan.",
    approach:
      "Menyatukan CRM ringan, pipeline, katalog penawaran, pelacakan proyek, pencatatan pendapatan, dan perhitungan target ke satu aplikasi. Insight hanya ditampilkan bila data nyata mencukupi.",
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
    summary:
      "Eksplorasi identitas visual untuk kedai kopi fiktif: logo, palet warna, dan penerapan pada cup dan menu. Ini proyek konsep, bukan pekerjaan klien.",
    type: "concept",
    category: "branding",
    year: 2026,
    context: "Latihan merancang identitas lengkap dari nol untuk jenis usaha yang umum di kalangan UMKM.",
    problem: "Banyak kedai kecil memakai logo, warna, dan huruf yang berbeda-beda di setiap media sehingga terkesan tidak konsisten.",
    approach: "Menentukan satu ide pengikat, lalu menurunkannya ke logo, warna, tipografi, dan contoh penerapan pada media yang paling sering dipakai.",
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
    summary:
      "Eksplorasi desain kemasan dan label untuk produk camilan fiktif, dengan fokus pada keterbacaan informasi produk. Ini proyek konsep, bukan pekerjaan klien.",
    type: "concept",
    category: "packaging",
    year: 2026,
    context: "Produk rumahan sering memiliki rasa yang baik tetapi kemasan yang belum menjelaskan produk dengan jelas.",
    problem: "Informasi penting seperti varian, komposisi, dan ukuran sering tenggelam oleh dekorasi.",
    approach: "Menata hierarki informasi lebih dulu, lalu menambahkan karakter visual yang tetap bisa diproduksi dengan teknik cetak umum.",
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
    summary:
      "Eksplorasi desain jersey untuk komunitas fiktif: pola, warna, dan penempatan nama serta nomor. Ini proyek konsep, bukan pekerjaan klien.",
    type: "concept",
    category: "printing-apparel",
    year: 2026,
    context: "Jersey komunitas perlu terlihat seragam dari depan, belakang, dan lengan, serta praktis diproduksi.",
    problem: "Desain yang menarik di layar sering sulit diproduksi karena warna terlalu banyak atau penempatan yang tidak teknis.",
    approach: "Membatasi jumlah warna, menetapkan area aman untuk nama dan nomor, lalu menyiapkan mockup untuk persetujuan.",
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
    summary:
      "Eksplorasi struktur landing page untuk usaha jasa fiktif: dari penjelasan layanan sampai tombol WhatsApp. Ini proyek konsep, bukan pekerjaan klien.",
    type: "concept",
    category: "website-digital",
    year: 2026,
    context: "Banyak usaha jasa hanya mengandalkan media sosial dan belum punya satu halaman yang menjelaskan layanan dengan jelas.",
    problem: "Calon pelanggan sulit menemukan layanan, harga, dan cara menghubungi dalam satu tempat.",
    approach: "Menyusun halaman berdasarkan pertanyaan calon pelanggan dan menempatkan ajakan bertindak pada titik yang tepat.",
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
    summary:
      "Eksplorasi rangkaian konten media sosial untuk peluncuran produk fiktif: dari teaser sampai ajakan membeli. Ini proyek konsep, bukan pekerjaan klien.",
    type: "concept",
    category: "social-media",
    year: 2026,
    context: "Peluncuran produk butuh rangkaian konten yang saling menyambung, bukan unggahan terpisah.",
    problem: "Unggahan promosi sering tampil berbeda-beda sehingga tidak membangun pengenalan.",
    approach: "Menyusun kerangka tiga tahap (kenalkan, jelaskan, ajak) dan satu sistem template yang dipakai di semuanya.",
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
