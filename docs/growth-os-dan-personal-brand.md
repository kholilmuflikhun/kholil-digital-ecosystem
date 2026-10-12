# Growth OS & Website Personal Brand Kholil Muflikhun

Dokumen ini menjelaskan fungsi utama, fitur, menu, dan hubungan antara Growth OS dengan Website Personal Brand Kholil Muflikhun.

## 1. Growth OS

### Fungsi utama

**Growth OS (Growth Operating System)** adalah pusat kendali untuk merencanakan, menjalankan, dan mengukur pertumbuhan bisnis. Sistem ini menghubungkan strategi, aktivitas pemasaran, prospek, penjualan, delivery, pelanggan, dan keuangan agar pengguna dapat memahami kondisi bisnis serta menentukan langkah berikutnya.

Alur pertumbuhan yang menjadi dasar sistem:

**Personal brand → Konten → Audiens → Prospek → Percakapan → Penawaran → Penjualan → Delivery → Testimoni → Referral → Repeat order → Produk digital → Pendapatan yang dapat diskalakan → Reinvestasi.**

### Fitur Growth OS

| Fitur | Fungsi dan kegunaan |
|---|---|
| **Dashboard** | Menampilkan ringkasan bisnis seperti pendapatan, pertumbuhan bulanan, profit, progres target, funnel penjualan, aktivitas, dan fokus yang disarankan. Berguna untuk melihat kondisi bisnis dan prioritas tanpa membuka setiap menu. |
| **Goals & Kampanye** | Membuat target pendapatan, profit, penjualan, prospek, konten, proyek, atau sasaran lain dengan nilai dan periode yang dapat ditentukan sendiri. Progres menampilkan sisa target, waktu tersisa, laju yang diperlukan per hari/minggu, dan proyeksi hasil. Kampanye dapat memiliki target dan fase. |
| **Daily Actions** | Menyusun tugas berdasarkan kategori dan prioritas serta mencatat aktivitas harian, seperti prospek yang dihubungi, follow-up, proposal, deal, konten, jam kerja, pendapatan, dan profit. Skor eksekusi membandingkan aktivitas KPI yang selesai dengan yang direncanakan. |
| **Prospects** | Menyimpan informasi calon pelanggan, sumber prospek, potensi nilai, status, penawaran terkait, konten sumber, dan jadwal follow-up. Filter status dan penanda follow-up membantu mencegah prospek terlewat. |
| **Sales Pipeline** | Melacak deal dari lead hingga won/lost, berikut nilai, probabilitas, perkiraan closing, dan aksi selanjutnya. Menampilkan nilai pipeline, pipeline tertimbang, win rate, ukuran deal rata-rata, siklus penjualan, serta alasan deal kalah. |
| **Customers** | Mengelola pelanggan dan melihat pendapatan historis, profit, jumlah order, rata-rata nilai order, pembelian terakhir, proyek, dan testimoni. Berguna untuk memahami nilai pelanggan dan peluang repeat order atau reaktivasi. |
| **Offers** | Mengelola katalog produk dan layanan, termasuk harga, biaya, margin, waktu pengerjaan, batas revisi, target pelanggan, dan pesan penjualan. |
| **Projects** | Memantau status, deadline, progres, nilai proyek, biaya, jam kerja, dan revisi setelah penjualan. Sistem menghitung profit dan profit per jam untuk membantu memantau delivery dan profitabilitas. |
| **Content** | Mencatat konten berdasarkan platform, content pillar, format, status, tanggal terbit, CTA, penawaran/kampanye terkait, reach, kunjungan profil, DM, dan biaya produksi. Kinerja konten dapat dikaitkan dengan lead, deal, pendapatan, dan ROI. |
| **Revenue** | Mencatat transaksi dan biaya, status pembayaran, metode, referensi, kanal, dan jatuh tempo. Menampilkan pendapatan, biaya, profit, margin, rata-rata nilai order (AOV), piutang, dan tren keuangan. |
| **Analytics** | Menampilkan review bulanan/mingguan, funnel dan kebocoran konversi, performa kanal, atribusi konten terhadap pendapatan, kinerja penawaran, serta insight dan rekomendasi berbasis data. |
| **Strategy** | Menyimpan visi, misi, positioning, proposisi nilai, pelanggan ideal, penawaran, kanal akuisisi, strategi pertumbuhan, dan keunggulan kompetitif sebagai acuan aktivitas bisnis. |
| **Settings** | Mengatur profil, mata uang, locale, parameter bisnis (misalnya AOV dan tingkat konversi), ambang skor eksekusi, rentang repeat order, serta menghapus data demo. |

### Alur penggunaan

