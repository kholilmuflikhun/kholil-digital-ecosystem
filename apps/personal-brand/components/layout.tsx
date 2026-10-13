import type { ElementType, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

type SectionProps = {
  children: ReactNode;
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  /** Tingkat heading. Halaman beranda memakai h2. */
  as?: ElementType;
  className?: string;
  ruled?: boolean;
};

/** Bagian halaman dengan pembatas tipis dan judul opsional. */
export function Section({ children, id, eyebrow, title, intro, as: Heading = "h2", className = "", ruled = true }: SectionProps) {
  const headingId = id && title ? `${id}-judul` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={`${ruled ? "border-t border-border" : ""} py-16 sm:py-24 ${className}`}>
      <Container>
        {(eyebrow || title || intro) && (
          <header className="mb-10 max-w-3xl sm:mb-14">
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            {title && (
              <Heading id={headingId} className="display-lg">
                {title}
              </Heading>
            )}
            {intro && <p className="mt-4 max-w-prose text-lg text-muted-foreground">{intro}</p>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}

/** Judul halaman dalam (h1). */
export function PageHeader({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <header className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent pb-12 pt-14 sm:pb-16 sm:pt-20">
      <Container>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="display-xl max-w-4xl">{title}</h1>
        {intro && <p className="mt-6 max-w-prose text-lg text-muted-foreground sm:text-xl">{intro}</p>}
        {children}
      </Container>
    </header>
  );
}
