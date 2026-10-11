# Troubleshooting Monorepo

| Gejala | Penyebab umum | Solusi |
|---|---|---|
| `Cannot find module '@kholil/shared'` | install belum dari root | jalankan `pnpm install` di root |
| Vercel: gagal membaca `packages/*` | Root Directory tanpa "include source outside root" | aktifkan opsi itu di Settings → General |
| `pnpm install` gagal di `prisma generate` / `Failed to fetch sha256 checksum` | unduhan engine Prisma diblokir (VPN, proxy, antivirus, jaringan) | sejak perbaikan ini `pnpm install` tidak lagi memanggil Prisma. Jalankan `pnpm --filter growth-os db:generate` setelah jaringan normal; `pnpm dev` dan `pnpm build` untuk Growth OS menjalankannya otomatis |
| Ada `package-lock.json` di root | `npm install` terjadi di repo pnpm | hapus; gunakan hanya `pnpm` (lockfile resmi: `pnpm-lock.yaml`) |
| `Prisma Client did not initialize` | `prisma generate` belum jalan | `pnpm --filter growth-os exec prisma generate` |
| pnpm memblokir skrip build | pnpm 10 mengabaikan lifecycle script | pastikan `pnpm.onlyBuiltDependencies` di root `package.json` |
| Build gagal: konten tidak valid | `content/*` melanggar skema | baca pesan Zod; jalankan `pnpm test --filter=personal-brand` |
| Formulir: "belum terhubung" | tidak ada tujuan terkonfigurasi | isi env email atau Growth OS |
| Lead tidak masuk Growth OS | kunci beda, URL salah, ingest belum aktif (503) | samakan kunci; cek `LEAD_INGEST_*` |
| Port bentrok | 3000/3001 terpakai | ubah `-p` di script `dev` |