1. Tetapkan arah bisnis melalui **Strategy**.
2. Buat target dan kampanye melalui **Goals & Kampanye**.
3. Turunkan target menjadi tugas melalui **Daily Actions**.
4. Tarik dan kelola prospek melalui konten, integrasi website, dan **Prospects**.
5. Tindak lanjuti deal melalui **Sales Pipeline** dan **Offers**.
6. Kelola pekerjaan setelah penjualan melalui **Customers** dan **Projects**.
7. Catat transaksi dan biaya melalui **Revenue**.
8. Evaluasi hasil dan tentukan perbaikan melalui **Dashboard** dan **Analytics**.

Dashboard juga menyediakan perhitungan kebutuhan transaksi, lead berkualitas, prospek, dan outreach untuk membantu mengejar sisa target pendapatan. Perhitungan ini memerlukan goal pendapatan serta parameter bisnis yang relevan.

### Batasan Growth OS saat ini

- Insight dan rekomendasi berbasis aturan dan data aplikasi, bukan AI; analisis mungkin belum tersedia jika data kurang.
- Notifikasi otomatis belum aktif, meskipun model data notifikasi tersedia.
- Testimoni dan referral tercakup dalam data/funnel, tetapi belum memiliki halaman input khusus.
- Tahap pipeline dipindahkan melalui pilihan tahap, bukan drag-and-drop.
- Rate limiter masih in-memory per instance sehingga batas laju tidak global untuk deployment multi-instance.

## 2. Website Personal Brand Kholil Muflikhun

### Fungsi utama

Website Personal Brand berfungsi sebagai etalase profesional dan jalur masuk calon klien. Website memperkenalkan Kholil, menjelaskan keahlian dan layanan, menampilkan karya, memberikan informasi untuk membantu calon klien mengambil keputusan, dan mengarahkan mereka untuk berdiskusi atau menghubungi.

Positioning yang disampaikan adalah perpaduan **strategi brand, desain, dan solusi digital** untuk membantu bisnis tampil lebih jelas, konsisten, dan meyakinkan.

Konten situs dikelola sebagai data TypeScript bertipe di dalam proyek, bukan melalui CMS atau database. Situs dibuat statis sebisa mungkin.

### Komponen utama website

- **Identitas dan pesan utama:** nama, keahlian, proposisi nilai, serta pendekatan kerja.
- **Konten layanan, produk, proyek, artikel, profil, dan proses:** memberi konteks mengenai bidang kerja dan solusi yang tersedia.
- **CTA (ajakan bertindak):** mengarahkan pengunjung ke konsultasi, portofolio, WhatsApp, atau formulir kontak.
- **Formulir kontak:** mengumpulkan kebutuhan inquiry dan mengirimkannya ke tujuan yang sudah dikonfigurasi.
- **Atribusi kunjungan:** menyimpan UTM, referrer, dan landing page pertama di `sessionStorage`, lalu menyertakannya saat formulir dikirim. Atribusi ini tidak memakai cookie.
- **SEO dan metadata:** metadata per halaman, canonical, Open Graph, sitemap, robots, serta data terstruktur yang sesuai dengan konten.
- **Analitik opsional:** Plausible dapat dipakai untuk mengukur interaksi umum. Isi formulir dan informasi kontak tidak dikirim ke analitik tersebut.

### Menu navigasi utama

| Menu | Fungsi dan tujuan |
|---|---|
| **Beranda** | Merangkum positioning, layanan unggulan, portofolio, produk, proses, wawasan, dan CTA. Menjadi titik awal untuk memahami penawaran Kholil. |
| **Tentang** | Menjelaskan cerita profesional, prinsip kerja, kompetensi, dan jenis bisnis yang ingin dibantu. Membantu membangun kepercayaan dan menunjukkan kecocokan. |
| **Layanan** | Menjelaskan layanan dalam empat bidang: Brand & Design, Content & Creative, Printing & Apparel, serta Digital & Technology. Tersedia halaman detail untuk layanan tertentu. |
| **Produk** | Menampilkan paket atau solusi yang dapat dijelajahi berdasarkan kategori. Pengunjung dapat melihat detail dan menghubungi Kholil terkait produk tersebut. |
| **Portofolio** | Menampilkan karya dan studi kasus, termasuk konteks, tantangan, dan pendekatan proyek. |
| **Wawasan** | Menyajikan artikel/panduan tentang brand, desain, produksi, dan digital untuk membantu calon klien memahami pilihan dan mengambil keputusan. |
| **Kontak** | Menyediakan formulir inquiry dan alternatif WhatsApp atau email bila sudah dikonfigurasi. Jika dibuka dari layanan/produk tertentu, konteks itu dapat dibawa ke formulir. |

### Menu dan tautan footer

