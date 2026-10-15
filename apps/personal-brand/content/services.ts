import type { Pillar, PillarId, Service } from "./schemas";

export const pillars: Pillar[] = [
  {
    id: "brand-design",
    name: "Brand dan Desain",
    tagline: "Identitas visual, kemasan, dan materi pemasaran.",
    description: "Bangun identitas bisnis yang konsisten dan mudah dikenali.",
    kind: "design",
  },
  {
    id: "content-creative",
    name: "Konten dan Kreatif",
    tagline: "Konten visual untuk media sosial dan kampanye.",
    description: "Rencanakan konten dengan arah visual yang konsisten.",
    kind: "design",
  },
  {
    id: "printing-apparel",
    name: "Cetak dan Apparel",
    tagline: "Desain siap produksi untuk apparel dan materi cetak.",
    description:
      "Desain dan produksi fisik memiliki ruang lingkup terpisah. Kapasitas dan estimasi dikonfirmasi per pesanan.",
    kind: "production",
  },
  {
    id: "digital-technology",
    name: "Digital dan Teknologi",
    tagline: "Website dan sistem untuk operasional bisnis.",
    description: "Website, aplikasi, dan alat internal sesuai alur kerja bisnis.",
    kind: "digital",
  },
];

type Row = [slug: string, name: string, summary: string, deliverables: string[], idealFor?: string];

const build = (pillar: PillarId, rows: Row[]): Service[] =>
  rows.map(([slug, name, summary, deliverables, idealFor]) => ({
    slug,
    pillar,
    name,
    summary,
    deliverables,
    idealFor,
    availability: "by-request" as const,
  }));

const brand = build("brand-design", [
  ["desain-logo", "Desain Logo", "Logo yang mudah dikenali dan terbaca di berbagai ukuran.", ["Konsep logo sesuai brief", "File logo dalam format siap pakai", "Versi warna dan versi monokrom"], "Usaha baru atau yang ingin memperbarui identitas."],
  ["brand-identity", "Brand Identity", "Sistem visual yang menyatukan logo, warna, huruf, dan elemen pendukung.", ["Logo dan variasinya", "Palet warna dan tipografi", "Elemen visual pendukung"], "Bisnis yang ingin tampil konsisten di berbagai media."],
  ["brand-guidelines", "Brand Guidelines", "Panduan penggunaan identitas agar tim dan vendor Anda menerapkan brand dengan benar.", ["Dokumen panduan penggunaan logo", "Aturan warna dan tipografi", "Contoh penerapan"], "Bisnis dengan beberapa orang atau vendor yang membuat materi."],
  ["desain-kemasan-label", "Desain Kemasan dan Label", "Kemasan dan label yang informatif serta mudah dikenali.", ["Desain kemasan atau label", "File siap cetak sesuai dieline", "Mockup untuk presentasi"], "Produk makanan, minuman, kosmetik, dan rumahan."],
  ["materi-pemasaran", "Materi Pemasaran", "Kumpulan materi promosi yang tampil seragam: dari selebaran sampai papan harga.", ["Desain materi sesuai kebutuhan", "File siap cetak atau siap unggah"], "Bisnis yang rutin membutuhkan materi promosi."],
  ["desain-poster-flyer", "Desain Poster dan Flyer", "Poster dan flyer dengan pesan yang mudah dibaca.", ["Desain poster atau flyer", "File siap cetak", "Versi digital untuk media sosial"]],
  ["desain-brosur", "Desain Brosur", "Brosur yang menyusun informasi layanan atau produk secara runtut dan mudah dibaca.", ["Layout brosur", "File siap cetak", "Versi PDF digital"]],
  ["desain-banner", "Desain Banner", "Banner untuk acara, toko, atau promosi dengan tulisan yang terbaca dari jarak jauh.", ["Desain banner sesuai ukuran", "File siap cetak"]],
  ["desain-katalog-produk", "Desain Katalog Produk", "Katalog yang membantu pelanggan memilih produk dengan cepat.", ["Layout katalog", "Penataan foto dan deskripsi produk", "File cetak dan PDF digital"], "Bisnis dengan banyak varian produk."],
  ["desain-menu-daftar-harga", "Desain Menu dan Daftar Harga", "Menu dan daftar harga yang rapi serta mudah diperbarui.", ["Layout menu atau daftar harga", "File siap cetak", "Versi digital"], "Kafe, restoran, katering, dan jasa."],
  ["desain-media-sosial", "Desain Media Sosial", "Template dan aset visual media sosial yang konsisten dengan identitas brand.", ["Template unggahan dan story", "Elemen visual pendukung", "File sumber yang dapat diedit"]],
  ["mockup-produk", "Mockup Produk", "Visualisasi produk atau desain pada media nyata untuk presentasi dan promosi.", ["Mockup sesuai kebutuhan", "File gambar resolusi tinggi"]],
  ["edit-foto-visual", "Edit Foto dan Peningkatan Visual", "Perapian foto produk dan materi visual agar tampil bersih dan seragam.", ["Foto hasil penyuntingan", "Penyesuaian warna, latar, dan komposisi"]],
  ["desain-presentasi", "Desain Presentasi", "Presentasi bisnis, proposal, atau company profile yang tertata dan mudah diikuti.", ["Template atau slide siap pakai", "Penataan visual dan hierarki informasi"], "Bisnis yang sering mengirim proposal atau presentasi."],
  ["alat-tulis-bisnis", "Alat Tulis Bisnis", "Kartu nama, kop surat, dan dokumen bisnis lain dengan identitas yang seragam.", ["Desain kartu nama dan kop surat", "File siap cetak"]],
]);

