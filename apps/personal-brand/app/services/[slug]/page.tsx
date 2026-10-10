import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPillar, getService, publishedProducts, publishedProjects, services } from "@/content";
import { buildMetadata, serviceJsonLd } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ButtonLink } from "@/components/button-link";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { availabilityLabels } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return buildMetadata({ title: s.seoTitle ?? s.name, description: s.seoDescription ?? s.summary, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: Params) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const pillar = getPillar(s.pillar);
  const related = publishedProducts().filter((p) => p.relatedServices.includes(s.slug));
  const work = publishedProjects().filter((p) => p.relatedServices.includes(s.slug));
  return (
    <>
      <JsonLd data={serviceJsonLd(s)} />
      <Breadcrumbs items={[{ name: "Layanan", path: "/services" }, { name: s.name, path: `/services/${s.slug}` }]} />
      <PageHeader eyebrow={pillar?.name} title={s.name} intro={s.summary}>
        <p className="ui mt-4 text-sm text-quiet">{availabilityLabels[s.availability]}</p>
      </PageHeader>
      <Section ruled={false} title="Yang Anda terima" as="h2">
        <ul className="prose-site">{s.deliverables.map((d) => (<li key={d}>{d}</li>))}</ul>
        {s.idealFor && <p className="mt-8 max-w-prose"><strong className="ui">Cocok untuk:</strong> {s.idealFor}</p>}
        <p className="mt-6 max-w-prose text-quiet">Lingkup, biaya, dan batas revisi disepakati sebelum pengerjaan dimulai.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/contact?layanan=${s.slug}`} event="consultation_click" eventProps={{ placement: "layanan", service: s.slug }}>Diskusikan Proyek</ButtonLink>
          <WhatsAppCta service={s.name} context={`Layanan: ${s.name}`} placement="layanan" />
        </div>
      </Section>
      {related.length > 0 && (
        <Section title="Produk terkait">
          <ul className="space-y-2">{related.map((p) => (<li key={p.slug}><Link className="link" href={`/products/${p.slug}`}>{p.name}</Link></li>))}</ul>
        </Section>
      )}
      {work.length > 0 && (
        <Section title="Karya terkait">
          <ul className="space-y-2">{work.map((p) => (<li key={p.slug}><Link className="link" href={`/portfolio/${p.slug}`}>{p.title}</Link></li>))}</ul>
        </Section>
      )}
    </>
  );
}
