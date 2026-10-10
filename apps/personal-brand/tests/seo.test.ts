import { describe, expect, it } from "vitest";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata, personJsonLd, productJsonLd, serviceJsonLd } from "@/lib/seo";
import { articles, products, services } from "@/content";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("metadata", () => {
  it("mengisi canonical, Open Graph, dan memotong deskripsi panjang", () => {
    const m = buildMetadata({ title: "Uji", description: "x".repeat(400), path: "/uji" });
    expect(m.alternates?.canonical).toMatch(/\/uji$/);
    expect(m.openGraph?.locale).toBe("id_ID");
    expect((m.description as string).length).toBeLessThanOrEqual(170);
  });

  it("noIndex menghasilkan robots index:false", () => {
    expect(buildMetadata({ title: "a", description: "b", path: "/", noIndex: true }).robots).toEqual({ index: false, follow: false });
  });
});

describe("JSON-LD tidak memuat data karangan", () => {
  it("Person tidak punya sameAs bila belum ada akun sosial", () => {
    expect(personJsonLd()).not.toHaveProperty("sameAs");
  });

  it("Product tanpa harga tidak memiliki offers", () => {
    for (const p of products) expect(productJsonLd(p)).not.toHaveProperty("offers");
  });

  it("Product berharga memiliki offers dengan mata uang", () => {
    const priced = { ...products[0], pricing: { mode: "fixed" as const, amount: 100000, currency: "IDR" } };
    expect((productJsonLd(priced) as { offers: { price: number } }).offers.price).toBe(100000);
  });

  it("Service, Article, dan Breadcrumb valid secara struktur", () => {
    expect(serviceJsonLd(services[0])["@type"]).toBe("Service");
    expect(serviceJsonLd(services[0])).not.toHaveProperty("areaServed");
    expect(articleJsonLd(articles[0]).datePublished).toBe(articles[0].publishedAt);
    const b = breadcrumbJsonLd([{ name: "A", path: "/a" }, { name: "B", path: "/b" }]);
    expect(b.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });
});

describe("sitemap dan robots", () => {
  it("memuat halaman statis dan semua halaman dinamis", () => {
    const urls = sitemap().map((s) => s.url);
    expect(urls.some((u) => u.endsWith("/services"))).toBe(true);
    expect(urls.filter((u) => u.includes("/services/")).length).toBe(services.length);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("robots menunjuk ke sitemap", () => {
    expect(robots().sitemap).toMatch(/sitemap\.xml$/);
  });
});
