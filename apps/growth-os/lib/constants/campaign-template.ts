export type CampaignPhase = {
  phase: number;
  title: string;
  startDay: number;
  endDay: number;
  objectives: string[];
  kpis: string[];
};

/** Template bawaan 30 hari. Hanya contoh: pengguna bebas mengubah durasi, fase, dan target. */
export const DEFAULT_30_DAY_PHASES: CampaignPhase[] = [
  {
    phase: 1,
    title: "Build the Machine",
    startDay: 1,
    endDay: 7,
    objectives: [
      "Positioning",
      "Offer creation",
      "Portfolio",
      "Price list",
      "CRM setup",
      "Sales channel",
      "Prospect database",
      "First outreach",
    ],
    kpis: ["Prospects", "Conversations", "Proposals", "Content", "First sales"],
  },
  {
    phase: 2,
    title: "Acquire Customers",
    startDay: 8,
    endDay: 14,
    objectives: ["Prospecting", "Follow-up", "Content", "Sales", "Testimonials", "Case studies"],
    kpis: ["New prospects", "Response rate", "Conversion", "Revenue", "Testimonials"],
  },
  {
    phase: 3,
    title: "Increase Average Order Value",
    startDay: 15,
    endDay: 21,
    objectives: ["Package services", "Upselling", "Cross-selling", "Printing/apparel", "Bundles", "Higher-value offers"],
    kpis: ["Average order value", "Revenue per customer", "Upsell rate", "Cross-sell rate"],
  },
  {
    phase: 4,
    title: "Scale",
    startDay: 22,
    endDay: 30,
    objectives: ["Website", "Digital products", "Automation", "AI", "Repeat orders", "Referral system", "Process documentation"],
    kpis: ["Repeat customers", "Referral customers", "Digital product sales", "Automation", "Profit margin"],
  },
];

export const CAMPAIGN_DURATIONS = [7, 14, 30, 60, 90] as const;

/** Skala fase template ke durasi kampanye lain secara proporsional. */
export function scalePhases(durationDays: number): CampaignPhase[] {
  if (durationDays === 30) return DEFAULT_30_DAY_PHASES;
  const ratio = durationDays / 30;
  return DEFAULT_30_DAY_PHASES.map((p, idx, arr) => {
    const startDay = idx === 0 ? 1 : Math.round((p.startDay - 1) * ratio) + 1;
    const endDay = idx === arr.length - 1 ? durationDays : Math.max(startDay, Math.round(p.endDay * ratio));
    return { ...p, startDay, endDay };
  });
}
