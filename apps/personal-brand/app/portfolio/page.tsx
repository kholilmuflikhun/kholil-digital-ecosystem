import { projectCategoryLabels, projectTypeLabels, publishedProjects } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { ProjectBrowser } from "@/components/filter-browsers";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = buildMetadata({
  title: "Portofolio dan Studi Kasus",
  description: "Lihat konteks, pendekatan, dan hasil kerja dari proyek pilihan.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  const projects = publishedProjects();
  return (
    <>
      <Breadcrumbs items={[{ name: "Portofolio", path: "/portfolio" }]} />
      <PageHeader eyebrow="Portofolio" title="Proyek dan studi kasus pilihan." intro="Setiap proyek memuat konteks, pendekatan, dan hasil kerja yang tersedia." />
      <Section ruled={false}>
        {projects.length === 0 ? (
          <p className="border border-border p-6 text-muted-foreground">Portofolio sedang disiapkan.</p>
        ) : (
          <ProjectBrowser projects={projects} labels={projectCategoryLabels} typeLabels={projectTypeLabels} />
        )}
      </Section>
    </>
  );
}
