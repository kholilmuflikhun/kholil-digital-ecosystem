import { differenceInCalendarDays, startOfDay } from "date-fns";

export type GoalProgressInput = {
  targetValue: number;
  currentValue: number;
  startDate: Date;
  endDate: Date;
  now?: Date;
};

export type GoalProgress = {
  progressPct: number;
  remaining: number;
  daysTotal: number;
  daysElapsed: number;
  daysLeft: number;
  dailyRequiredPace: number;
  weeklyRequiredPace: number;
  /** proyeksi nilai akhir bila laju saat ini dipertahankan */
  projectedResult: number;
  /** projectedResult - target (negatif = di bawah target) */
  variance: number;
  onTrack: boolean;
};

export function calculateGoalProgress(input: GoalProgressInput): GoalProgress {
  const now = startOfDay(input.now ?? new Date());
  const start = startOfDay(input.startDate);
  const end = startOfDay(input.endDate);

  const daysTotal = Math.max(1, differenceInCalendarDays(end, start) + 1);
  const rawElapsed = differenceInCalendarDays(now, start) + 1;
  const daysElapsed = Math.min(daysTotal, Math.max(0, rawElapsed));
  const daysLeft = Math.max(0, daysTotal - daysElapsed);

  const target = input.targetValue;
  const current = input.currentValue;
  const remaining = Math.max(0, target - current);
  const progressPct = target > 0 ? Math.min(100, (current / target) * 100) : 0;

  const dailyRequiredPace = daysLeft > 0 ? remaining / daysLeft : remaining;
  const weeklyRequiredPace = dailyRequiredPace * 7;

  const projectedResult =
    daysElapsed > 0 ? (current / daysElapsed) * daysTotal : current;
  const variance = projectedResult - target;

  return {
    progressPct,
    remaining,
    daysTotal,
    daysElapsed,
    daysLeft,
    dailyRequiredPace,
    weeklyRequiredPace,
    projectedResult,
    variance,
    onTrack: variance >= 0,
  };
}
