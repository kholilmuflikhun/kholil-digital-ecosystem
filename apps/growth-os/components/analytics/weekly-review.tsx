"use client";

import { useState, useTransition } from "react";
import { saveWeeklyReview } from "@/lib/actions/business";
import { buttonClass } from "@/components/ui/primitives";

const STEPS = [
  { title: "Pendapatan", questions: [["rev_amount", "Berapa pendapatan minggu ini?"], ["rev_profit", "Berapa profitnya?"], ["rev_source", "Sumber pendapatan utama?"]] },
  { title: "Penjualan", questions: [["sales_prospects", "Berapa prospek yang ditangani?"], ["sales_conversations", "Berapa percakapan yang terjadi?"], ["sales_proposals", "Berapa proposal terkirim?"], ["sales_won", "Berapa transaksi berhasil?"], ["sales_lost", "Mengapa transaksi tidak berhasil?"]] },
  { title: "Pemasaran", questions: [["mkt_content", "Konten mana yang paling efektif?"], ["mkt_leads", "Konten mana yang menghasilkan lead?"], ["mkt_channel", "Kanal mana yang paling efektif?"]] },
  { title: "Operasional", questions: [["ops_time", "Apa yang paling menyita waktu?"], ["ops_profitable", "Proyek mana yang menguntungkan?"], ["ops_bottleneck", "Apa hambatan utama?"]] },
  { title: "Strategi", questions: [["str_continue", "Apa yang perlu dilanjutkan?"], ["str_stop", "Apa yang perlu dihentikan?"], ["str_improve", "Apa yang perlu diperbaiki?"], ["str_test", "Apa yang perlu diuji berikutnya?"]] },
] as const;

export function WeeklyReview({ weekStart, initial }: { weekStart: string; initial: Record<string, string> }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const s = STEPS[step];

  function save() {
    start(async () => {
      const clean = Object.fromEntries(Object.entries(answers).filter(([, v]) => v.trim()));
      const res = await saveWeeklyReview({ weekStart, answers: clean });
      setMsg(res.ok ? "Tinjauan mingguan tersimpan." : res.error);
    });
  }

  return (
    <div>
      <ol className="mb-4 flex flex-wrap gap-1.5" aria-label="Langkah review">
        {STEPS.map((st, i) => (
          <li key={st.title}>
            <button type="button" onClick={() => setStep(i)} aria-current={i === step ? "step" : undefined}
              className={`rounded-full border px-3 py-1 text-xs ${i === step ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted"}`}>
              {i + 1}. {st.title}
            </button>
          </li>
        ))}
      </ol>
      <div className="grid gap-3">
        {s.questions.map(([key, q]) => (
          <label key={key} className="grid gap-1 text-sm">
            {q}
            <textarea
              rows={2} value={answers[key] ?? ""} maxLength={3000}
              onChange={(e) => setAnswers((a) => ({ ...a, [key]: e.target.value }))}
              className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </label>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <p role="status" className="text-xs text-muted-foreground">{msg}</p>
        <div className="flex gap-2">
          <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)} className={buttonClass("ghost")}>Kembali</button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={() => setStep(step + 1)} className={buttonClass()}>Lanjut</button>
          ) : null}
          <button type="button" disabled={pending} onClick={save} className={buttonClass(step === STEPS.length - 1 ? "primary" : "ghost")}>{pending ? "Menyimpan…" : "Simpan"}</button>
        </div>
      </div>
    </div>
  );
}
