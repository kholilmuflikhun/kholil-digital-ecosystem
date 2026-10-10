import { NextResponse } from "next/server";
import { leadPayloadSchema } from "@kholil/shared";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/utils/rate-limit";
import { extractBearer, ingestLead, safeEqual } from "@/lib/leads/ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32 * 1024;
const noStore = { "Cache-Control": "no-store" };
const json = (body: unknown, status: number) => NextResponse.json(body, { status, headers: noStore });

/**
 * Endpoint penerimaan lead dari website (server-to-server).
 * Nonaktif (503) kecuali LEAD_INGEST_API_KEY (>= 32 karakter) dan LEAD_INGEST_USER_EMAIL diatur.
 */
export async function POST(req: Request) {
  const apiKey = process.env.LEAD_INGEST_API_KEY;
  const ownerEmail = process.env.LEAD_INGEST_USER_EMAIL;
  if (!apiKey || apiKey.length < 32 || !ownerEmail) {
    return json({ error: "not_configured" }, 503);
  }

  const token = extractBearer(req.headers.get("authorization"));
  if (!token || !safeEqual(token, apiKey)) return json({ error: "unauthorized" }, 401);

  if (!rateLimit("lead-ingest", 120, 60_000).ok) return json({ error: "rate_limited" }, 429);

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);

  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const parsed = leadPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ error: "invalid_payload", fields: Object.keys(parsed.error.flatten().fieldErrors) }, 422);
  }

  try {
    const result = await ingestLead(db, parsed.data, ownerEmail);
    if (!result.ok) return json({ error: "not_configured" }, 503);
    return json({ ok: true, duplicate: result.duplicate }, result.duplicate ? 200 : 201);
  } catch (e) {
    console.error("lead ingest failed", e);
    return json({ error: "server_error" }, 500);
  }
}
