import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "IDR", locale = "id-ID") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  }).format(value);
}

export function formatCompact(value: number, locale = "id-ID") {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatPct(value: number | null, digits = 0) {
  return value === null ? "—" : `${value.toFixed(digits)}%`;
}

/** Prisma Decimal | number | string | null → number */
export function num(value: unknown): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}
