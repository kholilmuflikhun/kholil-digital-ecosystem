import type { Metadata } from "next";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { saveTestimonial, deleteTestimonial, saveReferral, deleteReferral } from "@/lib/actions/retention";
import { getOverview } from "@/lib/data/overview";
import { Badge, Card, CardTitle, DemoBadge, EmptyState, PageHeader, Stat, Table, Td, Th } from "@/components/ui/primitives";
import { DeleteButton, EntityForm, type Field } from "@/components/ui/entity-form";
import { formatCurrency, num } from "@/lib/utils";
import { pick } from "@/lib/constants/options";

export const metadata: Metadata = { title: "Testimoni & Rujukan" };
export const dynamic = "force-dynamic";

export default async function RetentionPage() {
  const userId = await requireUserId();
  const [testimonials, referrals, customers, prospects, o] = await Promise.all([
    db.testimonial.findMany({ where: { userId }, include: { customer: { select: { name: true, businessName: true } } }, orderBy: { receivedAt: "desc" }, take: 100 }),
    db.referral.findMany({ where: { userId }, include: { referrer: { select: { name: true, businessName: true } } }, orderBy: { createdAt: "desc" }, take: 100 }),
    db.customer.findMany({ where: { userId }, select: { id: true, name: true, businessName: true }, orderBy: { name: "asc" } }),
    db.prospect.findMany({ where: { userId }, select: { id: true, name: true }, orderBy: { createdAt: "desc" }, take: 200 }),
    getOverview(userId),
  ]);
  const money = (v: number) => formatCurrency(v, o.currency, o.locale);
  const customerOptions = pick(customers.map((c) => ({ id: c.id, name: c.businessName ?? c.name })));

  const testimonialFields: Field[] = [
    { name: "customerId", label: "Pelanggan", type: "select", required: true, options: customerOptions },
    { name: "quote", label: "Testimoni (kutipan pelanggan)", type: "textarea", required: true },
    { name: "rating", label: "Rating", type: "select", options: [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n} / 5` })) },
    { name: "receivedAt", label: "Tanggal diterima", type: "date" },
    { name: "isPublic", label: "Izin publikasi telah diberikan", type: "checkbox" },
  ];
  const referralFields: Field[] = [
    { name: "referrerId", label: "Pelanggan yang merekomendasikan", type: "select", required: true, options: customerOptions },
    { name: "referredName", label: "Nama yang direferensikan", required: true },
    { name: "referredProspectId", label: "Terhubung ke prospek", type: "select", options: pick(prospects) },
    { name: "resultingRevenue", label: "Pendapatan dari rujukan", type: "number" },
  ];

  const referralRevenue = referrals.reduce((s, r) => s + num(r.resultingRevenue), 0);

  return (
    <>
      <PageHeader
        title="Testimoni & Rujukan"
        description="Catat testimoni dan rujukan. Tampilkan testimoni hanya dengan izin pelanggan."
        actions={
          <div className="flex gap-2">
            <EntityForm title="Rujukan baru" fields={referralFields} action={saveReferral} triggerLabel="Rujukan" />
            <EntityForm title="Testimoni baru" fields={testimonialFields} action={saveTestimonial} triggerLabel="Testimoni" />
          </div>
        }
      />
      <section aria-label="Ringkasan" className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Testimoni" value={testimonials.length} hint={`${testimonials.filter((t) => t.isPublic).length} boleh publik`} />
        <Stat label="Rujukan" value={referrals.length} />
        <Stat label="Pendapatan dari rujukan" value={money(referralRevenue)} />
        <Stat label="Pelanggan" value={customers.length} />
      </section>

      <Card className="mb-6">
        <CardTitle>Testimoni</CardTitle>
        {testimonials.length === 0 ? <EmptyState>Belum ada testimoni.</EmptyState> : (
          <Table>
            <thead><tr><Th>Pelanggan</Th><Th>Kutipan</Th><Th>Rating</Th><Th>Publik</Th><Th>Diterima</Th><Th><span className="sr-only">Aksi</span></Th></tr></thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id}>
                  <Td>{t.customer.businessName ?? t.customer.name} {t.isDemo && <DemoBadge />}</Td>
                  <Td className="max-w-md text-sm">“{t.quote}”</Td>
                  <Td>{t.rating ? `${t.rating}/5` : "—"}</Td>
                  <Td><Badge tone={t.isPublic ? "success" : "neutral"}>{t.isPublic ? "Ya" : "Tidak"}</Badge></Td>
                  <Td>{format(t.receivedAt, "d MMM yyyy")}</Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <EntityForm mode="edit" title="Edit testimoni" fields={testimonialFields} action={saveTestimonial} id={t.id} initial={{ ...t, rating: t.rating ?? "" }} />
                      <DeleteButton action={deleteTestimonial} id={t.id} />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Card>
        <CardTitle>Rujukan</CardTitle>
        {referrals.length === 0 ? <EmptyState>Belum ada rujukan.</EmptyState> : (
          <Table>
            <thead><tr><Th>Pemberi rujukan</Th><Th>Nama rujukan</Th><Th>Pendapatan</Th><Th>Tanggal</Th><Th><span className="sr-only">Aksi</span></Th></tr></thead>
            <tbody>
              {referrals.map((r) => (
                <tr key={r.id}>
                  <Td>{r.referrer.businessName ?? r.referrer.name} {r.isDemo && <DemoBadge />}</Td>
                  <Td>{r.referredName}</Td>
                  <Td className="tabular-nums">{money(num(r.resultingRevenue))}</Td>
                  <Td>{format(r.createdAt, "d MMM yyyy")}</Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <EntityForm mode="edit" title="Ubah rujukan" fields={referralFields} action={saveReferral} id={r.id} initial={{ ...r, resultingRevenue: num(r.resultingRevenue), referredProspectId: r.referredProspectId ?? "" }} />
                      <DeleteButton action={deleteReferral} id={r.id} />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
