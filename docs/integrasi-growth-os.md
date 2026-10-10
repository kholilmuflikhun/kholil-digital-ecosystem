# Integrasi Website → Growth OS

## Prinsip

- Website tidak menyentuh database Growth OS dan tidak menerima data CRM.
- Rahasia hanya di server (`GROWTH_OS_API_KEY` tanpa `NEXT_PUBLIC_`).
- Growth OS mati atau belum dikonfigurasi tidak mematikan website; formulir tetap berhasil lewat email bila email terkonfigurasi.
- Pengiriman idempoten lewat `externalId` (UUID): kirim ulang tidak membuat prospek ganda.

## Kontrak (v1) — `packages/shared/src/lead.ts`

`POST {GROWTH_OS_API_URL}/api/leads`, header `Authorization: Bearer <kunci>`, JSON:

```json
{
  "version": 1,
  "externalId": "uuid",
  "source": "website_contact_form | website_whatsapp | website_service_inquiry | website_product_inquiry",
  "submittedAt": "ISO-8601",
  "name": "…", "email": "…", "whatsapp": "62812…",
  "preferredContact": "whatsapp | email",
  "businessName": "…", "serviceCategory": "brand-design | content-creative | printing-apparel | digital-technology | lainnya",
  "message": "…", "budgetRange": "…", "timeline": "…",
  "context": { "page": "…", "serviceSlug": "…", "productSlug": "…" },
  "attribution": { "utmSource": "…", "utmMedium": "…", "utmCampaign": "…", "utmContent": "…", "utmTerm": "…", "referrer": "…", "landingPage": "…" }
}
```

Respons: 2xx sukses (termasuk duplikat), 401 kunci salah, 400 JSON rusak, 422 payload tidak valid, 413 terlalu besar, 429 batas laju, 503 ingest belum diaktifkan, 500 galat server.

## Mengaktifkan

1. Di Growth OS: set `LEAD_INGEST_API_KEY` (≥32 karakter acak, `openssl rand -base64 32`) dan `LEAD_INGEST_USER_EMAIL` (email akun pemilik yang menerima prospek).
2. Di website: set `GROWTH_OS_API_URL` (tanpa garis miring akhir) dan `GROWTH_OS_API_KEY` dengan nilai yang sama.
3. Kirim formulir uji; prospek muncul di Growth OS dengan sumber dan atribusi.

Ganti kunci secara berkala; ubah di kedua proyek Vercel lalu redeploy.

## Menambah tujuan baru

Implementasikan `LeadSink` di `apps/personal-brand/lib/leads/sinks.ts` lalu daftarkan di `defaultSinks()`.

## Batasan

Rate limiter in-memory per instance. Untuk batas global gunakan Upstash Redis (ganti isi `lib/rate-limit.ts` dan `apps/growth-os/lib/utils/rate-limit.ts`). Integrasi ini belum diuji end-to-end terhadap database sungguhan di lingkungan pengembangan ini.
