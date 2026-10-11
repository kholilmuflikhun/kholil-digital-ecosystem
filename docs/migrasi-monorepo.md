# Rencana Migrasi ke Monorepo (pnpm + Turborepo)

## Kondisi awal (hasil audit)

| Aspek | Temuan |
|---|---|
| Struktur | Satu aplikasi Next.js, bukan monorepo, bukan repositori git |
| Next.js / React | 15.5.x / 19 |
| Package manager | npm (`package-lock.json`) |
| TypeScript | 5.7, `strict`, alias `@/*` → root aplikasi |
| Tailwind | 3.4 (config `tailwind.config.ts`, token warna CSS variable) |
| Database | PostgreSQL via Prisma 6 (`prisma/schema.prisma`) |
| Auth | Auth.js v5 beta, credentials, sesi JWT |
| Env | `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `ALLOW_SIGNUP` |
| Skrip | `dev`, `build` (`prisma generate && next build`), `typecheck`, `test` (vitest) |
| Baseline sebelum migrasi | typecheck lolos · 9 tes lulus · `next build` berhasil |

## Risiko dan konflik yang diidentifikasi

1. **Lockfile**: `package-lock.json` diganti `pnpm-lock.yaml`. Versi dependensi bisa bergeser. Mitigasi: versi dipertahankan persis dari `package.json` lama.
2. **Nama paket**: `growth-operating-system` menjadi `growth-os` agar `--filter=growth-os` sesuai konvensi. Hanya memengaruhi nama workspace, bukan perilaku runtime.
3. **Skrip lifecycle Prisma**: pnpm 10 memblokir skrip build dependensi secara default. Paket tepercaya (`prisma`, `@prisma/client`, `@prisma/engines`, `esbuild`, `sharp`) kini diizinkan melalui `allowBuilds` di `pnpm-workspace.yaml`, yaitu konfigurasi yang digunakan pnpm 11+.
4. **Env**: file `.env` tetap per aplikasi (`apps/growth-os/.env`), tidak digabung. Variabel tidak berubah.
5. **tsconfig**: tetap berdiri sendiri di tiap aplikasi (alias `@/*` tidak berubah). `tsconfig.base.json` di root hanya menyediakan opsi bersama.
6. **Deployment Vercel**: proyek lama (bila ada) harus mengubah **Root Directory** menjadi `apps/growth-os` dan memakai pnpm. Lihat `docs/deploy-vercel.md`.
7. **Tidak ada migrasi database**: skema Prisma tidak berubah.

## Langkah (inkremental)

1. Cadangan: `growth-os-pre-migration-backup.tgz` dibuat dan folder asli tidak disentuh.
2. Salin (bukan pindahkan) source ke `apps/growth-os`, tanpa `node_modules`, `.next`, `package-lock.json`.
3. Tambah root: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`, `.gitignore`, `.npmrc`.
4. Ubah `apps/growth-os/package.json` (nama, skrip `lint`), tanpa mengubah dependensi.
5. `pnpm install` lalu jalankan typecheck, test, dan build **Growth OS** dan bandingkan dengan baseline.
6. Baru setelah itu menambah `apps/personal-brand` dan paket bersama.

## Rollback / pemulihan

- Folder asli `growth-operating-system/` tidak diubah selama migrasi: kembali saja memakainya (`npm install`).
- Atau ekstrak `growth-os-pre-migration-backup.tgz`.
- Database dan skema tidak disentuh, jadi tidak ada langkah pemulihan data.
