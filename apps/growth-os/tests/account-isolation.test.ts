import { beforeEach, describe, expect, it, vi } from "vitest";

const CUID = (s: string) => `c${s.padEnd(12, "x")}`;
const A = "userA";

const { tx, dbMock } = vi.hoisted(() => {
const tx = {
  revenue: { findFirst: vi.fn(), update: vi.fn() },
  payment: { create: vi.fn(), findFirst: vi.fn(), delete: vi.fn() },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dbMock: Record<string, any> = {
  customer: { deleteMany: vi.fn(), findFirst: vi.fn(), updateMany: vi.fn() },
  testimonial: { create: vi.fn(), updateMany: vi.fn(), deleteMany: vi.fn() },
  referral: { create: vi.fn() },
  prospect: { findFirst: vi.fn() },
  expense: { updateMany: vi.fn(), deleteMany: vi.fn(), create: vi.fn() },
  notification: { updateMany: vi.fn() },
  $transaction: vi.fn(async (fn: (t: typeof tx) => unknown) => fn(tx)),
};
return { tx, dbMock };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));
vi.mock("@/lib/auth/session", () => ({ requireUserId: async () => A }));
vi.mock("@/lib/utils/rate-limit", () => ({ rateLimit: async () => ({ ok: true, retryAfterMs: 0 }) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/notifications/service", () => ({ generateNotificationsFor: vi.fn() }));
vi.mock("@/lib/data/goal-sync", () => ({ syncGoalProgress: vi.fn() }));

import { deleteCustomer } from "@/lib/actions/crm";
import { savePayment, saveExpense, deleteExpense } from "@/lib/actions/business";
import { saveTestimonial, saveReferral, markNotificationRead } from "@/lib/actions/retention";

beforeEach(() => {
  vi.clearAllMocks();
  dbMock.$transaction.mockImplementation(async (fn: (t: typeof tx) => unknown) => fn(tx));
});

describe("isolasi akun: setiap query memakai userId dari sesi server", () => {
  it("deleteCustomer menyaring dengan userId sesi", async () => {
    dbMock.customer.deleteMany.mockResolvedValue({ count: 0 });
    await deleteCustomer({ id: CUID("cust1") });
    expect(dbMock.customer.deleteMany).toHaveBeenCalledWith({ where: { id: CUID("cust1"), userId: A } });
  });

  it("deleteExpense dan markNotificationRead menyaring dengan userId sesi", async () => {
    dbMock.expense.deleteMany.mockResolvedValue({ count: 0 });
    dbMock.notification.updateMany.mockResolvedValue({ count: 0 });
    await deleteExpense({ id: CUID("exp1") });
    await markNotificationRead({ id: CUID("n1") });
    expect(dbMock.expense.deleteMany.mock.calls[0]![0].where).toEqual({ id: CUID("exp1"), userId: A });
    expect(dbMock.notification.updateMany.mock.calls[0]![0].where).toMatchObject({ id: CUID("n1"), userId: A });
  });

  it("saveExpense edit milik orang lain => gagal (count 0), userId ikut di where", async () => {
    dbMock.expense.updateMany.mockResolvedValue({ count: 0 });
    const r = await saveExpense({ date: "2026-10-01", category: "Iklan", amount: 1000 }, CUID("exp9"));
    expect(r.ok).toBe(false);
    expect(dbMock.expense.updateMany.mock.calls[0]![0].where).toEqual({ id: CUID("exp9"), userId: A });
  });

  it("userId dari klien diabaikan pada saveTestimonial (data memakai sesi)", async () => {
    dbMock.customer.findFirst.mockResolvedValue({ id: CUID("cust1") });
    await saveTestimonial({ customerId: CUID("cust1"), quote: "Pelayanannya bagus sekali", userId: "attacker" });
    expect(dbMock.testimonial.create.mock.calls[0]![0].data.userId).toBe(A);
  });

  it("saveTestimonial dengan pelanggan milik akun lain ditolak dan tidak menulis", async () => {
    dbMock.customer.findFirst.mockResolvedValue(null);
    const r = await saveTestimonial({ customerId: CUID("other"), quote: "Pelayanannya bagus sekali" });
    expect(r.ok).toBe(false);
    expect(dbMock.customer.findFirst.mock.calls[0]![0].where).toEqual({ id: CUID("other"), userId: A });
    expect(dbMock.testimonial.create).not.toHaveBeenCalled();
  });

  it("saveReferral dengan prospek milik akun lain ditolak", async () => {
    dbMock.customer.findFirst.mockResolvedValue({ id: CUID("cust1") });
    dbMock.prospect.findFirst.mockResolvedValue(null);
    const r = await saveReferral({ referrerId: CUID("cust1"), referredName: "Andi", referredProspectId: CUID("pOther") });
    expect(r.ok).toBe(false);
    expect(dbMock.referral.create).not.toHaveBeenCalled();
  });
});

describe("savePayment", () => {
  const input = { revenueId: CUID("rev1"), amount: 400, paidAt: "2026-10-10" };

  it("transaksi milik akun lain => ditolak dan tidak ada pembayaran dibuat", async () => {
    tx.revenue.findFirst.mockResolvedValue(null);
    const r = await savePayment(input);
    expect(r.ok).toBe(false);
    expect(tx.revenue.findFirst.mock.calls[0]![0].where).toEqual({ id: CUID("rev1"), userId: A });
    expect(tx.payment.create).not.toHaveBeenCalled();
  });

  it("menolak pembayaran melebihi sisa tagihan", async () => {
    tx.revenue.findFirst.mockResolvedValue({ id: CUID("rev1"), grossRevenue: 1000, paymentStatus: "PARTIAL", dueDate: null, payments: [{ amount: 700 }] });
    const r = await savePayment(input);
    expect(r).toMatchObject({ ok: false });
    expect(tx.payment.create).not.toHaveBeenCalled();
  });

  it("pembayaran valid: dicatat dengan userId sesi dan status dihitung ulang", async () => {
    tx.revenue.findFirst
      .mockResolvedValueOnce({ id: CUID("rev1"), grossRevenue: 1000, paymentStatus: "PENDING", dueDate: null, payments: [{ amount: 600 }] })
      .mockResolvedValueOnce({ id: CUID("rev1"), grossRevenue: 1000, paymentStatus: "PENDING", dueDate: null, payments: [{ amount: 600 }, { amount: 400 }] });
    const r = await savePayment(input);
    expect(r.ok).toBe(true);
    expect(tx.payment.create.mock.calls[0]![0].data.userId).toBe(A);
    expect(tx.revenue.update).toHaveBeenCalledWith({ where: { id: CUID("rev1") }, data: { paymentStatus: "PAID" } });
  });

  it("transaksi dibatalkan tidak menerima pembayaran", async () => {
    tx.revenue.findFirst.mockResolvedValue({ id: CUID("rev1"), grossRevenue: 1000, paymentStatus: "CANCELLED", dueDate: null, payments: [] });
    expect((await savePayment(input)).ok).toBe(false);
    expect(tx.payment.create).not.toHaveBeenCalled();
  });
});
