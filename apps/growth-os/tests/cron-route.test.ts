import { beforeEach, describe, expect, it, vi } from "vitest";

const generate = vi.fn();
const sync = vi.fn();
const findMany = vi.fn();
vi.mock("@/lib/db", () => ({ db: { user: { findMany: (...a: unknown[]) => findMany(...a) } } }));
vi.mock("@/lib/notifications/service", () => ({ generateNotificationsFor: (...a: unknown[]) => generate(...a) }));
vi.mock("@/lib/data/goal-sync", () => ({ syncGoalProgress: (...a: unknown[]) => sync(...a) }));

import { GET } from "@/app/api/cron/notifications/route";

const SECRET = "s".repeat(40);
const req = (auth?: string) => new Request("http://localhost/api/cron/notifications", { headers: auth ? { authorization: auth } : {} });

beforeEach(() => {
  vi.stubEnv("CRON_SECRET", SECRET);
  generate.mockReset().mockResolvedValue(2);
  sync.mockReset().mockResolvedValue(0);
  findMany.mockReset().mockResolvedValue([{ id: "u1" }, { id: "u2" }]);
});

describe("GET /api/cron/notifications", () => {
  it("503 bila CRON_SECRET belum diatur atau terlalu pendek", async () => {
    vi.stubEnv("CRON_SECRET", "pendek");
    expect((await GET(req(`Bearer ${SECRET}`))).status).toBe(503);
  });
  it("401 tanpa atau dengan secret salah, tanpa query database", async () => {
    expect((await GET(req())).status).toBe(401);
    expect((await GET(req("Bearer salah"))).status).toBe(401);
    expect(findMany).not.toHaveBeenCalled();
  });
  it("200 memproses semua user", async () => {
    const res = await GET(req(`Bearer ${SECRET}`));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, users: 2, created: 4, failed: 0 });
  });
  it("kegagalan satu user tidak menghentikan user lain", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    generate.mockRejectedValueOnce(new Error("boom"));
    const body = await (await GET(req(`Bearer ${SECRET}`))).json();
    expect(body).toMatchObject({ users: 2, created: 2, failed: 1 });
    spy.mockRestore();
  });
});
