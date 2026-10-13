import { format } from "date-fns";

export type NotificationDraft = {
  type: "FOLLOW_UP" | "OVERDUE_PAYMENT" | "DEADLINE" | "DAILY_PRIORITY";
  title: string;
  body?: string;
  entityType: string;
  entityId: string;
  dedupeKey: string;
  href: string;
};

export type NotificationSnapshot = {
  prospects: { id: string; name: string; status: string; nextFollowUpAt: Date | null }[];
  revenues: { id: string; reference: string | null; customerName: string | null; dueDate: Date | null; paymentStatus: string; outstanding: number }[];
  tasks: { id: string; title: string; status: string; dueDate: Date | null; priority: string }[];
  projects: { id: string; name: string; status: string; deadline: Date | null }[];
};

const day = (d: Date) => format(d, "yyyy-MM-dd");
const endOfToday = (now: Date) => new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

/**
 * Susun notifikasi dari data aktual. `dedupeKey` memuat id entitas + tanggal terkait,
 * sehingga menjalankan ulang pada hari yang sama tidak membuat notifikasi ganda,
 * dan jadwal baru (tanggal berubah) menghasilkan pengingat baru.
 */
export function buildNotifications(s: NotificationSnapshot, now = new Date()): NotificationDraft[] {
  const out: NotificationDraft[] = [];
  const eod = endOfToday(now).getTime();

  for (const p of s.prospects) {
    if (!p.nextFollowUpAt || p.status === "WON" || p.status === "LOST") continue;
    if (p.nextFollowUpAt.getTime() > eod) continue;
    out.push({
      type: "FOLLOW_UP",
      title: `Follow-up: ${p.name}`,
      body: `Jadwal follow-up ${format(p.nextFollowUpAt, "d MMM yyyy")}.`,
      entityType: "Prospect",
      entityId: p.id,
      dedupeKey: `followup:${p.id}:${day(p.nextFollowUpAt)}`,
      href: "/prospects",
    });
  }

  for (const r of s.revenues) {
    if (!r.dueDate || r.outstanding <= 0) continue;
    if (!["PENDING", "PARTIAL", "OVERDUE"].includes(r.paymentStatus)) continue;
    if (r.dueDate.getTime() >= now.getTime()) continue;
    const who = r.customerName ?? r.reference ?? "transaksi";
    out.push({
      type: "OVERDUE_PAYMENT",
      title: `Tagihan lewat jatuh tempo: ${who}`,
      body: `Jatuh tempo ${format(r.dueDate, "d MMM yyyy")}.`,
      entityType: "Revenue",
      entityId: r.id,
      dedupeKey: `overdue:${r.id}:${day(r.dueDate)}`,
      href: "/revenue",
    });
  }

  for (const t of s.tasks) {
    if (!t.dueDate || t.status === "DONE" || t.status === "SKIPPED") continue;
    if (t.dueDate.getTime() > eod) continue;
    if (t.priority !== "HIGH" && t.priority !== "CRITICAL") continue;
    out.push({
      type: "DAILY_PRIORITY",
      title: `Prioritas: ${t.title}`,
      entityType: "Task",
      entityId: t.id,
      dedupeKey: `task:${t.id}:${day(t.dueDate)}`,
      href: "/daily",
    });
  }

  const soon = eod + 3 * 24 * 60 * 60 * 1000;
  for (const pr of s.projects) {
    if (!pr.deadline || pr.status === "COMPLETED" || pr.status === "ARCHIVED") continue;
    if (pr.deadline.getTime() > soon) continue;
    out.push({
      type: "DEADLINE",
      title: `Deadline proyek: ${pr.name}`,
      body: `Tenggat ${format(pr.deadline, "d MMM yyyy")}.`,
      entityType: "Project",
      entityId: pr.id,
      dedupeKey: `deadline:${pr.id}:${day(pr.deadline)}`,
      href: "/projects",
    });
  }
  return out;
}
