import type { Metadata } from "next";
import { format, startOfDay, endOfDay } from "date-fns";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { executionScore, scoreLabel } from "@/lib/calculations";
import { saveDailyActivity, saveTask } from "@/lib/actions/business";
import { Badge, Card, EmptyState, PageHeader, Progress, Stat } from "@/components/ui/primitives";
import { EntityForm, type Field } from "@/components/ui/entity-form";
import { TaskRow } from "@/components/daily/task-row";
import { PRIORITY, TASK_CATEGORY, label } from "@/lib/constants/options";
import { num } from "@/lib/utils";

export const metadata: Metadata = { title: "Aktivitas Harian" };
export const dynamic = "force-dynamic";

const taskFields: Field[] = [
  { name: "title", label: "Tugas", required: true, full: true },
  { name: "category", label: "Kategori", type: "select", required: true, options: TASK_CATEGORY },
  { name: "priority", label: "Prioritas", type: "select", required: true, options: PRIORITY },
  { name: "estimatedMinutes", label: "Estimasi (menit)", type: "number" },
];

const scoreFields: Field[] = [
  { name: "date", label: "Tanggal", type: "date", required: true },
  { name: "prospectsContacted", label: "Prospek dihubungi", type: "number" },
  { name: "responses", label: "Respons", type: "number" },
  { name: "qualifiedLeads", label: "Lead berkualitas", type: "number" },
  { name: "followUps", label: "Tindak lanjut", type: "number" },
  { name: "proposals", label: "Proposal", type: "number" },
  { name: "dealsWon", label: "Transaksi berhasil", type: "number" },
  { name: "contentPublished", label: "Konten terbit", type: "number" },
  { name: "hoursWorked", label: "Jam kerja", type: "number" },
  { name: "notes", label: "Catatan", type: "textarea" },
];

const tone = { Kritis: "danger", "Perlu ditingkatkan": "warning", "Sesuai target": "primary", Unggul: "success" } as const;

export default async function DailyPage() {
  const userId = await requireUserId();
  const now = new Date();
  const [tasks, log, settings, revenueToday] = await Promise.all([
    db.task.findMany({ where: { userId, dueDate: { gte: startOfDay(now), lte: endOfDay(now) } }, orderBy: [{ priority: "desc" }, { createdAt: "asc" }] }),
    db.dailyActivity.findUnique({ where: { userId_date: { userId, date: startOfDay(now) } } }),
    db.userSettings.findUnique({ where: { userId } }),
    db.revenue.aggregate({ where: { userId, date: { gte: startOfDay(now), lte: endOfDay(now) }, paymentStatus: { not: "CANCELLED" } }, _sum: { grossRevenue: true, cost: true } }),
  ]);

  const planned = tasks.filter((t) => t.isKpiActivity && t.status !== "SKIPPED").length;
  const done = tasks.filter((t) => t.isKpiActivity && t.status === "DONE").length;
  const score = executionScore(done, planned);
  const lbl = score === null ? null : scoreLabel(score, settings ? { critical: settings.scoreCritical, needsWork: settings.scoreNeedsWork, onTrack: settings.scoreOnTrack } : undefined);
  const revToday = num(revenueToday._sum.grossRevenue);
  const profitToday = revToday - num(revenueToday._sum.cost);

  const groups = Object.fromEntries(TASK_CATEGORY.map((c) => [c.value, tasks.filter((t) => t.category === c.value)]));

  return (
    <>
      <PageHeader
        title="Aktivitas Harian"
        description={format(now, "EEEE, d MMMM yyyy")}
        actions={
          <div className="flex gap-2">
            <EntityForm title="Catatan harian" fields={scoreFields} action={saveDailyActivity} triggerLabel="Catatan" initial={{ date: format(now, "yyyy-MM-dd"), ...(log ?? {}), hoursWorked: num(log?.hoursWorked) }} />
            <EntityForm title="Tugas baru" fields={taskFields} action={saveTask} triggerLabel="Tugas" initial={{ category: "OTHER", priority: "MEDIUM" }} />
          </div>
        }
      />

      <Card className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Skor eksekusi</h2>
          {lbl ? <Badge tone={tone[lbl]}>{score}% · {lbl}</Badge> : <Badge>Belum ada tugas</Badge>}
        </div>
        <Progress value={score ?? 0} tone={lbl ? tone[lbl] : "neutral"} label="Skor eksekusi" />
        <p className="mt-1 text-xs text-muted-foreground">{done} dari {planned} aktivitas KPI selesai. Tugas yang dilewati tidak dihitung.</p>
      </Card>

      <section aria-label="Ringkasan aktivitas" className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <Stat label="Prospek dihubungi" value={log?.prospectsContacted ?? 0} />
        <Stat label="Respons" value={log?.responses ?? 0} />
        <Stat label="Lead berkualitas" value={log?.qualifiedLeads ?? 0} />
        <Stat label="Tindak lanjut" value={log?.followUps ?? 0} />
        <Stat label="Proposal" value={log?.proposals ?? 0} />
        <Stat label="Transaksi berhasil" value={log?.dealsWon ?? 0} />
        <Stat label="Pendapatan" value={revToday.toLocaleString("id-ID")} />
        <Stat label="Profit" value={profitToday.toLocaleString("id-ID")} />
        <Stat label="Konten terbit" value={log?.contentPublished ?? 0} />
        <Stat label="Tugas selesai" value={tasks.filter((t) => t.status === "DONE").length} />
        <Stat label="Jam kerja" value={num(log?.hoursWorked)} />
      </section>

      {tasks.length === 0 ? (
        <EmptyState>Belum ada tugas hari ini. Tambahkan aktivitas untuk pendapatan, penjualan, prospek, tindak lanjut, konten, pengerjaan, atau strategi.</EmptyState>
      ) : (
        <div className="grid gap-5">
          {TASK_CATEGORY.filter((c) => groups[c.value].length > 0).map((c) => (
            <section key={c.value} aria-label={c.label}>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">{c.label}</h2>
              <ul className="grid gap-2">
                {groups[c.value].map((t) => (
                  <TaskRow key={t.id} id={t.id} title={t.title} category={label(TASK_CATEGORY, t.category)} priority={t.priority} status={t.status} minutes={t.estimatedMinutes} demo={t.isDemo} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
