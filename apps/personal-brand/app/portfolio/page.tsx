import { projectCategoryLabels, projectTypeLabels, publishedProjects } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { ProjectBrowser } from "@/components/filter-browsers";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = buildMetadata({
  title: "Portfolio & Studi Kasus",
  description: "Lihat karya dan studi kasus yang menunjukkan pendekatan strategis, desain yang konsisten, dan solusi digital yang berdampak pada bisnis.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  const projects = publishedProjects();
  return (
    <>
      <Breadcrumbs items={[{ name: "Portofolio", path: "/portfolio" }]} />
      <PageHeader eyebrow="Portofolio" title="Karya yang menunjukkan arah, kualitas, dan hasil yang nyata." intro="Setiap proyek disusun dengan konteks yang jelas: tantangan yang dihadapi, pendekatan yang dipilih, dan nilai yang bisa dibawa ke bisnis Anda." />
      <Section ruled={false}>
        {projects.length === 0 ? (
          <p className="border border-rule p-6 text-quiet">Portofolio sedang disiapkan.</p>
        ) : (
          <ProjectBrowser projects={projects} labels={projectCategoryLabels} typeLabels={projectTypeLabels} />
        )}
      </Section>
    </>
  );
}
