import { pillars, processSteps } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/button-link";

export const metadata = buildMetadata({
  title: "Proses Kerja",
  description: "Dari discovery sampai serah terima: tahapan kerja yang jelas agar ruang lingkup, revisi, dan hasil akhir tidak mengejutkan.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Proses", path: "/process" }]} />
      <PageHeader eyebrow="Proses" title="Tahapan kerja yang jelas." intro="Setiap proyek melewati alur yang sama, disesuaikan dengan bidangnya." />
      <Section ruled={false}>
        <ol className="max-w-3xl">
          {processSteps.map((s, i) => (
            <li key={s.id} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-rule py-6">
              <span className="ui text-sm text-quiet">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="display-md">{s.title}</h2>
                <p className="mt-2 text-quiet">{s.description}</p>
                {s.appliesTo.length > 0 && (
                  <p className="ui mt-2 text-xs text-quiet">Berlaku untuk: {s.appliesTo.map((a) => pillars.find((p) => p.id === a)?.name).join(", ")}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10"><ButtonLink href="/contact">Mulai dengan Discovery</ButtonLink></div>
      </Section>
    </>
  );
}
