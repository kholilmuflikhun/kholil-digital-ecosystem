import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border bg-card p-4 shadow-sm", className)} {...props} />;
}

export function CardTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-sm font-semibold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}

type Tone = "neutral" | "success" | "warning" | "danger" | "primary";
const tones: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  primary: "bg-primary/15 text-primary",
};

export function Badge({ tone = "neutral", className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", tones[tone], className)} {...props} />
  );
}

export function Progress({ value, tone = "primary", label }: { value: number; tone?: Tone; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  const bar = { neutral: "bg-muted-foreground", success: "bg-success", warning: "bg-warning", danger: "bg-danger", primary: "bg-primary" }[tone];
  return (
    <div
      role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={label}
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
    >
      <div className={cn("h-full rounded-full transition-all", bar)} style={{ width: `${v}%` }} />
    </div>
  );
}

export function Stat({ label, value, hint, tone }: { label: string; value: React.ReactNode; hint?: React.ReactNode; tone?: Tone }) {
  return (
    <Card>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      {hint ? <p className={cn("mt-1 text-xs", tone ? tones[tone].split(" ")[1] : "text-muted-foreground")}>{hint}</p> : null}
    </Card>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">{children}</p>;
}

export function DemoBadge() {
  return <Badge tone="warning">DEMO</Badge>;
}

export const buttonClass = (variant: "primary" | "ghost" | "danger" = "primary") =>
  cn(
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50",
    variant === "primary" && "bg-primary text-primary-foreground hover:opacity-90",
    variant === "ghost" && "border bg-card hover:bg-muted",
    variant === "danger" && "text-danger hover:bg-danger/10",
  );

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full min-w-[640px] text-sm">{children}</table>
    </div>
  );
}
export const Th = (p: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th {...p} className={cn("whitespace-nowrap border-b bg-muted/50 px-3 py-2 text-left text-xs font-medium text-muted-foreground", p.className)} />
);
export const Td = (p: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td {...p} className={cn("border-b px-3 py-2 align-middle last:border-b-0", p.className)} />
);
