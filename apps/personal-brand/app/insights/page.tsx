import { publishedArticles } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { ArticleCard } from "@/components/cards";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = buildMetadata({
  title: "Wawasan Brand, Desain, dan Digital",
  description: "Panduan praktis tentang brand, desain, produksi, dan solusi digital.",
  path: "/insights",
});

export default function InsightsPage() {
  const list = publishedArticles();
  return (
    <>
      <Breadcrumbs items={[{ name: "Wawasan", path: "/insights" }]} />
      <PageHeader
        eyebrow="Wawasan"
        title="Wawasan untuk keputusan bisnis."
        intro="Panduan ringkas tentang brand, desain, dan solusi digital."
      />
      <Section ruled={false}>
        {list.length === 0 ? (
          <p className="border border-border p-6 text-muted-foreground">Artikel sedang disiapkan.</p>
        ) : (
          <ul className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">{list.map((a) => (<li key={a.slug}><ArticleCard article={a} /></li>))}</ul>
        )}
      </Section>
    </>
  );
}
