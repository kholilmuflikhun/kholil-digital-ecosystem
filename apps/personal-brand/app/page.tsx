import Link from "next/link";
import {
  pillars, processSteps, productCategoryLabels, profile, publishedArticles,
  publishedProducts, publishedProjects, secondaryCta, primaryCta, servicesByPillar, testimonials,
} from "@/content";
import { buildMetadata } from "@/lib/seo";
import { Container, Section } from "@/components/layout";
import { ButtonLink } from "@/components/button-link";
import { HeroPanel } from "@/components/hero-panel";
import { ProductBrowser } from "@/components/filter-browsers";
import { ProjectCard, ArticleCard } from "@/components/cards";
import { WhatsAppCta } from "@/components/whatsapp-cta";

const home = buildMetadata({
  title: "Strategi Brand, Desain, dan Solusi Digital",
  description: profile.valueProposition,
  path: "/",
});

// Template judul di layout tidak berlaku untuk halaman di segmen yang sama, jadi judul beranda ditulis utuh.
export const metadata = { ...home, title: { absolute: `${profile.name} | Strategi Brand & Solusi Digital` } };

export default function HomePage() {
  const featuredProjects = publishedProjects().filter((p) => p.featured);
  const featuredProducts = publishedProducts().filter((p) => p.featured);
  const caseStudy = featuredProjects[0];
  const articles = publishedArticles().slice(0, 3);

  return (
    <>
      {/* 1. Hero */}
      <section aria-labelledby="hero-judul" className="bg-gradient-to-b from-primary/5 to-transparent pb-16 pt-14 sm:pb-24 sm:pt-20">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow mb-5">{profile.name} · Strategi Brand · Desain · Digital</p>
            <h1 id="hero-judul" className="display-xl">{profile.headline}</h1>
            <p className="mt-6 max-w-prose text-lg text-muted-foreground sm:text-xl">{profile.heroSupport}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={primaryCta.href} event="consultation_click" eventProps={{ placement: "hero" }}>{primaryCta.label}</ButtonLink>
              <ButtonLink href={secondaryCta.href} variant="secondary">{secondaryCta.label}</ButtonLink>
            </div>
          </div>
          <HeroPanel items={pillars} />
        </Container>
      </section>

      {/* 2. Perkenalan */}
      <Section id="perkenalan" eyebrow="Perkenalan" title="Strategi, desain, dan digital yang saling terhubung.">
        <div className="grid gap-8 md:grid-cols-2">
          {profile.intro.map((t) => (<p key={t} className="text-lg">{t}</p>))}
        </div>
        <p className="mt-8"><Link href="/about" className="link ui font-semibold">Tentang saya</Link></p>
      </Section>

      {/* 3. Layanan */}
      <Section id="layanan" eyebrow="Layanan" title="Empat bidang layanan untuk kebutuhan bisnis." intro="Pilih layanan sesuai kebutuhan. Ruang lingkup dan langkah kerja disepakati sebelum proyek dimulai.">
        <div className="grid gap-10 md:grid-cols-2">
          {pillars.map((p) => (
            <article key={p.id} className="surface p-6">
              <h3 className="display-md">{p.name}</h3>
              <p className="mt-2 text-muted-foreground">{p.tagline}</p>
              <ul className="ui mt-4 space-y-1 text-sm">
                {servicesByPillar(p.id).slice(0, 4).map((s) => (
                  <li key={s.slug}><Link href={`/services/${s.slug}`} className="hover:underline">{s.name}</Link></li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-10"><ButtonLink href="/services" variant="secondary">Lihat semua layanan</ButtonLink></p>
      </Section>

      {/* 4. Portofolio pilihan */}
      {featuredProjects.length > 0 && (
        <Section id="portofolio" eyebrow="Portofolio" title="Contoh pendekatan dan hasil kerja." intro="Lihat konteks, pendekatan, dan hasil yang tersedia untuk tiap proyek.">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p) => (<li key={p.slug}><ProjectCard project={p} /></li>))}
          </ul>
          <p className="mt-10"><ButtonLink href="/portfolio" variant="secondary">Lihat semua portofolio</ButtonLink></p>
        </Section>
      )}

      {/* 5. Produk pilihan dengan filter kategori */}
      {featuredProducts.length > 0 && (
        <Section id="produk" eyebrow="Produk" title="Paket dan aset untuk kebutuhan bisnis." intro="Gunakan pilihan ini sebagai titik awal. Detail penawaran menyesuaikan kebutuhan proyek.">
          <ProductBrowser products={featuredProducts} labels={productCategoryLabels} limit={6} />
          <p className="mt-10"><ButtonLink href="/products" variant="secondary">Lihat semua produk</ButtonLink></p>
        </Section>
      )}

      {/* 6. Mengapa bekerja dengan saya */}
      <Section id="alasan" eyebrow="Cara kerja" title="Prinsip di balik setiap proyek.">
        <dl className="grid gap-8 md:grid-cols-2">
          {profile.philosophy.map((f) => (
            <div key={f.title} className="surface p-6">
              <dt className="display-md">{f.title}</dt>
              <dd className="mt-2 text-muted-foreground">{f.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 7. Proses */}
      <Section id="proses" eyebrow="Proses" title="Langkah kerja yang jelas sejak awal.">
        <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.slice(0, 4).map((s, i) => (
            <li key={s.id} className="surface p-5">
              <span className="ui text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display-md mt-1">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.description}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10"><ButtonLink href="/process" variant="secondary">Lihat Proses Lengkap</ButtonLink></p>
      </Section>

      {/* 8. Studi kasus */}
      {caseStudy && (
        <Section id="studi-kasus" eyebrow="Studi kasus" title={caseStudy.title}>
          <div className="grid gap-8 md:grid-cols-2">
            <div><h3 className="ui text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Masalah</h3><p className="mt-2">{caseStudy.problem}</p></div>
            <div><h3 className="ui text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Pendekatan</h3><p className="mt-2">{caseStudy.approach}</p></div>
          </div>
          <p className="mt-8"><Link href={`/portfolio/${caseStudy.slug}`} className="link ui font-semibold">Baca studi kasus</Link></p>
        </Section>
      )}

      {/* 9. Testimoni: hanya bila ada yang asli */}
      {testimonials.length > 0 && (
        <Section id="testimoni" eyebrow="Testimoni" title="Ulasan klien.">
          <ul className="grid gap-8 md:grid-cols-2">
            {testimonials.map((t) => (
              <li key={t.id}>
                <blockquote className="text-lg">“{t.quote}”</blockquote>
                <p className="ui mt-3 text-sm text-muted-foreground">{t.name}{t.role ? `, ${t.role}` : ""}{t.business ? ` · ${t.business}` : ""}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 10. Wawasan */}
      {articles.length > 0 && (
        <Section id="wawasan" eyebrow="Wawasan" title="Panduan untuk keputusan bisnis yang lebih jelas.">
          <ul className="grid gap-8 md:grid-cols-3">
            {articles.map((a) => (<li key={a.slug}><ArticleCard article={a} /></li>))}
          </ul>
          <p className="mt-10"><ButtonLink href="/insights" variant="secondary">Lihat semua wawasan</ButtonLink></p>
        </Section>
      )}

      {/* 11. CTA akhir */}
      <Section id="hubungi" ruled>
        <div className="max-w-3xl">
          <h2 className="display-lg">Mari bahas kebutuhan proyek Anda.</h2>
          <p className="mt-4 max-w-prose text-lg text-muted-foreground">Ceritakan kebutuhan dan tujuan bisnis Anda. Saya akan membantu menentukan langkah berikutnya.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact" event="consultation_click" eventProps={{ placement: "cta-akhir" }}>Diskusikan Proyek Anda</ButtonLink>
            <WhatsAppCta placement="cta-akhir" />
          </div>
        </div>
      </Section>
    </>
  );
}
