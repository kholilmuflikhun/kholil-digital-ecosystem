"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3, CalendarCheck, Compass, FolderKanban, Heart, Kanban, LayoutDashboard,
  Megaphone, Menu, Package, Settings, Target, Users, Wallet, X, LogOut, Rocket,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme";

const ICONS = { LayoutDashboard, Target, CalendarCheck, Users, Kanban, Heart, Package, FolderKanban, Megaphone, Wallet, BarChart3, Compass, Settings };

export function AppShell({
  children, userName, logout,
}: {
  children: React.ReactNode;
  userName: string;
  logout: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav aria-label="Navigasi utama" className="flex flex-col gap-0.5 p-3">
      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.icon as keyof typeof ICONS];
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r bg-card lg:flex">
        <div className="flex h-14 items-center gap-2 border-b px-4 font-semibold">
          <Rocket className="h-5 w-5 text-primary" /> Growth OS
        </div>
        <div className="flex-1 overflow-y-auto">{nav}</div>
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-card shadow-xl">
            <div className="flex h-14 items-center justify-between border-b px-4 font-semibold">
              <span className="flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" /> Growth OS</span>
              <button onClick={() => setOpen(false)} aria-label="Tutup menu"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto">{nav}</div>
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <button className="rounded-md p-2 hover:bg-muted lg:hidden" onClick={() => setOpen(true)} aria-label="Buka menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">{userName}</span>
            <ThemeToggle />
            <form action={logout}>
              <button className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted" aria-label="Keluar">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
