import type { Metadata } from "next";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { saveCustomer, deleteCustomer } from "@/lib/actions/crm";
import { Badge, DemoBadge, EmptyState, PageHeader, Stat, Table, Td, Th } from "@/components/ui/primitives";
import { DeleteButton, EntityForm, type Field } from "@/components/ui/entity-form";
import { formatCurrency, formatPct, num } from "@/lib/utils";

export const metadata: Metadata = { title: "Customers" };
export const dynamic = "force-dynamic";

const fields: Field[] = [
  { name: "name", label: "Nama", required: true },
  { name: "businessName", label: "Nama bisnis" },
  { name: "whatsapp", label: "WhatsApp" },
  { name: "email", label: "Email", type: "email" },
  { name: "instagram", label: "Instagram" },
  { name: "referralSource", label: "Sumber referral" },
  { name: "notes", label: "Catatan", type: "textarea" },
];

export default async function CustomersPage() {
  const userId = await requireUserId();
  const [customers, user, settings] = await Promise.all([
    db.customer.findMany({
      where: { userId },
      include: {
        revenues: { where: { paymentStatus: { not: "CANCELLED" } }, select: { grossRevenue: true, cost: true, date: true } },
        projects: { select: { id: true } },
        testimonials: { select: { id: true } },
        referredBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.user.findUniqueOrThrow({ where: { id: userId }, select: { currency: true, locale: true } }),
    db.userSettings.findUnique({ where: { userId } }),
  ]);
  const money = (v: number) => formatCurrency(v, user.currency, user.locale);
  const window = settings?.repeatWindowDays ?? 60;

  const rows = customers.map((c) => {
    const revenue = c.revenues.reduce((s, r) => s + num(r.grossRevenue), 0);
    const profit = revenue - c.revenues.reduce((s, r) => s + num(r.cost), 0);
    const last = c.revenues.reduce<Date | null>((m, r) => (!m || r.date > m ? r.date : m), null);
    return { c, revenue, profit, orders: c.revenues.length, aov: c.revenues.length ? revenue / c.revenues.length : null, last };
  });
  const buyers = rows.filter((r) => r.orders > 0);
  const repeat = buyers.filter((r) => r.orders > 1).length;
  const totalRevenue = buyers.reduce((s, r) => s + r.revenue, 0);

  return (
    <>
      <PageHeader title="Customers" actions={<EntityForm title="Pelanggan baru" fields={fields} action={saveCustomer} />} />

      <section aria-label="Nilai pelanggan" className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Pelanggan" value={customers.length} hint={`${buyers.length} sudah membeli`} />
        <Stat label="Repeat purchase rate" value={buyers.length ? formatPct((repeat / buyers.length) * 100) : "—"} hint={`${repeat} pelanggan repeat`} />
        <Stat label="Rata-rata pendapatan/pelanggan" value={buyers.length ? money(totalRevenue / buyers.length) : "—"} />
        <Stat label="Customer lifetime value (rata-rata)" value={buyers.length ? money(rows.reduce((s, r) => s + r.profit, 0) / buyers.length) : "—"} hint="Berdasarkan profit historis" />
      </section>

      {customers.length === 0 ? <EmptyState>Belum ada pelanggan. Pelanggan dibuat otomatis saat deal dipindah ke Won.</EmptyState> : (
        <Table>
          <thead><tr><Th>Pelanggan</Th><Th>Pendapatan</Th><Th>Profit</Th><Th>Order</Th><Th>AOV</Th><Th>Pembelian terakhir</Th><Th>Proyek</Th><Th>Testimoni</Th><Th><span className="sr-only">Aksi</span></Th></tr></thead>
          <tbody>
            {rows.map(({ c, revenue, profit, orders, aov, last }) => {
              const stale = last && Date.now() - last.getTime() > window * 86_400_000;
              return (
                <tr key={c.id}>
                  <Td>
                    <div className="font-medium">{c.businessName ?? c.name} {c.isDemo && <DemoBadge />}</div>
                    <div className="text-xs text-muted-foreground">{c.name}{c.referredBy ? ` · referral dari ${c.referredBy.name}` : c.referralSource ? ` · ${c.referralSource}` : ""}</div>
                  </Td>
                  <Td className="tabular-nums">{money(revenue)}</Td>
                  <Td className="tabular-nums">{money(profit)}</Td>
                  <Td>{orders}</Td>
                  <Td className="tabular-nums">{aov ? money(aov) : "—"}</Td>
                  <Td>{last ? <Badge tone={stale ? "warning" : "neutral"}>{format(last, "d MMM yyyy")}</Badge> : "—"}</Td>
                  <Td>{c.projects.length}</Td>
                  <Td>{c.testimonials.length}</Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <EntityForm mode="edit" title="Edit pelanggan" fields={fields} action={saveCustomer} id={c.id} initial={c} />
                      <DeleteButton action={deleteCustomer} id={c.id} />
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </>
  );
}
