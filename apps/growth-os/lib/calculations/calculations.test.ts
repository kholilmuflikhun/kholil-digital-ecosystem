import { describe, expect, it } from "vitest";
import {
  calculateGoalProgress,
  calculateSalesMath,
  executionScore,
  scoreLabel,
  summarizeFinance,
  buildFunnel,
  generateInsights,
  expectedValue,
} from "./index";

describe("calculateSalesMath", () => {
  it("menurunkan kebutuhan aktivitas dari target pendapatan", () => {
    const r = calculateSalesMath({
      requiredRevenue: 10_000,
      averageOrderValue: 500,
      conversionRate: 0.2,
      qualificationRate: 0.5,
      responseRate: 0.25,
    });
    expect(r).toEqual({
      requiredTransactions: 20,
      requiredQualifiedLeads: 100,
      requiredProspects: 200,
      requiredOutreach: 800,
    });
  });

  it("mengembalikan null bila parameter belum valid", () => {
    expect(
      calculateSalesMath({
        requiredRevenue: 1000,
        averageOrderValue: 0,
        conversionRate: 0.2,
        qualificationRate: 0.5,
        responseRate: 0.25,
      }),
    ).toBeNull();
  });
});

describe("calculateGoalProgress", () => {
  const base = {
    targetValue: 100,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-01-10"),
  };

  it("menghitung progres, sisa, dan laju yang dibutuhkan", () => {
    const p = calculateGoalProgress({ ...base, currentValue: 40, now: new Date("2026-01-05") });
    expect(p.progressPct).toBe(40);
    expect(p.remaining).toBe(60);
    expect(p.daysLeft).toBe(5);
    expect(p.dailyRequiredPace).toBe(12);
    expect(p.projectedResult).toBeCloseTo(80);
    expect(p.variance).toBeCloseTo(-20);
    expect(p.onTrack).toBe(false);
  });

  it("tidak membagi dengan nol bila target 0", () => {
    const p = calculateGoalProgress({ ...base, targetValue: 0, currentValue: 0, now: new Date("2026-01-05") });
    expect(p.progressPct).toBe(0);
  });
});

describe("scorecard", () => {
  it("menghitung skor dan label", () => {
    expect(executionScore(3, 4)).toBe(75);
    expect(executionScore(0, 0)).toBeNull();
    expect(scoreLabel(49)).toBe("Critical");
    expect(scoreLabel(50)).toBe("Needs Improvement");
    expect(scoreLabel(70)).toBe("On Track");
    expect(scoreLabel(90)).toBe("Excellent");
  });
});

describe("summarizeFinance", () => {
  it("mengabaikan transaksi dibatalkan dan menghitung margin", () => {
    const s = summarizeFinance(
      [
        { grossRevenue: 1000, cost: 400, paymentStatus: "PAID" },
        { grossRevenue: 500, cost: 100, paymentStatus: "PENDING" },
        { grossRevenue: 9999, cost: 0, paymentStatus: "CANCELLED" },
      ],
      100,
    );
    expect(s.grossRevenue).toBe(1500);
    expect(s.netProfit).toBe(900);
    expect(s.profitMargin).toBeCloseTo(60);
    expect(s.averageOrderValue).toBe(750);
    expect(s.outstanding).toBe(500);
  });
});

describe("funnel & insights", () => {
  it("menghitung konversi antar tahap", () => {
    const f = buildFunnel({
      audience: 1000, prospects: 100, qualifiedLeads: 40, conversations: 30,
      offers: 20, won: 10, customers: 10, repeatCustomers: 2, referrals: 1,
    });
    expect(f[1].conversionFromPrev).toBe(10);
    expect(f[5].conversionFromPrev).toBe(50);
  });

  it("tidak menghasilkan insight bila data tidak cukup", () => {
    const out = generateInsights({
      offers: [], aovThisPeriod: null, aovPreviousPeriod: null,
      followUpWinRate: null, coldOutreachWinRate: null, followUpSample: 0, coldSample: 0,
      contents: [], dormantCustomers: 0, dormantWindowDays: 60,
      pipelineValue: 0, proposalToCloseRate: null, proposalSample: 0,
    });
    expect(out).toHaveLength(0);
  });

  it("expected value = nilai × probabilitas", () => {
    expect(expectedValue(1000, 25)).toBe(250);
  });
});