const content = build("content-creative", [
  ["desain-konten-media-sosial", "Desain Konten Media Sosial", "Rangkaian konten visual yang konsisten, sesuai karakter brand dan platform.", ["Desain unggahan dan story", "Penyesuaian format per platform", "File siap unggah"]],
  ["perencanaan-konten", "Perencanaan Konten", "Rencana tema dan jadwal konten sesuai tujuan bisnis.", ["Pilar dan tema konten", "Kalender konten", "Arahan format dan ajakan bertindak"], "Bisnis yang membutuhkan arah konten."],
  ["creative-direction", "Creative Direction", "Arahan kreatif agar semua materi visual dan pesan bergerak ke satu arah.", ["Arah visual dan nada komunikasi", "Panduan referensi untuk tim"]],
  ["konten-promosi", "Konten Promosi", "Konten untuk promo, peluncuran, dan penawaran dengan pesan yang jelas.", ["Desain konten promosi", "Penyesuaian copy singkat", "File siap unggah"]],
  ["video-kreatif-singkat", "Kreatif Reels dan Video Singkat", "Konsep dan pengerjaan visual untuk video pendek di media sosial.", ["Konsep dan alur video", "Aset visual dan motion sederhana"]],
  ["dukungan-copywriting", "Dukungan Copywriting", "Bantuan merapikan teks agar pesan lebih jelas dan sesuai karakter brand.", ["Teks untuk konten atau materi promosi", "Opsi judul dan ajakan bertindak"]],
  ["visual-kampanye", "Visual Kampanye", "Visual utama kampanye beserta turunannya untuk berbagai media.", ["Key visual kampanye", "Turunan untuk media sosial dan cetak"]],
  ["aset-peluncuran-produk", "Aset Peluncuran Produk", "Paket aset visual untuk memperkenalkan produk baru ke pasar.", ["Visual peluncuran", "Konten pengumuman dan promosi"]],
  ["konten-personal-brand", "Konten Personal Brand", "Konten yang membantu individu dikenal lewat keahlian dan sudut pandangnya.", ["Tema dan format konten", "Desain konten sesuai identitas personal"], "Profesional, konsultan, dan pelaku usaha mandiri."],
  ["produksi-kreatif-ai", "Produksi Kreatif Berbantuan AI", "Eksplorasi ide dan visual dengan dukungan AI serta kurasi manusia.", ["Eksplorasi ide dan variasi visual", "Hasil akhir yang sudah dikurasi dan dirapikan"]],
]);

const printing = build("printing-apparel", [
  ["kaos-sablon-custom", "Kaos Sablon Custom", "Desain dan pemesanan kaos sablon untuk brand, komunitas, atau acara.", ["Desain siap sablon", "Pemisahan warna sesuai teknik sablon", "Koordinasi produksi sesuai model produksi yang disepakati"], "Komunitas, event, dan brand fashion kecil."],
  ["desain-apparel-custom", "Desain Apparel Custom", "Desain untuk kaos, hoodie, topi, dan apparel lain sesuai karakter brand.", ["Desain apparel", "Mockup untuk persetujuan", "File siap produksi"]],
  ["desain-jersey", "Desain Jersey", "Desain jersey tim atau komunitas dengan pola, warna, dan nomor yang konsisten.", ["Desain jersey depan, belakang, dan lengan", "Mockup untuk persetujuan", "File siap produksi"], "Tim olahraga, komunitas, dan sekolah."],
  ["jersey-custom", "Jersey Custom", "Pemesanan jersey custom dari desain sampai koordinasi produksi.", ["Desain jersey", "Koordinasi produksi sesuai model produksi yang disepakati"]],
  ["digital-printing", "Digital Printing", "Persiapan file dan koordinasi cetak digital untuk berbagai kebutuhan.", ["File siap cetak", "Koordinasi pencetakan sesuai model produksi yang disepakati"]],
  ["stiker-label", "Stiker dan Label", "Desain stiker dan label untuk produk, kemasan, atau promosi.", ["Desain stiker atau label", "File siap potong dan cetak"]],
  ["banner-cetak", "Banner", "Desain dan persiapan cetak banner untuk toko, acara, atau promosi.", ["Desain banner", "File siap cetak"]],
  ["brosur-flyer-cetak", "Brosur dan Flyer", "Persiapan file dan koordinasi cetak brosur serta flyer.", ["File siap cetak", "Koordinasi pencetakan sesuai model produksi yang disepakati"]],
  ["merchandise", "Merchandise", "Desain merchandise brand seperti totebag, mug, dan produk promosi lain.", ["Desain merchandise", "Mockup dan file siap produksi"]],
  ["file-desain-siap-cetak", "File Desain Siap Cetak", "Penyiapan file agar sesuai spesifikasi percetakan: ukuran, bleed, dan mode warna.", ["File cetak sesuai spesifikasi", "Pemeriksaan teknis sebelum cetak"], "Anda sudah punya desain tetapi belum siap cetak."],
  ["desain-cetak-kemasan", "Desain Cetak Kemasan", "Desain kemasan yang memperhitungkan bahan, dieline, dan teknik cetak.", ["Desain kemasan sesuai dieline", "File siap produksi"]],
]);

