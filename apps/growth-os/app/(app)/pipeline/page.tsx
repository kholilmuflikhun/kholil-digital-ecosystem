import type { Metadata } from "next";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { getOverview } from "@/lib/data/overview";
import { saveDeal, deleteDeal } from "@/lib/actions/crm";
import { DEAL_STAGES, DEAL_STAGE_LABELS } from "@/lib/constants";
import { DEAL_STAGE, pick } from "@/lib/constants/options";
import { Card, DemoBadge, EmptyState, PageHeader, Stat } from "@/components/ui/primitives";
import { DeleteButton, EntityForm, type Field } from "@/components/ui/entity-form";
import { StageSelect } from "@/components/pipeline/stage-select";
import { expectedValue } from "@/lib/calculations";
import { formatCurrency, formatPct, num } from "@/lib/utils";

export const metadata: Metadata = { title: "Pipeline Penjualan" };
export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const userId = await requireUserId();
  const [deals, prospects, offers, o] = await Promise.all([
    db.deal.findMany({ where: { userId }, include: { prospect: { select: { name: true, businessName: true } }, offer: { select: { name: true } } }, orderBy: { updatedAt: "desc" } }),
    db.prospect.findMany({ where: { userId }, select: { id: true, name: true, businessName: true }, orderBy: { name: "asc" }, take: 500 }),
    db.offer.findMany({ where: { userId }, select: { id: true, name: true } }),
    getOverview(userId),
  ]);
  const money = (v: number) => formatCurrency(v, o.currency, o.locale);

  const fields: Field[] = [
    { name: "name", label: "Nama transaksi", required: true, full: true },
    { name: "prospectId", label: "Prospek", type: "select", required: true, options: prospects.map((p) => ({ value: p.id, label: p.businessName ? `${p.name} — ${p.businessName}` : p.name })) },
    { name: "offerId", label: "Produk/layanan", type: "select", options: pick(offers) },
    { name: "stage", label: "Tahap", type: "select", required: true, options: DEAL_STAGE },
    { name: "value", label: "Nilai", type: "number", required: true },
    { name: "probability", label: "Probabilitas (%)", type: "number" },
    { name: "expectedCloseDate", label: "Perkiraan selesai", type: "date" },
    { name: "nextAction", label: "Aksi berikutnya", full: true },
    { name: "notes", label: "Catatan", type: "textarea" },
  ];

  return (
    <>
      <PageHeader title="Pipeline Penjualan" description="Nilai tertimbang = nilai transaksi × probabilitas." actions={<EntityForm title="Transaksi baru" fields={fields} action={saveDeal} initial={{ stage: "LEAD", probability: 5 }} />} />

      <section aria-label="Metrik pipeline" className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Nilai pipeline" value={money(o.pipeline.pipelineValue)} hint={`${o.pipeline.openCount} transaksi terbuka`} />
        <Stat label="Nilai tertimbang" value={money(o.pipeline.weightedPipeline)} />
        <Stat label="Tingkat keberhasilan" value={formatPct(o.pipeline.winRate)} />
        <Stat label="Nilai transaksi rata-rata" value={o.pipeline.avgDealSize ? money(o.pipeline.avgDealSize) : "—"} />
        <Stat label="Siklus penjualan" value={o.pipeline.salesCycle !== null ? `${o.pipeline.salesCycle.toFixed(0)} hari` : "—"} />
      </section>

      {deals.length === 0 ? <EmptyState>Belum ada transaksi. Tambahkan prospek, lalu buat transaksi.</EmptyState> : (
        <div className="-mx-4 overflow-x-auto px-4 pb-4">
          <div className="flex min-w-max gap-3">
            {DEAL_STAGES.map((stage) => {
              const col = deals.filter((d) => d.stage === stage);
              const sum = col.reduce((s, d) => s + num(d.value), 0);
              return (
                <section key={stage} aria-label={DEAL_STAGE_LABELS[stage]} className="w-64 shrink-0 rounded-lg bg-muted/50 p-2">
                  <header className="mb-2 flex items-center justify-between px-1 text-sm">
                    <h2 className="font-semibold">{DEAL_STAGE_LABELS[stage]} <span className="text-muted-foreground">({col.length})</span></h2>
                    <span className="text-xs text-muted-foreground">{money(sum)}</span>
                  </header>
                  <ul className="grid gap-2">
                    {col.map((d) => (
                      <li key={d.id}>
                        <Card className="p-3">
                          <p className="text-sm font-medium">{d.name} {d.isDemo && <DemoBadge />}</p>
                          <p className="text-xs text-muted-foreground">{d.prospect.businessName ?? d.prospect.name}{d.offer ? ` · ${d.offer.name}` : ""}</p>
                          <p className="mt-1 text-sm font-semibold tabular-nums">{money(num(d.value))}</p>
                          <p className="text-xs text-muted-foreground">
                            {d.probability}% → nilai tertimbang {money(expectedValue(num(d.value), d.probability))}
                            {d.expectedCloseDate ? ` · ${format(d.expectedCloseDate, "d MMM")}` : ""}
                          </p>
                          {d.nextAction && <p className="mt-1 text-xs">➜ {d.nextAction}</p>}
                          {d.lostReason && <p className="mt-1 text-xs text-danger">Alasan tidak berhasil: {d.lostReason}</p>}
                          <div className="mt-2 flex items-center gap-1">
                            <StageSelect id={d.id} stage={d.stage} />
                            <EntityForm mode="edit" title="Edit deal" fields={fields} action={saveDeal} id={d.id} initial={{ ...d, value: num(d.value) }} />
                            <DeleteButton action={deleteDeal} id={d.id} />
                          </div>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {o.pipeline.lostReasons.length > 0 && (
        <Card className="mt-4">
          <h2 className="mb-2 text-sm font-semibold">Alasan transaksi tidak berhasil</h2>
          <ul className="grid gap-1 text-sm">
            {o.pipeline.lostReasons.map((r) => <li key={r.reason} className="flex justify-between"><span>{r.reason}</span><span className="tabular-nums text-muted-foreground">{r.count}</span></li>)}
          </ul>
        </Card>
      )}
    </>
  );
}
