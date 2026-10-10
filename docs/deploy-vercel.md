# Deploy ke Vercel (dua proyek terpisah)

Satu repositori Git, dua proyek Vercel. Keduanya memakai pnpm.

## 1. Personal Brand

1. Vercel → Add New → Project → pilih repositori.
2. **Root Directory**: `apps/personal-brand`. Aktifkan "Include source files outside of the Root Directory" (agar `packages/*` terbaca).
3. Framework: Next.js (otomatis). Install command: `pnpm install` (default dari `pnpm-lock.yaml`). Build command: default (`next build`).
4. Environment Variables: lihat tabel di `apps/personal-brand/README.md`. Minimal `NEXT_PUBLIC_SITE_URL` dan `NEXT_PUBLIC_WHATSAPP_NUMBER`; tambah `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM_EMAIL` agar email aktif.
5. Deploy.

## 2. Growth OS

1. Buat database PostgreSQL (Neon/Supabase/Vercel Postgres).
2. Add New → Project, repositori sama. **Root Directory**: `apps/growth-os`, aktifkan include source outside root.
3. Env: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `ALLOW_SIGNUP=false`, dan (untuk menerima lead) `LEAD_INGEST_API_KEY`, `LEAD_INGEST_USER_EMAIL`.
4. Build: `pnpm build` menjalankan `prisma generate && next build`.
5. Setelah deploy pertama: `DATABASE_URL="…" pnpm --filter growth-os exec prisma db push`.

## Domain

- Website: domain utama (mis. `domainanda.com`).
- Growth OS: subdomain (mis. `os.domainanda.com`), Settings → Domains di proyek masing-masing. Atur DNS sesuai petunjuk Vercel. Perbarui `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`, dan `GROWTH_OS_API_URL`, lalu redeploy.

## Setelah deploy: periksa

- `/sitemap.xml` dan `/robots.txt` memakai domain benar.
- Kirim formulir uji; pastikan email/prospek masuk.
- Tombol WhatsApp membuka chat dengan pesan terisi.
- Jangan mengaktifkan indexing situs staging (preview Vercel sudah noindex secara bawaan).

## Catatan

Ignored Build Step (opsional) agar perubahan satu aplikasi tidak membangun yang lain: `npx turbo-ignore`.
