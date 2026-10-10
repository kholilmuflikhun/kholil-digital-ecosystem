"use server";

import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { contactFormSchema, toLeadPayload } from "@/lib/leads/schema";
import { defaultSinks } from "@/lib/leads/sinks";
import { deliverLead } from "@/lib/leads/deliver";
import { rateLimit } from "@/lib/rate-limit";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { whatsappNumber } from "@/lib/site";
import type { ContactState, ContactValues } from "./state";

const MIN_FILL_MS = 3000;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const VALUE_KEYS = ["name", "email", "whatsapp", "preferredContact", "businessName", "serviceCategory", "message", "budgetRange", "timeline"] as const;

function readValues(fd: FormData): ContactValues {
  const out: ContactValues = {};
  for (const k of VALUE_KEYS) {
    const v = fd.get(k);
    if (typeof v === "string") out[k] = v.slice(0, 3000);
  }
  return out;
}

/** Tautan WhatsApp cadangan berisi pesan pengunjung (bila nomor sudah dikonfigurasi). */
function fallbackWhatsApp(values: ContactValues, context?: string) {
  return (
    buildWhatsAppUrl(whatsappNumber, { name: values.name, service: values.serviceCategory, message: values.message, context }) ??
    undefined
  );
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = readValues(formData);
  const raw = Object.fromEntries(formData.entries());

  // 1) Batas laju per IP
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60_000).ok) {
    return { status: "rate_limited", message: "Terlalu banyak pengiriman dalam waktu singkat. Coba lagi beberapa menit lagi.", values };
  }

  // 2) Validasi di server
  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "invalid",
      message: "Periksa kembali isian yang ditandai.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values,
    };
  }
  const input = parsed.data;

  // 3) Anti-spam: honeypot terisi atau dikirim terlalu cepat/terlalu lama
  const age = Date.now() - input.startedAt;
  if (input.company_website || age < MIN_FILL_MS || age > MAX_AGE_MS) {
    return { status: "error", message: "Pengiriman tidak dapat diproses. Muat ulang halaman lalu coba lagi.", values };
  }

  // 4) Kirim ke semua tujuan yang terkonfigurasi
  const payload = toLeadPayload(input, randomUUID());
  const result = await deliverLead(payload, defaultSinks());
  const wa = fallbackWhatsApp(values, input.page);

  if (result.status === "delivered") return { status: "success" };
  if (result.status === "not_configured") {
    return {
      status: "not_configured",
      message: "Formulir belum terhubung ke email. Pesan Anda belum terkirim.",
      values,
      whatsappUrl: wa,
    };
  }
  return {
    status: "error",
    message: "Pesan belum terkirim karena gangguan sementara. Silakan coba lagi.",
    values,
    whatsappUrl: wa,
  };
}
