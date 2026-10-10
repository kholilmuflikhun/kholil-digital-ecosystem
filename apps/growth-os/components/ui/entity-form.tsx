"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { buttonClass } from "./primitives";
import { cn } from "@/lib/utils";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "textarea" | "checkbox" | "email";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  step?: string;
  full?: boolean;
};

type ActionResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
type Action = (input: Record<string, unknown>, id?: string) => Promise<ActionResult>;

const inputCls =
  "h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function EntityForm({
  title, fields, action, initial, id, mode = "create", triggerLabel,
}: {
  title: string;
  fields: Field[];
  action: Action;
  initial?: Record<string, unknown>;
  id?: string;
  mode?: "create" | "edit";
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [pending, start] = useTransition();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.type === "checkbox") values[f.name] = fd.get(f.name) === "on";
      else {
        const v = fd.get(f.name);
        if (v !== null && v !== "") values[f.name] = v;
      }
    }
    setError(null);
    setFieldErrors({});
    start(async () => {
      const res = await action(values, id);
      if (res.ok) setOpen(false);
      else {
        setError(res.error);
        setFieldErrors(res.fieldErrors ?? {});
      }
    });
  }

  return (
    <>
      {mode === "edit" ? (
        <button type="button" onClick={() => setOpen(true)} className={buttonClass("ghost") + " !h-8 !px-2"} aria-label={`Edit ${title}`}>
          <Pencil className="h-3.5 w-3.5" />
        </button>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className={buttonClass()}>
          <Plus className="h-4 w-4" /> {triggerLabel ?? "Tambah"}
        </button>
      )}

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        className="w-[min(560px,calc(100vw-2rem))] rounded-lg border bg-card p-0 text-foreground backdrop:bg-black/50"
      >
        <form onSubmit={submit} className="flex max-h-[85vh] flex-col">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="font-semibold">{title}</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="Tutup" className="rounded p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 overflow-y-auto p-4 sm:grid-cols-2">
            {fields.map((f) => {
              const raw = initial?.[f.name];
              const def =
                raw instanceof Date ? raw.toISOString().slice(0, 10) : raw === null || raw === undefined ? "" : String(raw);
              const errs = fieldErrors[f.name];
              const span = f.full || f.type === "textarea" ? "sm:col-span-2" : "";
              if (f.type === "checkbox") {
                return (
                  <label key={f.name} className={cn("flex items-center gap-2 text-sm", span)}>
                    <input type="checkbox" name={f.name} defaultChecked={Boolean(raw)} className="h-4 w-4" /> {f.label}
                  </label>
                );
              }
              return (
                <label key={f.name} className={cn("grid gap-1 text-sm", span)}>
                  <span className="text-xs font-medium text-muted-foreground">
                    {f.label}
                    {f.required ? " *" : ""}
                  </span>
                  {f.type === "textarea" ? (
                    <textarea name={f.name} defaultValue={def} rows={3} placeholder={f.placeholder} className={cn(inputCls, "h-auto py-2")} />
                  ) : f.type === "select" ? (
                    <select name={f.name} defaultValue={def} required={f.required} className={inputCls}>
                      {!f.required && <option value="">—</option>}
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={f.name} type={f.type ?? "text"} defaultValue={def} required={f.required}
                      step={f.type === "number" ? f.step ?? "any" : undefined} placeholder={f.placeholder} className={inputCls}
                    />
                  )}
                  {errs?.[0] ? <span className="text-xs text-danger">{errs[0]}</span> : null}
                </label>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-2 border-t px-4 py-3">
            <p role="alert" className="text-xs text-danger">{error}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setOpen(false)} className={buttonClass("ghost")}>Batal</button>
              <button type="submit" disabled={pending} className={buttonClass()}>{pending ? "Menyimpan…" : "Simpan"}</button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
}

export function DeleteButton({
  action, id, label = "Hapus", confirmText = "Hapus data ini? Tindakan tidak dapat dibatalkan.",
}: {
  action: (input: Record<string, unknown>) => Promise<ActionResult>;
  id: string;
  label?: string;
  confirmText?: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button" disabled={pending} aria-label={label}
      onClick={() => {
        if (confirm(confirmText)) start(async () => void (await action({ id })));
      }}
      className={buttonClass("danger") + " !h-8 !px-2"}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}

export function ActionButton({
  action, payload, children, variant = "ghost",
}: {
  action: (input: Record<string, unknown>) => Promise<ActionResult>;
  payload: Record<string, unknown>;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const [pending, start] = useTransition();
  return (
    <button type="button" disabled={pending} onClick={() => start(async () => void (await action(payload)))} className={buttonClass(variant) + " !h-8"}>
      {children}
    </button>
  );
}
