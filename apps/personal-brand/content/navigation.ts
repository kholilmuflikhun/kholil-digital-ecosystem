import type { z } from "zod";
import { navItemSchema } from "./schemas";

type NavItem = z.infer<typeof navItemSchema>;

export const mainNav: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/about" },
  { label: "Layanan", href: "/services" },
  { label: "Produk", href: "/products" },
  { label: "Portofolio", href: "/portfolio" },
  { label: "Wawasan", href: "/insights" },
  { label: "Kontak", href: "/contact" },
];

export const footerNav: NavItem[] = [
  { label: "Proses kerja", href: "/process" },
  { label: "Kebijakan privasi", href: "/privacy" },
  { label: "Syarat dan ketentuan", href: "/terms" },
];

export const primaryCta = { label: "Diskusikan Proyek Anda", href: "/contact" };
export const secondaryCta = { label: "Lihat Portfolio", href: "/portfolio" };
