import { describe, expect, it } from "vitest";
import { computeGoalCurrentValue, type GoalSyncData } from "./goal-sync";

const goal = (category: string) => ({ category, startDate: new Date(2026, 9, 1), endDate: new Date(2026, 9, 31) });
const inRange = new Date(2026, 9, 15);
const outRange = new Date(2026, 8, 15);
const data: GoalSyncData = {
  revenues: [
    { date: inRange, grossRevenue: 1000, cost: 300, paymentStatus: "PAID" },
    { date: inRange, grossRevenue: 500, cost: 0, paymentStatus: "CANCELLED" },
    { date: outRange, grossRevenue: 9999, cost: 0, paymentStatus: "PAID" },
  ],
  expenses: [{ date: inRange, amount: 100 }, { date: outRange, amount: 5000 }],
  wonDeals: [{ closedAt: inRange }, { closedAt: outRange }, { closedAt: null }],
  customers: [{ createdAt: inRange }],
  prospects: [{ createdAt: inRange }, { createdAt: inRange }],
  contents: [{ publishDate: inRange, status: "PUBLISHED" }, { publishDate: inRange, status: "DRAFT" }],
  projects: [{ completedAt: inRange }],
};

describe("computeGoalCurrentValue", () => {
  it("REVENUE: hanya periode goal dan tanpa transaksi batal", () => expect(computeGoalCurrentValue(goal("REVENUE"), data)).toBe(1000));
  it("PROFIT: laba kotor dikurangi biaya operasional periode", () => expect(computeGoalCurrentValue(goal("PROFIT"), data)).toBe(600));
  it("SALES: deal Won dalam periode", () => expect(computeGoalCurrentValue(goal("SALES"), data)).toBe(1));
  it("CUSTOMERS dan LEADS", () => {
    expect(computeGoalCurrentValue(goal("CUSTOMERS"), data)).toBe(1);
    expect(computeGoalCurrentValue(goal("LEADS"), data)).toBe(2);
  });
  it("CONTENT: hanya yang berstatus PUBLISHED", () => expect(computeGoalCurrentValue(goal("CONTENT"), data)).toBe(1));
  it("PROJECTS: proyek selesai dalam periode", () => expect(computeGoalCurrentValue(goal("PROJECTS"), data)).toBe(1));
  it("kategori tanpa sumber data (CUSTOM) mengembalikan null agar nilai manual aman", () => {
    expect(computeGoalCurrentValue(goal("CUSTOM"), data)).toBeNull();
  });
  it("hari terakhir periode ikut dihitung", () => {
    const d: GoalSyncData = { ...data, prospects: [{ createdAt: new Date(2026, 9, 31, 22, 0) }] };
    expect(computeGoalCurrentValue(goal("LEADS"), d)).toBe(1);
  });
});
