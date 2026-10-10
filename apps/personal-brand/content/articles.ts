import type { Article } from "./schemas";

/**
 * Artikel edukasi. Untuk menambah artikel: salin satu objek, ganti slug (unik), judul, tanggal, dan isi `body`.
 * Tipe blok: { type: "p" | "h2", text } dan { type: "ul", items: [] }.
 * Draf awal di bawah berisi panduan umum; tinjau dan sesuaikan dengan sudut pandang Anda sebelum rilis.
 */
export const articles: Article[] = [
  {
    slug: "persiapan-sebelum-memesan-desain-logo",
    title: "Apa yang Perlu Disiapkan Sebelum Memesan Desain Logo",
    description:
      "Daftar singkat hal yang membantu proses desain logo berjalan lebih cepat dan hasilnya lebih tepat sasaran.",
    category: "Branding",
    publishedAt: "2026-10-09",
    readingMinutes: 3,
    author: "Kholil Muflikhun",
    relatedServices: ["desain-logo", "brand-identity"],
    published: true,
    body: [
      { type: "p", text: "Logo yang baik dimulai dari brief yang jelas. Semakin jelas gambaran bisnis Anda, semakin sedikit putaran revisi yang dibutuhkan." },
      { type: "h2", text: "Kenali bisnis dan pelanggan Anda" },
      { type: "ul", items: [
        "Apa yang Anda jual dan apa yang membedakannya dari pesaing terdekat.",
        "Siapa pelanggan utama Anda: usia, kebiasaan, dan tempat mereka mengenal Anda.",
        "Kesan yang ingin muncul saat orang melihat brand Anda, misalnya hangat, tegas, atau modern.",
      ] },
      { type: "h2", text: "Kumpulkan referensi, termasuk yang tidak disukai" },
      { type: "p", text: "Contoh logo yang Anda sukai membantu menentukan arah. Contoh yang tidak Anda sukai sama bergunanya karena menunjukkan batasan." },
      { type: "h2", text: "Pikirkan di mana logo akan dipakai" },
      { type: "ul", items: [
        "Media sosial dan marketplace yang membutuhkan versi persegi atau bulat.",
        "Kemasan, stiker, atau stempel yang membutuhkan versi sederhana satu warna.",
        "Papan nama atau banner yang membutuhkan keterbacaan dari jarak jauh.",
      ] },
      { type: "p", text: "Dengan tiga hal ini, diskusi awal bisa langsung membahas arah visual, bukan mengumpulkan informasi dasar." },
    ],
  },
  {
    slug: "menyiapkan-file-desain-siap-cetak",
    title: "Cara Menyiapkan File Desain agar Siap Cetak",
    description:
      "Poin teknis yang sering terlewat sebelum desain dikirim ke percetakan: ukuran, bleed, mode warna, dan huruf.",
    category: "Digital Printing",
    publishedAt: "2026-10-09",
    readingMinutes: 3,
    author: "Kholil Muflikhun",
    relatedServices: ["file-desain-siap-cetak", "digital-printing"],
    published: true,
    body: [
      { type: "p", text: "Desain yang tampil bagus di layar belum tentu siap dicetak. Beberapa pemeriksaan teknis berikut membantu menghindari cetak ulang." },
      { type: "h2", text: "Ukuran dan area bleed" },
      { type: "p", text: "Pastikan ukuran dokumen sesuai ukuran akhir. Untuk desain yang berwarna sampai ke tepi, tambahkan area bleed (umumnya beberapa milimeter di setiap sisi) agar tidak muncul garis putih setelah dipotong. Tanyakan angka bleed yang diminta percetakan Anda." },
      { type: "h2", text: "Mode warna" },
      { type: "p", text: "Layar memakai RGB, sedangkan banyak proses cetak memakai CMYK. Warna yang sangat cerah di layar bisa tampak lebih redup saat dicetak. Cek hasil konversi sebelum menyetujui desain." },
      { type: "h2", text: "Huruf dan gambar" },
      { type: "ul", items: [
        "Ubah teks menjadi outline atau sertakan berkas huruf agar tampilan tidak berubah.",
        "Gunakan gambar beresolusi cukup untuk ukuran cetak; gambar kecil yang diperbesar akan pecah.",
        "Letakkan teks penting di dalam area aman, tidak terlalu dekat dengan tepi potong.",
      ] },
      { type: "p", text: "Bila ragu, minta percetakan memeriksa spesifikasi mereka terlebih dahulu. Setiap mesin dan bahan punya ketentuan sendiri." },
    ],
  },
  {
    slug: "landing-page-atau-website-bisnis",
    title: "Landing Page atau Website Bisnis: Mana yang Perlu Dulu?",
    description:
      "Cara memilih antara satu halaman fokus dan website multi-halaman berdasarkan tujuan dan tahap bisnis Anda.",
    category: "Pengembangan Web",
    publishedAt: "2026-10-09",
    readingMinutes: 3,
    author: "Kholil Muflikhun",
    relatedServices: ["pengembangan-landing-page", "pengembangan-website-bisnis"],
    published: true,
    body: [
      { type: "p", text: "Keduanya sama-sama berguna, tetapi menjawab kebutuhan yang berbeda. Pilihan yang tepat bergantung pada apa yang ingin Anda capai sekarang." },
      { type: "h2", text: "Landing page cocok bila tujuannya satu" },
      { type: "ul", items: [
        "Mempromosikan satu produk atau satu layanan.",
        "Mengumpulkan inquiry dari iklan atau unggahan media sosial.",
        "Menguji penawaran baru sebelum berinvestasi lebih besar.",
      ] },
      { type: "h2", text: "Website bisnis cocok bila Anda butuh gambaran utuh" },
      { type: "ul", items: [
        "Anda memiliki beberapa layanan atau lini produk yang perlu dijelaskan.",
        "Calon klien ingin melihat profil, portofolio, dan proses kerja sebelum menghubungi.",
        "Anda ingin ditemukan lewat pencarian untuk beberapa topik berbeda.",
      ] },
      { type: "h2", text: "Mulai kecil, tumbuh bertahap" },
      { type: "p", text: "Banyak bisnis memulai dari landing page, lalu menambah halaman ketika kebutuhan sudah jelas. Yang terpenting, tentukan lebih dulu tindakan apa yang diharapkan dari pengunjung: mengirim pesan, menelepon, atau memesan." },
    ],
  },
];

export const publishedArticles = () =>
  articles.filter((a) => a.published).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const getArticle = (slug: string) => publishedArticles().find((a) => a.slug === slug);
