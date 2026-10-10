"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import type { Product, Project } from "@/content";
import { ProductCard, ProjectCard } from "./cards";

type Option = { value: string; label: string };

function FilterBar({ options, active, onChange, label }: { options: Option[]; active: string; onChange: (v: string) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="mb-8 flex flex-wrap gap-2">
      {[{ value: "all", label: "Semua" }, ...options].map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={active === o.value}
          onClick={() => onChange(o.value)}
          className="ui min-h-[44px] rounded-sm border border-ink px-4 text-sm font-medium aria-pressed:bg-ink aria-pressed:text-paper"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Daftar produk dengan filter kategori. Hanya kategori yang punya produk yang ditampilkan. */
export function ProductBrowser({
  products,
  labels,
  initialCategory = "all",
  limit,
}: {
  products: Product[];
  labels: Record<string, string>;
  initialCategory?: string;
  limit?: number;
}) {
  const present = Array.from(new Set(products.map((p) => p.category)));
  const [active, setActive] = useState(present.includes(initialCategory as never) ? initialCategory : "all");
  const filtered = products.filter((p) => active === "all" || p.category === active);
  const shown = limit ? filtered.slice(0, limit) : filtered;
  return (
    <div>
      <FilterBar
        label="Filter kategori produk"
        options={present.map((c) => ({ value: c, label: labels[c] ?? c }))}
        active={active}
        onChange={(v) => {
          setActive(v);
          track("portfolio_filter", { scope: "products", category: v });
        }}
      />
      {shown.length === 0 ? (
        <p className="border border-rule p-6 text-quiet">Belum ada produk di kategori ini.</p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {shown.map((p) => (
            <li key={p.slug} className="relative">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ProjectBrowser({
  projects,
  labels,
  typeLabels,
}: {
  projects: Project[];
  labels: Record<string, string>;
  typeLabels: Record<string, string>;
}) {
  const [active, setActive] = useState("all");
  const present = Array.from(new Set(projects.map((p) => p.category)));
  const filtered = projects.filter((p) => active === "all" || p.category === active);
  return (
    <div>
      <FilterBar
        label="Filter kategori portofolio"
        options={present.map((c) => ({ value: c, label: labels[c] ?? c }))}
        active={active}
        onChange={(v) => {
          setActive(v);
          track("portfolio_filter", { scope: "portfolio", category: v });
        }}
      />
      {filtered.length === 0 ? (
        <p className="border border-rule p-6 text-quiet">Belum ada karya di kategori ini.</p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {filtered.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
      )}
      <p className="sr-only">{Object.keys(typeLabels).length} jenis proyek tersedia pada label kartu.</p>
    </div>
  );
}
