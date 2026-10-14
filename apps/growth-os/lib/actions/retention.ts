"use server";

import { db } from "@/lib/db";
import { testimonialSchema, referralSchema, idSchema } from "@/lib/validations/entities";
import { guard, parse, ownsAll, refresh, safe, fail, type ActionResult } from "./helpers";
import { generateNotificationsFor } from "@/lib/notifications/service";
import { syncGoalProgress } from "@/lib/data/goal-sync";

type In = FormData | Record<string, unknown>;

export async function saveTestimonial(input: In, id?: string): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(testimonialSchema, input);
    if (!p.ok) return p;
    if (!(await ownsAll(userId, { customer: p.data.customerId }))) return fail("Pelanggan tidak ditemukan.");
    const data = { ...p.data, receivedAt: p.data.receivedAt ?? new Date() };
    if (id) {
      const r = await db.testimonial.updateMany({ where: { id, userId }, data });
      if (r.count === 0) return fail("Testimoni tidak ditemukan.");
    } else {
      await db.testimonial.create({ data: { ...data, userId } });
    }
    refresh("/retention", "/customers", "/analytics", "/dashboard");
    return { ok: true };
  });
}

export async function deleteTestimonial(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    await db.testimonial.deleteMany({ where: { id: p.data.id, userId } });
    refresh("/retention", "/customers", "/analytics", "/dashboard");
    return { ok: true };
  });
}

export async function saveReferral(input: In, id?: string): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(referralSchema, input);
    if (!p.ok) return p;
    if (!(await ownsAll(userId, { customer: p.data.referrerId, prospect: p.data.referredProspectId }))) return fail("Data tidak ditemukan.");
    if (id) {
      const r = await db.referral.updateMany({ where: { id, userId }, data: p.data });
      if (r.count === 0) return fail("Rujukan tidak ditemukan.");
    } else {
      await db.referral.create({ data: { ...p.data, userId } });
    }
    refresh("/retention", "/customers", "/analytics", "/dashboard");
    return { ok: true };
  });
}

export async function deleteReferral(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    await db.referral.deleteMany({ where: { id: p.data.id, userId } });
    refresh("/retention", "/customers", "/analytics", "/dashboard");
    return { ok: true };
  });
}

// ───────── Notifikasi in-app ─────────
export async function markNotificationRead(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    await db.notification.updateMany({ where: { id: p.data.id, userId, readAt: null }, data: { readAt: new Date() } });
    refresh("/notifications", "/dashboard");
    return { ok: true };
  });
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    await db.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });
    refresh("/notifications", "/dashboard");
    return { ok: true };
  });
}

/** Segarkan notifikasi dan progres goal otomatis secara manual (tombol di halaman notifikasi). */
export async function refreshInsights(): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    await Promise.all([generateNotificationsFor(userId), syncGoalProgress(userId)]);
    refresh("/notifications", "/goals", "/dashboard");
    return { ok: true };
  });
}
