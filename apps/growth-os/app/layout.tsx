import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme";

export const metadata: Metadata = {
  title: { default: "Growth Operating System", template: "%s · Growth OS" },
  description: "Sistem operasi bisnis untuk mengubah personal brand menjadi pendapatan yang berulang.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
