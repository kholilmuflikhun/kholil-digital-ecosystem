"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

type Item = { label: string; href: string };

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

/** Navigasi utama: tautan di layar lebar, dialog modal native di layar sempit (fokus terkurung, Esc menutup). */
export function SiteNav({ items, cta }: { items: Item[]; cta: Item }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const openMenu = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const closeMenu = () => dialogRef.current?.close();

  return (
    <>
      <nav aria-label="Navigasi utama" className="hidden lg:block">
        <ul className="ui flex items-center gap-1">
          {items.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                aria-current={isActive(pathname, i.href) ? "page" : undefined}
                className="inline-flex min-h-[44px] items-center px-3 text-[0.95rem] font-medium text-muted-foreground hover:text-foreground aria-[current=page]:text-primary"
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link
        href={cta.href}
        className="ui hidden min-h-[44px] items-center rounded-lg bg-primary px-4 text-[0.95rem] font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 lg:inline-flex"
      >
        {cta.label}
      </Link>

      <button
        ref={triggerRef}
        type="button"
        onClick={openMenu}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="menu-seluler"
        className="ui inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg border border-border px-3 lg:hidden"
      >
        <Menu aria-hidden="true" size={20} />
        <span className="text-sm font-medium">Menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id="menu-seluler"
        aria-label="Menu navigasi"
        onClose={() => {
          setOpen(false);
          triggerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeMenu();
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-background p-0 text-foreground backdrop:bg-foreground/50"
      >
        <div className="mx-auto flex h-full max-w-page flex-col px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <span className="ui font-bold">Menu</span>
            <button
              type="button"
              onClick={closeMenu}
              className="ui inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg border border-border px-3"
            >
              <X aria-hidden="true" size={20} />
              <span className="text-sm font-medium">Tutup</span>
            </button>
          </div>
          <nav aria-label="Navigasi seluler" className="mt-8 flex-1 overflow-y-auto">
            <ul className="ui">
              {items.map((i) => (
                <li key={i.href} className="border-b border-border">
                  <Link
                    href={i.href}
                    onClick={closeMenu}
                    aria-current={isActive(pathname, i.href) ? "page" : undefined}
                    className="flex min-h-[56px] items-center text-2xl font-semibold aria-[current=page]:text-primary"
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href={cta.href}
            onClick={closeMenu}
            className="ui mt-6 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground"
          >
            {cta.label}
          </Link>
        </div>
      </dialog>
    </>
  );
}
