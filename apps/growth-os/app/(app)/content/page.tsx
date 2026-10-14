import type { Metadata } from "next";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { getOverview } from "@/lib/data/overview";
import { saveContent, deleteContent } from "@/lib/actions/business";
import { Badge, Card, CardTitle, DemoBadge, EmptyState, PageHeader, Table, Td, Th } from "@/components/ui/primitives";
import { DeleteButton, EntityForm, type Field } from "@/components/ui/entity-form";
import { CONTENT_STATUS, PILLAR, PLATFORM, label, pick } from "@/lib/constants/options";
import { formatCurrency, formatPct, num } from "@/lib/utils";
import { NOT_ENOUGH_DATA } from "@/lib/calculations";

export const metadata: Metadata = { title: "Konten" };
export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const userId = await requireUserId();
  const [items, offers, campaigns, o] = await Promise.all([
    db.content.findMany({ where: { userId }, orderBy: [{ publishDate: { sort: "desc", nulls: "last" } }] }),
    db.offer.findMany({ where: { userId }, select: { id: true, name: true } }),
    db.campaign.findMany({ where: { userId }, select: { id: true, name: true } }),
    getOverview(userId),
  ]);
  const money = (v: number) => formatCurrency(v, o.currency, o.locale);
  const stats = new Map(o.contentStats.map((s) => [s.id, s]));

  const fields: Field[] = [
    { name: "title", label: "Judul", required: true, full: true },
    { name: "platform", label: "Platform", type: "select", required: true, options: PLATFORM },
    { name: "pillar", label: "Pilar konten", type: "select", required: true, options: PILLAR },
    { name: "format", label: "Format (reel, carousel, dll.)" },
    { name: "status", label: "Status", type: "select", required: true, options: CONTENT_STATUS },
    { name: "publishDate", label: "Tanggal terbit", type: "date" },
    { name: "cta", label: "CTA", full: true },
    { name: "offerId", label: "Penawaran terkait", type: "select", options: pick(offers) },
    { name: "campaignId", label: "Kampanye", type: "select", options: pick(campaigns) },
    { name: "reach", label: "Jangkauan", type: "number" },
    { name: "profileVisits", label: "Kunjungan profil", type: "number" },
    { name: "dms", label: "DM masuk", type: "number" },
    { name: "productionCost", label: "Biaya produksi", type: "number" },
  ];

  const byPillar = new Map<string, { n: number; leads: number; revenue: number }>();
  for (const s of o.contentStats) {
    const cur = byPillar.get(s.pillar) ?? { n: 0, leads: 0, revenue: 0 };
    byPillar.set(s.pillar, { n: cur.n + 1, leads: cur.leads + s.leads, revenue: cur.revenue + s.revenue });
  }

  return (
    <>
      <PageHeader title="Konten" description="Lacak kontribusi konten terhadap pendapatan." actions={<EntityForm title="Konten baru" fields={fields} action={saveContent} initial={{ status: "IDEA", platform: "INSTAGRAM", pillar: "EDUCATION" }} />} />

      {items.length === 0 ? <EmptyState>Belum ada konten.</EmptyState> : (
        <Table>
          <thead><tr><Th>Konten</Th><Th>Pilar</Th><Th>Status</Th><Th>Terbit</Th><Th>Jangkauan</Th><Th>DM</Th><Th>Lead</Th><Th>Transaksi</Th><Th>Pendapatan</Th><Th>ROI</Th><Th><span className="sr-only">Aksi</span></Th></tr></thead>
          <tbody>
            {items.map((c) => {
              const s = stats.get(c.id);
              return (
                <tr key={c.id}>
                  <Td><div className="font-medium">{c.title} {c.isDemo && <DemoBadge />}</div><div className="text-xs text-muted-foreground">{label(PLATFORM, c.platform)}{c.format ? ` · ${c.format}` : ""}</div></Td>
                  <Td className="text-xs">{label(PILLAR, c.pillar)}</Td>
                  <Td><Badge tone={c.status === "PUBLISHED" ? "success" : "neutral"}>{label(CONTENT_STATUS, c.status)}</Badge></Td>
                  <Td>{c.publishDate ? format(c.publishDate, "d MMM") : "—"}</Td>
                  <Td className="tabular-nums">{c.reach.toLocaleString("id-ID")}</Td>
                  <Td className="tabular-nums">{c.dms}</Td>
                  <Td className="tabular-nums">{s?.leads ?? 0}</Td>
                  <Td className="tabular-nums">{s?.deals ?? 0}</Td>
                  <Td className="tabular-nums">{money(s?.revenue ?? 0)}</Td>
                  <Td className="tabular-nums">{s?.roi != null ? formatPct(s.roi) : "—"}</Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <EntityForm mode="edit" title="Edit konten" fields={fields} action={saveContent} id={c.id} initial={{ ...c, productionCost: num(c.productionCost) }} />
                      <DeleteButton action={deleteContent} id={c.id} />
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <Card className="mt-4">
        <CardTitle>Performa per pilar konten</CardTitle>
        {byPillar.size === 0 ? <EmptyState>{NOT_ENOUGH_DATA}</EmptyState> : (
          <ul className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {[...byPillar.entries()].sort((a, b) => b[1].leads - a[1].leads).map(([p, v]) => (
              <li key={p} className="rounded-md border p-3">
                <p className="font-medium">{label(PILLAR, p)}</p>
                <p className="text-xs text-muted-foreground">{v.n} konten · {v.leads} lead · {money(v.revenue)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
