"use server";

import { db } from "@/lib/db";
import { DEAL_STAGE_PROBABILITY } from "@/lib/constants";
import {
  prospectSchema, dealSchema, dealStageSchema, customerSchema, idSchema,
} from "@/lib/validations/entities";
import { guard, parse, ownsAll, refresh, safe, logActivity, fail, type ActionResult } from "./helpers";

type In = FormData | Record<string, unknown>;

// ───────── Prospects ─────────
export async function saveProspect(input: In, id?: string): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(prospectSchema, input);
    if (!p.ok) return p;
    if (!(await ownsAll(userId, { offer: p.data.offerId, content: p.data.contentId }))) return fail("Data tidak ditemukan.");

    if (id) {
      const r = await db.prospect.updateMany({ where: { id, userId }, data: p.data });
      if (r.count === 0) return fail("Prospek tidak ditemukan.");
    } else {
      const created = await db.prospect.create({ data: { ...p.data, userId } });
      await logActivity(userId, "prospect.created", "Prospect", created.id);
    }
    refresh("/prospects", "/dashboard");
    return { ok: true };
  });
}

export async function markProspectContacted(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    const r = await db.prospect.updateMany({
      where: { id: p.data.id, userId },
      data: { lastContactAt: new Date(), status: "CONTACTED" },
    });
    if (r.count === 0) return fail("Prospek tidak ditemukan.");
    refresh("/prospects", "/daily", "/dashboard");
    return { ok: true };
  });
}

export async function deleteProspect(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    await db.prospect.deleteMany({ where: { id: p.data.id, userId } });
    refresh("/prospects", "/pipeline", "/dashboard");
    return { ok: true };
  });
}

// ───────── Deals ─────────
export async function saveDeal(input: In, id?: string): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(dealSchema, input);
    if (!p.ok) return p;
    if (!(await ownsAll(userId, { prospect: p.data.prospectId, offer: p.data.offerId }))) return fail("Data tidak ditemukan.");

    if (id) {
      const r = await db.deal.updateMany({ where: { id, userId }, data: p.data });
      if (r.count === 0) return fail("Deal tidak ditemukan.");
    } else {
      const created = await db.deal.create({ data: { ...p.data, userId } });
      await logActivity(userId, "deal.created", "Deal", created.id);
    }
    refresh("/pipeline", "/dashboard");
    return { ok: true };
  });
}

/** Pindah tahap (drag & drop kanban). Won otomatis membuat pelanggan + mencatat closedAt. */
export async function moveDealStage(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(dealStageSchema, input);
    if (!p.ok) return p;

    const deal = await db.deal.findFirst({ where: { id: p.data.id, userId }, include: { prospect: true } });
    if (!deal) return fail("Deal tidak ditemukan.");

    let customerId = deal.customerId;
    if (p.data.stage === "WON" && !customerId) {
      const customer = await db.customer.create({
        data: {
          userId,
          name: deal.prospect.name,
          businessName: deal.prospect.businessName,
          email: deal.prospect.email,
          whatsapp: deal.prospect.whatsapp,
          instagram: deal.prospect.instagram,
          referralSource: deal.prospect.source,
        },
      });
      customerId = customer.id;
    }

    await db.$transaction([
      db.deal.update({
        where: { id: deal.id },
        data: {
          stage: p.data.stage,
          probability: DEAL_STAGE_PROBABILITY[p.data.stage],
          closedAt: p.data.stage === "WON" || p.data.stage === "LOST" ? new Date() : null,
          lostReason: p.data.stage === "LOST" ? p.data.lostReason ?? "Tidak disebutkan" : null,
          customerId,
        },
      }),
      db.prospect.update({
        where: { id: deal.prospectId },
        data: {
          status: p.data.stage === "WON" ? "WON" : p.data.stage === "LOST" ? "LOST" : undefined,
        },
      }),
    ]);
    await logActivity(userId, "deal.stage_changed", "Deal", deal.id, { from: deal.stage, to: p.data.stage });
    refresh("/pipeline", "/prospects", "/customers", "/dashboard", "/analytics");
    return { ok: true };
  });
}

export async function deleteDeal(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    await db.deal.deleteMany({ where: { id: p.data.id, userId } });
    refresh("/pipeline", "/dashboard");
    return { ok: true };
  });
}

// ───────── Customers ─────────
export async function saveCustomer(input: In, id?: string): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(customerSchema, input);
    if (!p.ok) return p;
    if (id) {
      const r = await db.customer.updateMany({ where: { id, userId }, data: p.data });
      if (r.count === 0) return fail("Pelanggan tidak ditemukan.");
    } else {
      await db.customer.create({ data: { ...p.data, userId } });
    }
    refresh("/customers", "/dashboard");
    return { ok: true };
  });
}

export async function deleteCustomer(input: In): Promise<ActionResult> {
  return safe(async () => {
    const userId = await guard();
    const p = parse(idSchema, input);
    if (!p.ok) return p;
    await db.customer.deleteMany({ where: { id: p.data.id, userId } });
    refresh("/customers", "/dashboard");
    return { ok: true };
  });
}
