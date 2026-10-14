import { Container } from "@/components/layout";
import { ButtonLink } from "@/components/button-link";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="eyebrow">404</p>
      <h1 className="display-xl mt-3">Halaman tidak ditemukan.</h1>
      <p className="mt-6 max-w-prose text-lg text-muted-foreground">Halaman mungkin telah dipindahkan. Kunjungi beranda atau layanan.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Beranda</ButtonLink>
        <ButtonLink href="/services" variant="secondary">Lihat layanan</ButtonLink>
      </div>
    </Container>
  );
}
