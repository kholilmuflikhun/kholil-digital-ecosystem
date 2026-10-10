export type SalesMathInput = {
  requiredRevenue: number;
  averageOrderValue: number;
  /** lead terkualifikasi → transaksi (0-1) */
  conversionRate: number;
  /** prospek → lead terkualifikasi (0-1) */
  qualificationRate: number;
  /** outreach → respons (0-1) */
  responseRate: number;
};

export type SalesMathResult = {
  requiredTransactions: number;
  requiredQualifiedLeads: number;
  requiredProspects: number;
  requiredOutreach: number;
};

function safeDivide(a: number, b: number): number | null {
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= 0) return null;
  return a / b;
}

/**
 * Reverse-engineer target pendapatan menjadi aktivitas yang dibutuhkan.
 * Mengembalikan null bila ada parameter yang belum valid (<= 0), agar UI
 * bisa meminta pengguna melengkapi pengaturan, bukan menampilkan angka palsu.
 */
export function calculateSalesMath(input: SalesMathInput): SalesMathResult | null {
  const transactions = safeDivide(input.requiredRevenue, input.averageOrderValue);
  if (transactions === null) return null;
  const leads = safeDivide(transactions, input.conversionRate);
  if (leads === null) return null;
  const prospects = safeDivide(leads, input.qualificationRate);
  if (prospects === null) return null;
  const outreach = safeDivide(prospects, input.responseRate);
  if (outreach === null) return null;

  return {
    requiredTransactions: Math.ceil(transactions),
    requiredQualifiedLeads: Math.ceil(leads),
    requiredProspects: Math.ceil(prospects),
    requiredOutreach: Math.ceil(outreach),
  };
}
