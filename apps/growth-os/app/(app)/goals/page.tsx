import type { Metadata } from "next";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { calculateGoalProgress } from "@/lib/calculations";
import { formatPct, num } from "@/lib/utils";
import { syncGoalProgress } from "@/lib/data/goal-sync";
import { saveGoal, deleteGoal, createCampaign } from "@/lib/actions/business";
import { Badge, Card, CardTitle, DemoBadge, EmptyState, PageHeader, Progress } from "@/components/ui/primitives";
import { DeleteButton, EntityForm, type Field } from "@/components/ui/entity-form";
import { CAMPAIGN_DURATION, GOAL_CATEGORY, GOAL_STATUS, PRIORITY, label } from "@/lib/constants/options";
import { DEFAULT_30_DAY_PHASES } from "@/lib/constants/campaign-template";

export const metadata: Metadata = { title: "Goals" };
export const dynamic = "force-dynamic";

const goalFields: Field[] = [
  { name: "name", label: "Nama goal", required: true, full: true },
  { name: "category", label: "Kategori", type: "select", required: true, options: GOAL_CATEGORY },
  { name: "metric", label: "Metrik (mis. IDR, transaksi)", required: true },
  { name: "targetValue", label: "Target", type: "number", required: true },
  { name: "currentValue", label: "Nilai saat ini (manual)", type: "number" },
  { name: "autoTrack", label: "Hitung otomatis dari data (pendapatan, profit, penjualan, pelanggan, lead, konten, proyek)", type: "checkbox" },
  { name: "startDate", label: "Mulai", type: "date", required: true },
  { name: "endDate", label: "Selesai", type: "date", required: true },
  { name: "status", label: "Status", type: "select", required: true, options: GOAL_STATUS },
  { name: "priority", label: "Prioritas", type: "select", required: true, options: PRIORITY },
  { name: "description", label: "Deskripsi", type: "textarea" },
];

const campaignFields: Field[] = [
  { name: "name", label: "Nama kampanye", required: true, full: true },
  { name: "durationDays", label: "Durasi", type: "select", required: true, options: CAMPAIGN_DURATION },
  { name: "startDate", label: "Mulai", type: "date", required: true },
  { name: "revenueTarget", label: "Target pendapatan", type: "number" },
  { name: "salesTarget", label: "Target penjualan", type: "number" },
  { name: "contentTarget", label: "Target konten", type: "number" },
  { name: "prospectTarget", label: "Target prospek", type: "number" },
  { name: "goalSummary", label: "Tujuan", type: "textarea" },
  { name: "useTemplate", label: "Gunakan template fase 30 hari (diskalakan ke durasi)", type: "checkbox" },
];

