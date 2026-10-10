import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { loginAction } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return <AuthForm mode="login" action={loginAction} />;
}
