export type FunnelCounts = {
  audience: number; // jangkauan konten (reach)
  prospects: number;
  qualifiedLeads: number;
  conversations: number;
  offers: number; // proposal terkirim
  won: number;
  customers: number;
  repeatCustomers: number;
  referrals: number;
};

export type FunnelStage = {
  key: keyof FunnelCounts;
  label: string;
  count: number;
  /** konversi dari tahap sebelumnya (%) atau null bila tidak dapat dihitung */
  conversionFromPrev: number | null;
};

const STAGES: { key: keyof FunnelCounts; label: string }[] = [
  { key: "audience", label: "Audience" },
  { key: "prospects", label: "Prospek" },
  { key: "qualifiedLeads", label: "Lead Terkualifikasi" },
  { key: "conversations", label: "Percakapan" },
  { key: "offers", label: "Penawaran" },
  { key: "won", label: "Deal Won" },
  { key: "customers", label: "Pelanggan" },
  { key: "repeatCustomers", label: "Pelanggan Berulang" },
  { key: "referrals", label: "Referral" },
];

export function buildFunnel(counts: FunnelCounts): FunnelStage[] {
  return STAGES.map((stage, i) => {
    const count = counts[stage.key];
    const prev = i > 0 ? counts[STAGES[i - 1].key] : null;
    return {
      key: stage.key,
      label: stage.label,
      count,
      conversionFromPrev: prev !== null && prev > 0 ? (count / prev) * 100 : null,
    };
  });
}

/** Tahap dengan konversi terendah = titik kebocoran funnel. */
export function findBiggestLeak(stages: FunnelStage[]): FunnelStage | null {
  const measurable = stages.filter(
    (s) => s.conversionFromPrev !== null && s.key !== "audience" && s.key !== "referrals",
  );
  if (measurable.length === 0) return null;
  return measurable.reduce((min, s) =>
    (s.conversionFromPrev as number) < (min.conversionFromPrev as number) ? s : min,
  );
}
