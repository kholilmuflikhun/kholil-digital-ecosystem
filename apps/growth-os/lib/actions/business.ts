"use server";

import { db } from "@/lib/db";
import { scalePhases } from "@/lib/constants/campaign-template";
import { addDays, startOfDay } from "date-fns";
import {
  goalSchema, taskSchema, taskStatusSchema, offerSchema, projectSchema, contentSchema,
  revenueSchema, expenseSchema, campaignSchema, dailyActivitySchema, settingsSchema,
  strategySchema, weeklyReviewSchema, idSchema,
} from "@/lib/validations/entities";
import { guard, parse, ownsAll, refresh, safe, fail, type ActionResult } from "./helpers";
import type { Prisma } from "@prisma/client";

type In = FormData | Record<string, unknown>;

async function upsertOwned<T extends { count: number }>(
  id: string | undefined,
  update: () => Promise<T>,
  create: () => Promise<unknown>,
  notFound: string,
): Promise<ActionResult> {
  if (id) {
    const r = await update();
    if (r.count === 0) return fail(notFound);
  } else {
    await create();
  }
  return { ok: true };
}

// ───────── Goals ─────────
export async function saveGoal(input: In, id?: string): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(goalSchema, input);
    if (!p.ok) return p;
    const res = await upsertOwned(id,
      () => db.goal.updateMany({ where: { id, userId }, data: p.data }),
      () => db.goal.create({ data: { ...p.data, userId } }),
      "Goal tidak ditemukan.");
    refresh("/goals", "/dashboard");
    return res;
  });
}

export async function deleteGoal(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    await db.goal.deleteMany({ where: { id: p.data.id, userId } });
    refresh("/goals", "/dashboard");
    return { ok: true };
  });
}

// ───────── Tasks ─────────
export async function saveTask(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(taskSchema, input);
    if (!p.ok) return p;
    if (!(await ownsAll(userId, { prospect: p.data.prospectId, customer: p.data.customerId, project: p.data.projectId, goal: p.data.goalId }))) {
      return fail("Data tidak ditemukan.");
    }
    await db.task.create({ data: { ...p.data, userId, dueDate: p.data.dueDate ?? startOfDay(new Date()) } });
    refresh("/daily", "/dashboard");
    return { ok: true };
  });
}

export async function setTaskStatus(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(taskStatusSchema, input);
    if (!p.ok) return p;
    const r = await db.task.updateMany({
      where: { id: p.data.id, userId },
      data: { status: p.data.status, completedAt: p.data.status === "DONE" ? new Date() : null },
    });
    if (r.count === 0) return fail("Tugas tidak ditemukan.");
    refresh("/daily", "/dashboard");
    return { ok: true };
  });
}

export async function deleteTask(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    await db.task.deleteMany({ where: { id: p.data.id, userId } });
    refresh("/daily", "/dashboard");
    return { ok: true };
  });
}

// ───────── Daily scorecard ─────────
export async function saveDailyActivity(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(dailyActivitySchema, input);
    if (!p.ok) return p;
    const date = startOfDay(p.data.date);
    await db.dailyActivity.upsert({
      where: { userId_date: { userId, date } },
      create: { ...p.data, date, userId },
      update: { ...p.data, date },
    });
    refresh("/daily", "/dashboard", "/analytics");
    return { ok: true };
  });
}

// ───────── Offers ─────────
export async function saveOffer(input: In, id?: string): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(offerSchema, input);
    if (!p.ok) return p;
    const res = await upsertOwned(id,
      () => db.offer.updateMany({ where: { id, userId }, data: p.data }),
      () => db.offer.create({ data: { ...p.data, userId } }),
      "Penawaran tidak ditemukan.");
    refresh("/offers", "/dashboard");
    return res;
  });
}

export async function deleteOffer(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    await db.offer.deleteMany({ where: { id: p.data.id, userId } });
    refresh("/offers");
    return { ok: true };
  });
}

// ───────── Projects ─────────
export async function saveProject(input: In, id?: string): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(projectSchema, input);
    if (!p.ok) return p;
    if (!(await ownsAll(userId, { customer: p.data.customerId, deal: p.data.dealId, offer: p.data.offerId }))) return fail("Data tidak ditemukan.");
    const data = { ...p.data, completedAt: p.data.status === "COMPLETED" ? new Date() : null };
    const res = await upsertOwned(id,
      () => db.project.updateMany({ where: { id, userId }, data }),
      () => db.project.create({ data: { ...data, userId } }),
      "Proyek tidak ditemukan.");
    refresh("/projects", "/dashboard");
    return res;
  });
}

export async function deleteProject(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    await db.project.deleteMany({ where: { id: p.data.id, userId } });
    refresh("/projects", "/dashboard");
    return { ok: true };
  });
}

