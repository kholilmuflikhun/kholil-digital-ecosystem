import type { LeadPayload } from "@kholil/shared";

/** Tujuan pengiriman lead. Tambahkan sink baru (mis. Telegram) tanpa mengubah alur formulir. */
export interface LeadSink {
  readonly name: string;
  isConfigured(): boolean;
  send(payload: LeadPayload): Promise<void>;
}

const TIMEOUT_MS = 6000;

async function fetchWithTimeout(url: string, init: RequestInit, fetchImpl: typeof fetch = fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetchImpl(url, { ...init, signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }
}

/** Hapus karakter kontrol agar tidak bisa menyisipkan header/baris baru di subjek email. */
const oneLine = (s: string) => s.replace(/[\r\n\u0000-\u001f]+/g, " ").trim();

export function formatEmailText(p: LeadPayload): string {
  const a = p.attribution;
  return [
    `Inquiry baru dari website`,
    ``,
    `Nama: ${p.name}`,
    p.businessName ? `Bisnis: ${p.businessName}` : null,
    p.email ? `Email: ${p.email}` : null,
    p.whatsapp ? `WhatsApp: ${p.whatsapp}` : null,
    `Kontak pilihan: ${p.preferredContact}`,
    `Kategori layanan: ${p.serviceCategory}`,
    p.budgetRange ? `Budget: ${p.budgetRange}` : null,
    p.timeline ? `Timeline: ${p.timeline}` : null,
    ``,
    `Pesan:`,
    p.message,
    ``,
    `Konteks: ${[p.context.page, p.context.serviceSlug && `layanan=${p.context.serviceSlug}`, p.context.productSlug && `produk=${p.context.productSlug}`].filter(Boolean).join(" | ") || "-"}`,
    `Sumber: ${p.source}`,
    a.utmSource || a.utmMedium || a.utmCampaign
      ? `UTM: ${[a.utmSource, a.utmMedium, a.utmCampaign, a.utmContent, a.utmTerm].filter(Boolean).join(" / ")}`
      : null,
    a.referrer ? `Referrer: ${a.referrer}` : null,
    a.landingPage ? `Landing page: ${a.landingPage}` : null,
    `ID: ${p.externalId}`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export class ResendEmailSink implements LeadSink {
  readonly name = "email";
  constructor(
    private readonly env: Record<string, string | undefined> = process.env,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  isConfigured() {
    return Boolean(this.env.RESEND_API_KEY && this.env.CONTACT_EMAIL && this.env.CONTACT_FROM_EMAIL);
  }

  async send(p: LeadPayload) {
    const res = await fetchWithTimeout(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${this.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: this.env.CONTACT_FROM_EMAIL,
          to: [this.env.CONTACT_EMAIL],
          reply_to: p.email,
          subject: oneLine(`Inquiry baru: ${p.name}${p.businessName ? ` (${p.businessName})` : ""}`).slice(0, 150),
          text: formatEmailText(p),
        }),
      },
      this.fetchImpl,
    );
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  }
}

/** Mengirim lead ke Growth OS lewat endpoint server-to-server (POST /api/leads). */
export class GrowthOsSink implements LeadSink {
  readonly name = "growth-os";
  constructor(
    private readonly env: Record<string, string | undefined> = process.env,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  isConfigured() {
    return Boolean(this.env.GROWTH_OS_API_URL && this.env.GROWTH_OS_API_KEY);
  }

  async send(p: LeadPayload) {
    const base = (this.env.GROWTH_OS_API_URL as string).replace(/\/+$/, "");
    const res = await fetchWithTimeout(
      `${base}/api/leads`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${this.env.GROWTH_OS_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(p),
      },
      this.fetchImpl,
    );
    if (!res.ok) throw new Error(`Growth OS responded ${res.status}`);
  }
}

export const defaultSinks = (): LeadSink[] => [new ResendEmailSink(), new GrowthOsSink()];
