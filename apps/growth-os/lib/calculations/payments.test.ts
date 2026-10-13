import { describe, expect, it } from "vitest";
import { derivePaymentStatus, exceedsGross, sumPaid } from "./payments";

const past = new Date("2026-01-01");
const future = new Date("2099-01-01");

describe("pembayaran bertahap", () => {
  it("menjumlahkan tanpa galat desimal", () => {
    expect(sumPaid([0.1, 0.2])).toBe(0.3);
  });
  it("status PAID bila total terbayar >= nilai transaksi", () => {
    expect(derivePaymentStatus({ gross: 1000, paid: 1000, current: "PENDING" })).toBe("PAID");
  });
  it("PARTIAL bila sebagian dibayar dan belum jatuh tempo", () => {
    expect(derivePaymentStatus({ gross: 1000, paid: 400, dueDate: future, current: "PENDING" })).toBe("PARTIAL");
  });
  it("PENDING bila belum ada pembayaran", () => {
    expect(derivePaymentStatus({ gross: 1000, paid: 0, current: "PARTIAL" })).toBe("PENDING");
  });
  it("OVERDUE bila ada sisa dan lewat jatuh tempo", () => {
    expect(derivePaymentStatus({ gross: 1000, paid: 400, dueDate: past, current: "PARTIAL", now: new Date("2026-06-01") })).toBe("OVERDUE");
  });
  it("CANCELLED tidak pernah diubah otomatis", () => {
    expect(derivePaymentStatus({ gross: 1000, paid: 1000, current: "CANCELLED" })).toBe("CANCELLED");
  });
  it("menolak pembayaran yang melebihi sisa tagihan", () => {
    expect(exceedsGross(1000, 600, 400)).toBe(false);
    expect(exceedsGross(1000, 600, 400.01)).toBe(true);
  });
});
