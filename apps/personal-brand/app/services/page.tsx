import { pillars, servicesByPillar } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { ServiceLink } from "@/components/cards";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";

export const metadata = buildMetadata({
  title: "Layanan Brand, Desain, dan Digital",
  description: "Layanan brand, desain, produksi, dan solusi digital.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Layanan", path: "/services" }]} />
      <PageHeader eyebrow="Layanan" title="Layanan bisnis." intro="Pilih layanan sesuai kebutuhan dan ruang lingkup proyek." />
      {pillars.map((p) => (
        <Section key={p.id} id={p.id} title={p.name} intro={p.description} ruled>
          {p.kind === "production" && (
            <p className="ui mb-6 border border-border p-4 text-sm">
              Desain dan produksi fisik dihitung terpisah. Ketersediaan dikonfirmasi per pesanan.
            </p>
          )}
          <ul>{servicesByPillar(p.id).map((s, i) => (<ServiceLink key={s.slug} service={s} index={i} />))}</ul>
        </Section>
      ))}
      <Section ruled><ButtonLink href="/contact">Diskusikan proyek</ButtonLink></Section>
    </>
  );
}
