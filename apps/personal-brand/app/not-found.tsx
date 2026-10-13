import { Container } from "@/components/layout";
import { ButtonLink } from "@/components/button-link";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="eyebrow">404</p>
      <h1 className="display-xl mt-3">Halaman tidak ditemukan.</h1>
      <p className="mt-6 max-w-prose text-lg text-muted-foreground">Alamat yang Anda tuju tidak ada atau sudah dipindahkan. Coba mulai dari beranda atau lihat layanan.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Ke beranda</ButtonLink>
        <ButtonLink href="/services" variant="secondary">Lihat layanan</ButtonLink>
      </div>
    </Container>
  );
}
