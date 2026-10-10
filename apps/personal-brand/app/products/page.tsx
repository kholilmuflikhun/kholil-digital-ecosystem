import { productCategoryLabels, publishedProducts } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { ProductBrowser } from "@/components/filter-browsers";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = buildMetadata({
  title: "Paket dan Solusi untuk Bisnis",
  description: "Jelajahi paket branding, konten, cetak, apparel, dan digital. Ruang lingkup, ketersediaan, dan penawaran dibahas sesuai kebutuhan proyek.",
  path: "/products",
});

type Props = { searchParams: Promise<{ kategori?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { kategori } = await searchParams;
  return (
    <>
      <Breadcrumbs items={[{ name: "Produk", path: "/products" }]} />
      <PageHeader
        eyebrow="Produk"
        title="Pilihan solusi, disusun untuk kebutuhan nyata."
        intro="Mulai dari identitas brand hingga kebutuhan digital dan produksi. Setiap paket memiliki cakupan yang jelas; detail dan penawaran dibahas berdasarkan tujuan serta kebutuhan proyek Anda."
      />
      <Section ruled={false}>
        <ProductBrowser products={publishedProducts()} labels={productCategoryLabels} initialCategory={kategori} />
      </Section>
    </>
  );
}
