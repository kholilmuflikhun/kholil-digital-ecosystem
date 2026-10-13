import type { Metadata } from "next";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { getOverview } from "@/lib/data/overview";
import { saveRevenue, deleteRevenue, saveExpense, deleteExpense, savePayment, deletePayment } from "@/lib/actions/business";
import { Badge, Card, CardTitle, DemoBadge, EmptyState, PageHeader, Stat, Table, Td, Th } from "@/components/ui/primitives";
import { DeleteButton, EntityForm, type Field } from "@/components/ui/entity-form";
import { BarList, TrendChart } from "@/components/ui/charts";
import { PAYMENT_STATUS, label, pick } from "@/lib/constants/options";
import { formatCurrency, formatPct, num } from "@/lib/utils";

export const metadata: Metadata = { title: "Revenue" };
export const dynamic = "force-dynamic";
const PAGE_SIZE = 50;

export default async function RevenuePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const userId = await requireUserId();
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const [rows, total, customers, offers, deals, o, expenses] = await Promise.all([
    db.revenue.findMany({ where: { userId }, include: { customer: { select: { name: true, businessName: true } }, offer: { select: { name: true } }, payments: { orderBy: { paidAt: "asc" } } }, orderBy: { date: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    db.revenue.count({ where: { userId } }),
    db.customer.findMany({ where: { userId }, select: { id: true, name: true, businessName: true } }),
    db.offer.findMany({ where: { userId }, select: { id: true, name: true } }),
    db.deal.findMany({ where: { userId, stage: "WON" }, select: { id: true, name: true } }),
    getOverview(userId),
    db.expense.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 20 }),
  ]);
  const money = (v: number) => formatCurrency(v, o.currency, o.locale);
  const f = o.finance;

  const fields: Field[] = [
    { name: "date", label: "Tanggal", type: "date", required: true },
    { name: "customerId", label: "Pelanggan", type: "select", options: pick(customers.map((c) => ({ id: c.id, name: c.businessName ?? c.name }))) },
    { name: "offerId", label: "Produk/layanan", type: "select", options: pick(offers) },
    { name: "dealId", label: "Deal", type: "select", options: pick(deals) },
    { name: "grossRevenue", label: "Pendapatan kotor", type: "number", required: true },
    { name: "cost", label: "Biaya", type: "number" },
    { name: "paymentStatus", label: "Status pembayaran", type: "select", required: true, options: PAYMENT_STATUS },
    { name: "paymentMethod", label: "Metode pembayaran" },
    { name: "reference", label: "Invoice/referensi" },
    { name: "channel", label: "Kanal" },
    { name: "dueDate", label: "Jatuh tempo", type: "date" },
    { name: "notes", label: "Catatan", type: "textarea" },
  ];
  const expenseFields: Field[] = [
    { name: "date", label: "Tanggal", type: "date", required: true },
    { name: "category", label: "Kategori (iklan, tools, dll.)", required: true },
    { name: "amount", label: "Jumlah", type: "number", required: true },
    { name: "note", label: "Catatan", type: "textarea" },
  ];
  const payFields = (revenueId: string, label: string, outstanding: number): Field[] => [
    { name: "revenueId", label: "Transaksi", type: "select", required: true, options: [{ value: revenueId, label }] },
    { name: "amount", label: `Jumlah dibayar (sisa ${money(outstanding)})`, type: "number", required: true },
    { name: "paidAt", label: "Tanggal bayar", type: "date", required: true },
    { name: "method", label: "Metode" },
    { name: "note", label: "Catatan", type: "textarea" },
  ];
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Revenue"
        actions={
          <div className="flex gap-2">
            <EntityForm title="Biaya operasional" fields={expenseFields} action={saveExpense} triggerLabel="Biaya" />
            <EntityForm title="Transaksi baru" fields={fields} action={saveRevenue} triggerLabel="Transaksi" initial={{ paymentStatus: "PENDING" }} />
          </div>
        }
      />

      <section aria-label="Ringkasan keuangan" className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Pendapatan kotor" value={money(f.grossRevenue)} />
        <Stat label="Total biaya" value={money(f.totalCosts)} hint={`+ operasional ${money(f.operatingExpenses)}`} />
        <Stat label="Laba kotor / bersih" value={money(f.grossProfit)} hint={`Bersih ${money(f.netProfit)}`} />
        <Stat label="Margin" value={formatPct(f.profitMargin)} hint={`AOV ${f.averageOrderValue ? money(f.averageOrderValue) : "—"}`} />
        <Stat label="Belum dibayar" value={money(f.outstanding)} tone={f.outstanding > 0 ? "warning" : undefined} />
      </section>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card><CardTitle>Tren Pendapatan & Profit</CardTitle><TrendChart data={o.monthly} series={[{ key: "revenue", label: "Pendapatan" }, { key: "profit", label: "Profit" }]} /></Card>
        <Card><CardTitle>Pendapatan per Pelanggan</CardTitle>{o.revenueByCustomer.length ? <BarList data={o.revenueByCustomer} /> : <EmptyState>Belum ada data.</EmptyState>}</Card>
      </div>

      {rows.length === 0 ? <EmptyState>Belum ada transaksi.</EmptyState> : (
        <Table>
          <thead><tr><Th>Tanggal</Th><Th>Pelanggan</Th><Th>Layanan</Th><Th>Kotor</Th><Th>Biaya</Th><Th>Bersih</Th><Th>Terbayar</Th><Th>Status</Th><Th>Ref</Th><Th><span className="sr-only">Aksi</span></Th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const paid = r.payments.reduce((s, x) => s + num(x.amount), 0);
              const outstanding = Math.max(0, num(r.grossRevenue) - paid);
              const rowLabel = `${r.reference ?? format(r.date, "d MMM yyyy")}`;
              return (
              <tr key={r.id}>
                <Td>{format(r.date, "d MMM yyyy")}</Td>
                <Td>{r.customer?.businessName ?? r.customer?.name ?? "—"} {r.isDemo && <DemoBadge />}</Td>
                <Td className="text-xs">{r.offer?.name ?? "—"}</Td>
                <Td className="tabular-nums">{money(num(r.grossRevenue))}</Td>
                <Td className="tabular-nums">{money(num(r.cost))}</Td>
                <Td className="tabular-nums">{money(num(r.grossRevenue) - num(r.cost))}</Td>
                <Td className="tabular-nums text-xs">
                  {money(paid)}
                  {r.payments.length > 0 && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-primary">{r.payments.length} pembayaran</summary>
                      <ul className="mt-1 space-y-1">
                        {r.payments.map((x) => (
                          <li key={x.id} className="flex items-center justify-between gap-2">
                            <span>{format(x.paidAt, "d MMM yy")} · {money(num(x.amount))}</span>
                            <DeleteButton action={deletePayment} id={x.id} label="Hapus pembayaran" confirmText="Hapus pembayaran ini?" />
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </Td>
                <Td><Badge tone={r.paymentStatus === "PAID" ? "success" : r.paymentStatus === "OVERDUE" ? "danger" : r.paymentStatus === "CANCELLED" ? "neutral" : "warning"}>{label(PAYMENT_STATUS, r.paymentStatus)}</Badge></Td>
                <Td className="text-xs">{r.reference ?? "—"}</Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    {outstanding > 0 && r.paymentStatus !== "CANCELLED" && (
                      <EntityForm title="Catat pembayaran" triggerLabel="Bayar" fields={payFields(r.id, rowLabel, outstanding)} action={savePayment} initial={{ revenueId: r.id, paidAt: new Date(), amount: outstanding }} />
                    )}
                    <EntityForm mode="edit" title="Edit transaksi" fields={fields} action={saveRevenue} id={r.id} initial={{ ...r, grossRevenue: num(r.grossRevenue), cost: num(r.cost) }} />
                    <DeleteButton action={deleteRevenue} id={r.id} />
                  </div>
                </Td>
              </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <section aria-label="Biaya operasional" className="mt-8">
        <h2 className="mb-3 text-sm font-semibold tracking-tight">Biaya operasional terbaru</h2>
        {expenses.length === 0 ? <EmptyState>Belum ada biaya operasional.</EmptyState> : (
          <Table>
            <thead><tr><Th>Tanggal</Th><Th>Kategori</Th><Th>Jumlah</Th><Th>Catatan</Th><Th><span className="sr-only">Aksi</span></Th></tr></thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id}>
                  <Td>{format(e.date, "d MMM yyyy")}</Td>
                  <Td>{e.category} {e.isDemo && <DemoBadge />}</Td>
                  <Td className="tabular-nums">{money(num(e.amount))}</Td>
                  <Td className="text-xs">{e.note ?? "—"}</Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <EntityForm mode="edit" title="Edit biaya" fields={expenseFields} action={saveExpense} id={e.id} initial={{ ...e, amount: num(e.amount) }} />
                      <DeleteButton action={deleteExpense} id={e.id} />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
      {pages > 1 && (
        <nav aria-label="Halaman" className="mt-4 flex items-center justify-center gap-2 text-sm">
          {page > 1 && <a className="rounded border px-3 py-1 hover:bg-muted" href={`?page=${page - 1}`}>← Sebelumnya</a>}
          <span className="text-muted-foreground">Halaman {page} / {pages}</span>
          {page < pages && <a className="rounded border px-3 py-1 hover:bg-muted" href={`?page=${page + 1}`}>Berikutnya →</a>}
        </nav>
      )}
    </>
  );
}
