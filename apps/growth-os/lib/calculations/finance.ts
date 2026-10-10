export type RevenueRow = {
  grossRevenue: number;
  cost: number;
  paymentStatus: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" | "CANCELLED";
  paidAmount?: number;
};

export type FinanceSummary = {
  grossRevenue: number;
  totalCosts: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  profitMargin: number | null;
  averageOrderValue: number | null;
  transactions: number;
  outstanding: number;
};

/** Transaksi yang dibatalkan tidak dihitung sebagai pendapatan. */
export function summarizeFinance(
  rows: RevenueRow[],
  operatingExpenses = 0,
): FinanceSummary {
  const valid = rows.filter((r) => r.paymentStatus !== "CANCELLED");
  const grossRevenue = valid.reduce((s, r) => s + r.grossRevenue, 0);
  const totalCosts = valid.reduce((s, r) => s + r.cost, 0);
  const grossProfit = grossRevenue - totalCosts;
  const netProfit = grossProfit - operatingExpenses;
  const outstanding = valid
    .filter((r) => r.paymentStatus !== "PAID")
    .reduce((s, r) => s + Math.max(0, r.grossRevenue - (r.paidAmount ?? 0)), 0);

  return {
    grossRevenue,
    totalCosts,
    grossProfit,
    operatingExpenses,
    netProfit,
    profitMargin: grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : null,
    averageOrderValue: valid.length > 0 ? grossRevenue / valid.length : null,
    transactions: valid.length,
    outstanding,
  };
}

export function grossMargin(price: number, cost: number): number | null {
  return price > 0 ? ((price - cost) / price) * 100 : null;
}

export function growthRate(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}

export function expectedValue(value: number, probabilityPct: number): number {
  return value * (Math.min(100, Math.max(0, probabilityPct)) / 100);
}
