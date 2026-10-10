import { z } from "zod";
import { profile } from "./profile";
import { settings } from "./settings";
import { services, pillars } from "./services";
import { products } from "./products";
import { projects } from "./projects";
import { articles } from "./articles";
import { testimonials } from "./testimonials";
import { processSteps } from "./process";
import {
  articleSchema, pillarSchema, processStepSchema, productSchema, profileSchema,
  projectSchema, serviceSchema, settingsSchema, testimonialSchema,
} from "./schemas";

export * from "./schemas";
export { profile, settings, services, pillars, products, projects, articles, testimonials, processSteps };
export * from "./navigation";
export { getService, getPillar, servicesByPillar } from "./services";
export { getProduct, publishedProducts, productCategoryLabels } from "./products";
export { getProject, publishedProjects, projectTypeLabels, projectCategoryLabels } from "./projects";
export { getArticle, publishedArticles } from "./articles";

/**
 * Validasi seluruh konten dan referensi silang. Dipanggil oleh tes dan bisa dijalankan manual.
 * Mengembalikan daftar masalah (kosong = valid).
 */
export function validateContent(): string[] {
  const issues: string[] = [];
  const check = <T>(label: string, schema: z.ZodType<T, z.ZodTypeDef, unknown>, items: unknown[]) =>
    items.forEach((item, i) => {
      const r = schema.safeParse(item);
      if (!r.success) issues.push(`${label}[${i}]: ${r.error.issues.map((x) => `${x.path.join(".")} ${x.message}`).join("; ")}`);
    });

  check("profile", profileSchema, [profile]);
  check("settings", settingsSchema, [settings]);
  check("pillars", pillarSchema, pillars);
  check("services", serviceSchema, services);
  check("products", productSchema, products);
  check("projects", projectSchema, projects);
  check("articles", articleSchema, articles);
  check("testimonials", testimonialSchema, testimonials);
  check("process", processStepSchema, processSteps);

  const dupes = (label: string, keys: string[]) => {
    const seen = new Set<string>();
    keys.forEach((k) => (seen.has(k) ? issues.push(`${label}: slug ganda "${k}"`) : seen.add(k)));
  };
  dupes("services", services.map((s) => s.slug));
  dupes("products", products.map((p) => p.slug));
  dupes("projects", projects.map((p) => p.slug));
  dupes("articles", articles.map((a) => a.slug));

  const serviceSlugs = new Set(services.map((s) => s.slug));
  const refs: [string, string[]][] = [
    ...products.map((p): [string, string[]] => [`product:${p.slug}`, p.relatedServices]),
    ...projects.map((p): [string, string[]] => [`project:${p.slug}`, p.relatedServices]),
    ...articles.map((a): [string, string[]] => [`article:${a.slug}`, a.relatedServices]),
  ];
  for (const [owner, slugs] of refs) {
    for (const s of slugs) if (!serviceSlugs.has(s)) issues.push(`${owner}: layanan terkait tidak ada "${s}"`);
  }

  // Aturan anti-klaim palsu
  for (const p of projects) {
    if (p.client && !p.clientVerified) issues.push(`project:${p.slug}: nama klien tanpa clientVerified`);
    if (p.type === "concept" && p.client) issues.push(`project:${p.slug}: proyek konsep tidak boleh punya klien`);
    if (p.type === "concept" && p.outcome) issues.push(`project:${p.slug}: proyek konsep tidak boleh mengklaim hasil`);
  }
  return issues;
}
