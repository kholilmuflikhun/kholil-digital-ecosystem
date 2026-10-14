import type { Metadata } from "next";
import { format, startOfDay } from "date-fns";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { saveProspect, deleteProspect, markProspectContacted } from "@/lib/actions/crm";
import { Badge, DemoBadge, EmptyState, PageHeader, Table, Td, Th } from "@/components/ui/primitives";
import { ActionButton, DeleteButton, EntityForm, type Field } from "@/components/ui/entity-form";
import { PROSPECT_STATUS, label, pick } from "@/lib/constants/options";
import { formatCurrency, num } from "@/lib/utils";

export const metadata: Metadata = { title: "Prospek" };
export const dynamic = "force-dynamic";
const PAGE_SIZE = 50;

export default async function ProspectsPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const userId = await requireUserId();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const status = PROSPECT_STATUS.find((s) => s.value === sp.status)?.value;
  const where = { userId, ...(status ? { status: status as never } : {}) };

  const [rows, total, offers, contents, user] = await Promise.all([
    db.prospect.findMany({
      where, orderBy: [{ nextFollowUpAt: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, include: { offer: { select: { name: true } }, content: { select: { title: true } } },
    }),
    db.prospect.count({ where }),
    db.offer.findMany({ where: { userId, isActive: true }, select: { id: true, name: true } }),
    db.content.findMany({ where: { userId }, select: { id: true, title: true }, orderBy: { createdAt: "desc" }, take: 100 }),
    db.user.findUniqueOrThrow({ where: { id: userId }, select: { currency: true, locale: true } }),
  ]);

  const fields: Field[] = [
    { name: "name", label: "Nama", required: true },
    { name: "businessName", label: "Nama bisnis" },
    { name: "whatsapp", label: "WhatsApp" },
    { name: "email", label: "Email", type: "email" },
    { name: "instagram", label: "Instagram" },
    { name: "website", label: "Website" },
    { name: "industry", label: "Industri" },
    { name: "location", label: "Lokasi" },
    { name: "source", label: "Sumber" },
    { name: "potentialValue", label: "Potensi nilai", type: "number" },
    { name: "probability", label: "Probabilitas (%)", type: "number" },
    { name: "status", label: "Status", type: "select", required: true, options: PROSPECT_STATUS },
    { name: "nextFollowUpAt", label: "Tindak lanjut berikutnya", type: "date" },
    { name: "offerId", label: "Penawaran", type: "select", options: pick(offers) },
    { name: "contentId", label: "Berasal dari konten", type: "select", options: pick(contents.map((c) => ({ id: c.id, name: c.title }))) },
    { name: "isColdOutreach", label: "Kontak awal tanpa rujukan", type: "checkbox" },
    { name: "notes", label: "Catatan", type: "textarea" },
  ];

  const today = startOfDay(new Date());
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader title="Prospek" description={`${total} prospek`} actions={<EntityForm title="Prospek baru" fields={fields} action={saveProspect} initial={{ status: "NEW", probability: 10 }} />} />

      <nav aria-label="Filter status" className="mb-4 flex flex-wrap gap-1.5">
        {[{ value: "", label: "Semua" }, ...PROSPECT_STATUS].map((s) => (
          <a key={s.value} href={s.value ? `?status=${s.value}` : "?"}
            className={`rounded-full border px-3 py-1 text-xs ${(status ?? "") === s.value ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted"}`}>
            {s.label}
          </a>
        ))}
      </nav>

      {rows.length === 0 ? <EmptyState>Belum ada prospek{status ? ` dengan status ${label(PROSPECT_STATUS, status)}` : ""}.</EmptyState> : (
        <Table>
          <thead><tr><Th>Prospek</Th><Th>Status</Th><Th>Potensi</Th><Th>Probabilitas</Th><Th>Kontak terakhir</Th><Th>Tindak lanjut</Th><Th>Penawaran</Th><Th><span className="sr-only">Aksi</span></Th></tr></thead>
          <tbody>
            {rows.map((p) => {
              const overdue = p.nextFollowUpAt && p.nextFollowUpAt < today && !["WON", "LOST", "DORMANT"].includes(p.status);
              return (
                <tr key={p.id}>
                  <Td>
                    <div className="font-medium">{p.name} {p.isDemo && <DemoBadge />}</div>
                    <div className="text-xs text-muted-foreground">{p.businessName}{p.whatsapp ? ` · ${p.whatsapp}` : ""}</div>
                  </Td>
                  <Td><Badge tone={p.status === "WON" ? "success" : p.status === "LOST" ? "danger" : "primary"}>{label(PROSPECT_STATUS, p.status)}</Badge></Td>
                  <Td className="tabular-nums">{formatCurrency(num(p.potentialValue), user.currency, user.locale)}</Td>
                  <Td className="tabular-nums">{p.probability}%</Td>
                  <Td>{p.lastContactAt ? format(p.lastContactAt, "d MMM") : "—"}</Td>
                  <Td>{p.nextFollowUpAt ? <Badge tone={overdue ? "danger" : "neutral"}>{format(p.nextFollowUpAt, "d MMM")}</Badge> : "—"}</Td>
                  <Td className="text-xs">{p.offer?.name ?? "—"}</Td>
                  <Td>
                    <div className="flex justify-end gap-1">
                      <ActionButton action={markProspectContacted} payload={{ id: p.id }}>Catat kontak</ActionButton>
                      <EntityForm mode="edit" title="Edit prospek" fields={fields} action={saveProspect} id={p.id} initial={{ ...p, potentialValue: num(p.potentialValue) }} />
                      <DeleteButton action={deleteProspect} id={p.id} />
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {pages > 1 && (
        <nav aria-label="Halaman" className="mt-4 flex items-center justify-center gap-2 text-sm">
          {page > 1 && <a className="rounded border px-3 py-1 hover:bg-muted" href={`?${status ? `status=${status}&` : ""}page=${page - 1}`}>← Sebelumnya</a>}
          <span className="text-muted-foreground">Halaman {page} / {pages}</span>
          {page < pages && <a className="rounded border px-3 py-1 hover:bg-muted" href={`?${status ? `status=${status}&` : ""}page=${page + 1}`}>Berikutnya →</a>}
        </nav>
      )}
    </>
  );
}
