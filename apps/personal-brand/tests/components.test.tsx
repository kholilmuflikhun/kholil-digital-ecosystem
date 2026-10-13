import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { HeroPanel } from "@/components/hero-panel";
import { ProductCard } from "@/components/cards";
import { ProjectArt } from "@/components/project-art";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { products } from "@/content";
import { formatPricing } from "@/lib/format";

describe("komponen", () => {
  it("Breadcrumbs menandai halaman saat ini dan menyertakan JSON-LD", () => {
    const html = renderToStaticMarkup(<Breadcrumbs items={[{ name: "Layanan", path: "/services" }]} />);
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("BreadcrumbList");
  });

  it("JsonLd meng-escape '<' agar tidak menutup script", () => {
    const html = renderToStaticMarkup(<JsonLd data={{ a: "</script><b>" }} />);
    expect(html).not.toContain("</script><b>");
    expect(html).toContain("\\u003c");
  });

  it("HeroPanel dikelompokkan dan berlabel untuk pembaca layar", () => {
    const html = renderToStaticMarkup(<HeroPanel items={[{ id: "a", name: "Brand", tagline: "Strategi" }]} />);
    expect(html).toContain('role="group"');
    expect(html).toContain("aria-label");
    expect(html).toContain("Brand");
  });

  it("ProductCard memakai teks harga jujur, bukan angka", () => {
    const html = renderToStaticMarkup(<ProductCard product={products[0]} />);
    expect(html).toContain(products[0].name);
    expect(html).not.toMatch(/Rp\s?\d/);
  });

  it("ProjectArt berlabel sebagai ilustrasi konsep", () => {
    expect(renderToStaticMarkup(<ProjectArt variant="packaging" />)).toContain("Ilustrasi konsep");
  });

  it("WhatsAppCta jatuh ke formulir kontak bila nomor belum dikonfigurasi", () => {
    const html = renderToStaticMarkup(<WhatsAppCta />);
    expect(html).toContain('href="/contact"');
  });

  it("formatPricing", () => {
    expect(formatPricing({ mode: "contact" }).label).toMatch(/hubungi/i);
    expect(formatPricing({ mode: "custom-quotation" }).label).toMatch(/penawaran/i);
    expect(formatPricing({ mode: "starting-from", amount: 500000, currency: "IDR" }).prefix).toBe("Mulai dari");
  });
});
