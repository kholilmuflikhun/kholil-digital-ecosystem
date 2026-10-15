import { projectCategoryLabels, projectTypeLabels, publishedProjects } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { ProjectBrowser } from "@/components/filter-browsers";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = buildMetadata({
  title: "Portofolio dan Studi Kasus",
  description: "Proyek pilihan dan pendekatan kerja.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  const projects = publishedProjects();
  return (
    <>
      <Breadcrumbs items={[{ name: "Portofolio", path: "/portfolio" }]} />
      <PageHeader eyebrow="Portofolio" title="Proyek pilihan." intro="Konteks dan pendekatan tiap proyek." />
      <Section ruled={false}>
        {projects.length === 0 ? (
          <p className="border border-border p-6 text-muted-foreground">Portofolio segera tersedia.</p>
        ) : (
          <ProjectBrowser projects={projects} labels={projectCategoryLabels} typeLabels={projectTypeLabels} />
        )}
      </Section>
    </>
  );
}
