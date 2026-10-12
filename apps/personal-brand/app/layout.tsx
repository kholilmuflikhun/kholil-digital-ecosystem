import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { settings } from "@/content";
import { siteUrl, plausibleDomain } from "@/lib/site";
import { websiteJsonLd, personJsonLd } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AttributionCapture } from "@/components/attribution-capture";
import { JsonLd } from "@/components/json-ld";
import { ThemeProvider } from "@/components/theme";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${settings.siteName} | Brand, Desain, dan Solusi Digital`, template: `%s | ${settings.siteName}` },
  description: settings.siteDescription,
  openGraph: { type: "website", locale: "id_ID", siteName: settings.siteName },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a
            href="#konten"
            className="ui sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
          >
            Lewati ke konten utama
          </a>
          <SiteHeader />
          <main id="konten" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          <AttributionCapture />
          <JsonLd data={websiteJsonLd()} />
          <JsonLd data={personJsonLd()} />
          {plausibleDomain && (
            <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
