import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, type WhatsAppMessageInput } from "@/lib/whatsapp";
import { whatsappNumber } from "@/lib/site";
import { TrackedLink } from "./tracked-link";

type Props = WhatsAppMessageInput & {
  label?: string;
  variant?: "solid" | "outline";
  className?: string;
  /** Dipakai sebagai properti event analitik (bukan data pengunjung). */
  placement?: string;
};

/**
 * Tombol WhatsApp dengan pesan terisi dan ter-encode. Bila nomor belum dikonfigurasi,
 * tombol dialihkan ke formulir kontak (tidak pernah membuat tautan rusak).
 */
export function WhatsAppCta({ label = "Chat via WhatsApp", variant = "outline", className = "", placement = "umum", ...message }: Props) {
  const url = buildWhatsAppUrl(whatsappNumber, message);
  const styles =
    variant === "solid" ? "bg-ink text-paper hover:bg-ink/85" : "border border-ink text-ink hover:bg-ink hover:text-paper";
  return (
    <TrackedLink
      href={url ?? "/contact"}
      event="whatsapp_click"
      eventProps={{ placement, configured: Boolean(url) }}
      className={`ui inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-base font-semibold transition-colors ${styles} ${className}`}
    >
      <MessageCircle aria-hidden="true" size={18} />
      {url ? label : "Hubungi lewat formulir"}
      {url && <span className="sr-only"> (membuka WhatsApp di tab baru)</span>}
    </TrackedLink>
  );
}
