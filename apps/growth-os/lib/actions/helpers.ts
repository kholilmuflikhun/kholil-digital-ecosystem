import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { rateLimit } from "@/lib/utils/rate-limit";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/** Ubah FormData / objek mentah menjadi objek polos; string kosong dianggap tidak diisi. */
export function toPlain(input: FormData | Record<string, unknown>): Record<string, unknown> {
  const obj: Record<string, unknown> =
    input instanceof FormData ? Object.fromEntries(input.entries()) : { ...input };
  for (const k of Object.keys(obj)) if (obj[k] === "") delete obj[k];
  return obj;
}

export function parse<S extends z.ZodTypeAny>(schema: S, input: FormData | Record<string, unknown>) {
  const result = schema.safeParse(toPlain(input));
  if (!result.success) {
    return {
      ok: false as const,
      error: "Data tidak valid",
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  return { ok: true as const, data: result.data as z.infer<S> };
}

/** Pembatas laju mutasi per user (60 per menit). */
export async function guard() {
  const userId = await requireUserId();
  if (!(await rateLimit(`mutate:${userId}`, 60, 60_000)).ok) {
    throw new Error("Terlalu banyak permintaan. Coba lagi sebentar.");
  }
  return userId;
}

type OwnedModel = "offer" | "prospect" | "customer" | "deal" | "project" | "content" | "goal" | "campaign" | "revenue";

/**
 * Verifikasi bahwa semua ID relasi milik user. Tidak pernah percaya ID dari klien.
 * Mengembalikan false bila ada yang bukan milik user.
 */
export async function ownsAll(userId: string, checks: Partial<Record<OwnedModel, string | undefined>>) {
  for (const [model, id] of Object.entries(checks)) {
    if (!id) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const delegate = (db as any)[model];
    const found = await delegate.findFirst({ where: { id, userId }, select: { id: true } });
    if (!found) return false;
  }
  return true;
}

export async function logActivity(userId: string, action: string, entityType: string, entityId: string, metadata?: object) {
  await db.activityLog.create({ data: { userId, action, entityType, entityId, metadata } });
}

export function refresh(...paths: string[]) {
  for (const p of paths) revalidatePath(p);
}

export function fail(error: string): ActionResult {
  return { ok: false, error };
}

export async function safe<T>(fn: () => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  try {
    return await fn();
  } catch (e) {
    // Next.js redirect() melempar error khusus; teruskan
    if (e && typeof e === "object" && "digest" in e && String((e as { digest: unknown }).digest).startsWith("NEXT_REDIRECT")) throw e;
    console.error(e);
    return { ok: false, error: e instanceof Error && e.message.startsWith("Terlalu") ? e.message : "Terjadi kesalahan. Coba lagi." };
  }
}
