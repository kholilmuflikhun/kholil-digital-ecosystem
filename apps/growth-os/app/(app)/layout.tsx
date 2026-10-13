import { AppShell } from "@/components/app-shell";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { logoutAction } from "@/lib/actions/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await requireUserId();
  const [user, unread] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, select: { name: true, email: true } }),
    db.notification.count({ where: { userId, channel: "IN_APP", readAt: null } }),
  ]);
  return (
    <AppShell userName={user?.name ?? user?.email ?? ""} logout={logoutAction} unread={unread}>
      {children}
    </AppShell>
  );
}