const digital = build("digital-technology", [
  ["pengembangan-landing-page", "Pengembangan Landing Page", "Halaman fokus untuk mengarahkan pengunjung pada satu tindakan.", ["Landing page responsif", "Formulir atau tombol kontak", "Pengaturan dasar SEO"], "Peluncuran, promosi, atau satu layanan."],
  ["pengembangan-website-bisnis", "Pengembangan Website Bisnis", "Website yang menjelaskan bisnis, layanan, dan cara menghubungi Anda dengan jelas.", ["Website multi-halaman responsif", "Struktur konten dan navigasi", "Pengaturan dasar SEO"]],
  ["website-company-profile", "Website Company Profile", "Website profil perusahaan yang informatif dan profesional.", ["Halaman profil, layanan, dan kontak", "Desain responsif"]],
  ["website-portofolio", "Website Portofolio", "Website untuk menampilkan karya dan keahlian secara profesional.", ["Galeri karya dan halaman studi kasus", "Desain responsif"], "Kreator, desainer, fotografer, dan konsultan."],
  ["pengembangan-aplikasi-web", "Pengembangan Aplikasi Web", "Aplikasi web yang mendukung alur kerja bisnis.", ["Aplikasi web sesuai kebutuhan", "Autentikasi dan pengelolaan data", "Dokumentasi penggunaan"]],
  ["implementasi-ui", "Implementasi UI", "Mengubah desain antarmuka menjadi halaman yang berfungsi dan responsif.", ["Implementasi desain ke kode", "Komponen yang dapat dipakai ulang"], "Anda sudah punya desain tetapi belum ada developer."],
  ["dashboard-bisnis", "Dashboard Bisnis", "Dashboard yang merangkum angka penting bisnis agar keputusan lebih mudah diambil.", ["Dashboard sesuai metrik yang disepakati", "Visualisasi data yang mudah dibaca"]],
  ["alat-internal", "Alat Internal", "Alat kecil untuk merapikan pekerjaan berulang tim, seperti pencatatan pesanan atau pengajuan.", ["Alat internal sesuai proses", "Panduan penggunaan singkat"]],
  ["alur-kerja-ai", "Alur Kerja Berbantuan AI", "Merancang alur kerja yang memakai AI untuk tugas yang sesuai, dengan pengecekan manusia.", ["Pemetaan proses dan peluang penggunaan AI", "Implementasi alur kerja yang disepakati"]],
  ["otomasi-alur-kerja", "Otomasi Alur Kerja", "Mengotomasi langkah-langkah manual seperti notifikasi, pencatatan, dan penyalinan data.", ["Pemetaan proses", "Implementasi otomasi", "Dokumentasi alur"]],
  ["pengembangan-produk-digital", "Pengembangan Produk Digital", "Rancang dan bangun versi awal produk digital.", ["Penentuan cakupan versi pertama", "Pengembangan dan pengujian"]],
  ["konsultasi-teknis", "Konsultasi Teknis", "Sesi diskusi untuk menentukan pendekatan teknis yang masuk akal sebelum Anda berinvestasi.", ["Rekomendasi pendekatan dan prioritas", "Ringkasan tertulis hasil diskusi"]],
]);

export const services: Service[] = [...brand, ...content, ...printing, ...digital];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const getPillar = (id: PillarId) => pillars.find((p) => p.id === id);
export const servicesByPillar = (id: PillarId) => services.filter((s) => s.pillar === id);
