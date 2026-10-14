"use client";

import { useState, useTransition } from "react";
import { buttonClass } from "@/components/ui/primitives";

const SECTIONS = [
  ["vision", "Visi", "Arah bisnis jangka panjang"],
  ["mission", "Misi", "Tujuan bisnis"],
  ["positioning", "Posisi brand", "Audiens dan pembeda utama"],
  ["valueProposition", "Proposisi nilai", "Masalah yang diselesaikan"],
  ["idealCustomer", "Pelanggan ideal", "Pelanggan yang dilayani"],
  ["offersSummary", "Penawaran", "Produk atau layanan"],
  ["acquisitionChannels", "Kanal akuisisi", "Sumber pelanggan"],
  ["growthStrategy", "Strategi pertumbuhan", "Arah pengembangan bisnis"],
  ["competitiveEdge", "Keunggulan", "Alasan pelanggan memilih bisnis"],
] as const;

type Action = (input: Record<string, unknown>) => Promise<{ ok: boolean; error?: string }>;

export function StrategyForm({ action, initial }: { action: Action; initial: Record<string, string> }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const values = Object.fromEntries(SECTIONS.map(([k]) => [k, String(fd.get(k) ?? "")]));
        start(async () => {
          const r = await action(values);
          setMsg(r.ok ? "Strategi tersimpan." : r.error ?? "Strategi gagal disimpan.");
        });
      }}
      className="grid gap-4"
    >
      {SECTIONS.map(([key, title, q]) => (
        <label key={key} className="grid gap-1">
          <span className="text-sm font-semibold">{title} <span className="font-normal text-muted-foreground">— {q}</span></span>
          <textarea name={key} defaultValue={initial[key]} rows={3} maxLength={2000}
            className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </label>
      ))}
      <div className="flex items-center justify-between">
        <p role="status" className="text-xs text-muted-foreground">{msg}</p>
        <button disabled={pending} className={buttonClass()}>{pending ? "Menyimpan…" : "Simpan strategi"}</button>
      </div>
    </form>
  );
}
