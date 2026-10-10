# Troubleshooting Monorepo

| Gejala | Penyebab umum | Solusi |
|---|---|---|
| `Cannot find module '@kholil/shared'` | install belum dari root | jalankan `pnpm install` di root |
| Vercel: gagal membaca `packages/*` | Root Directory tanpa "include source outside root" | aktifkan opsi itu di Settings → General |
| `Prisma Client did not initialize` | `prisma generate` belum jalan | `pnpm --filter growth-os exec prisma generate` |
| pnpm memblokir skrip build | pnpm 10 mengabaikan lifecycle script | pastikan `pnpm.onlyBuiltDependencies` di root `package.json` |
| Build gagal: konten tidak valid | `content/*` melanggar skema | baca pesan Zod; jalankan `pnpm test --filter=personal-brand` |
| Formulir: "belum terhubung" | tidak ada tujuan terkonfigurasi | isi env email atau Growth OS |
| Lead tidak masuk Growth OS | kunci beda, URL salah, ingest belum aktif (503) | samakan kunci; cek `LEAD_INGEST_*` |
| Port bentrok | 3000/3001 terpakai | ubah `-p` di script `dev` |
