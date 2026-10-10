import { describe, expect, it } from "vitest";
import {
  articles, getProduct, getProject, getService, mainNav, pillars, products, projects, publishedProducts,
  services, settings, testimonials, validateContent,
} from "@/content";

describe("konten", () => {
  it("lolos validasi skema dan referensi silang", () => {
    expect(validateContent()).toEqual([]);
  });

  it("memiliki empat pilar dan setiap pilar punya layanan", () => {
    expect(pillars.map((p) => p.id)).toEqual(["brand-design", "content-creative", "printing-apparel", "digital-technology"]);
    for (const p of pillars) expect(services.some((s) => s.pillar === p.id)).toBe(true);
  });

  it("slug unik di semua koleksi", () => {
    for (const list of [services, products, projects, articles]) {
      const slugs = list.map((x) => x.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("tidak mengarang harga: tidak ada produk dengan harga angka", () => {
    for (const p of products) expect(["contact", "custom-quotation"]).toContain(p.pricing.mode);
  });

  it("produk digital yang belum ada ditandai segera hadir, bukan tersedia", () => {
    for (const p of products.filter((x) => x.type === "digital-download" || x.type === "template")) {
      expect(p.availability).toBe("coming-soon");
    }
  });

  it("tidak ada estimasi pengiriman yang belum terverifikasi", () => {
    for (const p of products) expect(p.deliveryEstimate).toBeUndefined();
  });

  it("proyek konsep tidak memiliki klien atau hasil", () => {
    for (const p of projects.filter((x) => x.type === "concept")) {
      expect(p.client).toBeUndefined();
      expect(p.outcome).toBeUndefined();
    }
  });

  it("tidak mengklaim merek yang belum punya aset asli", () => {
    const text = JSON.stringify(projects).toLowerCase();
    for (const name of ["braling", "mumtaza", "dzaroza"]) expect(text).not.toContain(name);
  });

  it("testimoni kosong sampai ada yang asli, model produksi belum diklaim", () => {
    expect(testimonials).toHaveLength(0);
    expect(settings.productionModel).toBe("unset");
  });

  it("getter mengembalikan item yang benar atau undefined", () => {
    expect(getService(services[0].slug)?.name).toBe(services[0].name);
    expect(getProduct("tidak-ada")).toBeUndefined();
    expect(getProject("tidak-ada")).toBeUndefined();
    expect(publishedProducts().length).toBeGreaterThan(0);
  });

  it("validateContent mendeteksi pelanggaran: klien tanpa verifikasi", () => {
    const original = projects[1];
    const copy = { ...original, client: "PT Contoh", clientVerified: false };
    projects.push(copy);
    try {
      expect(validateContent().some((m) => m.includes("slug ganda"))).toBe(true);
      expect(validateContent().some((m) => m.includes("tanpa clientVerified"))).toBe(true);
    } finally {
      projects.pop();
    }
  });
});

describe("navigasi", () => {
  it("memuat tujuh item utama dengan tujuan yang valid", () => {
    expect(mainNav.map((n) => n.href)).toEqual(["/", "/about", "/services", "/products", "/portfolio", "/insights", "/contact"]);
  });
});
