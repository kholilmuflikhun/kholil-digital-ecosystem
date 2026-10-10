/** Ubah input mentah menjadi format internasional tanpa tanda baca (mis. 6281234567890), atau undefined bila tidak valid. */
export function normalizeWhatsAppNumber(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;
  const digits = raw.trim().replace(/[\s\-().]/g, "").replace(/^\+/, "");
  const intl = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return /^[1-9]\d{7,14}$/.test(intl) ? intl : undefined;
}

export type WhatsAppMessageInput = {
  name?: string;
  service?: string;
  message?: string;
  /** Konteks halaman atau produk, mis. "Produk: Paket Logo" */
  context?: string;
};

const MAX_MESSAGE = 900;

export function buildWhatsAppText({ name, service, message, context }: WhatsAppMessageInput): string {
  const intro = name?.trim() ? `Halo Kholil, saya ${name.trim()}.` : "Halo Kholil,";
  const lines = [
    intro,
    service?.trim() ? `Saya tertarik dengan: ${service.trim()}.` : "Saya ingin berdiskusi tentang kebutuhan bisnis saya.",
  ];
  if (message?.trim()) lines.push("", message.trim().slice(0, MAX_MESSAGE));
  if (context?.trim()) lines.push("", `Dari halaman: ${context.trim()}`);
  return lines.join("\n");
}

/** Mengembalikan tautan wa.me yang sudah di-encode, atau null bila nomor belum valid/dikonfigurasi. */
export function buildWhatsAppUrl(number: string | undefined, input: WhatsAppMessageInput = {}): string | null {
  const n = normalizeWhatsAppNumber(number);
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(buildWhatsAppText(input))}`;
}