export default async function GoalsPage() {
  const userId = await requireUserId();
  await syncGoalProgress(userId).catch((e) => console.error("goal sync failed", e));
  const [goals, campaigns] = await Promise.all([
    db.goal.findMany({ where: { userId }, orderBy: [{ status: "asc" }, { endDate: "asc" }] }),
    db.campaign.findMany({ where: { userId }, orderBy: { startDate: "desc" } }),
  ]);

  return (
    <>
      <PageHeader
        title="Goals & Kampanye"
        description="Target ditentukan sendiri: nilai, mata uang, dan periode tidak dikunci."
        actions={
          <div className="flex gap-2">
            <EntityForm title="Kampanye baru" fields={campaignFields} action={createCampaign} triggerLabel="Kampanye" initial={{ durationDays: 30, useTemplate: true }} />
            <EntityForm title="Goal baru" fields={goalFields} action={saveGoal} triggerLabel="Goal" initial={{ status: "ACTIVE", priority: "MEDIUM" }} />
          </div>
        }
      />

      {goals.length === 0 ? (
        <EmptyState>Belum ada goal. Mulai dengan satu target pendapatan dan satu target aktivitas.</EmptyState>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {goals.map((g) => {
            const p = calculateGoalProgress({ targetValue: num(g.targetValue), currentValue: num(g.currentValue), startDate: g.startDate, endDate: g.endDate });
            return (
              <li key={g.id}>
                <Card>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{g.name} {g.isDemo && <DemoBadge />}</h3>
                      <p className="text-xs text-muted-foreground">
                        {label(GOAL_CATEGORY, g.category)} · {format(g.startDate, "d MMM")} – {format(g.endDate, "d MMM yyyy")}
                      </p>
                    </div>
                    <span className="flex items-center gap-1">{g.autoTrack && <Badge>Otomatis</Badge>}<Badge tone={g.status === "ACHIEVED" ? "success" : g.status === "ACTIVE" ? "primary" : "neutral"}>{label(GOAL_STATUS, g.status)}</Badge></span>
                  </div>
                  <div className="mt-3"><Progress value={p.progressPct} tone={p.onTrack ? "success" : "warning"} label={g.name} /></div>
                  <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div><dt className="text-muted-foreground">Progres</dt><dd className="font-semibold">{formatPct(p.progressPct)}</dd></div>
                    <div><dt className="text-muted-foreground">Sisa</dt><dd className="font-semibold">{p.remaining.toLocaleString("id-ID")} {g.metric}</dd></div>
                    <div><dt className="text-muted-foreground">Sisa hari</dt><dd className="font-semibold">{p.daysLeft}</dd></div>
                    <div><dt className="text-muted-foreground">Laju/hari</dt><dd className="font-semibold">{p.dailyRequiredPace.toLocaleString("id-ID", { maximumFractionDigits: 1 })}</dd></div>
                    <div><dt className="text-muted-foreground">Laju/minggu</dt><dd className="font-semibold">{p.weeklyRequiredPace.toLocaleString("id-ID", { maximumFractionDigits: 1 })}</dd></div>
                    <div>
                      <dt className="text-muted-foreground">Proyeksi</dt>
                      <dd className={p.onTrack ? "font-semibold text-success" : "font-semibold text-warning"}>
                        {p.projectedResult.toLocaleString("id-ID", { maximumFractionDigits: 0 })} ({p.variance >= 0 ? "+" : ""}{p.variance.toLocaleString("id-ID", { maximumFractionDigits: 0 })})
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-3 flex justify-end gap-1">
                    <EntityForm mode="edit" title="Edit goal" fields={goalFields} action={saveGoal} id={g.id} initial={{ ...g, targetValue: num(g.targetValue), currentValue: num(g.currentValue) }} />
                    <DeleteButton action={deleteGoal} id={g.id} />
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mb-3 mt-8 text-lg font-semibold">Kampanye</h2>
      {campaigns.length === 0 ? (
        <EmptyState>Belum ada kampanye. Pilih durasi 7–90 hari atau kustom, lalu gunakan template 4 fase.</EmptyState>
      ) : (
        <div className="grid gap-3">
          {campaigns.map((c) => {
            const phases = (c.milestones as typeof DEFAULT_30_DAY_PHASES | null) ?? [];
            const day = Math.min(c.durationDays, Math.max(1, Math.ceil((Date.now() - c.startDate.getTime()) / 86_400_000) + 1));
            return (
              <Card key={c.id}>
                <CardTitle action={<Badge tone={c.status === "ACTIVE" ? "primary" : "neutral"}>{c.status}</Badge>}>
                  {c.name} {c.isDemo && <DemoBadge />}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {c.durationDays} hari · {format(c.startDate, "d MMM")} – {format(c.endDate, "d MMM yyyy")} · hari ke-{day}
                  {c.revenueTarget ? ` · target ${num(c.revenueTarget).toLocaleString("id-ID")}` : ""}
                </p>
                <div className="my-3"><Progress value={(day / c.durationDays) * 100} label="Waktu berjalan" /></div>
                {phases.length > 0 && (
                  <ol className="grid gap-2 md:grid-cols-4">
                    {phases.map((ph) => (
                      <li key={ph.phase} className={`rounded-md border p-3 text-xs ${day >= ph.startDay && day <= ph.endDay ? "border-primary bg-primary/5" : ""}`}>
                        <p className="font-semibold">Fase {ph.phase}: {ph.title}</p>
                        <p className="text-muted-foreground">Hari {ph.startDay}–{ph.endDay}</p>
                        <p className="mt-1">{ph.objectives.join(" · ")}</p>
                        <p className="mt-1 text-muted-foreground">KPI: {ph.kpis.join(", ")}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
