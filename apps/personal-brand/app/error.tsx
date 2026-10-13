"use client";

import { Container } from "@/components/layout";

/** Batas error: tidak menampilkan detail teknis ke pengunjung. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-24">
      <h1 className="display-lg">Terjadi kendala.</h1>
      <p className="mt-4 max-w-prose text-lg text-muted-foreground">Halaman ini gagal dimuat. Silakan coba lagi. Bila berulang, hubungi saya lewat halaman kontak.</p>
      <button type="button" onClick={reset} className="ui mt-6 min-h-[44px] rounded-lg bg-primary px-5 font-semibold text-primary-foreground">
        Coba lagi
      </button>
    </Container>
  );
}
