"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact } from "@/app/contact/actions";
import { initialContactState, type ContactState } from "@/app/contact/state";
import { budgetOptions, serviceCategoryOptions, timelineOptions } from "@/lib/leads/options";
import { track } from "@/lib/analytics";
import { readAttribution } from "./attribution-capture";

type Props = {
  defaultCategory?: string;
  defaultMessage?: string;
  /** Konteks (bukan data pribadi) yang ikut terkirim untuk atribusi. */
  context?: { page?: string; serviceSlug?: string; productSlug?: string };
};

const field =
  "ui mt-1.5 block w-full min-h-[44px] rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground aria-[invalid=true]:border-danger";
const label = "ui block text-sm font-semibold";

export function ContactForm({ defaultCategory, defaultMessage, context }: Props) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, initialContactState);
  const [startedAt, setStartedAt] = useState("");
  const [attribution, setAttribution] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStartedAt(String(Date.now()));
    setAttribution(readAttribution());
  }, []);

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
    if (state.status === "success") track("contact_submit", { result: "success" });
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border border-foreground p-6 outline-none">
        <h2 className="display-md">Pesan Anda sudah terkirim.</h2>
        <p className="mt-3 text-muted-foreground">
          Terima kasih. Saya akan membaca kebutuhan Anda dan membalas lewat metode kontak yang Anda pilih. Estimasi waktu balasan tidak dijanjikan di sini; bila
          mendesak, hubungi lewat WhatsApp.
        </p>
      </div>
    );
  }

  const values = state.status === "idle" ? {} : state.values;
  const errors = state.status === "invalid" ? state.fieldErrors : {};
  const err = (k: string) => errors[k]?.[0];
  const describe = (k: string) => (err(k) ? `${k}-error` : undefined);
  const banner =
    state.status === "error" || state.status === "not_configured" || state.status === "rate_limited" || state.status === "invalid"
      ? state
      : null;
  const waUrl = state.status === "error" || state.status === "not_configured" ? state.whatsappUrl : undefined;

  return (
    <form action={action} noValidate className="space-y-6">
      {banner && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="border border-danger p-4 outline-none">
          <p className="ui font-semibold text-danger">{banner.message}</p>
          {waUrl && (
            <p className="mt-2">
              Anda tetap bisa{" "}
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="link">
                mengirim pesan yang sama lewat WhatsApp
              </a>
              .
            </p>
          )}
        </div>
      )}

      <input type="hidden" name="startedAt" value={startedAt} />
      <input type="hidden" name="attribution" value={attribution} />
      <input type="hidden" name="page" value={context?.page ?? ""} />
      <input type="hidden" name="serviceSlug" value={context?.serviceSlug ?? ""} />
      <input type="hidden" name="productSlug" value={context?.productSlug ?? ""} />
      {/* Honeypot: disembunyikan dari pengguna dan teknologi bantu */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Situs web perusahaan
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>Nama <span aria-hidden="true">*</span></label>
          <input id="name" name="name" required autoComplete="name" defaultValue={values.name} aria-invalid={Boolean(err("name"))} aria-describedby={describe("name")} className={field} />
          {err("name") && <p id="name-error" className="mt-1 text-sm text-danger">{err("name")}</p>}
        </div>
        <div>
          <label htmlFor="businessName" className={label}>Nama bisnis (opsional)</label>
          <input id="businessName" name="businessName" autoComplete="organization" defaultValue={values.businessName} className={field} />
        </div>
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" defaultValue={values.email} aria-invalid={Boolean(err("email"))} aria-describedby={describe("email")} className={field} />
          {err("email") && <p id="email-error" className="mt-1 text-sm text-danger">{err("email")}</p>}
        </div>
        <div>
          <label htmlFor="whatsapp" className={label}>Nomor WhatsApp</label>
          <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" placeholder="08xxxxxxxxxx" defaultValue={values.whatsapp} aria-invalid={Boolean(err("whatsapp"))} aria-describedby={describe("whatsapp")} className={field} />
          {err("whatsapp") && <p id="whatsapp-error" className="mt-1 text-sm text-danger">{err("whatsapp")}</p>}
        </div>
      </div>
      <p className="-mt-3 text-sm text-muted-foreground">Isi minimal salah satu: email atau nomor WhatsApp.</p>

      <fieldset aria-describedby={describe("preferredContact")}>
        <legend className={label}>Metode kontak yang Anda pilih <span aria-hidden="true">*</span></legend>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
          {[
            ["whatsapp", "WhatsApp"],
            ["email", "Email"],
          ].map(([v, l]) => (
            <label key={v} className="ui inline-flex min-h-[44px] items-center gap-2">
              <input type="radio" name="preferredContact" value={v} required defaultChecked={(values.preferredContact ?? "whatsapp") === v} className="h-5 w-5 accent-foreground" />
              {l}
            </label>
          ))}
        </div>
        {err("preferredContact") && <p id="preferredContact-error" className="mt-1 text-sm text-danger">{err("preferredContact")}</p>}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="serviceCategory" className={label}>Kebutuhan <span aria-hidden="true">*</span></label>
          <select id="serviceCategory" name="serviceCategory" required defaultValue={values.serviceCategory ?? defaultCategory ?? "lainnya"} aria-invalid={Boolean(err("serviceCategory"))} aria-describedby={describe("serviceCategory")} className={field}>
            {serviceCategoryOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {err("serviceCategory") && <p id="serviceCategory-error" className="mt-1 text-sm text-danger">{err("serviceCategory")}</p>}
        </div>
        <div>
          <label htmlFor="timeline" className={label}>Target waktu (opsional)</label>
          <select id="timeline" name="timeline" defaultValue={values.timeline ?? ""} className={field}>
            <option value="">Pilih</option>
            {timelineOptions.map((o) => (<option key={o}>{o}</option>))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="budgetRange" className={label}>Perkiraan anggaran (opsional)</label>
          <select id="budgetRange" name="budgetRange" defaultValue={values.budgetRange ?? ""} className={field}>
            <option value="">Pilih</option>
            {budgetOptions.map((o) => (<option key={o}>{o}</option>))}
          </select>
          <p className="mt-1 text-sm text-muted-foreground">Hanya membantu saya memahami skala. Bukan daftar harga dan tidak mengikat.</p>
        </div>
      </div>

      <div>
        <label htmlFor="message" className={label}>Ceritakan kebutuhan Anda <span aria-hidden="true">*</span></label>
        <textarea id="message" name="message" required rows={6} maxLength={3000} defaultValue={values.message ?? defaultMessage} aria-invalid={Boolean(err("message"))} aria-describedby={describe("message")} className={field} />
        {err("message") && <p id="message-error" className="mt-1 text-sm text-danger">{err("message")}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending || !startedAt} className="ui inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60">
          {pending ? "Mengirim…" : "Kirim pesan"}
        </button>
        <p className="text-sm text-muted-foreground">Data Anda hanya dipakai untuk membalas pesan ini. Lihat <Link className="link" href="/privacy">kebijakan privasi</Link>.</p>
      </div>
    </form>
  );
}
