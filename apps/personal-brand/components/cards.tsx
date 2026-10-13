import Link from "next/link";
import Image from "next/image";
import type { Article, Product, Project, Service } from "@/content";
import { productCategoryLabels, projectCategoryLabels, projectTypeLabels } from "@/content";
import { availabilityLabels, formatDate, formatPricing } from "@/lib/format";
import { ProjectArt } from "./project-art";

export function PriceLabel({ pricing }: { pricing: Product["pricing"] }) {
  const { label, prefix } = formatPricing(pricing);
  return (
    <p className="ui text-sm">
      {prefix && <span className="text-muted-foreground">{prefix} </span>}
      <span className="font-semibold">{label}</span>
    </p>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="surface relative flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lift">
      <p className="eyebrow">{productCategoryLabels[product.category]}</p>
      <h3 className="display-md mt-2">
        <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 hover:underline">
          {product.name}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-muted-foreground">{product.shortDescription}</p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <PriceLabel pricing={product.pricing} />
        <span className="ui rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs">{availabilityLabels[product.availability]}</span>
      </div>
    </article>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const image = project.images[0];
  return (
    <article className="surface relative flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lift">
      <div className="aspect-[16/10] overflow-hidden border-b border-border">
        {image ? (
          <Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="h-full w-full object-cover" />
        ) : project.art ? (
          <ProjectArt variant={project.art.variant} />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">
          {projectTypeLabels[project.type]} · {projectCategoryLabels[project.category]}
        </p>
        <h3 className="display-md mt-2">
          <Link href={`/portfolio/${project.slug}`} className="after:absolute after:inset-0 hover:underline">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-muted-foreground">{project.summary}</p>
      </div>
    </article>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="surface relative flex h-full flex-col p-5 transition hover:border-primary hover:shadow-lift">
      <p className="eyebrow">
        {article.category} · {article.readingMinutes} menit baca
      </p>
      <h3 className="display-md mt-2">
        <Link href={`/insights/${article.slug}`} className="after:absolute after:inset-0 hover:underline">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 text-muted-foreground">{article.description}</p>
      <p className="ui mt-3 text-sm text-muted-foreground">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
      </p>
    </article>
  );
}

export function ServiceLink({ service, index }: { service: Service; index?: number }) {
  return (
    <li className="relative border-t border-border">
      <Link href={`/services/${service.slug}`} className="group grid gap-1 py-4 sm:grid-cols-[3rem_1fr_2fr] sm:items-baseline sm:gap-4">
        {index !== undefined && <span className="ui text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>}
        <span className="ui text-lg font-semibold group-hover:underline">{service.name}</span>
        <span className="text-muted-foreground">{service.summary}</span>
      </Link>
    </li>
  );
}
