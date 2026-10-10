import type { LeadPayload } from "@kholil/shared";
import type { LeadSink } from "./sinks";

export type DeliveryResult =
  | { status: "not_configured" }
  | { status: "delivered"; delivered: string[]; failed: string[] }
  | { status: "failed"; failed: string[] };

/**
 * Kirim lead ke semua sink yang terkonfigurasi. Sukses bila minimal satu sink berhasil.
 * Bila tidak ada sink terkonfigurasi, hasilnya "not_configured" (tidak pernah dianggap sukses).
 * Kegagalan satu sink (mis. Growth OS offline) tidak menggagalkan sink lain.
 */
export async function deliverLead(payload: LeadPayload, sinks: LeadSink[]): Promise<DeliveryResult> {
  const active = sinks.filter((s) => s.isConfigured());
  if (active.length === 0) return { status: "not_configured" };

  const results = await Promise.allSettled(active.map((s) => s.send(payload)));
  const delivered: string[] = [];
  const failed: string[] = [];
  results.forEach((r, i) => {
    if (r.status === "fulfilled") delivered.push(active[i].name);
    else {
      failed.push(active[i].name);
      console.error(`[lead] sink ${active[i].name} gagal:`, r.reason instanceof Error ? r.reason.message : "unknown");
    }
  });
  return delivered.length > 0 ? { status: "delivered", delivered, failed } : { status: "failed", failed };
}
