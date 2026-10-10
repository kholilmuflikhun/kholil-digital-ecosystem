# Personal Brand (Kholil Muflikhun)

Website Next.js 15 (App Router, statis sebisa mungkin). Tidak memakai database. Konten ada di `apps/personal-brand/content/` sebagai TypeScript bertipe dan divalidasi dengan Zod melalui tes konten.

## Menjalankan lokal

Jalankan perintah dari root monorepo. Gunakan Node.js 20.9+ dan pnpm 10.

```bash
pnpm install
pnpm dev --filter=personal-brand   # http://localhost:3001
```

Salin `.env.example` ke `.env.local` bila ingin mengatur fitur opsional. Di PowerShell:

```powershell
Copy-Item apps\personal-brand\.env.example apps\personal-brand\.env.local
```

Tanpa env pun situs berjalan. Bila nomor WhatsApp belum diatur, CTA WhatsApp beralih ke formulir kontak. Formulir tetap dapat diisi, tetapi menjawab jujur "belum terhubung" dan tidak pernah pura-pura sukses; bila pengiriman gagal dan nomor WhatsApp tersedia, formulir menawarkan WhatsApp sebagai alternatif.

## Halaman

- `/`, `/about`, `/services`, `/products`, `/portfolio`, `/process`, `/insights`, dan `/contact`
- `/services/<slug>`, `/products/<slug>`, `/portfolio/<slug>`, dan `/insights/<slug>` untuk detail konten
- `/privacy` dan `/terms` untuk kebijakan privasi dan syarat
- `/sitemap.xml` dan `/robots.txt` untuk crawler

## Environment variable

| Variabel | Sisi | Wajib | Keterangan |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | publik | produksi | URL kanonik, mis. `https://domainanda.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | publik | disarankan | `08…` atau `62…`; tombol WhatsApp aktif bila valid |
| `NEXT_PUBLIC_CONTACT_EMAIL` | publik | opsional | email yang ditampilkan |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | publik | opsional | mengaktifkan analitik Plausible |
| `NEXT_PUBLIC_GROWTH_OS_URL` | publik | opsional | hanya tautan |
| `CONTACT_EMAIL` | **server** | untuk email | tujuan email inquiry |
| `CONTACT_FROM_EMAIL` | **server** | untuk email | pengirim terverifikasi di Resend |
| `RESEND_API_KEY` | **server** | untuk email | rahasia |
| `GROWTH_OS_API_URL` | **server** | untuk CRM | mis. `https://os.domainanda.com` |
| `GROWTH_OS_API_KEY` | **server** | untuk CRM | harus sama dengan `LEAD_INGEST_API_KEY` di Growth OS |

Formulir dianggap terhubung bila minimal satu tujuan (email atau Growth OS) terkonfigurasi lengkap. Konfigurasi email membutuhkan ketiga variabel email; Growth OS membutuhkan `GROWTH_OS_API_URL` dan `GROWTH_OS_API_KEY`. Panduan rinci dan contoh format ada di [`docs/panduan-env-personal-brand.md`](../../docs/panduan-env-personal-brand.md). Variabel `NEXT_PUBLIC_*` bersifat publik; jangan menaruh rahasia di dalamnya.

## Alur lead

Formulir → validasi Zod server → anti-spam (honeypot, waktu isi, batas laju per IP) → kirim ke semua tujuan terkonfigurasi → balasan jujur. Batas laju saat ini bersifat in-memory per instance. UTM, referrer eksternal, dan landing page pertama disimpan di `sessionStorage` (tanpa cookie) dan ikut terkirim bersama formulir. Analitik Plausible bersifat opsional dan tidak menerima isi formulir, nama, email, atau nomor telepon. Detail integrasi: [`docs/integrasi-growth-os.md`](../../docs/integrasi-growth-os.md).

## Mengedit konten

Lihat [`docs/mengedit-konten.md`](../../docs/mengedit-konten.md). Edit file di `content/`; `pnpm test --filter=personal-brand` menjalankan `validateContent` untuk memeriksa skema, slug/referensi silang, serta aturan anti-klaim palsu. Validasi tersebut merupakan bagian dari tes dan tidak otomatis dijalankan oleh `next build`.

## Struktur

```
app/            rute App Router, aksi kontak, sitemap.ts, robots.ts
components/     navigasi, formulir, CTA, atribusi, analytics, metadata terstruktur
content/        data bertipe: layanan, produk, proyek, artikel, profil, proses, pengaturan
lib/            SEO, situs, WhatsApp, analytics, rate-limit, leads/ (validasi, sinks, pengiriman)
tests/          tes Vitest untuk konten, formulir, lead, SEO, komponen, dan WhatsApp
```

## Perintah

Semua perintah berikut dijalankan dari root monorepo:

```bash
pnpm dev --filter=personal-brand
pnpm build --filter=personal-brand
pnpm --filter=personal-brand start
pnpm lint --filter=personal-brand
pnpm typecheck --filter=personal-brand
pnpm test --filter=personal-brand
```

Tes mencakup validasi konten, URL WhatsApp, skema formulir, payload lead, sinks dan `deliverLead` (termasuk Growth OS mati), server action formulir, metadata/JSON-LD/sitemap, dan render komponen.

## SEO, aksesibilitas, dan privasi

Metadata, canonical, dan Open Graph dibuat per halaman; sitemap dan robots tersedia otomatis. JSON-LD (Person, WebSite, Service, Product, Article, BreadcrumbList) hanya memakai data yang tersedia; produk tanpa harga tidak memiliki `offers`. Situs juga menyediakan tautan lewati ke konten utama dan header keamanan HTTP. Atribusi hanya disimpan selama sesi browser tanpa cookie, dan analitik opsional tidak pernah menerima isi formulir atau data kontak.

## Belum dikonfigurasi / perlu Anda isi

- Nomor WhatsApp, email, domain produksi, dan akun sosial (`content/settings.ts`).
- Harga produk (semua "hubungi saya" sampai Anda isi `pricing`).
- Model produksi fisik (`productionModel: "unset"`) dan estimasi pengiriman.
- Aset portofolio asli dan foto profil. Proyek konsep memakai ilustrasi prosedural berlabel "Proyek konsep".
- Testimoni asli (kosong, bagian tersembunyi).
- Artikel adalah draf awal: tinjau sebelum dipromosikan. Halaman privasi dan syarat adalah draf, perlu ditinjau penasihat hukum.
- Gambar OG khusus (belum dibuat).
