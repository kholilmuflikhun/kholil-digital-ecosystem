import type { Metadata } from "next";
import { format, startOfWeek } from "date-fns";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { getOverview } from "@/lib/data/overview";
import { Badge, Card, CardTitle, EmptyState, PageHeader, Stat } from "@/components/ui/primitives";
import { BarList, TrendChart } from "@/components/ui/charts";
import { WeeklyReview } from "@/components/analytics/weekly-review";
import { Flywheel } from "@/components/flywheel";
import { findBiggestLeak, NOT_ENOUGH_DATA } from "@/lib/calculations";
import { formatCurrency, formatPct } from "@/lib/utils";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const userId = await requireUserId();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const [o, review] = await Promise.all([
    getOverview(userId),
    db.weeklyReview.findUnique({ where: { userId_weekStart: { userId, weekStart } } }),
  ]);
  const money = (v: number) => formatCurrency(v, o.currency, o.locale);
  const leak = findBiggestLeak(o.funnel);
  const m = o.thisMonth;

  const totalHours = o.activity7.reduce((s, a) => s + Number(a.hoursWorked), 0);
  const bestChannel = o.revenueByChannel[0];
  const offerStats = o.revenueByOffer;

  return (
    <>
      <PageHeader title="Analytics" description="Peninjauan bulanan, kebocoran funnel, dan review mingguan." />

      <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Review bulanan · {format(new Date(), "MMMM yyyy")}</h2>
      <section aria-label="Review bulanan" className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Pendapatan" value={money(m.grossRevenue)} hint={o.revenueGrowth === null ? NOT_ENOUGH_DATA : `${o.revenueGrowth >= 0 ? "+" : ""}${o.revenueGrowth.toFixed(0)}% vs bulan lalu`} tone={o.revenueGrowth === null ? undefined : o.revenueGrowth >= 0 ? "success" : "danger"} />
        <Stat label="Profit / margin" value={money(m.grossProfit)} hint={formatPct(m.grossRevenue > 0 ? (m.grossProfit / m.grossRevenue) * 100 : null)} />
        <Stat label="Transaksi / AOV" value={m.transactions} hint={m.averageOrderValue ? money(m.averageOrderValue) : "—"} />
        <Stat label="Pelanggan repeat" value={formatPct(o.customers.repeatRate)} hint={`${o.customers.buyers} pelanggan membeli`} />
        <Stat label="Pipeline tertimbang" value={money(o.pipeline.weightedPipeline)} hint={`Win rate ${formatPct(o.pipeline.winRate)}`} />
        <Stat label="Konten terbit" value={o.publishedCount} hint={`${o.contentStats.reduce((s, c) => s + c.leads, 0)} lead dari konten`} />
        <Stat label="Jam kerja (7 hari)" value={totalHours.toFixed(1)} hint={totalHours > 0 ? `${money(o.thisMonth.grossProfit / Math.max(totalHours, 1))}/jam (indikatif)` : NOT_ENOUGH_DATA} />
        <Stat label="Kanal terbaik" value={bestChannel?.name ?? "—"} hint={bestChannel ? money(bestChannel.value) : NOT_ENOUGH_DATA} />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardTitle>Perbandingan Bulanan</CardTitle><TrendChart data={o.monthly} series={[{ key: "revenue", label: "Pendapatan" }, { key: "cost", label: "Biaya" }, { key: "profit", label: "Profit" }]} /></Card>
        <Card><CardTitle>Pendapatan per Kanal</CardTitle>{o.revenueByChannel.length ? <BarList data={o.revenueByChannel} /> : <EmptyState>{NOT_ENOUGH_DATA}</EmptyState>}</Card>

        <Card>
          <CardTitle>Kebocoran Funnel</CardTitle>
          {leak ? (
            <p className="text-sm">Konversi terendah ada pada tahap <strong>{leak.label}</strong> ({leak.conversionFromPrev?.toFixed(0)}% dari tahap sebelumnya). Fokuskan perbaikan di sini lebih dulu.</p>
          ) : <EmptyState>{NOT_ENOUGH_DATA}</EmptyState>}
          <ol className="mt-3 grid gap-1 text-sm">
            {o.funnel.map((s, i) => (
              <li key={s.key} className="flex justify-between border-b py-1 last:border-0">
                <span>{s.label}</span>
                <span className="tabular-nums text-muted-foreground">{s.count.toLocaleString(o.locale)}{i > 0 && s.conversionFromPrev !== null ? ` · ${s.conversionFromPrev.toFixed(0)}%` : ""}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <CardTitle>Atribusi Konten → Pendapatan</CardTitle>
          {o.contentStats.filter((c) => c.leads > 0).length === 0 ? <EmptyState>{NOT_ENOUGH_DATA}</EmptyState> : (
            <ul className="grid gap-2 text-sm">
              {[...o.contentStats].filter((c) => c.leads > 0).sort((a, b) => b.revenue - a.revenue || b.leads - a.leads).slice(0, 6).map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2 rounded-md border p-2">
                  <span className="truncate">{c.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{c.leads} lead · {c.deals} deal · {money(c.revenue)}{c.leadRate !== null ? ` · ${c.leadRate.toFixed(2)}% lead/reach` : ""}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardTitle>Penawaran: Unggulan vs Lemah</CardTitle>
          {offerStats.length === 0 ? <EmptyState>{NOT_ENOUGH_DATA}</EmptyState> : (
            <ul className="grid gap-1 text-sm">
              {offerStats.map((s, i) => (
                <li key={s.name} className="flex items-center justify-between">
                  <span>{s.name}</span>
                  <span className="flex items-center gap-2 tabular-nums">{money(s.value)}{i === 0 && <Badge tone="success">Unggulan</Badge>}{i === offerStats.length - 1 && offerStats.length > 2 && <Badge tone="warning">Terlemah</Badge>}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardTitle>Insight & Rekomendasi</CardTitle>
          {o.insights.length + o.recommendations.length === 0 ? <EmptyState>{NOT_ENOUGH_DATA}</EmptyState> : (
            <ul className="grid gap-2 text-sm">
              {o.insights.map((i) => <li key={i.id}>• {i.text}</li>)}
              {o.recommendations.map((r) => <li key={r.id} className="text-primary">➜ {r.text}</li>)}
            </ul>
          )}
        </Card>
      </div>

      <Card className="mt-4">
        <CardTitle>Review Mingguan · minggu {format(weekStart, "d MMM")}</CardTitle>
        <WeeklyReview weekStart={format(weekStart, "yyyy-MM-dd")} initial={(review?.answers as Record<string, string> | undefined) ?? {}} />
      </Card>

      <Card className="mt-4"><CardTitle>Growth Flywheel</CardTitle><Flywheel /></Card>
    </>
  );
}
