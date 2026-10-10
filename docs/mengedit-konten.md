# Mengedit Konten Website

Semua konten di `apps/personal-brand/content/`. Tidak ada editor publik. Perubahan = edit file, commit, deploy. Konten divalidasi saat build; konten tidak valid menggagalkan build.

## Aturan jujur (ditegakkan tes)

- Jangan isi `outcome`, nama klien, atau testimoni yang tidak nyata.
- Nama klien hanya bila `clientVerified: true` dan ada izin.
- Proyek konsep wajib `type: "concept"`, tanpa klien dan tanpa hasil.
- Harga hanya bila nyata. Default `contact` atau `custom-quotation`.
- `deliveryEstimate` hanya bila sudah terverifikasi.

## Menambah layanan (`services.ts`)

Tambah satu baris di array pilar yang sesuai: `[slug, nama, ringkasan, [deliverables], "cocok untuk"]`. Slug unik, huruf kecil dan tanda hubung. Halaman `/services/<slug>` dan sitemap otomatis ikut.

## Menambah produk (`products.ts`)

Panggil `make({...})` dengan `slug`, `name`, `category`, `type`, `short`, `full`, `features`, `deliverables`. Opsi: `featured`, `availability`, `related` (slug layanan), `pricing`. Untuk menampilkan harga:

```ts
pricing: { mode: "starting-from", amount: 1500000, currency: "IDR" }  // isi angka asli
```

Mode: `fixed`, `starting-from`, `custom-quotation`, `contact`. JSON-LD `offers` hanya muncul untuk `fixed` dan `starting-from`.

## Menambah proyek (`projects.ts`)

Salin satu objek. Taruh gambar asli di `public/portfolio/<slug>/` dan isi `images` (alt wajib deskriptif). Tanpa gambar, isi `art: { variant }` hanya untuk proyek konsep.

## Menambah artikel (`articles.ts`)

Salin satu objek, ganti `slug`, `title`, `publishedAt`, `body` (blok `p`, `h2`, `ul`). `published: false` untuk menyimpan draf.

## Testimoni (`testimonials.ts`)

Tambah hanya yang asli dan disetujui (`consent: true`). Selama kosong, bagian testimoni tidak tampil.

## Profil, navigasi, pengaturan

`profile.ts` (teks utama), `navigation.ts` (menu; label bahasa Indonesia, ubah bila ingin Inggris), `settings.ts` (akun sosial, area layanan, model produksi).

Setelah mengedit: `pnpm typecheck && pnpm test --filter=personal-brand`.
