import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { profile } from "@/content";

/** Letakkan foto di apps/personal-brand/public/ dengan salah satu nama ini; terdeteksi otomatis saat build. */
const CANDIDATES = ["kholil-muflikhun.png", "kholil-muflikhun.webp", "kholil-muflikhun.jpg"];

function findPortrait(): string | null {
  for (const f of CANDIDATES) {
    if (fs.existsSync(path.join(process.cwd(), "public", f))) return `/${f}`;
  }
  return null;
}

const fade = {
  WebkitMaskImage: "linear-gradient(to bottom, #000 70%, transparent 100%)",
  maskImage: "linear-gradient(to bottom, #000 70%, transparent 100%)",
} as const;

/**
 * Foto di sisi kanan hero tanpa bingkai: cahaya biru lembut di belakang, tepi bawah memudar ke latar.
 * Tanpa file foto, tampil siluet placeholder berlabel; setelah foto diletakkan di public/, otomatis diganti.
 * Disarankan PNG/WebP berlatar transparan (potongan setengah badan), rasio sekitar 4:5.
 */
export function HeroPortrait() {
  const src = findPortrait();
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm lg:max-w-none">
      <div
        aria-hidden="true"
        className="absolute -inset-24 -z-10 bg-[radial-gradient(closest-side,hsl(var(--primary)/0.20),transparent)]"
      />
      {src ? (
        <Image
          src={src}
          alt={`Foto ${profile.name}`}
          fill
          priority
          sizes="(min-width: 1024px) 40vw, 80vw"
          className="object-contain object-bottom"
          style={fade}
        />
      ) : (
        <svg
          role="img"
          aria-label={`Tempat foto ${profile.name}`}
          viewBox="0 0 400 500"
          className="absolute inset-0 h-full w-full text-primary"
          style={fade}
        >
          <defs>
            <linearGradient id="hp-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.10" />
            </linearGradient>
          </defs>
          <circle cx="200" cy="150" r="82" fill="url(#hp-body)" />
          <path d="M40 500 C40 360 110 285 200 285 C290 285 360 360 360 500 Z" fill="url(#hp-body)" />
        </svg>
      )}
    </div>
  );
}
