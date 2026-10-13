import { db } from "@/lib/db";
import { num } from "@/lib/utils";
import { computeGoalCurrentValue } from "@/lib/calculations/goal-sync";

/** Perbarui currentValue goal berstatus ACTIVE dan autoTrack dari data nyata milik user. */
export async function syncGoalProgress(userId: string): Promise<number> {
  const goals = await db.goal.findMany({ where: { userId, autoTrack: true, status: { in: ["ACTIVE", "ACHIEVED"] } } });
  if (goals.length === 0) return 0;

  const [revenues, expenses, wonDeals, customers, prospects, contents, projects] = await Promise.all([
    db.revenue.findMany({ where: { userId }, select: { date: true, grossRevenue: true, cost: true, paymentStatus: true } }),
    db.expense.findMany({ where: { userId }, select: { date: true, amount: true } }),
    db.deal.findMany({ where: { userId, stage: "WON" }, select: { closedAt: true } }),
    db.customer.findMany({ where: { userId }, select: { createdAt: true } }),
    db.prospect.findMany({ where: { userId }, select: { createdAt: true } }),
    db.content.findMany({ where: { userId }, select: { publishDate: true, status: true } }),
    db.project.findMany({ where: { userId }, select: { completedAt: true } }),
  ]);
  const data = {
    revenues: revenues.map((r) => ({ ...r, grossRevenue: num(r.grossRevenue), cost: num(r.cost) })),
    expenses: expenses.map((e) => ({ ...e, amount: num(e.amount) })),
    wonDeals, customers, prospects, contents, projects,
  };

  let changed = 0;
  for (const g of goals) {
    const value = computeGoalCurrentValue(g, data);
    if (value === null || value === num(g.currentValue)) continue;
    await db.goal.updateMany({
      where: { id: g.id, userId },
      data: { currentValue: value, status: value >= num(g.targetValue) && num(g.targetValue) > 0 ? "ACHIEVED" : g.status === "ACHIEVED" ? "ACTIVE" : g.status },
    });
    changed++;
  }
  return changed;
}
