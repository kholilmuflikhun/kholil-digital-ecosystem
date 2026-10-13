import { getProduct, getService } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { publicEmail, whatsappNumber } from "@/lib/site";
import { PageHeader, Section } from "@/components/layout";
import { ContactForm } from "@/components/contact-form";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { TrackedLink } from "@/components/tracked-link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import type { ServiceCategory } from "@kholil/shared";

export const metadata = buildMetadata({
  title: "Mulai Konsultasi",
  description: "Ceritakan kebutuhan bisnis Anda dan dapatkan saran yang lebih jelas untuk branding, desain, produk digital, atau sistem kerja yang lebih rapi.",
  path: "/contact",
});

type Props = { searchParams: Promise<{ layanan?: string; produk?: string }> };

const productToCategory: Record<string, ServiceCategory> = {
  branding: "brand-design",
  "social-media": "content-creative",
  "printing-apparel": "printing-apparel",
  "digital-products": "digital-technology",
  technology: "digital-technology",
};

export default async function ContactPage({ searchParams }: Props) {
  const q = await searchParams;
  const service = q.layanan ? getService(q.layanan) : undefined;
  const product = q.produk ? getProduct(q.produk) : undefined;
  const defaultCategory: ServiceCategory | undefined = service?.pillar ?? (product ? productToCategory[product.category] : undefined);
  const subject = product ? `Produk: ${product.name}` : service ? `Layanan: ${service.name}` : undefined;
  return (
    <>
      <Breadcrumbs items={[{ name: "Kontak", path: "/contact" }]} />
      <PageHeader
        eyebrow="Kontak"
        title="Ceritakan kebutuhan Anda. Saya akan membantu merumuskannya dengan lebih jelas."
        intro={subject ? `${subject}. Tambahkan detail yang Anda punya, dan saya akan menilai arah yang paling tepat untuk kebutuhan Anda.` : "Semakin jelas kebutuhan Anda, semakin cepat saya bisa memberi gambaran solusi yang relevan."}
      />
      <Section ruled={false}>
        <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <ContactForm
            defaultCategory={defaultCategory}
            defaultMessage={subject ? `${subject}\n\n` : undefined}
            context={{ page: subject, serviceSlug: service?.slug, productSlug: product?.slug }}
          />
          <aside className="h-fit space-y-6 border border-border p-5" aria-label="Cara lain menghubungi">
            <h2 className="display-md">Alternatif kontak</h2>
            <div className="space-y-3">
              <WhatsAppCta variant="solid" context={subject} service={product?.name ?? service?.name} placement="kontak" className="w-full" />
              {!whatsappNumber && <p className="text-sm text-muted-foreground">Nomor WhatsApp belum dikonfigurasi. Anda tetap bisa mengirimkan formulir.</p>}
              {publicEmail ? (
                <p><TrackedLink href={`mailto:${publicEmail}`} event="email_click" eventProps={{ placement: "kontak" }} className="link">{publicEmail}</TrackedLink></p>
              ) : (
                <p className="text-sm text-muted-foreground">Alamat email publik belum dikonfigurasi.</p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Balasan biasanya diberikan dalam waktu singkat. Untuk kebutuhan yang lebih urgent, WhatsApp adalah jalur tercepat.</p>
          </aside>
        </div>
      </Section>
    </>
  );
}
