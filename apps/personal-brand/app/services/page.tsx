import { pillars, servicesByPillar } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { ServiceLink } from "@/components/cards";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";

export const metadata = buildMetadata({
  title: "Layanan Strategis untuk Brand dan Digital",
  description: "Brand strategy, desain visual, konten kreatif, cetak dan apparel, serta solusi digital yang membantu bisnis tampil lebih kuat dan lebih siap tumbuh.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Layanan", path: "/services" }]} />
      <PageHeader eyebrow="Layanan" title="Layanan yang menyatukan brand, produk, dan pertumbuhan." intro="Tak perlu mengelola banyak vendor untuk kebutuhan yang sama. Saya membantu membangun sistem yang lebih rapi, lebih konsisten, dan lebih siap mendukung pertumbuhan bisnis Anda." />
      {pillars.map((p) => (
        <Section key={p.id} id={p.id} title={p.name} intro={p.description} ruled>
          {p.kind === "production" && (
            <p className="ui mb-6 border border-rule p-4 text-sm">
              Catatan: bagian ini memisahkan <strong>desain</strong> (file siap produksi) dari <strong>produksi fisik</strong>. Kapasitas, estimasi, dan ketersediaan produksi dikonfirmasi per pesanan.
            </p>
          )}
          <ul>{servicesByPillar(p.id).map((s, i) => (<ServiceLink key={s.slug} service={s} index={i} />))}</ul>
        </Section>
      ))}
      <Section ruled><ButtonLink href="/contact">Diskusikan Proyek Anda</ButtonLink></Section>
    </>
  );
}
