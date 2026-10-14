export const NOT_ENOUGH_DATA = "Data belum mencukupi.";

export type OfferStat = { name: string; revenue: number; cost: number; count: number };
export type ContentStat = { title: string; pillar: string; leads: number; revenue: number };

export type InsightSnapshot = {
  offers: OfferStat[];
  /** AOV bulan ini dan bulan lalu (null bila tidak ada transaksi) */
  aovThisPeriod: number | null;
  aovPreviousPeriod: number | null;
  followUpWinRate: number | null; // %
  coldOutreachWinRate: number | null; // %
  followUpSample: number;
  coldSample: number;
  contents: ContentStat[];
  /** pelanggan yang belum membeli lagi dalam N hari */
  dormantCustomers: number;
  dormantWindowDays: number;
  pipelineValue: number;
  proposalToCloseRate: number | null; // %
  proposalSample: number;
};

export type Insight = { id: string; tone: "positive" | "neutral" | "warning"; text: string };

const MIN_SAMPLE = 3;

export function generateInsights(s: InsightSnapshot): Insight[] {
  const out: Insight[] = [];

  // 1. Penawaran dengan pendapatan terbesar
  const withRevenue = s.offers.filter((o) => o.revenue > 0);
  if (withRevenue.length >= 2) {
    const top = [...withRevenue].sort((a, b) => b.revenue - a.revenue)[0];
    out.push({
      id: "top-offer",
      tone: "positive",
      text: `Pendapatan terbesar berasal dari "${top.name}".`,
    });
  }

  // 2. Pendapatan tinggi tapi margin rendah
  const lowMargin = withRevenue
    .filter((o) => o.count >= 2)
    .map((o) => ({ ...o, margin: ((o.revenue - o.cost) / o.revenue) * 100 }))
    .filter((o) => o.margin < 25)
    .sort((a, b) => b.revenue - a.revenue)[0];
  if (lowMargin) {
    out.push({
      id: "low-margin",
      tone: "warning",
      text: `"${lowMargin.name}" menghasilkan pendapatan tinggi tetapi margin hanya ${lowMargin.margin.toFixed(0)}%.`,
    });
  }

  // 3. Tren AOV
  if (s.aovThisPeriod !== null && s.aovPreviousPeriod !== null && s.aovPreviousPeriod > 0) {
    if (s.aovThisPeriod > s.aovPreviousPeriod) {
      out.push({
        id: "aov-up",
        tone: "positive",
        text: "Rata-rata nilai pesanan naik dibanding periode sebelumnya.",
      });
    } else if (s.aovThisPeriod < s.aovPreviousPeriod) {
      out.push({
        id: "aov-down",
        tone: "warning",
        text: "Rata-rata nilai pesanan turun dibanding periode sebelumnya.",
      });
    }
  }

  // 4. Follow-up vs cold outreach
  if (
    s.followUpWinRate !== null &&
    s.coldOutreachWinRate !== null &&
    s.followUpSample >= MIN_SAMPLE &&
    s.coldSample >= MIN_SAMPLE &&
    s.followUpWinRate > s.coldOutreachWinRate
  ) {
    out.push({
      id: "followup-better",
      tone: "positive",
      text: "Tindak lanjut menghasilkan konversi lebih tinggi daripada kontak awal.",
    });
  }

  // 5. Konten terbaik berdasarkan lead
  const topContent = [...s.contents].filter((c) => c.leads > 0).sort((a, b) => b.leads - a.leads)[0];
  if (topContent && s.contents.filter((c) => c.leads > 0).length >= 2) {
    out.push({
      id: "top-content",
      tone: "positive",
      text: `Konten "${topContent.title}" (${topContent.pillar}) menghasilkan lead terbanyak: ${topContent.leads}.`,
    });
  }

  // 6. Pelanggan dorman
  if (s.dormantCustomers > 0) {
    out.push({
      id: "dormant",
      tone: "warning",
      text: `${s.dormantCustomers} pelanggan belum membeli lagi dalam ${s.dormantWindowDays} hari.`,
    });
  }

  // 7. Pipeline kuat tapi closing rendah
  if (
    s.proposalToCloseRate !== null &&
    s.proposalSample >= MIN_SAMPLE &&
    s.pipelineValue > 0 &&
    s.proposalToCloseRate < 25
  ) {
    out.push({
      id: "weak-close",
      tone: "warning",
      text: "Konversi proposal ke transaksi masih rendah.",
    });
  }

  return out;
}
