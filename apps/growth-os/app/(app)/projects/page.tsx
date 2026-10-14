import type { Metadata } from "next";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { saveProject, deleteProject } from "@/lib/actions/business";
import { Badge, DemoBadge, EmptyState, PageHeader, Progress, Table, Td, Th } from "@/components/ui/primitives";
import { DeleteButton, EntityForm, type Field } from "@/components/ui/entity-form";
import { PROJECT_STATUS, label, pick } from "@/lib/constants/options";
import { formatCurrency, num } from "@/lib/utils";

export const metadata: Metadata = { title: "Proyek" };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const userId = await requireUserId();
  const [projects, customers, offers, deals, user] = await Promise.all([
    db.project.findMany({ where: { userId }, include: { customer: { select: { name: true, businessName: true } }, offer: { select: { name: true } } }, orderBy: [{ status: "asc" }, { deadline: { sort: "asc", nulls: "last" } }] }),
    db.customer.findMany({ where: { userId }, select: { id: true, name: true, businessName: true } }),
    db.offer.findMany({ where: { userId }, select: { id: true, name: true } }),
    db.deal.findMany({ where: { userId, stage: "WON" }, select: { id: true, name: true } }),
    db.user.findUniqueOrThrow({ where: { id: userId }, select: { currency: true, locale: true } }),
  ]);
  const money = (v: number) => formatCurrency(v, user.currency, user.locale);

  const fields: Field[] = [
    { name: "name", label: "Nama proyek", required: true, full: true },
    { name: "customerId", label: "Pelanggan", type: "select", options: pick(customers.map((c) => ({ id: c.id, name: c.businessName ?? c.name }))) },
    { name: "offerId", label: "Penawaran", type: "select", options: pick(offers) },
    { name: "dealId", label: "Transaksi berhasil", type: "select", options: pick(deals) },
    { name: "status", label: "Status", type: "select", required: true, options: PROJECT_STATUS },
    { name: "deadline", label: "Tenggat", type: "date" },
    { name: "value", label: "Nilai proyek", type: "number" },
    { name: "cost", label: "Biaya", type: "number" },
    { name: "completion", label: "Selesai (%)", type: "number" },
    { name: "hoursSpent", label: "Jam kerja", type: "number" },
    { name: "revisions", label: "Jumlah revisi", type: "number" },
    { name: "notes", label: "Catatan", type: "textarea" },
  ];

  return (
    <>
      <PageHeader title="Proyek" description="Pantau progres, biaya, dan profit per jam." actions={<EntityForm title="Proyek baru" fields={fields} action={saveProject} initial={{ status: "PLANNING", completion: 0 }} />} />
      {projects.length === 0 ? <EmptyState>Belum ada proyek.</EmptyState> : (
        <Table>
          <thead><tr><Th>Proyek</Th><Th>Status</Th><Th>Tenggat</Th><Th>Progres</Th><Th>Nilai</Th><Th>Profit</Th><Th>Jam</Th><Th>Profit/jam</Th><Th>Revisi</Th><Th><span className="sr-only">Aksi</span></Th></tr></thead>
          <tbody>
            {projects.map((p) => {
              const profit = num(p.value) - num(p.cost);
              const hours = num(p.hoursSpent);
              const late = p.deadline && p.deadline < new Date() && !["COMPLETED", "ARCHIVED"].includes(p.status);
              return (
                <tr key={p.id}>
                  <Td><div className="font-medium">{p.name} {p.isDemo && <DemoBadge />}</div><div className="text-xs text-muted-foreground">{p.customer?.businessName ?? p.customer?.name ?? "—"}</div></Td>
                  <Td><Badge tone={p.status === "COMPLETED" ? "success" : p.status === "REVISION" ? "warning" : "primary"}>{label(PROJECT_STATUS, p.status)}</Badge></Td>
                  <Td>{p.deadline ? <Badge tone={late ? "danger" : "neutral"}>{format(p.deadline, "d MMM")}</Badge> : "—"}</Td>
                  <Td className="w-32"><Progress value={p.completion} tone={p.completion === 100 ? "success" : "primary"} label={p.name} /></Td>
                  <Td className="tabular-nums">{money(num(p.value))}</Td>
                  <Td className={`tabular-nums ${profit < 0 ? "text-danger" : ""}`}>{money(profit)}</Td>
                  <Td className="tabular-nums">{hours || "—"}</Td>
                  <Td className="tabular-nums">{hours > 0 ? money(profit / hours) : "—"}</Td>
                  <Td>{p.revisions}</Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <EntityForm mode="edit" title="Edit proyek" fields={fields} action={saveProject} id={p.id} initial={{ ...p, value: num(p.value), cost: num(p.cost), hoursSpent: hours }} />
                      <DeleteButton action={deleteProject} id={p.id} />
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
