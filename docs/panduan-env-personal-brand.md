# Panduan Mengisi Environment Variable Personal Brand

Panduan ini menjelaskan cara mengisi `apps/personal-brand/.env.example` untuk pengembangan lokal dan produksi.

## 1. Buat file konfigurasi lokal

Jangan isi `.env.example` dengan kredensial asli. Salin file tersebut menjadi `.env.local` dari folder utama proyek:

```powershell
Copy-Item apps\personal-brand\.env.example apps\personal-brand\.env.local
```

Isi nilai di `.env.local`. File ini digunakan untuk pengembangan lokal dan jangan dibagikan atau di-commit ke Git.

## 2. Arti setiap variabel

### Situs

```env
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
```

Alamat utama situs, tanpa garis miring di akhir. Untuk lokal, gunakan `http://localhost:3001`. Saat produksi, ganti dengan domain sebenarnya, misalnya `https://domainanda.com`. Nilai ini digunakan untuk URL kanonik dan metadata situs.

### Kontak publik

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=""
NEXT_PUBLIC_CONTACT_EMAIL=""
```

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: nomor WhatsApp untuk tombol kontak. Isi dengan kode negara dan angka saja, tanpa `+`, spasi, atau tanda baca. Contoh Indonesia: `6281234567890`. Jika kosong, tombol WhatsApp tidak aktif.
- `NEXT_PUBLIC_CONTACT_EMAIL`: alamat email yang boleh ditampilkan kepada pengunjung. Mengisinya tidak otomatis mengaktifkan pengiriman email dari formulir.

### Pengiriman formulir melalui Resend

```env
CONTACT_EMAIL=""
RESEND_API_KEY=""
CONTACT_FROM_EMAIL=""
```

Ketiga variabel ini harus diisi agar inquiry dari formulir dikirim melalui email:

- `CONTACT_EMAIL`: alamat penerima inquiry, misalnya `halo@domainanda.com`.
- `RESEND_API_KEY`: API key dari akun Resend. Perlakukan sebagai rahasia.
- `CONTACT_FROM_EMAIL`: alamat pengirim yang sudah diverifikasi di Resend. Contoh: `Website <halo@domainanda.com>`.

### Integrasi Growth OS

```env
NEXT_PUBLIC_GROWTH_OS_URL=""
GROWTH_OS_API_URL=""
GROWTH_OS_API_KEY=""
```

Bagian ini opsional dan digunakan jika ingin mengirim lead ke Growth OS.

- `NEXT_PUBLIC_GROWTH_OS_URL`: URL Growth OS yang boleh dijadikan tautan publik, misalnya `https://os.domainanda.com`. Ini hanya tautan, bukan pengaturan pengiriman lead.
- `GROWTH_OS_API_URL`: URL dasar Growth OS untuk pengiriman lead, misalnya `https://os.domainanda.com`. Jangan tambahkan garis miring di akhir atau `/api/leads`; aplikasi akan menambahkan endpoint tersebut.
- `GROWTH_OS_API_KEY`: kunci rahasia yang harus sama persis dengan `LEAD_INGEST_API_KEY` pada konfigurasi Growth OS.

Untuk mengaktifkan pengiriman formulir ke Growth OS, isi `GROWTH_OS_API_URL` dan `GROWTH_OS_API_KEY`. Lihat [Panduan integrasi Website ke Growth OS](./integrasi-growth-os.md) untuk cara menyiapkan kunci dan konfigurasi penerimanya.

### Analytics

```env
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=""
```

Opsional. Isi dengan domain situs yang didaftarkan di Plausible—biasanya hanya nama domain, misalnya `domainanda.com`, tanpa `https://`. Biarkan kosong jika tidak memakai Plausible.

## 3. Contoh konfigurasi lokal

Contoh berikut hanya menunjukkan format. Ganti semua nilai contoh dengan konfigurasi Anda sendiri:

```env
NEXT_PUBLIC_SITE_URL="http://localhost:3001"

NEXT_PUBLIC_WHATSAPP_NUMBER="6281234567890"
NEXT_PUBLIC_CONTACT_EMAIL="halo@domainanda.com"

CONTACT_EMAIL="halo@domainanda.com"
RESEND_API_KEY="re_ganti_dengan_api_key_anda"
CONTACT_FROM_EMAIL="Website <halo@domainanda.com>"

NEXT_PUBLIC_GROWTH_OS_URL="https://os.domainanda.com"
GROWTH_OS_API_URL="https://os.domainanda.com"
GROWTH_OS_API_KEY="ganti_dengan_kunci_yang_sama_dengan_growth_os"

NEXT_PUBLIC_PLAUSIBLE_DOMAIN="domainanda.com"
```

Tidak perlu mengisi semua variabel. Untuk mengaktifkan formulir, minimal satu tujuan harus dikonfigurasi lengkap:

- **Email:** ketiga variabel Resend (`CONTACT_EMAIL`, `RESEND_API_KEY`, dan `CONTACT_FROM_EMAIL`).
- **Growth OS:** kedua variabel (`GROWTH_OS_API_URL` dan `GROWTH_OS_API_KEY`).

Jika belum menyiapkan tujuan pengiriman, biarkan variabel terkait kosong. Situs tetap dapat berjalan, tetapi pengiriman formulir belum aktif.

## 4. Konfigurasi produksi di Vercel

Tambahkan variabel yang diperlukan melalui **Vercel → Project → Settings → Environment Variables** pada proyek `personal-brand`.

- Atur `NEXT_PUBLIC_SITE_URL` ke domain produksi, misalnya `https://domainanda.com`.
- Isi variabel kontak, email, Growth OS, atau analytics sesuai fitur yang digunakan.
- Jangan menambahkan awalan `NEXT_PUBLIC_` pada variabel rahasia.
- Setelah mengubah variabel di Vercel, lakukan redeploy agar nilai baru diterapkan.

Variabel berawalan `NEXT_PUBLIC_` ditujukan untuk penggunaan publik dan dapat terlihat oleh browser. Jangan pernah menaruh API key atau kunci Growth OS pada variabel dengan awalan tersebut.
