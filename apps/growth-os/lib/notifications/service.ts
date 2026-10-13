import { db } from "@/lib/db";
import { num } from "@/lib/utils";
import { buildNotifications, type NotificationDraft } from "./build";

/**
 * Buat notifikasi in-app untuk satu user. Idempoten: constraint unik (userId, dedupeKey)
 * + skipDuplicates memastikan pemanggilan berulang atau bersamaan tidak membuat duplikat.
 */
export async function generateNotificationsFor(userId: string, now = new Date()): Promise<number> {
  const [prospects, revenues, tasks, projects] = await Promise.all([
    db.prospect.findMany({
      where: { userId, nextFollowUpAt: { not: null, lte: now }, status: { notIn: ["WON", "LOST"] } },
      select: { id: true, name: true, status: true, nextFollowUpAt: true },
      take: 200,
    }),
    db.revenue.findMany({
      where: { userId, dueDate: { not: null, lt: now }, paymentStatus: { in: ["PENDING", "PARTIAL", "OVERDUE"] } },
      select: { id: true, reference: true, dueDate: true, paymentStatus: true, grossRevenue: true, customer: { select: { name: true, businessName: true } }, payments: { select: { amount: true } } },
      take: 200,
    }),
    db.task.findMany({
      where: { userId, status: { in: ["TODO", "IN_PROGRESS"] }, dueDate: { not: null, lte: now }, priority: { in: ["HIGH", "CRITICAL"] } },
      select: { id: true, title: true, status: true, dueDate: true, priority: true },
      take: 200,
    }),
    db.project.findMany({
      where: { userId, deadline: { not: null }, status: { notIn: ["COMPLETED", "ARCHIVED"] } },
      select: { id: true, name: true, status: true, deadline: true },
      take: 200,
    }),
  ]);

  const drafts: NotificationDraft[] = buildNotifications(
    {
      prospects,
      revenues: revenues.map((r) => ({
        id: r.id,
        reference: r.reference,
        customerName: r.customer?.businessName ?? r.customer?.name ?? null,
        dueDate: r.dueDate,
        paymentStatus: r.paymentStatus,
        outstanding: num(r.grossRevenue) - r.payments.reduce((s, p) => s + num(p.amount), 0),
      })),
      tasks,
      projects,
    },
    now,
  );
  if (drafts.length === 0) return 0;

  const res = await db.notification.createMany({
    data: drafts.map((d) => ({
      userId,
      type: d.type,
      title: d.title,
      body: d.body,
      entityType: d.entityType,
      entityId: d.entityId,
      dedupeKey: d.dedupeKey,
    })),
    skipDuplicates: true,
  });
  return res.count;
}