// ───────── Content ─────────
export async function saveContent(input: In, id?: string): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(contentSchema, input);
    if (!p.ok) return p;
    if (!(await ownsAll(userId, { offer: p.data.offerId, campaign: p.data.campaignId }))) return fail("Data tidak ditemukan.");
    const res = await upsertOwned(id,
      () => db.content.updateMany({ where: { id, userId }, data: p.data }),
      () => db.content.create({ data: { ...p.data, userId } }),
      "Konten tidak ditemukan.");
    refresh("/content", "/dashboard", "/analytics");
    return res;
  });
}

export async function deleteContent(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    await db.content.deleteMany({ where: { id: p.data.id, userId } });
    refresh("/content");
    return { ok: true };
  });
}

// ───────── Revenue & expenses ─────────
export async function saveRevenue(input: In, id?: string): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(revenueSchema, input);
    if (!p.ok) return p;
    if (!(await ownsAll(userId, { customer: p.data.customerId, offer: p.data.offerId, deal: p.data.dealId }))) return fail("Data tidak ditemukan.");
    const res = await upsertOwned(id,
      () => db.revenue.updateMany({ where: { id, userId }, data: p.data }),
      () => db.revenue.create({ data: { ...p.data, userId } }),
      "Transaksi tidak ditemukan.");
    refresh("/revenue", "/dashboard", "/analytics", "/customers");
    return res;
  });
}

export async function deleteRevenue(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    await db.revenue.deleteMany({ where: { id: p.data.id, userId } });
    refresh("/revenue", "/dashboard", "/analytics");
    return { ok: true };
  });
}

export async function saveExpense(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(expenseSchema, input);
    if (!p.ok) return p;
    await db.expense.create({ data: { ...p.data, userId } });
    refresh("/revenue", "/dashboard", "/analytics");
    return { ok: true };
  });
}

// ───────── Campaigns ─────────
export async function createCampaign(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(campaignSchema, input);
    if (!p.ok) return p;
    const { useTemplate, ...data } = p.data;
    const start = startOfDay(data.startDate);
    await db.campaign.create({
      data: {
        ...data,
        userId,
        startDate: start,
        endDate: addDays(start, data.durationDays - 1),
        status: "ACTIVE",
        milestones: useTemplate ? (scalePhases(data.durationDays) as unknown as Prisma.InputJsonValue) : undefined,
      },
    });
    refresh("/goals", "/dashboard", "/strategy");
    return { ok: true };
  });
}

// ───────── Settings, strategy, review ─────────
export async function saveSettings(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(settingsSchema, input);
    if (!p.ok) return p;
    const { name, currency, locale, ...rest } = p.data;
    if (!(rest.scoreCritical < rest.scoreNeedsWork && rest.scoreNeedsWork < rest.scoreOnTrack)) {
      return fail("Ambang skor harus berurutan: Critical < Needs Improvement < On Track.");
    }
    await db.$transaction([
      db.user.update({ where: { id: userId }, data: { name, currency, locale } }),
      db.userSettings.upsert({ where: { userId }, create: { userId, ...rest }, update: rest }),
    ]);
    refresh("/", "/settings", "/dashboard", "/analytics");
    return { ok: true };
  });
}

export async function saveStrategy(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(strategySchema, input);
    if (!p.ok) return p;
    await db.strategy.upsert({ where: { userId }, create: { userId, ...p.data }, update: p.data });
    refresh("/strategy");
    return { ok: true };
  });
}

export async function saveWeeklyReview(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(weeklyReviewSchema, input);
    if (!p.ok) return p;
    const weekStart = startOfDay(p.data.weekStart);
    await db.weeklyReview.upsert({
      where: { userId_weekStart: { userId, weekStart } },
      create: { userId, weekStart, answers: p.data.answers },
      update: { answers: p.data.answers },
    });
    refresh("/analytics");
    return { ok: true };
  });
}

/** Hapus seluruh data bertanda demo milik user yang sedang login. */
export async function clearDemoData(): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    await db.$transaction([
      db.task.deleteMany({ where: { userId, isDemo: true } }),
      db.dailyActivity.deleteMany({ where: { userId, isDemo: true } }),
      db.testimonial.deleteMany({ where: { userId, isDemo: true } }),
      db.referral.deleteMany({ where: { userId, isDemo: true } }),
      db.payment.deleteMany({ where: { userId, revenue: { isDemo: true } } }),
      db.revenue.deleteMany({ where: { userId, isDemo: true } }),
      db.expense.deleteMany({ where: { userId, isDemo: true } }),
      db.project.deleteMany({ where: { userId, isDemo: true } }),
      db.deal.deleteMany({ where: { userId, isDemo: true } }),
      db.prospect.deleteMany({ where: { userId, isDemo: true } }),
      db.customer.deleteMany({ where: { userId, isDemo: true } }),
      db.content.deleteMany({ where: { userId, isDemo: true } }),
      db.goal.deleteMany({ where: { userId, isDemo: true } }),
      db.campaign.deleteMany({ where: { userId, isDemo: true } }),
      db.offer.deleteMany({ where: { userId, isDemo: true } }),
    ]);
    refresh("/", "/dashboard");
    return { ok: true };
  });
}
