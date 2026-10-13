export type PaymentStatusValue = "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" | "CANCELLED";

/** Total terbayar dalam satuan sen (hindari galat floating point). */
const cents = (n: number) => Math.round(n * 100);

export function sumPaid(amounts: number[]): number {
  return amounts.reduce((a, b) => a + cents(b), 0) / 100;
}

/**
 * Status pembayaran turunan dari total pembayaran bertahap.
 * CANCELLED tidak pernah diubah otomatis. Sisa tagihan lewat jatuh tempo => OVERDUE.
 */
export function derivePaymentStatus(input: {
  gross: number;
  paid: number;
  dueDate?: Date | null;
  current: PaymentStatusValue;
  now?: Date;
}): PaymentStatusValue {
  if (input.current === "CANCELLED") return "CANCELLED";
  const gross = cents(input.gross);
  const paid = cents(input.paid);
  if (gross > 0 && paid >= gross) return "PAID";
  if (gross === 0 && paid > 0) return "PAID";
  const overdue = input.dueDate ? input.dueDate.getTime() < (input.now ?? new Date()).getTime() : false;
  if (overdue) return "OVERDUE";
  return paid > 0 ? "PARTIAL" : "PENDING";
}

/** True bila pembayaran baru akan melebihi nilai transaksi. */
export function exceedsGross(gross: number, alreadyPaid: number, amount: number): boolean {
  return cents(alreadyPaid) + cents(amount) > cents(gross);
}
