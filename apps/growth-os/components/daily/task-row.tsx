"use client";

import { useTransition } from "react";
import { setTaskStatus, deleteTask } from "@/lib/actions/business";
import { Badge } from "@/components/ui/primitives";
import { DeleteButton } from "@/components/ui/entity-form";
import { cn } from "@/lib/utils";

const STATUSES = [
  ["TODO", "Belum dimulai"], ["IN_PROGRESS", "Berjalan"], ["DONE", "Selesai"], ["SKIPPED", "Dilewati"],
] as const;
const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Rendah", MEDIUM: "Sedang", HIGH: "Tinggi", CRITICAL: "Kritis",
};

export function TaskRow({
  id, title, category, priority, status, minutes, demo,
}: {
  id: string; title: string; category: string; priority: string; status: string; minutes: number | null; demo: boolean;
}) {
  const [pending, start] = useTransition();
  const done = status === "DONE" || status === "SKIPPED";
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-md border bg-card p-3">
      <input
        type="checkbox" checked={status === "DONE"} disabled={pending} aria-label={`Tandai selesai: ${title}`}
        onChange={(e) => start(async () => void (await setTaskStatus({ id, status: e.target.checked ? "DONE" : "TODO" })))}
        className="h-4 w-4"
      />
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm font-medium", done && "text-muted-foreground line-through")}>{title}</p>
        <p className="text-xs text-muted-foreground">{category}{minutes ? ` · ${minutes} menit` : ""}</p>
      </div>
      {demo && <Badge tone="warning">DEMO</Badge>}
      <Badge tone={priority === "HIGH" || priority === "CRITICAL" ? "danger" : "neutral"}>{PRIORITY_LABELS[priority] ?? priority}</Badge>
      <select
        aria-label="Status tugas" value={status} disabled={pending}
        onChange={(e) => start(async () => void (await setTaskStatus({ id, status: e.target.value })))}
        className="h-8 rounded-md border bg-background px-2 text-xs"
      >
        {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <DeleteButton action={deleteTask} id={id} />
    </li>
  );
}
