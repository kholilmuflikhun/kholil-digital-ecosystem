import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { registerAction } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Daftar" };

export default function RegisterPage() {
  if (process.env.ALLOW_SIGNUP === "false") redirect("/login");
  return <AuthForm mode="register" action={registerAction} />;
}
