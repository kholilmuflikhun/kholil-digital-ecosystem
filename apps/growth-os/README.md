# Growth Operating System

Sistem operasi bisnis pribadi/UMKM yang menghubungkan:
**Personal Brand → Konten → Audience → Prospek → Percakapan → Penawaran → Penjualan → Delivery → Testimoni → Referral → Repeat Order → Produk Digital → Pendapatan → Reinvestasi.**

Growth OS adalah aplikasi internal untuk mengelola seluruh alur tersebut. Target, mata uang, parameter bisnis, dan durasi kampanye tidak dikunci; pengguna dapat mengaturnya sendiri.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Prisma + PostgreSQL · Auth.js (credentials) · Zod · Recharts · date-fns

## Prasyarat

Node.js 22 atau lebih baru dan pnpm 10.28.0. Jalankan perintah dari root monorepo.

## Menjalankan secara lokal

Salin file contoh environment lalu isi koneksi PostgreSQL dan rahasia autentikasi:

```bash
pnpm install
cp apps/growth-os/.env.example apps/growth-os/.env
pnpm --filter growth-os db:push
pnpm --filter growth-os db:seed    # opsional: buat data demo berlabel DEMO
pnpm --filter growth-os dev        # http://localhost:3000
```

Di PowerShell, gunakan `Copy-Item apps\growth-os\.env.example apps\growth-os\.env` sebagai pengganti perintah `cp`.

Setelah menjalankan seed, akun demo adalah `demo@growthos.app` / `demo12345`. Seed membuat ulang akun demo beserta datanya. Data demo dapat dihapus dari **Settings → Hapus semua data demo**. Jangan gunakan akun atau kata sandi demo di produksi.

Perintah lain dari root monorepo:

```bash
pnpm --filter growth-os lint
pnpm --filter growth-os typecheck
pnpm --filter growth-os test
pnpm --filter growth-os build
pnpm --filter growth-os start
```

## Environment variables

| Variabel | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | ya | String koneksi PostgreSQL (Neon, Supabase, Vercel Postgres, dll.) |
| `AUTH_SECRET` | ya | Buat dengan `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | disarankan | URL publik aplikasi |
| `ALLOW_SIGNUP` | tidak | `false` untuk menutup pendaftaran akun baru |
| `LEAD_INGEST_API_KEY` | tidak | Kunci server-ke-server, minimal 32 karakter; wajib untuk mengaktifkan penerimaan lead |
| `LEAD_INGEST_USER_EMAIL` | tidak | Email akun Growth OS yang menerima lead; wajib bersama API key |

Panduan lengkap environment ada di [`docs/panduan-env-growth-os.md`](../../docs/panduan-env-growth-os.md). Jangan commit file `.env` atau menaruh rahasia pada variabel `NEXT_PUBLIC_*`.

## Fitur utama

- Dashboard, target, dan aktivitas harian.
- Manajemen prospek dan pipeline penjualan, pelanggan, penawaran, proyek, konten, serta pendapatan.
- Analytics, strategi bisnis, dan pengaturan parameter bisnis.
- Insights dan rekomendasi berbasis aturan dari data aplikasi, tanpa AI.
- Penerimaan lead dari website Personal Brand melalui endpoint server-ke-server `POST /api/leads`.

Lead dari website memerlukan `LEAD_INGEST_API_KEY` dan `LEAD_INGEST_USER_EMAIL` di Growth OS, serta `GROWTH_OS_API_URL` dan `GROWTH_OS_API_KEY` di website. Pengiriman menggunakan `externalId` agar permintaan ulang tidak membuat prospek ganda. Lihat [`docs/integrasi-growth-os.md`](../../docs/integrasi-growth-os.md) untuk kontrak dan langkah konfigurasi.

## Deploy ke Vercel

1. Buat database PostgreSQL (mis. Neon atau Vercel Postgres) dan salin connection string.
2. Push repo ke GitHub, lalu **Import Project** di Vercel. Atur Root Directory ke `apps/growth-os` bila membuat proyek Vercel khusus untuk aplikasi ini.
3. Isi environment variables di atas (Settings → Environment Variables).
4. Deploy. Script build menjalankan `prisma generate && next build`.
5. Setelah deploy pertama, terapkan skema dari mesin lokal:
   ```bash
   DATABASE_URL="<url produksi>" pnpm --filter growth-os exec prisma db push
   ```
   Di PowerShell: `$env:DATABASE_URL="<url produksi>"; pnpm --filter growth-os exec prisma db push`.
   (atau pakai `prisma migrate deploy` bila Anda memakai migrasi).
6. Seed bersifat opsional dan hanya untuk membuat data demo; hindari menjalankannya di produksi kecuali data demo memang diinginkan.

Gunakan connection string dengan pooling (mis. pooler Neon) agar aman untuk serverless.
Panduan deploy dua aplikasi dan konfigurasi domain tersedia di [`docs/deploy-vercel.md`](../../docs/deploy-vercel.md).

## Arsitektur

```
app/(auth)        login dan register
app/(app)         halaman terproteksi: dashboard, goals, daily, prospects, pipeline,
                  customers, offers, projects, content, revenue, analytics, strategy, settings
