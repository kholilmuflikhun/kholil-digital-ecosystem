import type { Metadata } from "next";
import { absoluteUrl, siteUrl } from "./site";
import { profile, settings } from "@/content";
import type { Article, Pricing, Product, Service } from "@/content";

type MetaInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

const clip = (text: string, max: number) => (text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`);

/** Metadata per halaman: canonical, Open Graph, Twitter. Judul memakai template di layout. */
export function buildMetadata({ title, description, path, type = "website", noIndex, publishedTime, modifiedTime }: MetaInput): Metadata {
  const url = absoluteUrl(path);
  const desc = clip(description, 170);
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title: `${title} | ${settings.siteName}`,
      description: desc,
      siteName: settings.siteName,
      locale: "id_ID",
      ...(type === "article" ? { publishedTime, modifiedTime, authors: [profile.name] } : {}),
    },
    twitter: { card: "summary_large_image", title: `${title} | ${settings.siteName}`, description: desc },
  };
}

// ───────── JSON-LD (hanya properti yang didukung data nyata) ─────────
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    jobTitle: profile.role,
    description: settings.siteDescription,
    ...(settings.social.length ? { sameAs: settings.social.map((s) => s.url) } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName,
    url: siteUrl,
    inLanguage: "id-ID",
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.summary,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@type": "Person", name: profile.name, url: siteUrl },
    ...(settings.serviceArea ? { areaServed: settings.serviceArea } : {}),
  };
}

function offerFor(pricing: Pricing) {
  if (pricing.mode === "fixed") return { "@type": "Offer", price: pricing.amount, priceCurrency: pricing.currency };
  if (pricing.mode === "starting-from") {
    return {
      "@type": "Offer",
      priceSpecification: { "@type": "PriceSpecification", minPrice: pricing.amount, priceCurrency: pricing.currency },
    };
  }
  return undefined; // custom-quotation / contact: jangan mengarang harga
}

export function productJsonLd(product: Product) {
  const offers = offerFor(product.pricing);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    url: absoluteUrl(`/products/${product.slug}`),
    ...(offers ? { offers } : {}),
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Person", name: article.author, url: siteUrl },
    mainEntityOfPage: absoluteUrl(`/insights/${article.slug}`),
    inLanguage: "id-ID",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
