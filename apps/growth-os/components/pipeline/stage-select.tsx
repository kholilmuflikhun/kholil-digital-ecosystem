"use client";

import { useTransition } from "react";
import { DEAL_STAGES, DEAL_STAGE_LABELS } from "@/lib/constants";
import { moveDealStage } from "@/lib/actions/crm";

export function StageSelect({ id, stage }: { id: string; stage: (typeof DEAL_STAGES)[number] }) {
  const [pending, start] = useTransition();
  return (
    <select
      aria-label="Pindah tahap" value={stage} disabled={pending}
      onChange={(e) => {
        const next = e.target.value as (typeof DEAL_STAGES)[number];
        let lostReason: string | undefined;
        if (next === "LOST") lostReason = prompt("Alasan kalah?") ?? undefined;
        start(async () => void (await moveDealStage({ id, stage: next, lostReason })));
      }}
      className="h-8 w-full rounded-md border bg-background px-2 text-xs"
    >
      {DEAL_STAGES.map((s) => <option key={s} value={s}>{DEAL_STAGE_LABELS[s]}</option>)}
    </select>
  );
}
