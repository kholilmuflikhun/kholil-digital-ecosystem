# Kholil Digital Ecosystem

Monorepo (pnpm + Turborepo) berisi dua aplikasi yang dideploy terpisah:

| Aplikasi       | Folder                | Fungsi                                                       | Port lokal |
| -------------- | --------------------- | ------------------------------------------------------------ | ---------- |
| Personal Brand | `apps/personal-brand` | Website publik: layanan, produk, portofolio, wawasan, kontak | 3001       |
| Growth OS      | `apps/growth-os`      | Sistem internal (login): CRM, pipeline, target, pendapatan   | 3000       |

Paket bersama: `packages/shared` (kontrak lead + validasi Zod, dipakai kedua aplikasi) dan `packages/config` (konfigurasi ESLint).
Website **tidak** mengakses database Growth OS. Ia hanya mengirim lead lewat endpoint server-ke-server (lihat `docs/integrasi-growth-os.md`). Bila Growth OS mati, website tetap berjalan dan pengiriman lead ke Growth OS dapat gagal tanpa menghentikan situs.

## Struktur

```
apps/
  growth-os/        Next.js + Prisma + Auth.js (aplikasi internal)
  personal-brand/   Next.js, konten bertipe di content/, tanpa database
packages/
  shared/           skema Zod kontrak lead (versi 1)
  config/           konfigurasi ESLint bersama
docs/               deploy, integrasi, panduan environment/konten, dan brand voice
```

## Prasyarat

Node.js 20.9+ dan pnpm 10.28.0. Aktifkan pnpm melalui Corepack jika belum tersedia:

```bash
corepack enable
corepack prepare pnpm@10.28.0 --activate
```

Growth OS juga memerlukan database PostgreSQL dan environment variables; Personal Brand dapat dijalankan tanpa database maupun environment. Jangan commit file environment lokal atau menyimpan rahasia di variabel `NEXT_PUBLIC_*`.

## Perintah

Jalankan dari root monorepo:

```bash
pnpm install
pnpm dev --filter=personal-brand     # http://localhost:3001
pnpm dev --filter=growth-os          # http://localhost:3000 (perlu setup PostgreSQL, lihat README app)
pnpm build --filter=personal-brand
pnpm build --filter=growth-os        # menjalankan prisma generate lebih dulu
pnpm typecheck && pnpm lint && pnpm test
pnpm format
```

Untuk menyiapkan Growth OS secara lokal, salin `apps/growth-os/.env.example` menjadi `apps/growth-os/.env`, isi `DATABASE_URL` dan `AUTH_SECRET`, lalu jalankan `pnpm --filter growth-os db:push`. Seed data demo bersifat opsional. Lihat README masing-masing aplikasi untuk langkah lengkap dan daftar environment variables.

## Dokumentasi

- `apps/personal-brand/README.md`: env, pengeditan konten, SEO, tes
- `apps/growth-os/README.md`: setup PostgreSQL, autentikasi, seed demo, fitur, dan keterbatasan MVP
- `docs/mengedit-konten.md`: menambah layanan, produk, proyek, artikel
- `docs/integrasi-growth-os.md`: kontrak lead dan cara mengaktifkan
- `docs/deploy-vercel.md`: dua proyek Vercel, domain, env
- `docs/panduan-env-personal-brand.md` dan `docs/panduan-env-growth-os.md`: konfigurasi environment tiap aplikasi
- `docs/brand-voice-kit.md`: positioning dan panduan copy Personal Brand
- `docs/migrasi-monorepo.md`: rencana migrasi, risiko, rollback
- `docs/troubleshooting.md`: kesalahan build monorepo yang umum

## Status

Lihat bagian "Belum dikonfigurasi / perlu Anda isi" di `apps/personal-brand/README.md`. Singkatnya: nomor WhatsApp, email, domain, aset portofolio asli, harga, dan testimoni belum diisi dan sengaja tidak dikarang. Growth OS adalah aplikasi internal; detail kesiapan dan keterbatasan MVP tercantum di `apps/growth-os/README.md`.
