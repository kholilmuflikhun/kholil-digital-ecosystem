import { cache } from "react";
import { db } from "@/lib/db";
import { num } from "@/lib/utils";
import {
  buildFunnel, calculateGoalProgress, calculateSalesMath, executionScore, scoreLabel,
  summarizeFinance, generateInsights, generateRecommendations, expectedValue, growthRate,
  type FunnelCounts,
} from "@/lib/calculations";
import { startOfMonth, subMonths, endOfDay, startOfDay, subDays, differenceInCalendarDays, format } from "date-fns";

/** Satu sumber data untuk dashboard, analytics, dan insight. Semua query dibatasi userId. */
export const getOverview = cache(async (userId: string) => {
  const now = new Date();
  const today = startOfDay(now);
  const monthStart = startOfMonth(now);
  const prevMonthStart = startOfMonth(subMonths(now, 1));

  const [user, settings, goals, deals, prospects, customers, offers, contents, revenues, expenses, tasksToday, activity7, projects, campaign] =
    await Promise.all([
      db.user.findUniqueOrThrow({ where: { id: userId }, select: { name: true, currency: true, locale: true } }),
      db.userSettings.findUnique({ where: { userId } }),
      db.goal.findMany({ where: { userId, status: "ACTIVE" }, orderBy: [{ priority: "desc" }, { endDate: "asc" }] }),
      db.deal.findMany({ where: { userId }, include: { prospect: { select: { name: true, isColdOutreach: true, lastContactAt: true } }, offer: { select: { name: true } } } }),
      db.prospect.findMany({ where: { userId } }),
      db.customer.findMany({ where: { userId }, include: { revenues: { where: { paymentStatus: { not: "CANCELLED" } }, select: { grossRevenue: true, cost: true, date: true } } } }),
      db.offer.findMany({ where: { userId } }),
      db.content.findMany({ where: { userId }, include: { _count: { select: { prospects: true, deals: true } }, deals: { where: { stage: "WON" }, select: { value: true } } } }),
      db.revenue.findMany({ where: { userId }, include: { offer: { select: { name: true } }, customer: { select: { name: true, businessName: true } }, payments: { select: { amount: true } } }, orderBy: { date: "asc" } }),
      db.expense.findMany({ where: { userId }, orderBy: { date: "asc" } }),
      db.task.findMany({ where: { userId, dueDate: { gte: today, lte: endOfDay(now) } }, orderBy: [{ priority: "desc" }, { createdAt: "asc" }] }),
      db.dailyActivity.findMany({ where: { userId, date: { gte: subDays(today, 6) } }, orderBy: { date: "asc" } }),
      db.project.findMany({ where: { userId } }),
      db.campaign.findFirst({ where: { userId, status: "ACTIVE" }, orderBy: { startDate: "desc" } }),
    ]);

  // ── Keuangan ──
  const revRows = revenues.map((r) => ({
    grossRevenue: num(r.grossRevenue), cost: num(r.cost), paymentStatus: r.paymentStatus,
    paidAmount: r.payments.reduce((s, p) => s + num(p.amount), 0),
    date: r.date,
  }));
  const expAll = expenses.reduce((s, e) => s + num(e.amount), 0);
  const finance = summarizeFinance(revRows, expAll);
  const inMonth = (d: Date, from: Date, to?: Date) => d >= from && (!to || d < to);
  const thisMonthRows = revRows.filter((r) => inMonth(r.date, monthStart));
  const prevMonthRows = revRows.filter((r) => inMonth(r.date, prevMonthStart, monthStart));
  const thisMonth = summarizeFinance(thisMonthRows);
  const prevMonth = summarizeFinance(prevMonthRows);

  // Tren bulanan (6 bulan)
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const from = startOfMonth(subMonths(now, 5 - i));
    const to = startOfMonth(subMonths(now, 4 - i));
    const rows = revRows.filter((r) => inMonth(r.date, from, to));
    const exp = expenses.filter((e) => inMonth(e.date, from, to)).reduce((s, e) => s + num(e.amount), 0);
    const s = summarizeFinance(rows, exp);
    return { month: format(from, "MMM yy"), revenue: s.grossRevenue, profit: s.netProfit, cost: s.totalCosts + exp };
  });

  const groupSum = (key: (r: (typeof revenues)[number]) => string) => {
    const map = new Map<string, number>();
    for (const r of revenues) {
      if (r.paymentStatus === "CANCELLED") continue;
      const k = key(r);
      map.set(k, (map.get(k) ?? 0) + num(r.grossRevenue));
    }
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  };
  const revenueByOffer = groupSum((r) => r.offer?.name ?? "Tanpa penawaran");
  const revenueByCustomer = groupSum((r) => r.customer?.businessName ?? r.customer?.name ?? "Tanpa pelanggan").slice(0, 8);
  const revenueByChannel = groupSum((r) => r.channel ?? "Tidak diketahui");

  // ── Pipeline ──
  const openDeals = deals.filter((d) => d.stage !== "WON" && d.stage !== "LOST");
  const wonDeals = deals.filter((d) => d.stage === "WON");
  const lostDeals = deals.filter((d) => d.stage === "LOST");
  const pipelineValue = openDeals.reduce((s, d) => s + num(d.value), 0);
  const weightedPipeline = openDeals.reduce((s, d) => s + expectedValue(num(d.value), d.probability), 0);
  const closed = wonDeals.length + lostDeals.length;
  const winRate = closed > 0 ? (wonDeals.length / closed) * 100 : null;
  const avgDealSize = wonDeals.length > 0 ? wonDeals.reduce((s, d) => s + num(d.value), 0) / wonDeals.length : null;
  const cycles = wonDeals.filter((d) => d.closedAt).map((d) => differenceInCalendarDays(d.closedAt!, d.createdAt));
  const salesCycle = cycles.length ? cycles.reduce((a, b) => a + b, 0) / cycles.length : null;
  const lostReasons = Object.entries(
    lostDeals.reduce<Record<string, number>>((acc, d) => {
      const k = d.lostReason ?? "Tidak disebutkan";
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count);

  // ── Pelanggan ──
  const repeatWindow = settings?.repeatWindowDays ?? 60;
  const customerStats = customers.map((c) => {
    const total = c.revenues.reduce((s, r) => s + num(r.grossRevenue), 0);
    const profit = total - c.revenues.reduce((s, r) => s + num(r.cost), 0);
    const last = c.revenues.reduce<Date | null>((m, r) => (!m || r.date > m ? r.date : m), null);
    return { id: c.id, name: c.businessName ?? c.name, total, profit, orders: c.revenues.length, last };
  });
  const buyers = customerStats.filter((c) => c.orders > 0);
  const repeatCustomers = buyers.filter((c) => c.orders > 1).length;
  const repeatRate = buyers.length > 0 ? (repeatCustomers / buyers.length) * 100 : null;
  const dormant = buyers.filter((c) => c.last && differenceInCalendarDays(now, c.last) > repeatWindow);
  const avgCustomerRevenue = buyers.length ? buyers.reduce((s, c) => s + c.total, 0) / buyers.length : null;
  const referralCustomers = customers.filter((c) => c.referredById).length;

  // ── Konten & atribusi ──
  const contentStats = contents.map((c) => {
    const leads = c._count.prospects;
    const revenue = c.deals.reduce((s, d) => s + num(d.value), 0);
    const cost = num(c.productionCost);
    return {
      id: c.id, title: c.title, pillar: c.pillar, platform: c.platform, status: c.status,
      reach: c.reach, leads, deals: c.deals.length, revenue,
      leadRate: c.reach > 0 ? (leads / c.reach) * 100 : null,
      roi: cost > 0 ? ((revenue - cost) / cost) * 100 : null,
    };
  });
  const published = contents.filter((c) => c.status === "PUBLISHED" || c.status === "REPURPOSED");

  // ── Funnel ──
  const proposalDeals = deals.filter((d) => ["PROPOSAL", "NEGOTIATION", "WON"].includes(d.stage) || (d.stage === "LOST" && d.probability > 0));
  const funnelCounts: FunnelCounts = {
    audience: contents.reduce((s, c) => s + c.reach, 0),
    prospects: prospects.length,
    qualifiedLeads: prospects.filter((p) => ["QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON"].includes(p.status)).length,
    conversations: prospects.filter((p) => !["NEW", "CONTACTED", "DORMANT"].includes(p.status)).length,
    offers: proposalDeals.length,
    won: wonDeals.length,
    customers: buyers.length,
    repeatCustomers,
    referrals: referralCustomers,
  };
  const funnel = buildFunnel(funnelCounts);

  // ── Insight & rekomendasi ──
  const offerStats = offers.map((o) => {
    const rows = revenues.filter((r) => r.offerId === o.id && r.paymentStatus !== "CANCELLED");
    return { name: o.name, revenue: rows.reduce((s, r) => s + num(r.grossRevenue), 0), cost: rows.reduce((s, r) => s + num(r.cost), 0), count: rows.length };
  });
  const followUpDeals = deals.filter((d) => d.stage === "WON" || d.stage === "LOST").filter((d) => !d.prospect.isColdOutreach);
  const coldDeals = deals.filter((d) => d.stage === "WON" || d.stage === "LOST").filter((d) => d.prospect.isColdOutreach);
  const rate = (arr: typeof deals) => (arr.length ? (arr.filter((d) => d.stage === "WON").length / arr.length) * 100 : null);
  const proposalWon = deals.filter((d) => d.stage === "WON").length;
  const proposalClosed = deals.filter((d) => d.stage === "LOST" || d.stage === "WON").length;

  const insights = generateInsights({
    offers: offerStats,
    aovThisPeriod: thisMonth.averageOrderValue,
    aovPreviousPeriod: prevMonth.averageOrderValue,
    followUpWinRate: rate(followUpDeals), coldOutreachWinRate: rate(coldDeals),
    followUpSample: followUpDeals.length, coldSample: coldDeals.length,
    contents: contentStats.map((c) => ({ title: c.title, pillar: c.pillar, leads: c.leads, revenue: c.revenue })),
    dormantCustomers: dormant.length, dormantWindowDays: repeatWindow,
    pipelineValue, proposalToCloseRate: proposalClosed ? (proposalWon / proposalClosed) * 100 : null, proposalSample: proposalClosed,
  });

  const revenueGoal = goals.find((g) => g.category === "REVENUE");
  const overdueFollowUps = prospects.filter((p) => p.nextFollowUpAt && p.nextFollowUpAt < today && !["WON", "LOST", "DORMANT"].includes(p.status));
  const recommendations = generateRecommendations({
    weightedPipeline,
    pipelineTarget: revenueGoal ? Math.max(0, num(revenueGoal.targetValue) - num(revenueGoal.currentValue)) : null,
    proposalsSent: proposalDeals.length, closingRate: proposalClosed ? (proposalWon / proposalClosed) * 100 : null,
    grossRevenue: finance.grossRevenue, profitMargin: finance.profitMargin,
    customers: buyers.length, repeatPurchaseRate: repeatRate,
    topContentLeads: Math.max(0, ...contentStats.map((c) => c.leads)),
    overdueFollowUps: overdueFollowUps.length,
  });

  // ── Goals ──
  const goalProgress = goals.map((g) => ({
    id: g.id, name: g.name, category: g.category, metric: g.metric, priority: g.priority,
    target: num(g.targetValue), current: num(g.currentValue),
    ...calculateGoalProgress({ targetValue: num(g.targetValue), currentValue: num(g.currentValue), startDate: g.startDate, endDate: g.endDate }),
  }));

  // ── Sales math (dari target pendapatan goal aktif) ──
  const salesMath = revenueGoal && settings && num(settings.averageOrderValue) > 0
    ? calculateSalesMath({
        requiredRevenue: Math.max(0, num(revenueGoal.targetValue) - num(revenueGoal.currentValue)),
        averageOrderValue: num(settings.averageOrderValue),
        conversionRate: num(settings.conversionRate),
        qualificationRate: num(settings.qualificationRate),
        responseRate: num(settings.responseRate),
      })
    : null;

  // ── Eksekusi harian ──
  const planned = tasksToday.filter((t) => t.isKpiActivity && t.status !== "SKIPPED").length;
  const done = tasksToday.filter((t) => t.isKpiActivity && t.status === "DONE").length;
  const score = executionScore(done, planned);
  const thresholds = settings ? { critical: settings.scoreCritical, needsWork: settings.scoreNeedsWork, onTrack: settings.scoreOnTrack } : undefined;

  // ── Fokus hari ini ──
  const focus: { kind: "priority" | "today" | "revenue" | "retention"; text: string; href: string }[] = [];
  const hot = prospects.filter((p) => p.probability >= 40 && !["WON", "LOST", "DORMANT"].includes(p.status));
  if (overdueFollowUps.length) focus.push({ kind: "priority", text: `Follow-up ${overdueFollowUps.length} prospek yang sudah lewat jadwal`, href: "/prospects" });
  else if (hot.length) focus.push({ kind: "priority", text: `Hubungi ${hot.length} prospek panas`, href: "/prospects" });
  const nextContent = contents.find((c) => ["READY", "SCHEDULED", "DRAFT"].includes(c.status));
  if (nextContent) focus.push({ kind: "today", text: `Siapkan konten: ${nextContent.title}`, href: "/content" });
  const closest = [...openDeals].sort((a, b) => b.probability - a.probability)[0];
  if (closest) focus.push({ kind: "revenue", text: `Dorong deal terdekat closing: ${closest.name}`, href: "/pipeline" });
  if (dormant.length) focus.push({ kind: "retention", text: `Hubungi ${dormant[0].name} untuk repeat order`, href: "/customers" });

  return {
    user, settings, currency: user.currency, locale: user.locale,
    finance, thisMonth, prevMonth, revenueGrowth: growthRate(thisMonth.grossRevenue, prevMonth.grossRevenue),
    monthly, revenueByOffer, revenueByCustomer, revenueByChannel,
    pipeline: { pipelineValue, weightedPipeline, winRate, avgDealSize, salesCycle, lostReasons, openCount: openDeals.length },
    customers: { count: customers.length, buyers: buyers.length, repeatRate, avgCustomerRevenue, stats: customerStats, dormant },
    contentStats, publishedCount: published.length,
    funnel, insights, recommendations, goalProgress, salesMath,
    execution: { planned, done, score, label: score === null ? null : scoreLabel(score, thresholds), tasks: tasksToday },
    activity7, focus, campaign,
    projectsCompleted: projects.filter((p) => p.status === "COMPLETED").length,
    projects,
    counts: { prospects: prospects.length, offers: offers.length, revenues: revenues.length },
  };
});

export type Overview = Awaited<ReturnType<typeof getOverview>>;
