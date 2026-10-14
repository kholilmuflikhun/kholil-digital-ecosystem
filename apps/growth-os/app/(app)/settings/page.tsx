import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { saveSettings, clearDemoData } from "@/lib/actions/business";
import { Card, CardTitle, PageHeader } from "@/components/ui/primitives";
import { SettingsForm } from "@/components/settings-form";
import { ActionButton } from "@/components/ui/entity-form";
import { num } from "@/lib/utils";

export const metadata: Metadata = { title: "Pengaturan" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const userId = await requireUserId();
  const [user, s, demoCount] = await Promise.all([
    db.user.findUniqueOrThrow({ where: { id: userId }, select: { name: true, email: true, currency: true, locale: true } }),
    db.userSettings.findUnique({ where: { userId } }),
    db.prospect.count({ where: { userId, isDemo: true } }),
  ]);

  return (
    <>
      <PageHeader title="Pengaturan" description={user.email ?? undefined} />
      <Card>
        <CardTitle>Profil dan parameter bisnis</CardTitle>
        <SettingsForm
          action={saveSettings}
          initial={{
            name: user.name ?? "", currency: user.currency, locale: user.locale,
            averageOrderValue: num(s?.averageOrderValue), conversionRate: num(s?.conversionRate ?? 0.2),
            qualificationRate: num(s?.qualificationRate ?? 0.4), responseRate: num(s?.responseRate ?? 0.3),
            scoreCritical: s?.scoreCritical ?? 50, scoreNeedsWork: s?.scoreNeedsWork ?? 70, scoreOnTrack: s?.scoreOnTrack ?? 90,
            repeatWindowDays: s?.repeatWindowDays ?? 60,
          }}
        />
      </Card>

      <Card className="mt-4">
        <CardTitle>Data demo</CardTitle>
        <p className="mb-3 text-sm text-muted-foreground">Hapus data contoh sebelum menggunakan data bisnis.</p>
        {demoCount > 0 ? (
          <ActionButton action={clearDemoData as never} payload={{}}>Hapus semua data demo</ActionButton>
        ) : <p className="text-sm">Data demo tidak ditemukan.</p>}
      </Card>
    </>
  );
}
