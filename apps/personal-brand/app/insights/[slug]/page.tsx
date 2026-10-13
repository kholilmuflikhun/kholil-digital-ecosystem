import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getService, publishedArticles } from "@/content";
import { articleJsonLd, buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { PageHeader, Section } from "@/components/layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ButtonLink } from "@/components/button-link";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => publishedArticles().map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return buildMetadata({
    title: a.title, description: a.description, path: `/insights/${a.slug}`, type: "article",
    publishedTime: a.publishedAt, modifiedTime: a.updatedAt ?? a.publishedAt,
  });
}

export default async function ArticlePage({ params }: Params) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const services = a.relatedServices.map((s) => getService(s)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  return (
    <>
      <JsonLd data={articleJsonLd(a)} />
      <Breadcrumbs items={[{ name: "Wawasan", path: "/insights" }, { name: a.title, path: `/insights/${a.slug}` }]} />
      <PageHeader eyebrow={a.category} title={a.title} intro={a.description}>
        <p className="ui mt-5 text-sm text-muted-foreground">
          {a.author} · <time dateTime={a.publishedAt}>{formatDate(a.publishedAt)}</time> · {a.readingMinutes} menit baca
        </p>
      </PageHeader>
      <Section ruled={false}>
        <article className="prose-site text-lg">
          {a.body.map((b, i) =>
            b.type === "p" ? <p key={i}>{b.text}</p> : b.type === "h2" ? <h2 key={i}>{b.text}</h2> : (
              <ul key={i}>{b.items.map((it) => (<li key={it}>{it}</li>))}</ul>
            ),
          )}
        </article>
        {services.length > 0 && (
          <p className="ui mt-12 text-sm">Layanan terkait:{" "}
            {services.map((s, i) => (<span key={s.slug}>{i > 0 && ", "}<Link className="link" href={`/services/${s.slug}`}>{s.name}</Link></span>))}
          </p>
        )}
        <div className="mt-10"><ButtonLink href="/contact">Diskusikan Proyek</ButtonLink></div>
      </Section>
    </>
  );
}