app/api/leads     endpoint lead-ingest server-ke-server
components/       UI, form entitas, grafik, shell aplikasi, dan flywheel
lib/actions       server actions untuk autentikasi dan mutasi data
lib/calculations  fungsi perhitungan murni dan tes Vitest
lib/data          agregasi data dashboard/analytics dengan scope userId
lib/leads         validasi dan pemetaan lead eksternal ke prospek
lib/validations   skema validasi Zod
prisma/           schema.prisma dan seed data demo
```

### Keamanan

- Setiap query dan mutasi memakai `userId` dari sesi server, tidak pernah dari klien.
- Mutasi memakai `updateMany/deleteMany({ where: { id, userId } })`; ID relasi dari klien diverifikasi lewat `ownsAll`.
- Input divalidasi dengan Zod di server. Password di-hash dengan bcrypt (cost 12).
- Middleware melindungi halaman aplikasi; endpoint publik memiliki pemeriksaan akses masing-masing. Endpoint lead-ingest memakai API key, validasi payload, batas ukuran request, dan pencatatan pengiriman idempoten.
- Header keamanan dasar diatur di `next.config.ts`.
- **Rate limiter bersifat in-memory** (`lib/utils/rate-limit.ts`) untuk login, pendaftaran, mutasi, dan lead-ingest. Di Vercel atau lingkungan multi-instance, batas ini tidak global; ganti implementasinya dengan Upstash Redis untuk rate limit lintas instance.

### Insight & rekomendasi

Berbasis aturan (tanpa AI) dan berasal dari data aplikasi. Bila data belum cukup, UI dapat menampilkan **"Not enough data yet."**

### Notifikasi

Model `Notification` mendukung tipe (follow-up, tagihan jatuh tempo, deadline, prioritas harian, milestone kampanye, review mingguan, reaktivasi), kanal (`IN_APP`, `EMAIL`, `WHATSAPP`, `TELEGRAM`, `CALENDAR`), dan `dedupeKey`. MVP belum menghasilkan atau menampilkan notifikasi. Langkah berikutnya adalah job terjadwal (misalnya Vercel Cron) yang membuat notifikasi, lalu UI untuk menampilkannya.

## Monorepo dan integrasi

Aplikasi ini berada di `apps/growth-os` dalam monorepo pnpm + Turborepo. Kontrak lead bersama berada di `packages/shared`; website tidak mengakses database Growth OS secara langsung dan mengirim lead melalui `POST /api/leads`. [README root](../../README.md) menjelaskan struktur workspace, dan [`docs/integrasi-growth-os.md`](../../docs/integrasi-growth-os.md) menjelaskan detail integrasi.

## Keterbatasan MVP

- Kanban pipeline memindahkan deal lewat dropdown tahap (bukan drag-and-drop).
- Pembuatan dan tampilan notifikasi otomatis belum aktif (lihat di atas).
- Testimoni dan referral tersimpan di database dan dihitung di funnel, tetapi belum punya halaman input sendiri.
- Belum ada OAuth; autentikasi saat ini memakai credentials. Provider OAuth dapat ditambahkan di konfigurasi Auth.js.
