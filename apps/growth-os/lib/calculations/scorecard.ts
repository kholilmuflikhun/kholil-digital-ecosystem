export type ScoreThresholds = {
  critical: number; // di bawah ini = Critical (default 50)
  needsWork: number; // di bawah ini = Needs Improvement (default 70)
  onTrack: number; // di bawah ini = On Track (default 90)
};

export const DEFAULT_THRESHOLDS: ScoreThresholds = {
  critical: 50,
  needsWork: 70,
  onTrack: 90,
};

export type ScoreLabel = "Critical" | "Needs Improvement" | "On Track" | "Excellent";

export function executionScore(completed: number, planned: number): number | null {
  if (planned <= 0) return null;
  return Math.min(100, Math.round((completed / planned) * 100));
}

export function scoreLabel(
  score: number,
  t: ScoreThresholds = DEFAULT_THRESHOLDS,
): ScoreLabel {
  if (score < t.critical) return "Critical";
  if (score < t.needsWork) return "Needs Improvement";
  if (score < t.onTrack) return "On Track";
  return "Excellent";
}
