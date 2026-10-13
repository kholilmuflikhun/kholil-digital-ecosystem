import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { safeEqual, extractBearer } from "@/lib/leads/ingest";
import { generateNotificationsFor } from "@/lib/notifications/service";
import { syncGoalProgress } from "@/lib/data/goal-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const noStore = { "Cache-Control": "no-store" };

/**
 * Cron harian (Vercel Cron mengirim `Authorization: Bearer $CRON_SECRET`).
 * Nonaktif (503) bila CRON_SECRET (>= 32 karakter) belum diatur. Idempoten.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 32) return NextResponse.json({ error: "not_configured" }, { status: 503, headers: noStore });
  const token = extractBearer(req.headers.get("authorization"));
  if (!token || !safeEqual(token, secret)) return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: noStore });

  const users = await db.user.findMany({ select: { id: true }, take: 1000 });
  let created = 0;
  let failed = 0;
  for (const u of users) {
    try {
      created += await generateNotificationsFor(u.id);
      await syncGoalProgress(u.id);
    } catch (e) {
      failed++;
      console.error("cron notifications failed for a user", e);
    }
  }
  return NextResponse.json({ ok: true, users: users.length, created, failed }, { headers: noStore });
}