| Menu/tautan | Fungsi dan tujuan |
|---|---|
| **Proses kerja** | Menjelaskan tahapan proyek dari awal hingga serah terima agar alur, ekspektasi, dan ruang lingkup lebih jelas. |
| **Kebijakan privasi** | Menjelaskan data yang diterima, tujuan penggunaan, atribusi, dan penyimpanan. Kontennya saat ini masih draf dan perlu ditinjau sebelum menjadi kebijakan final. |
| **Syarat dan ketentuan** | Menjelaskan ketentuan umum tentang proposal, pembayaran, revisi, hak atas hasil kerja, dan produksi fisik. Halaman ini masih draf; ketentuan proyek mengikuti proposal/perjanjian tertulis yang disepakati. |
| **WhatsApp, email, dan sosial** | Menyediakan jalur kontak dan tautan sosial. Nomor WhatsApp, email, dan akun sosial harus dikonfigurasi agar tersedia/berfungsi. |

### Halaman detail

Selain halaman menu, tersedia halaman detail untuk layanan, produk, portofolio, dan artikel wawasan. Website juga menyediakan `sitemap.xml` dan `robots.txt` untuk crawler mesin pencari.

## 3. Integrasi Website dengan Growth OS

### Alur pengiriman lead

1. Pengunjung mengirim formulir kontak di website.
2. Server memvalidasi isian dan menerapkan perlindungan anti-spam, termasuk honeypot, pemeriksaan waktu pengisian, serta pembatasan laju.
3. Jika dikonfigurasi, website mengirim lead ke Growth OS melalui koneksi server-ke-server:
   `POST {GROWTH_OS_API_URL}/api/leads`
4. Growth OS memvalidasi payload dan mencatatnya sebagai prospek untuk ditindaklanjuti.

Website tidak mengakses database Growth OS secara langsung dan tidak mengambil data CRM dari Growth OS.

### Data yang dapat dikirim

Payload lead dapat mencakup:

- identitas/kontak: nama, email dan/atau WhatsApp, serta nama bisnis;
- pilihan kontak, kategori kebutuhan, pesan, anggaran, dan target waktu;
- sumber inquiry: formulir kontak umum, inquiry layanan, inquiry produk, atau sumber WhatsApp yang tercatat melalui alur lead;
- konteks halaman, slug layanan/produk;
- atribusi UTM, referrer, dan landing page;
- `externalId` dan waktu pengiriman.

Pengiriman menggunakan `externalId` untuk mencegah permintaan ulang membuat prospek ganda. Kontrak dan respons endpoint lebih rinci dijelaskan dalam [panduan integrasi Website → Growth OS](./integrasi-growth-os.md).

### Konfigurasi integrasi

Growth OS membutuhkan:

- `LEAD_INGEST_API_KEY`
- `LEAD_INGEST_USER_EMAIL`

Website membutuhkan:

- `GROWTH_OS_API_URL`
- `GROWTH_OS_API_KEY`

API key adalah rahasia server dan tidak boleh ditempatkan pada variabel `NEXT_PUBLIC_*`. Lihat [panduan environment Personal Brand](./panduan-env-personal-brand.md) dan [panduan environment Growth OS](./panduan-env-growth-os.md).

### Email, WhatsApp, dan analitik

- **Email:** formulir dapat mengirim inquiry melalui Resend jika konfigurasi email lengkap. Email dan Growth OS dapat menjadi tujuan pengiriman secara bersamaan.
- **WhatsApp:** CTA membuka percakapan WhatsApp bila nomor tersedia; jika tidak, tombol mengarah ke formulir kontak. Klik WhatsApp sendiri tidak otomatis membuat prospek di Growth OS. Prospek tercatat melalui alur pengiriman inquiry.
- **Plausible:** analitik opsional untuk event dan interaksi umum website. Ini terpisah dari Growth OS dan tidak menerima isi formulir atau informasi kontak.
- **Kegagalan konfigurasi:** jika Growth OS tidak tersedia, website tidak menganggap pengiriman ke Growth OS berhasil. Pengiriman email tetap dapat berfungsi jika email sudah dikonfigurasi. Jika tidak ada tujuan yang aktif, formulir menyampaikan bahwa pesan belum terkirim.

## 4. Ringkasan hubungan keduanya

| Sistem | Peran |
|---|---|
| **Website Personal Brand** | Memperkenalkan Kholil dan penawarannya, membangun kepercayaan, memberi informasi, serta menangkap inquiry calon klien. |
| **Growth OS** | Mengelola prospek yang masuk, aktivitas follow-up, pipeline penjualan, pelanggan, proyek, pendapatan, target, dan analisis pertumbuhan. |
| **Integrasi lead** | Menghubungkan formulir website ke daftar prospek Growth OS secara aman melalui API server-ke-server. |

Secara sederhana: **website membantu calon klien menemukan dan menghubungi Kholil; Growth OS membantu mengelola tindak lanjut dan proses pertumbuhan bisnis setelah inquiry masuk.**
