# Deploy ke Vercel (dua proyek terpisah)

Satu repositori Git, dua proyek Vercel. Buat satu proyek Vercel untuk setiap aplikasi, dan atur **Root Directory** masing-masing seperti di bawah. Aktifkan opsi untuk menyertakan source files di luar root directory agar workspace `packages/*` dapat diakses. Gunakan pnpm dari `packageManager` di root repo (`pnpm@12.11.2`); jangan menetapkan perintah install/build khusus kecuali memang perlu.

## 1. Personal Brand

1. Vercel → Add New → Project → pilih repositori.
2. **Root Directory**: `apps/personal-brand`.
3. Framework: Next.js (otomatis). Biarkan install dan build command default agar Vercel menggunakan workspace pnpm dan script build aplikasi.
4. Environment Variables: lihat tabel di `apps/personal-brand/README.md`. Minimal `NEXT_PUBLIC_SITE_URL` dan `NEXT_PUBLIC_WHATSAPP_NUMBER`; tambah `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM_EMAIL` agar email aktif.
5. Deploy.

## 2. Growth OS

1. Buat database PostgreSQL (Neon/Supabase/Vercel Postgres).
2. Add New → Project, repositori sama. **Root Directory**: `apps/growth-os`.
3. Env: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `ALLOW_SIGNUP=false`, `CRON_SECRET`, dan (untuk menerima lead) `LEAD_INGEST_API_KEY`, `LEAD_INGEST_USER_EMAIL`.
4. Biarkan Build Command default. Script build Growth OS menjalankan `prisma generate && next build`.
5. Terapkan skema database sebelum aplikasi digunakan. Repositori ini belum memiliki migrasi Prisma; untuk bootstrap MVP awal, jalankan `pnpm --filter growth-os exec prisma db push` dari mesin lokal dengan `DATABASE_URL` produksi yang diset sementara. Sebelum perubahan skema produksi berikutnya, buat dan commit migrasi Prisma, lalu jalankan `pnpm --filter growth-os db:deploy`. Jangan gunakan `db push` sebagai alur deploy berulang.

## Domain

- Website: domain utama (mis. `domainanda.com`).
- Growth OS: subdomain (mis. `os.domainanda.com`), Settings → Domains di proyek masing-masing. Atur DNS sesuai petunjuk Vercel. Perbarui `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`, dan `GROWTH_OS_API_URL`, lalu redeploy.

## Setelah deploy: periksa

- `/sitemap.xml` dan `/robots.txt` memakai domain benar.
- Kirim formulir uji; pastikan email/prospek masuk.
- Tombol WhatsApp membuka chat dengan pesan terisi.
- Jangan mengaktifkan indexing situs staging (preview Vercel sudah noindex secara bawaan).

## Catatan

Perubahan dalam monorepo dapat memicu deployment pada kedua proyek. Jika ingin melewati deployment saat file aplikasi terkait tidak berubah, gunakan pengaturan Skip/Ignore Build Step Vercel yang sesuai untuk tiap proyek; jangan mengandalkan `services` di `vercel.json` root karena pemetaan proyek monorepo dilakukan lewat pengaturan Root Directory di Vercel. Cron Growth OS didefinisikan di `apps/growth-os/vercel.json` dan berjalan pada deployment Production.
