"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/auth";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { rateLimit } from "@/lib/utils/rate-limit";
import { parse, type ActionResult } from "./helpers";

export async function registerAction(_: unknown, formData: FormData): Promise<ActionResult> {
  if (process.env.ALLOW_SIGNUP === "false") return { ok: false, error: "Pendaftaran dinonaktifkan." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await rateLimit(`register:${ip}`, 5, 60 * 60_000)).ok) {
    return { ok: false, error: "Terlalu banyak percobaan. Coba lagi nanti." };
  }

  const p = parse(registerSchema, formData);
  if (!p.ok) return p;

  const exists = await db.user.findUnique({ where: { email: p.data.email }, select: { id: true } });
  if (exists) return { ok: false, error: "Email sudah terdaftar." };

  await db.user.create({
    data: {
      name: p.data.name,
      email: p.data.email,
      passwordHash: await bcrypt.hash(p.data.password, 12),
      settings: { create: {} },
      strategy: { create: {} },
    },
  });

  try {
    await signIn("credentials", { email: p.data.email, password: p.data.password, redirectTo: "/dashboard" });
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, error: "Akun dibuat, silakan login." };
    throw e; // redirect
  }
  return { ok: true };
}

export async function loginAction(_: unknown, formData: FormData): Promise<ActionResult> {
  const p = parse(loginSchema, formData);
  if (!p.ok) return p;
  try {
    await signIn("credentials", { ...p.data, redirectTo: "/dashboard" });
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, error: "Email atau password salah." };
    throw e; // redirect
  }
  return { ok: true };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
