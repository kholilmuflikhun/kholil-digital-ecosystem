export type ScoreThresholds = {
  critical: number;
  needsWork: number;
  onTrack: number;
};

export const DEFAULT_THRESHOLDS: ScoreThresholds = {
  critical: 50,
  needsWork: 70,
  onTrack: 90,
};

export type ScoreLabel = "Kritis" | "Perlu ditingkatkan" | "Sesuai target" | "Unggul";

export function executionScore(completed: number, planned: number): number | null {
  if (planned <= 0) return null;
  return Math.min(100, Math.round((completed / planned) * 100));
}

export function scoreLabel(
  score: number,
  t: ScoreThresholds = DEFAULT_THRESHOLDS,
): ScoreLabel {
  if (score < t.critical) return "Kritis";
  if (score < t.needsWork) return "Perlu ditingkatkan";
  if (score < t.onTrack) return "Sesuai target";
  return "Unggul";
}
