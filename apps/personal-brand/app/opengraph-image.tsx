import { ImageResponse } from "next/og";
import { profile, settings } from "@/content";

export const alt = `${settings.siteName} | Strategi Brand, Desain, dan Solusi Digital`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

/** Gambar OG bawaan: putih + biru korporat, sama dengan tema situs. Hanya teks dari konten nyata. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffffff", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: "#1d3fc4" }} />
          <div style={{ fontSize: 30, fontWeight: 700, color: "#0f172a", letterSpacing: -0.5 }}>{settings.siteName}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1d3fc4", letterSpacing: 4, textTransform: "uppercase" }}>Strategi Brand · Desain · Digital</div>
          <div style={{ fontSize: 68, fontWeight: 800, color: "#0f172a", lineHeight: 1.05, letterSpacing: -2 }}>{profile.headline.replace(/\n/g, " ")}</div>
        </div>
        <div style={{ display: "flex", height: 8, width: 160, background: "#1d3fc4", borderRadius: 4 }} />
      </div>
    ),
    size,
  );
}
