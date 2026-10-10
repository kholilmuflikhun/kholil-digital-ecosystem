import type { ReactNode } from "react";
import type { AnalyticsEvent } from "@/lib/analytics";
import { TrackedLink } from "./tracked-link";

const base =
  "ui inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-base font-semibold transition-colors";
const variants = {
  primary: "bg-ink text-paper hover:bg-ink/85",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink underline decoration-1 underline-offset-4 hover:decoration-2 px-0",
} as const;

type Props = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  event?: AnalyticsEvent;
  eventProps?: Record<string, string | number | boolean>;
  className?: string;
  ariaLabel?: string;
};

export function ButtonLink({ href, children, variant = "primary", event, eventProps, className = "", ariaLabel }: Props) {
  return (
    <TrackedLink
      href={href}
      event={event}
      eventProps={eventProps}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </TrackedLink>
  );
}
