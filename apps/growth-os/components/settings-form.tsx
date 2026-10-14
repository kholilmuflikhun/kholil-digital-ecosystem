"use client";

import { useState, useTransition } from "react";
import { buttonClass } from "@/components/ui/primitives";

type Action = (input: Record<string, unknown>) => Promise<{ ok: boolean; error?: string; fieldErrors?: Record<string, string[]> }>;

const FIELDS = [
  ["name", "Nama", "text", "Nama tampilan"],
  ["currency", "Mata uang (kode ISO, mis. IDR)", "text", ""],
  ["locale", "Format wilayah (mis. id-ID)", "text", ""],
  ["averageOrderValue", "Rata-rata nilai pesanan", "number", "Dasar perhitungan target penjualan"],
  ["conversionRate", "Konversi lead ke transaksi (0–1)", "number", "0,2 = 20%"],
  ["qualificationRate", "Konversi prospek ke lead (0–1)", "number", ""],
  ["responseRate", "Tingkat respons prospek (0–1)", "number", ""],
  ["scoreCritical", "Batas skor kritis (%)", "number", ""],
  ["scoreNeedsWork", "Batas skor perlu ditingkatkan (%)", "number", ""],
  ["scoreOnTrack", "Batas skor sesuai target (%)", "number", "Di atas batas ini: unggul"],
  ["repeatWindowDays", "Periode pesanan ulang (hari)", "number", "Pelanggan dianggap tidak aktif setelah periode ini"],
] as const;

export function SettingsForm({ action, initial }: { action: Action; initial: Record<string, string | number> }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, start] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const values = Object.fromEntries(FIELDS.map(([k]) => [k, fd.get(k)]));
        setMsg(null);
        start(async () => {
          const r = await action(values);
          setErrors(r.fieldErrors ?? {});
          setMsg(r.ok ? "Pengaturan tersimpan." : r.error ?? "Pengaturan gagal disimpan.");
        });
      }}
      className="grid gap-3 sm:grid-cols-2"
    >
      {FIELDS.map(([k, label, type, hint]) => (
        <label key={k} className="grid gap-1 text-sm">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <input
            name={k} type={type} step={type === "number" ? "any" : undefined} defaultValue={initial[k]} required
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
          {errors[k]?.[0] && <span className="text-xs text-danger">{errors[k][0]}</span>}
        </label>
      ))}
      <div className="flex items-center justify-between sm:col-span-2">
        <p role="status" className="text-xs text-muted-foreground">{msg}</p>
        <button disabled={pending} className={buttonClass()}>{pending ? "Menyimpan…" : "Simpan"}</button>
      </div>
    </form>
  );
}
