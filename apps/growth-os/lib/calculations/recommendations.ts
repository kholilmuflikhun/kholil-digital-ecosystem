export type RecommendationInput = {
  weightedPipeline: number;
  pipelineTarget: number | null;
  proposalsSent: number;
  closingRate: number | null; // %
  grossRevenue: number;
  profitMargin: number | null; // %
  customers: number;
  repeatPurchaseRate: number | null; // %
  topContentLeads: number;
  overdueFollowUps: number;
};

export type Recommendation = {
  id: string;
  priority: "high" | "medium" | "low";
  text: string;
};

export function generateRecommendations(i: RecommendationInput): Recommendation[] {
  const out: Recommendation[] = [];

  if (i.pipelineTarget !== null && i.pipelineTarget > 0 && i.weightedPipeline < i.pipelineTarget) {
    out.push({ id: "prospecting", priority: "high", text: "Tingkatkan aktivitas pencarian prospek." });
  }

  if (i.proposalsSent >= 5 && i.closingRate !== null && i.closingRate < 25) {
    out.push({
      id: "closing",
      priority: "high",
      text: "Tinjau harga, kejelasan penawaran, penanganan keberatan, dan tindak lanjut.",
    });
  }

  if (i.grossRevenue > 0 && i.profitMargin !== null && i.profitMargin < 20) {
    out.push({ id: "margin", priority: "high", text: "Tinjau biaya dan harga." });
  }

  if (i.customers >= 5 && i.repeatPurchaseRate !== null && i.repeatPurchaseRate < 20) {
    out.push({
      id: "retention",
      priority: "medium",
      text: "Susun kampanye retensi dan pembelian ulang.",
    });
  }

  if (i.topContentLeads >= 3) {
    out.push({
      id: "repurpose",
      priority: "low",
      text: "Adaptasi konten ke beberapa format.",
    });
  }

  if (i.overdueFollowUps > 0) {
    out.push({
      id: "followups",
      priority: "high",
      text: `Tindak lanjuti ${i.overdueFollowUps} prospek yang melewati jadwal.`,
    });
  }

  return out;
}
