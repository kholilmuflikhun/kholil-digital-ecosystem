import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getService, productCategoryLabels, publishedProducts } from "@/content";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ButtonLink } from "@/components/button-link";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { PriceLabel } from "@/components/cards";
import { availabilityLabels } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => publishedProducts().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return buildMetadata({ title: p.seoTitle ?? p.name, description: p.seoDescription ?? p.shortDescription, path: `/products/${p.slug}` });
}

export default async function ProductPage({ params }: Params) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const external = p.ctaDestination !== "inquiry";
  const services = p.relatedServices.map((s) => getService(s)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  return (
    <>
      <JsonLd data={productJsonLd(p)} />
      <Breadcrumbs items={[{ name: "Produk", path: "/products" }, { name: p.name, path: `/products/${p.slug}` }]} />
      <PageHeader eyebrow={productCategoryLabels[p.category]} title={p.name} intro={p.shortDescription}>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <PriceLabel pricing={p.pricing} />
          <p className="ui text-sm">{availabilityLabels[p.availability]}</p>
          {p.deliveryEstimate && <p className="ui text-sm">Estimasi: {p.deliveryEstimate}</p>}
        </div>
      </PageHeader>
      <Section ruled={false}>
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="prose-site">
            <p className="text-lg">{p.fullDescription}</p>
            {p.features.length > 0 && (<><h2>Fitur</h2><ul>{p.features.map((f) => (<li key={f}>{f}</li>))}</ul></>)}
            {p.deliverables.length > 0 && (<><h2>Yang Anda terima</h2><ul>{p.deliverables.map((f) => (<li key={f}>{f}</li>))}</ul></>)}
            {p.revisionPolicy && (<><h2>Revisi</h2><p>{p.revisionPolicy}</p></>)}
          </div>
          <aside className="h-fit border border-foreground p-5" aria-label="Pesan produk">
            <div className="flex flex-col gap-3">
              <ButtonLink
                href={external ? p.ctaDestination : `/contact?produk=${p.slug}`}
                event="consultation_click"
                eventProps={{ placement: "produk", product: p.slug }}
              >
                {p.ctaLabel}
              </ButtonLink>
              <WhatsAppCta service={p.name} context={`Produk: ${p.name}`} placement="produk" className="w-full" />
            </div>
            {services.length > 0 && (
              <div className="mt-6 border-t border-border pt-4">
                <p className="ui text-sm font-semibold">Layanan terkait</p>
                <ul className="mt-2 space-y-1 text-sm">{services.map((s) => (<li key={s.slug}><Link className="link" href={`/services/${s.slug}`}>{s.name}</Link></li>))}</ul>
              </div>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}
