import { profile } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { ButtonLink } from "@/components/button-link";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = buildMetadata({
  title: "Tentang Kholil Muflikhun",
  description: "Brand strategist, designer, dan full-stack developer yang membantu bisnis membangun identitas, pengalaman, dan sistem digital yang lebih kuat dan lebih premium.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Tentang", path: "/about" }]} />
      <PageHeader eyebrow="Tentang" title={`Saya ${profile.name}.`} intro="Saya membantu bisnis membangun identitas, pengalaman, dan eksekusi digital yang lebih jelas, lebih kuat, dan lebih premium." />
      <Section ruled={false}>
        <div className="prose-site text-lg">
          {profile.story.map((text, index) => (
            <p key={`story-${index}`}>{text}</p>
          ))}
        </div>
      </Section>
      <Section eyebrow="Prinsip yang saya pegang" title="Cara saya membangun brand dan produk yang lebih dipercaya.">
        <dl className="grid gap-8 md:grid-cols-2">
          {profile.philosophy.map((item) => (
            <div key={item.title} className="border-t border-rule pt-4">
              <dt className="display-md">{item.title}</dt>
              <dd className="mt-2 text-quiet">{item.text}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section eyebrow="Bidang yang saya tangani" title="Kompetensi yang saya bawa ke setiap proyek yang serius.">
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {profile.capabilities.map((capability, index) => (
            <li key={`capability-${index}`} className="border-t border-rule py-3">
              {capability}
            </li>
          ))}
        </ul>
      </Section>
      <Section eyebrow="Ideal untuk" title="Bisnis yang ingin tampil lebih profesional dan lebih siap berkembang.">
        <ul className="flex flex-wrap gap-2">
          {profile.audiences.map((audience, index) => (
            <li key={`audience-${index}`} className="ui rounded-sm border border-rule px-3 py-1.5 text-sm">
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
