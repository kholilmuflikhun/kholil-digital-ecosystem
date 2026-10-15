import { productCategoryLabels, publishedProducts } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { PageHeader, Section } from "@/components/layout";
import { ProductBrowser } from "@/components/filter-browsers";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = buildMetadata({
  title: "Paket dan Produk",
  description: "Paket brand, konten, cetak, dan digital untuk bisnis.",
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
        title="Paket dan produk."
        intro="Cakupan dan penawaran menyesuaikan kebutuhan proyek."
      />
      <Section ruled={false}>
        <ProductBrowser products={publishedProducts()} labels={productCategoryLabels} initialCategory={kategori} />
      </Section>
    </>
  );
}
