# Panduan Mengisi Environment Variable Growth OS

Panduan ini menjelaskan cara menyiapkan file konfigurasi untuk aplikasi Growth OS yang berada di `apps/growth-os`.

## 1. Buat file konfigurasi lokal

Jangan mengisi file `.env.example` dengan data asli. Salin file contoh menjadi `.env` di folder aplikasi:

```bash
cp apps/growth-os/.env.example apps/growth-os/.env
```

Jika menggunakan PowerShell:

```powershell
Copy-Item apps\growth-os\.env.example apps\growth-os\.env
```

Setelah itu, isi nilai sesuai kebutuhan di file `apps/growth-os/.env`.

> Catatan: file `.env` adalah file lokal yang tidak boleh dibagikan atau di-commit ke Git.

## 2. Variabel yang tersedia

Berikut penjelasan tiap variabel yang ada di `apps/growth-os/.env.example`.

### DATABASE_URL

```env
DATABASE_URL="postgresql://user:password@host:5432/growth_os?sslmode=require"
```

- Wajib diisi.
- Merupakan string koneksi PostgreSQL.
- Cocok untuk Neon, Supabase, Vercel Postgres, PostgreSQL lokal, atau layanan database lain yang kompatibel.
- Contoh lokal:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/growth_os?schema=public"
```

Pastikan database sudah dibuat dan user yang dipakai punya hak akses untuk membaca dan menulis data.

### AUTH_SECRET

```env
AUTH_SECRET=""
```

- Wajib diisi.
- Digunakan oleh Auth.js / NextAuth untuk mengenkripsi session dan token autentikasi.
- Buat nilai acak dengan perintah:

```bash
openssl rand -base64 32
```

Contoh:

```env
AUTH_SECRET="GANTI_DENGAN_OUTPUT_OPENSSL"
```

Jangan memakai string yang mudah ditebak.

### NEXT_PUBLIC_APP_URL

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

- Disarankan diisi.
- Merupakan URL publik aplikasi.
- Untuk lokal, umumnya:

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

- Untuk produksi, gunakan domain aplikasi Anda:

```env
NEXT_PUBLIC_APP_URL="https://growthos.domainanda.com"
```

Nilai ini sering dipakai untuk redirect, callback, tautan publik, dan metadata aplikasi.

### ALLOW_SIGNUP

```env
ALLOW_SIGNUP="true"
```

- Opsional.
- Nilai yang valid:
  - `"true"` untuk membuka pendaftaran
  - `"false"` untuk menutup pendaftaran

Contoh:

```env
ALLOW_SIGNUP="false"
```

Jika diset `false`, halaman register akan otomatis redirect ke halaman login.

### LEAD_INGEST_API_KEY

```env
LEAD_INGEST_API_KEY=""
```

- Opsional, tetapi penting jika Anda ingin menerima lead dari website personal brand.
- Dipakai untuk autentikasi endpoint `POST /api/leads` di Growth OS.
- Harus minimal 32 karakter.
- Sebaiknya dibuat random:

```bash
openssl rand -hex 32
```

Contoh:

```env
LEAD_INGEST_API_KEY="GANTI_DENGAN_OUTPUT_OPENSSL"
```

Nilai ini harus sama persis dengan `GROWTH_OS_API_KEY` yang dipasang di website personal brand.

### LEAD_INGEST_USER_EMAIL

```env
LEAD_INGEST_USER_EMAIL=""
```

- Opsional, tetapi diperlukan agar endpoint penerimaan lead aktif.
- Ini adalah email akun yang akan menerima data prospek dari website.

Contoh:

```env
LEAD_INGEST_USER_EMAIL="admin@domainanda.com"
```

Email ini harus valid dan sesuai dengan akun yang ada di aplikasi Growth OS.

### CRON_SECRET

Rahasia untuk endpoint `GET /api/cron/notifications` (job harian yang membuat notifikasi in-app dan memperbarui progres goal otomatis). Minimal 32 karakter. Bila kosong atau lebih pendek, endpoint menjawab 503 dan notifikasi tetap dibuat saat halaman Notifikasi dibuka. `vercel.json` di `apps/growth-os` menjadwalkan job pukul 01:00 UTC; Vercel otomatis mengirim `Authorization: Bearer <CRON_SECRET>`.

Buat nilainya sendiri: `openssl rand -hex 32`.

### UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN (opsional)

Mengaktifkan pembatas laju global di Upstash Redis. Tanpa keduanya, pembatas memakai memori per instance (cukup untuk lokal, kurang kuat di Vercel). Bila Upstash gagal dijangkau, aplikasi otomatis memakai cadangan in-memory dan mencatat peringatan di log.

## 3. Contoh file `.env` yang siap digunakan

### Contoh lokal

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/growth_os?schema=public"
AUTH_SECRET="GANTI_DENGAN_OUTPUT_OPENSSL"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ALLOW_SIGNUP="true"
LEAD_INGEST_API_KEY="GANTI_DENGAN_OUTPUT_OPENSSL"
LEAD_INGEST_USER_EMAIL="admin@domainanda.com"
CRON_SECRET="GANTI_DENGAN_OUTPUT_OPENSSL"
```

