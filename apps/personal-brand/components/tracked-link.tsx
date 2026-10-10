"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type Props = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  event?: AnalyticsEvent;
  eventProps?: Record<string, string | number | boolean>;
  children: ReactNode;
};

/** Tautan yang mengirim event analitik (tanpa data pribadi). Tautan internal memakai next/link. */
export function TrackedLink({ href, event, eventProps, onClick, children, ...rest }: Props) {
  const handle: NonNullable<Props["onClick"]> = (e) => {
    if (event) track(event, eventProps);
    onClick?.(e);
  };
  if (href.startsWith("/")) {
    return (
      <Link href={href} onClick={handle} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} onClick={handle} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {children}
    </a>
  );
}
