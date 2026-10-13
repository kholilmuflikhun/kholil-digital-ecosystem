import { describe, expect, it } from "vitest";
import { buildNotifications, type NotificationSnapshot } from "./build";

const now = new Date(2026, 9, 13, 10, 0);
const base: NotificationSnapshot = { prospects: [], revenues: [], tasks: [], projects: [] };

describe("buildNotifications", () => {
  it("follow-up jatuh tempo membuat notifikasi dengan dedupeKey stabil", () => {
    const snap = { ...base, prospects: [{ id: "p1", name: "Budi", status: "NEW", nextFollowUpAt: new Date(2026, 9, 12) }] };
    const a = buildNotifications(snap, now);
    const b = buildNotifications(snap, new Date(2026, 9, 13, 23, 0));
    expect(a).toHaveLength(1);
    expect(a[0]!.dedupeKey).toBe("followup:p1:2026-10-12");
    expect(b[0]!.dedupeKey).toBe(a[0]!.dedupeKey);
  });
  it("mengabaikan prospek Won/Lost atau follow-up di masa depan", () => {
    const snap = {
      ...base,
      prospects: [
        { id: "p1", name: "A", status: "WON", nextFollowUpAt: new Date(2026, 9, 1) },
        { id: "p2", name: "B", status: "NEW", nextFollowUpAt: new Date(2026, 9, 20) },
      ],
    };
    expect(buildNotifications(snap, now)).toHaveLength(0);
  });
  it("tagihan lewat jatuh tempo hanya bila masih ada sisa", () => {
    const due = new Date(2026, 9, 1);
    const snap = {
      ...base,
      revenues: [
        { id: "r1", reference: "INV-1", customerName: "Kopi", dueDate: due, paymentStatus: "PARTIAL", outstanding: 500 },
        { id: "r2", reference: "INV-2", customerName: null, dueDate: due, paymentStatus: "PAID", outstanding: 0 },
      ],
    };
    const out = buildNotifications(snap, now);
    expect(out.map((n) => n.entityId)).toEqual(["r1"]);
    expect(out[0]!.type).toBe("OVERDUE_PAYMENT");
  });
  it("tugas prioritas tinggi dan deadline proyek 3 hari ke depan", () => {
    const snap = {
      ...base,
      tasks: [
        { id: "t1", title: "Kirim proposal", status: "TODO", dueDate: new Date(2026, 9, 13), priority: "HIGH" },
        { id: "t2", title: "Santai", status: "TODO", dueDate: new Date(2026, 9, 13), priority: "LOW" },
        { id: "t3", title: "Selesai", status: "DONE", dueDate: new Date(2026, 9, 13), priority: "CRITICAL" },
      ],
      projects: [
        { id: "j1", name: "Logo", status: "IN_PROGRESS", deadline: new Date(2026, 9, 15) },
        { id: "j2", name: "Jauh", status: "IN_PROGRESS", deadline: new Date(2026, 10, 30) },
        { id: "j3", name: "Arsip", status: "ARCHIVED", deadline: new Date(2026, 9, 14) },
      ],
    };
    const out = buildNotifications(snap, now);
    expect(out.map((n) => n.entityId).sort()).toEqual(["j1", "t1"]);
  });
});
