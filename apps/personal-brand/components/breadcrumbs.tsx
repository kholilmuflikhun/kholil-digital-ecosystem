import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";
import { Container } from "./layout";
import { JsonLd } from "./json-ld";

export type Crumb = { name: string; path: string };

/** Breadcrumb terlihat + JSON-LD BreadcrumbList. Item terakhir adalah halaman saat ini. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "Beranda", path: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <nav aria-label="Navigasi lokasi" className="border-b border-border">
        <Container>
          <ol className="ui flex flex-wrap items-center gap-x-2 py-3 text-sm text-muted-foreground">
            {all.map((c, i) => {
              const last = i === all.length - 1;
              return (
                <li key={c.path} className="flex items-center gap-2">
                  {last ? (
                    <span aria-current="page" className="text-foreground">
                      {c.name}
                    </span>
                  ) : (
                    <Link href={c.path} className="underline underline-offset-4 hover:text-foreground">
                      {c.name}
                    </Link>
                  )}
                  {!last && <span aria-hidden="true">/</span>}
                </li>
              );
            })}
          </ol>
        </Container>
      </nav>
    </>
  );
}
