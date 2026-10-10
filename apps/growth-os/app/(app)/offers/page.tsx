import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { saveOffer, deleteOffer } from "@/lib/actions/business";
import { Badge, Card, DemoBadge, EmptyState, PageHeader } from "@/components/ui/primitives";
import { DeleteButton, EntityForm, type Field } from "@/components/ui/entity-form";
import { grossMargin } from "@/lib/calculations";
import { formatCurrency, formatPct, num } from "@/lib/utils";

export const metadata: Metadata = { title: "Offers" };
export const dynamic = "force-dynamic";

const fields: Field[] = [
  { name: "name", label: "Nama", required: true },
  { name: "category", label: "Kategori (mis. Design, Content, Digital, Production)", required: true },
  { name: "price", label: "Harga", type: "number", required: true },
  { name: "cost", label: "Biaya (HPP)", type: "number" },
  { name: "deliveryDays", label: "Waktu pengerjaan (hari)", type: "number" },
  { name: "revisionLimit", label: "Batas revisi", type: "number" },
  { name: "targetCustomer", label: "Target pelanggan" },
  { name: "isActive", label: "Aktif", type: "checkbox" },
  { name: "description", label: "Deskripsi", type: "textarea" },
  { name: "salesMessage", label: "Pesan penjualan", type: "textarea" },
];

export default async function OffersPage() {
  const userId = await requireUserId();
  const [offers, user] = await Promise.all([
    db.offer.findMany({ where: { userId }, orderBy: [{ isActive: "desc" }, { category: "asc" }, { name: "asc" }] }),
    db.user.findUniqueOrThrow({ where: { id: userId }, select: { currency: true, locale: true } }),
  ]);
  const money = (v: number) => formatCurrency(v, user.currency, user.locale);
  const categories = [...new Set(offers.map((o) => o.category))];

  return (
    <>
      <PageHeader title="Offers" description="Katalog produk dan layanan. Tambah, ubah, atau hapus sesuai bisnis Anda." actions={<EntityForm title="Penawaran baru" fields={fields} action={saveOffer} initial={{ isActive: true }} />} />
      {offers.length === 0 ? <EmptyState>Belum ada penawaran.</EmptyState> : categories.map((cat) => (
        <section key={cat} className="mb-6" aria-label={cat}>
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">{cat}</h2>
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {offers.filter((o) => o.category === cat).map((o) => {
              const m = grossMargin(num(o.price), num(o.cost));
              return (
                <li key={o.id}>
                  <Card className={o.isActive ? "" : "opacity-60"}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium">{o.name} {o.isDemo && <DemoBadge />}</h3>
                      <Badge tone={o.isActive ? "success" : "neutral"}>{o.isActive ? "Aktif" : "Nonaktif"}</Badge>
                    </div>
                    <p className="mt-2 text-xl font-semibold tabular-nums">{money(num(o.price))}</p>
                    <p className="text-xs text-muted-foreground">
                      Biaya {money(num(o.cost))} · Margin <span className={m !== null && m < 25 ? "text-warning" : ""}>{formatPct(m)}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {o.deliveryDays ? `${o.deliveryDays} hari` : "—"} · revisi {o.revisionLimit ?? "—"}
                    </p>
                    {o.salesMessage && <p className="mt-2 line-clamp-3 text-xs">“{o.salesMessage}”</p>}
                    <div className="mt-3 flex justify-end gap-1">
                      <EntityForm mode="edit" title="Edit penawaran" fields={fields} action={saveOffer} id={o.id} initial={{ ...o, price: num(o.price), cost: num(o.cost) }} />
                      <DeleteButton action={deleteOffer} id={o.id} />
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
