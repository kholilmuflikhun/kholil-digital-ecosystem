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
export function WhatsAppCta({ label = "Hubungi via WhatsApp", variant = "outline", className = "", placement = "umum", ...message }: Props) {
  const url = buildWhatsAppUrl(whatsappNumber, message);
  const styles =
    variant === "solid" ? "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90" : "border border-input bg-card text-foreground hover:border-primary hover:text-primary";
  return (
    <TrackedLink
      href={url ?? "/contact"}
      event="whatsapp_click"
      eventProps={{ placement, configured: Boolean(url) }}
      className={`ui inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-[0.95rem] font-semibold transition-colors ${styles} ${className}`}
    >
      <MessageCircle aria-hidden="true" size={18} />
      {url ? label : "Gunakan formulir kontak"}
      {url && <span className="sr-only"> (membuka WhatsApp di tab baru)</span>}
    </TrackedLink>
  );
}
