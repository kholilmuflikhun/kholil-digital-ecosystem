"use client";

import { useEffect } from "react";

const KEY = "kh_attribution";

/** Membaca atribusi first-touch dari sessionStorage (dipakai formulir). */
export function readAttribution(): string {
  try {
    return window.sessionStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

/**
 * Menyimpan UTM, referrer, dan landing page pada kunjungan pertama dalam sesi.
 * Hanya disimpan di sessionStorage browser dan dikirim bersama formulir kontak. Tidak ada cookie.
 */
export function AttributionCapture() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(KEY)) return;
      const q = new URL(window.location.href).searchParams;
      const get = (k: string) => q.get(k)?.slice(0, 150) || undefined;
      let referrer: string | undefined;
      if (document.referrer) {
        const r = new URL(document.referrer);
        if (r.host !== window.location.host) referrer = `${r.origin}${r.pathname}`.slice(0, 500);
      }
      const data = {
        utmSource: get("utm_source"),
        utmMedium: get("utm_medium"),
        utmCampaign: get("utm_campaign"),
        utmContent: get("utm_content"),
        utmTerm: get("utm_term"),
        referrer,
        landingPage: window.location.pathname.slice(0, 500),
      };
      window.sessionStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* sessionStorage dapat diblokir; atribusi opsional */
    }
  }, []);
  return null;
}
