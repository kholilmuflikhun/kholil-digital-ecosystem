import Link from "next/link";
import { footerNav, mainNav, profile, settings } from "@/content";
import { publicEmail } from "@/lib/site";
import { Container } from "./layout";
import { WhatsAppCta } from "./whatsapp-cta";
import { TrackedLink } from "./tracked-link";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border">
      <Container className="grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="ui text-xl font-bold">{settings.siteName}</p>
          <p className="mt-3 max-w-sm text-muted-foreground">{profile.role}.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <WhatsAppCta placement="footer" />
          </div>
          {publicEmail && (
            <p className="mt-4">
              <TrackedLink href={`mailto:${publicEmail}`} event="email_click" eventProps={{ placement: "footer" }} className="link">
                {publicEmail}
              </TrackedLink>
            </p>
          )}
        </div>
        <nav aria-label="Peta situs">
          <p className="eyebrow mb-3">Situs</p>
          <ul className="ui space-y-1">
            {mainNav.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="inline-flex min-h-[32px] items-center hover:underline">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Informasi">
          <p className="eyebrow mb-3">Informasi</p>
          <ul className="ui space-y-1">
            {footerNav.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="inline-flex min-h-[32px] items-center hover:underline">
                  {i.label}
                </Link>
              </li>
            ))}
            {settings.social.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="noopener noreferrer" target="_blank" className="inline-flex min-h-[32px] items-center hover:underline">
                  {s.label}
                  <span className="sr-only"> (tab baru)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="border-t border-border py-6">
        <p className="ui text-sm text-muted-foreground">© {year} {settings.siteName}. Seluruh hak dilindungi.</p>
      </Container>
    </footer>
  );
}
