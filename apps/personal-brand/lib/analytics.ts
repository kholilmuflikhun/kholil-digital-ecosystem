/**
 * Pelacakan event yang ramah privasi. Provider dapat diganti tanpa mengubah komponen.
 * Aturan: JANGAN kirim isi formulir, nama, email, atau nomor telepon sebagai properti.
 */
export type AnalyticsEvent =
  | "whatsapp_click"
  | "email_click"
  | "contact_submit"
  | "consultation_click"
  | "growth_os_link_click"
  | "service_view"
  | "product_view"
  | "portfolio_view"
  | "portfolio_filter";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export function track(event: AnalyticsEvent, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* analytics tidak boleh mengganggu pengalaman pengunjung */
  }
}
