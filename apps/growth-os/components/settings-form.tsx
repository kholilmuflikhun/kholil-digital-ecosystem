"use client";

import { useState, useTransition } from "react";
import { buttonClass } from "@/components/ui/primitives";

type Action = (input: Record<string, unknown>) => Promise<{ ok: boolean; error?: string; fieldErrors?: Record<string, string[]> }>;

const FIELDS = [
  ["name", "Nama", "text", "Nama tampilan"],
  ["currency", "Mata uang (kode ISO, mis. IDR, USD)", "text", ""],
  ["locale", "Locale (mis. id-ID, en-US)", "text", ""],
  ["averageOrderValue", "Rata-rata nilai pesanan (AOV)", "number", "Dipakai mesin matematika penjualan"],
  ["conversionRate", "Konversi lead terkualifikasi → transaksi (0–1)", "number", "0.2 = 20%"],
  ["qualificationRate", "Kualifikasi prospek → lead (0–1)", "number", ""],
  ["responseRate", "Response rate outreach (0–1)", "number", ""],
  ["scoreCritical", "Ambang Critical (di bawah, %)", "number", ""],
  ["scoreNeedsWork", "Ambang Needs Improvement (di bawah, %)", "number", ""],
  ["scoreOnTrack", "Ambang On Track (di bawah, %)", "number", "Di atas ini = Excellent"],
  ["repeatWindowDays", "Jendela repeat order (hari)", "number", "Pelanggan dianggap dorman setelahnya"],
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
          setMsg(r.ok ? "Pengaturan tersimpan." : r.error ?? "Gagal menyimpan.");
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
