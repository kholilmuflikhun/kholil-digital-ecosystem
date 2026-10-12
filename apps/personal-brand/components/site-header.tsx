import Link from "next/link";
import { mainNav, primaryCta, settings } from "@/content";
import { Container } from "./layout";
import { SiteNav } from "./site-nav";
import { ThemeToggle } from "./theme";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <Container className="flex min-h-[64px] items-center justify-between gap-4">
        <Link href="/" className="ui text-lg font-bold tracking-tight" aria-label={`${settings.siteName}, ke beranda`}>
          {settings.siteName}
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SiteNav items={mainNav} cta={primaryCta} />
        </div>
      </Container>
    </header>
  );
}
