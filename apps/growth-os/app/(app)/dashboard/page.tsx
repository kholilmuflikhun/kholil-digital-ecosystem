import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { requireUserId } from "@/lib/auth/session";
import { getOverview } from "@/lib/data/overview";
import { formatCurrency, formatPct } from "@/lib/utils";
import { Badge, Card, CardTitle, EmptyState, PageHeader, Progress, Stat } from "@/components/ui/primitives";
import { ActivityChart, BarList, TrendChart } from "@/components/ui/charts";
import { Flywheel } from "@/components/flywheel";
import { NOT_ENOUGH_DATA } from "@/lib/calculations";

export const metadata: Metadata = { title: "Ringkasan" };
export const dynamic = "force-dynamic";

const focusIcon = { priority: "Prioritas", today: "Hari ini", revenue: "Pendapatan", retention: "Retensi" } as const;
const labelTone = { Kritis: "danger", "Perlu ditingkatkan": "warning", "Sesuai target": "primary", Unggul: "success" } as const;
const priorityLabel = { high: "Tinggi", medium: "Sedang", low: "Rendah" } as const;

export default async function DashboardPage() {
  const userId = await requireUserId();
  const o = await getOverview(userId);
  const money = (v: number) => formatCurrency(v, o.currency, o.locale);
  const revenueGoal = o.goalProgress.find((g) => g.category === "REVENUE");

  return (
    <>
      <PageHeader title="Ringkasan" description={format(new Date(), "EEEE, d MMMM yyyy")} />

      {/* KPI */}
      <section aria-label="Ringkasan" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Total pendapatan" value={money(o.finance.grossRevenue)}
          hint={revenueGoal ? `Sisa target: ${money(revenueGoal.remaining)}` : "Belum ada target pendapatan"}
        />
        <Stat
          label="Perubahan pendapatan bulan ini" value={formatPct(o.revenueGrowth, 0)}
          tone={o.revenueGrowth === null ? undefined : o.revenueGrowth >= 0 ? "success" : "danger"}
          hint={o.revenueGrowth === null ? NOT_ENOUGH_DATA : "vs bulan lalu"}
        />
        <Stat label="Nilai pesanan rata-rata" value={o.finance.averageOrderValue ? money(o.finance.averageOrderValue) : "—"} hint={`${o.finance.transactions} transaksi`} />
        <Stat label="Profit bersih" value={money(o.finance.netProfit)} hint={`Margin ${formatPct(o.finance.profitMargin, 0)}`} />
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Fokus hari ini */}
        <Card className="lg:col-span-1">
          <CardTitle>Fokus Hari Ini</CardTitle>
          {o.focus.length === 0 ? (
            <EmptyState>Belum ada rekomendasi. Tambahkan prospek, transaksi, atau konten.</EmptyState>
          ) : (
            <ul className="grid gap-2">
              {o.focus.map((f) => (
                <li key={f.text}>
                  <Link href={f.href} className="block rounded-md border p-3 hover:bg-muted">
                    <span className="text-xs text-muted-foreground">{focusIcon[f.kind]}</span>
                    <span className="block text-sm font-medium">{f.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 border-t pt-3">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Skor aktivitas hari ini</span>
              {o.execution.label ? <Badge tone={labelTone[o.execution.label]}>{o.execution.label}</Badge> : <Badge>—</Badge>}
            </div>
            <Progress value={o.execution.score ?? 0} tone={o.execution.label ? labelTone[o.execution.label] : "neutral"} label="Skor aktivitas" />
            <p className="mt-1 text-xs text-muted-foreground">
              {o.execution.planned > 0 ? `${o.execution.done} dari ${o.execution.planned} aktivitas selesai` : "Belum ada tugas hari ini"}
            </p>
          </div>
        </Card>

        {/* Progres goal */}
        <Card className="lg:col-span-2">
          <CardTitle action={<Link href="/goals" className="text-xs text-primary hover:underline">Kelola target</Link>}>Progres target</CardTitle>
          {o.goalProgress.length === 0 ? (
            <EmptyState>Belum ada target aktif. Tambahkan target untuk memantau progres.</EmptyState>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {o.goalProgress.slice(0, 6).map((g) => (
                <li key={g.id}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="truncate font-medium">{g.name}</span>
                    <span className="tabular-nums text-muted-foreground">{g.progressPct.toFixed(0)}%</span>
                  </div>
                  <Progress value={g.progressPct} tone={g.onTrack ? "success" : "warning"} label={g.name} />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {g.current.toLocaleString(o.locale)} / {g.target.toLocaleString(o.locale)} {g.metric} · {g.daysLeft} hari tersisa · {g.dailyRequiredPace.toLocaleString(o.locale, { maximumFractionDigits: 1 })}/hari
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Funnel */}
      <Card className="mt-4">
        <CardTitle>Funnel Penjualan</CardTitle>
        <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-9">
          {o.funnel.map((s, i) => (
            <li key={s.key} className="relative rounded-md border bg-muted/40 p-3 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-semibold tabular-nums">{s.count.toLocaleString(o.locale)}</p>
              <p className="text-xs text-muted-foreground">{i === 0 ? "" : s.conversionFromPrev === null ? "—" : `${s.conversionFromPrev.toFixed(0)}%`}</p>
            </li>
          ))}
        </ol>
      </Card>

      {/* Revenue & aktivitas */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Tren Pendapatan & Profit (6 bulan)</CardTitle>
          <TrendChart data={o.monthly} series={[{ key: "revenue", label: "Pendapatan" }, { key: "profit", label: "Profit" }]} />
        </Card>
        <Card>
          <CardTitle>Pendapatan per produk atau layanan</CardTitle>
          {o.revenueByOffer.length === 0 ? <EmptyState>{NOT_ENOUGH_DATA}</EmptyState> : <BarList data={o.revenueByOffer.slice(0, 6)} />}
        </Card>
        <Card>
          <CardTitle>Aktivitas 7 hari</CardTitle>
          {o.activity7.length === 0 ? (
            <EmptyState>{NOT_ENOUGH_DATA}</EmptyState>
          ) : (
            <ActivityChart data={o.activity7.map((a) => ({ day: format(a.date, "dd/MM"), contacted: a.prospectsContacted, followUps: a.followUps, proposals: a.proposals }))} />
          )}
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
            <div><dt>Proposal</dt><dd className="text-base font-semibold text-foreground">{o.activity7.reduce((s, a) => s + a.proposals, 0)}</dd></div>
            <div><dt>Konten terbit</dt><dd className="text-base font-semibold text-foreground">{o.publishedCount}</dd></div>
            <div><dt>Proyek selesai</dt><dd className="text-base font-semibold text-foreground">{o.projectsCompleted}</dd></div>
          </dl>
        </Card>
        <Card>
          <CardTitle>Perhitungan target penjualan</CardTitle>
          {o.salesMath && revenueGoal ? (
            <>
              <p className="mb-3 text-sm text-muted-foreground">Untuk menutup sisa {money(revenueGoal.remaining)} pada goal “{revenueGoal.name}”:</p>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Transaksi", o.salesMath.requiredTransactions],
                  ["Lead terkualifikasi", o.salesMath.requiredQualifiedLeads],
                  ["Prospek", o.salesMath.requiredProspects],
                  ["Outreach", o.salesMath.requiredOutreach],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-md border p-2 text-center">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="text-lg font-semibold tabular-nums">{Number(v).toLocaleString(o.locale)}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : (
            <EmptyState>Tetapkan target pendapatan dan lengkapi nilai pesanan serta konversi di <Link className="text-primary underline" href="/settings">Pengaturan</Link>.</EmptyState>
          )}
        </Card>
      </div>

      {/* Insight & rekomendasi */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Insight otomatis</CardTitle>
          {o.insights.length === 0 ? <EmptyState>{NOT_ENOUGH_DATA}</EmptyState> : (
            <ul className="grid gap-2 text-sm">
              {o.insights.map((i) => (
                <li key={i.id} className="flex gap-2">
                  <Badge tone={i.tone === "positive" ? "success" : i.tone === "warning" ? "warning" : "neutral"}>{i.tone === "positive" ? "＋" : "!"}</Badge>
                  <span>{i.text}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardTitle>Rekomendasi</CardTitle>
          {o.recommendations.length === 0 ? <EmptyState>{NOT_ENOUGH_DATA}</EmptyState> : (
            <ul className="grid gap-2 text-sm">
              {o.recommendations.map((r) => (
                <li key={r.id} className="flex gap-2">
                  <Badge tone={r.priority === "high" ? "danger" : r.priority === "medium" ? "warning" : "neutral"}>{priorityLabel[r.priority]}</Badge>
                  <span>{r.text}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="mt-4">
        <CardTitle>Siklus pertumbuhan</CardTitle>
        <Flywheel />
      </Card>
    </>
  );
}
