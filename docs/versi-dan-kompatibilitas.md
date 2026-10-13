# Versi dependensi dan keputusan kompatibilitas

Diperiksa langsung ke registry npm pada 13 Oktober 2026 (`npm view <paket> dist-tags.latest`). Kolom *Dipakai* adalah versi terpasang di `pnpm-lock.yaml`.

| Paket | Tag `latest` di registry | Dipakai | Keputusan |
|---|---|---|---|
| next | 16.4.0 | 15.5.x | Tetap 15 (major baru belum diuji) |
| react / react-dom | 19.3.0 | 19.3.0 | Sudah terbaru |
| prisma / @prisma/client | 8.0.0-rc.22 / 7.10.0 | 6.19.x | Tetap 6 (7+ mengubah generator, driver, dan konfigurasi) |
| next-auth | 4.24.15 (v5 hanya `beta`: 5.0.0-beta.32) | 5.0.0-beta.32 | Auth.js v5 dipakai karena App Router; masih beta, pantau rilis stabil |
| tailwindcss | 4.3.3 | 3.4.x | Tetap 3 (v4 mengganti konfigurasi dan preset) |
| typescript | 7.0.2 | 5.9.x | Tetap 5.x |
| zod | 4.6.7 | 3.x | Tetap 3 (skema bersama dipakai dua aplikasi) |
| vitest | 5.0.4 | 2.1.x | Tetap 2 |
| recharts | 3.10.1 | 2.15.x | Tetap 2 |
| lucide-react | 1.56.0 | 0.468.x | Tetap; ikon yang dipakai sudah tersedia |
| next-themes | 0.4.6 | 0.4.x | Sesuai |
| @fontsource-variable/inter | 5.3.0 | 5.x | Sesuai |
| turbo | 2.11.7 | 2.11.7 | Sudah terbaru |

## Prinsip

1. Tidak ada kenaikan versi major tanpa menjalankan typecheck, tes, dan build. Seluruh kombinasi di atas lulus ketiganya (lihat laporan verifikasi).
2. "Latest" di registry belum tentu cocok dengan seluruh kombinasi dependensi. Kenaikan major (Next 16, Prisma 7, Tailwind 4, Zod 4) belum diuji pada repositori ini dan sebaiknya dilakukan satu per satu pada cabang terpisah.
3. Versi dikunci oleh `pnpm-lock.yaml`; jalankan `pnpm install --frozen-lockfile` di CI.

## Urutan peningkatan yang disarankan

1. Patch dan minor dalam rentang saat ini (`pnpm update`).
2. Tailwind 4 dan lucide-react 1.x (dampak UI; cek tampilan terang/gelap).
3. Zod 4 (ubah skema bersama dan seluruh `safeParse`).
4. Prisma 7 lalu Next 16 (uji migrasi, auth, dan middleware).
