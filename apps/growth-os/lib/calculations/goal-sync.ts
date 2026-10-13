export type GoalSyncInput = {
  category: string;
  startDate: Date;
  endDate: Date;
};

export type GoalSyncData = {
  revenues: { date: Date; grossRevenue: number; cost: number; paymentStatus: string }[];
  expenses: { date: Date; amount: number }[];
  wonDeals: { closedAt: Date | null }[];
  customers: { createdAt: Date }[];
  prospects: { createdAt: Date }[];
  contents: { publishDate: Date | null; status: string }[];
  projects: { completedAt: Date | null }[];
};

const within = (d: Date | null | undefined, g: GoalSyncInput) =>
  !!d && d.getTime() >= g.startDate.getTime() && d.getTime() <= endOfDay(g.endDate);

function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
}

/**
 * Nilai capaian goal dari data nyata. Mengembalikan null untuk kategori yang tidak
 * punya sumber data otomatis (mis. CUSTOM), sehingga nilai manual tidak tertimpa.
 */
export function computeGoalCurrentValue(goal: GoalSyncInput, data: GoalSyncData): number | null {
  const rev = data.revenues.filter((r) => r.paymentStatus !== "CANCELLED" && within(r.date, goal));
  switch (goal.category) {
    case "REVENUE":
      return rev.reduce((s, r) => s + r.grossRevenue, 0);
    case "PROFIT": {
      const gross = rev.reduce((s, r) => s + r.grossRevenue - r.cost, 0);
      const opex = data.expenses.filter((e) => within(e.date, goal)).reduce((s, e) => s + e.amount, 0);
      return gross - opex;
    }
    case "SALES":
      return data.wonDeals.filter((d) => within(d.closedAt, goal)).length;
    case "CUSTOMERS":
      return data.customers.filter((c) => within(c.createdAt, goal)).length;
    case "LEADS":
      return data.prospects.filter((p) => within(p.createdAt, goal)).length;
    case "CONTENT":
      return data.contents.filter((c) => c.status === "PUBLISHED" && within(c.publishDate, goal)).length;
    case "PROJECTS":
      return data.projects.filter((p) => within(p.completedAt, goal)).length;
    default:
      return null;
  }
}
