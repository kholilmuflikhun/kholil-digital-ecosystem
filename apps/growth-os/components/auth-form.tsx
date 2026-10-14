"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { buttonClass } from "@/components/ui/primitives";

type State = { ok: boolean; error?: string; fieldErrors?: Record<string, string[]> } | null;

export function AuthForm({
  mode, action,
}: {
  mode: "login" | "register";
  action: (state: State, formData: FormData) => Promise<State>;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const isLogin = mode === "login";
  const input = "h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2 font-semibold">
          <Rocket className="h-5 w-5 text-primary" /> Growth OS
        </div>
        <h1 className="text-xl font-semibold">{isLogin ? "Masuk" : "Buat akun"}</h1>
        <form action={formAction} className="mt-4 grid gap-3">
          {!isLogin && (
            <label className="grid gap-1 text-sm">
              Nama
              <input name="name" required autoComplete="name" className={input} />
              {state?.fieldErrors?.name?.[0] && <span className="text-xs text-danger">{state.fieldErrors.name[0]}</span>}
            </label>
          )}
          <label className="grid gap-1 text-sm">
            Email
            <input name="email" type="email" required autoComplete="email" className={input} />
            {state?.fieldErrors?.email?.[0] && <span className="text-xs text-danger">{state.fieldErrors.email[0]}</span>}
          </label>
          <label className="grid gap-1 text-sm">
            Kata sandi
            <input name="password" type="password" required minLength={isLogin ? 1 : 8} autoComplete={isLogin ? "current-password" : "new-password"} className={input} />
            {state?.fieldErrors?.password?.[0] && <span className="text-xs text-danger">{state.fieldErrors.password[0]}</span>}
          </label>
          <p role="alert" className="min-h-4 text-xs text-danger">{state && !state.ok ? state.error : ""}</p>
          <button disabled={pending} className={buttonClass() + " !h-10"}>
            {pending ? "Memproses…" : isLogin ? "Masuk" : "Daftar"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
          <Link href={isLogin ? "/register" : "/login"} className="font-medium text-primary hover:underline">
            {isLogin ? "Daftar" : "Masuk"}
          </Link>
        </p>
        {isLogin && (
          <p className="mt-3 rounded-md bg-muted p-2 text-center text-xs text-muted-foreground">
            Akun demo: demo@growthos.app / demo12345
          </p>
        )}
      </div>
    </main>
  );
}
