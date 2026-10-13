import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getService, projectCategoryLabels, projectTypeLabels, publishedProjects } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";
import { ProjectArt } from "@/components/project-art";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => publishedProjects().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return buildMetadata({ title: p.title, description: p.summary, path: `/portfolio/${p.slug}` });
}

export default async function ProjectPage({ params }: Params) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const services = p.relatedServices.map((s) => getService(s)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const rows: [string, string][] = [
    ["Jenis", projectTypeLabels[p.type]],
    ["Kategori", projectCategoryLabels[p.category]],
    ...(p.year ? ([["Tahun", String(p.year)]] as [string, string][]) : []),
    ...(p.client && p.clientVerified ? ([["Klien", p.client]] as [string, string][]) : []),
    ...(p.tools.length ? ([["Alat", p.tools.join(", ")]] as [string, string][]) : []),
  ];
  return (
    <>
      <Breadcrumbs items={[{ name: "Portofolio", path: "/portfolio" }, { name: p.title, path: `/portfolio/${p.slug}` }]} />
      <PageHeader eyebrow={projectTypeLabels[p.type]} title={p.title} intro={p.summary} />
      <Section ruled={false}>
        <div className="mb-12 aspect-[16/8] overflow-hidden border border-border">
          {p.images[0] ? (
            <Image src={p.images[0].src} alt={p.images[0].alt} width={p.images[0].width} height={p.images[0].height} className="h-full w-full object-cover" priority />
          ) : p.art ? (
            <ProjectArt variant={p.art.variant} />
          ) : null}
        </div>
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="prose-site">
            <h2>Konteks</h2><p>{p.context}</p>
            <h2>Masalah</h2><p>{p.problem}</p>
            <h2>Pendekatan</h2><p>{p.approach}</p>
            <h2>Hasil kerja</h2><ul>{p.deliverables.map((d) => (<li key={d}>{d}</li>))}</ul>
            {p.outcome && (<><h2>Hasil</h2><p>{p.outcome}</p></>)}
          </div>
          <aside className="h-fit border border-border p-5" aria-label="Informasi proyek">
            <dl className="ui space-y-3 text-sm">
              {rows.map(([k, v]) => (<div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>))}
            </dl>
            {services.length > 0 && (
              <div className="mt-5 border-t border-border pt-4">
                <p className="ui text-sm text-muted-foreground">Layanan terkait</p>
                <ul className="mt-1 space-y-1 text-sm">{services.map((s) => (<li key={s.slug}><Link href={`/services/${s.slug}`} className="link">{s.name}</Link></li>))}</ul>
              </div>
            )}
            {p.url && <p className="mt-5"><a className="link ui text-sm" href={p.url} target="_blank" rel="noopener noreferrer">Kunjungi proyek<span className="sr-only"> (tab baru)</span></a></p>}
          </aside>
        </div>
        <div className="mt-14"><ButtonLink href="/contact">Diskusikan Proyek Serupa</ButtonLink></div>
      </Section>
    </>
  );
}