### Contoh produksi

```env
DATABASE_URL="postgresql://user:password@host:5432/growth_os?sslmode=require"
AUTH_SECRET="GANTI_DENGAN_OUTPUT_OPENSSL"
NEXT_PUBLIC_APP_URL="https://growthos.domainanda.com"
ALLOW_SIGNUP="false"
LEAD_INGEST_API_KEY="GANTI_DENGAN_OUTPUT_OPENSSL"
LEAD_INGEST_USER_EMAIL="admin@domainanda.com"
CRON_SECRET="GANTI_DENGAN_OUTPUT_OPENSSL"
```

## 4. Kapan fitur lead ingest aktif?

Endpoint pengiriman lead di Growth OS hanya aktif ketika dua kondisi terpenuhi:

- `LEAD_INGEST_API_KEY` tersedia dan panjangnya lebih dari atau sama dengan 32 karakter
- `LEAD_INGEST_USER_EMAIL` diisi

Jika salah satu tidak ada, endpoint akan menolak request dengan status `503` bukan karena error server, tetapi karena modul belum dikonfigurasi.

Ini sesuai dengan logika yang ada di file [apps/growth-os/app/api/leads/route.ts](../apps/growth-os/app/api/leads/route.ts).

## 5. Langkah setelah konfigurasi selesai

Setelah file `.env` siap, jalankan langkah berikut:

```bash
pnpm --filter growth-os exec prisma db push
pnpm --filter growth-os db:seed
pnpm dev --filter=growth-os
```

Informasi lengkapnya bisa dilihat di [apps/growth-os/README.md](../apps/growth-os/README.md).

> **Peringatan:** nilai `AUTH_SECRET`, `LEAD_INGEST_API_KEY`, dan `CRON_SECRET` pada contoh hanyalah placeholder. Hasilkan nilai baru dan unik untuk setiap environment menggunakan perintah `openssl` di atas.

## 6. Praktik keamanan yang disarankan

- Jangan commit file `.env` ke repositori.
- Jangan membagikan `AUTH_SECRET` atau `LEAD_INGEST_API_KEY` ke orang lain.
- Gunakan nilai acak dan unik untuk setiap environment.
- Untuk production, simpan variabel di dashboard hosting seperti Vercel, Railway, atau Render, bukan di file repo.
- Jangan menambahkan API key ke variabel yang berawalan `NEXT_PUBLIC_` karena variabel itu bisa dibaca browser.

## 7. Catatan terkait integrasi website

Jika Anda juga memakai website personal brand, maka kunci `LEAD_INGEST_API_KEY` pada Growth OS harus sama dengan `GROWTH_OS_API_KEY` pada website. Penjelasan lengkapnya ada di dokumentasi [docs/integrasi-growth-os.md](./integrasi-growth-os.md).

Untuk konfigurasi website personal brand, lihat juga [docs/panduan-env-personal-brand.md](./panduan-env-personal-brand.md).

## 8. Ringkasan singkat

Untuk menjalankan Growth OS secara lokal, minimal Anda perlu:

```env
DATABASE_URL="..."
AUTH_SECRET="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Sementara variabel lead ingestion baru diperlukan jika Anda ingin menerima data dari website.
