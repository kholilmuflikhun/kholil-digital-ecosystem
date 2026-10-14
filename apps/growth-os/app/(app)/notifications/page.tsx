import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { generateNotificationsFor } from "@/lib/notifications/service";
import { markAllNotificationsRead, markNotificationRead, refreshInsights } from "@/lib/actions/retention";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui/primitives";
import { ActionButton } from "@/components/ui/entity-form";

export const metadata: Metadata = { title: "Notifikasi" };
export const dynamic = "force-dynamic";

const HREF: Record<string, string> = { Prospect: "/prospects", Revenue: "/revenue", Task: "/daily", Project: "/projects" };
const TYPE_LABEL: Record<string, string> = {
  FOLLOW_UP: "Tindak lanjut", OVERDUE_PAYMENT: "Tagihan", DEADLINE: "Tenggat", DAILY_PRIORITY: "Prioritas",
  CAMPAIGN_MILESTONE: "Tahapan kampanye", WEEKLY_REVIEW: "Tinjauan", CUSTOMER_REACTIVATION: "Pelanggan tidak aktif",
};

export default async function NotificationsPage() {
  const userId = await requireUserId();
  await generateNotificationsFor(userId).catch((e) => console.error("notification generation failed", e));
  const items = await db.notification.findMany({
    where: { userId, channel: "IN_APP" },
    orderBy: [{ readAt: { sort: "asc", nulls: "first" } }, { createdAt: "desc" }],
    take: 100,
  });
  const unread = items.filter((n) => !n.readAt).length;

  return (
    <>
      <PageHeader
        title="Notifikasi"
        description="Pengingat tindak lanjut, tagihan, tenggat, dan prioritas."
        actions={
          <div className="flex gap-2">
            <ActionButton action={refreshInsights} payload={{}}>Segarkan</ActionButton>
            {unread > 0 && <ActionButton action={markAllNotificationsRead} payload={{}}>Tandai semua dibaca</ActionButton>}
          </div>
        }
      />
      {items.length === 0 ? <EmptyState>Tidak ada notifikasi baru.</EmptyState> : (
        <ul className="grid gap-2">
          {items.map((n) => (
            <li key={n.id}>
              <Card className={n.readAt ? "opacity-70" : "border-primary/40"}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <Badge tone={n.readAt ? "neutral" : "primary"}>{TYPE_LABEL[n.type] ?? n.type}</Badge>
                      {n.title}
                    </p>
                    {n.body && <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">{format(n.createdAt, "d MMM yyyy HH:mm")}</p>
                  </div>
                  <div className="flex gap-1">
                    {n.entityType && HREF[n.entityType] && <Link href={HREF[n.entityType]!} className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted">Buka</Link>}
                    {!n.readAt && <ActionButton action={markNotificationRead} payload={{ id: n.id }}>Tandai dibaca</ActionButton>}
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
