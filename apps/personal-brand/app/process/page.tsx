import { pillars, processSteps } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";

export const metadata = buildMetadata({
  title: "Proses Kerja",
  description: "Tahapan kerja, ruang lingkup, revisi, dan penyerahan hasil.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Proses", path: "/process" }]} />
      <PageHeader eyebrow="Proses" title="Tahapan kerja." intro="Alur disesuaikan dengan kebutuhan dan ruang lingkup proyek." />
      <Section ruled={false}>
        <ol className="max-w-3xl">
          {processSteps.map((s, i) => (
            <li key={s.id} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-border py-6">
              <span className="ui text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="display-md">{s.title}</h2>
                <p className="mt-2 text-muted-foreground">{s.description}</p>
                {s.appliesTo.length > 0 && (
                  <p className="ui mt-2 text-xs text-muted-foreground">Berlaku untuk: {s.appliesTo.map((a) => pillars.find((p) => p.id === a)?.name).join(", ")}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10"><ButtonLink href="/contact">Diskusikan proyek Anda</ButtonLink></div>
      </Section>
    </>
  );
}
