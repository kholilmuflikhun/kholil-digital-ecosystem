import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { publishedArticles, publishedProducts, publishedProjects, services, settings } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const stat = ["", "/about", "/services", "/products", "/portfolio", "/process", "/insights", "/contact", "/privacy", "/terms"];
  const legal = new Date(settings.legalUpdatedAt);
  return [
    ...stat.map((p) => ({ url: absoluteUrl(p || "/"), priority: p === "" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`), priority: 0.6 })),
    ...publishedProducts().map((p) => ({ url: absoluteUrl(`/products/${p.slug}`), priority: 0.5 })),
    ...publishedProjects().map((p) => ({ url: absoluteUrl(`/portfolio/${p.slug}`), priority: 0.6 })),
    ...publishedArticles().map((a) => ({ url: absoluteUrl(`/insights/${a.slug}`), lastModified: new Date(a.updatedAt ?? a.publishedAt), priority: 0.5 })),
  ].map((e) => ({ lastModified: legal, ...e }));
}
