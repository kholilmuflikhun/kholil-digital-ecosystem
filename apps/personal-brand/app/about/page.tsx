import { profile } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { ButtonLink } from "@/components/button-link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = buildMetadata({
  title: "Tentang Kholil Muflikhun",
  description: "Pendekatan personal yang menghubungkan strategi brand, desain, dan implementasi digital.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Tentang", path: "/about" }]} />
      <PageHeader eyebrow="Tentang" title={`Saya ${profile.name}.`} intro="Saya menghubungkan strategi brand, desain, dan solusi digital dengan kebutuhan bisnis." />
      <Section ruled={false}>
        <div className="prose-site text-lg">
          {profile.story.map((text, index) => (
            <p key={`story-${index}`}>{text}</p>
          ))}
        </div>
      </Section>
      <Section eyebrow="Prinsip kerja" title="Cara saya mendekati setiap proyek.">
        <dl className="grid gap-8 md:grid-cols-2">
          {profile.philosophy.map((item) => (
            <div key={item.title} className="border-t border-border pt-4">
              <dt className="display-md">{item.title}</dt>
              <dd className="mt-2 text-muted-foreground">{item.text}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section eyebrow="Bidang layanan" title="Keahlian yang dapat mendukung proyek Anda.">
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {profile.capabilities.map((capability, index) => (
            <li key={`capability-${index}`} className="border-t border-border py-3">
              {capability}
            </li>
          ))}
        </ul>
      </Section>
      <Section eyebrow="Untuk siapa" title="Saya bekerja dengan bisnis dan tim yang membutuhkan arah lebih jelas.">
        <ul className="flex flex-wrap gap-2">
          {profile.audiences.map((audience, index) => (
            <li key={`audience-${index}`} className="ui rounded-full border border-border bg-muted px-3 py-1.5 text-sm">
              {audience}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ButtonLink href="/contact">Diskusikan Proyek Anda</ButtonLink>
        </div>
      </Section>
    </>
  );
}
