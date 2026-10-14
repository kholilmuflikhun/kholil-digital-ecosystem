import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { saveStrategy } from "@/lib/actions/business";
import { Card, PageHeader } from "@/components/ui/primitives";
import { StrategyForm } from "@/components/strategy-form";

export const metadata: Metadata = { title: "Strategi" };
export const dynamic = "force-dynamic";

export default async function StrategyPage() {
  const userId = await requireUserId();
  const s = await db.strategy.findUnique({ where: { userId } });
  return (
    <>
      <PageHeader title="Strategi" description="Tetapkan arah bisnis sebagai acuan aktivitas." />
      <Card>
        <StrategyForm
          action={saveStrategy}
          initial={{
            vision: s?.vision ?? "", mission: s?.mission ?? "", positioning: s?.positioning ?? "",
            valueProposition: s?.valueProposition ?? "", idealCustomer: s?.idealCustomer ?? "",
            offersSummary: s?.offersSummary ?? "", acquisitionChannels: s?.acquisitionChannels ?? "",
            growthStrategy: s?.growthStrategy ?? "", competitiveEdge: s?.competitiveEdge ?? "",
          }}
        />
      </Card>
    </>
  );
}
