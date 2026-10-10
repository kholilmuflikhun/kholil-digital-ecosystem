const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

export const GOAL_CATEGORY = toOptions({
  REVENUE: "Pendapatan", PROFIT: "Profit", SALES: "Penjualan", CUSTOMERS: "Pelanggan", LEADS: "Lead",
  CONTENT: "Konten", PROJECTS: "Proyek", PERSONAL_DEVELOPMENT: "Pengembangan diri", MARKETING: "Marketing",
  PRODUCT_DEVELOPMENT: "Pengembangan produk", CUSTOM: "Kustom",
});
export const GOAL_STATUS = toOptions({ ACTIVE: "Aktif", ACHIEVED: "Tercapai", PAUSED: "Dijeda", CANCELLED: "Dibatalkan" });
export const PRIORITY = toOptions({ LOW: "Rendah", MEDIUM: "Sedang", HIGH: "Tinggi", CRITICAL: "Kritis" });
export const TASK_CATEGORY = toOptions({
  REVENUE: "Pendapatan", SALES: "Penjualan", PROSPECTING: "Prospecting", FOLLOW_UP: "Follow-up",
  CONTENT: "Konten", DELIVERY: "Delivery", STRATEGIC: "Strategis", OTHER: "Lainnya",
});
export const PROSPECT_STATUS = toOptions({
  NEW: "New", CONTACTED: "Contacted", RESPONDED: "Responded", QUALIFIED: "Qualified",
  PROPOSAL_SENT: "Proposal Sent", NEGOTIATION: "Negotiation", WON: "Won", LOST: "Lost", DORMANT: "Dormant",
});
export const DEAL_STAGE = toOptions({
  LEAD: "Lead", CONTACTED: "Contacted", QUALIFIED: "Qualified", DISCOVERY: "Discovery",
  PROPOSAL: "Proposal", NEGOTIATION: "Negotiation", WON: "Won", LOST: "Lost",
});
export const PROJECT_STATUS = toOptions({
  PLANNING: "Planning", WAITING_FOR_CONTENT: "Waiting for Content", IN_PROGRESS: "In Progress",
  REVIEW: "Review", REVISION: "Revision", COMPLETED: "Completed", ARCHIVED: "Archived",
});
export const PILLAR = toOptions({
  EDUCATION: "Education", PORTFOLIO: "Portfolio", CASE_STUDY: "Case Study", BEHIND_THE_SCENES: "Behind The Scenes",
  SELLING: "Selling", PERSONAL_BRAND: "Personal Brand", THOUGHT_LEADERSHIP: "Thought Leadership",
});
export const PLATFORM = toOptions({
  INSTAGRAM: "Instagram", TIKTOK: "TikTok", FACEBOOK: "Facebook", LINKEDIN: "LinkedIn",
  THREADS: "Threads", YOUTUBE: "YouTube", WEBSITE: "Website", OTHER: "Lainnya",
});
export const CONTENT_STATUS = toOptions({
  IDEA: "Idea", DRAFT: "Draft", READY: "Ready", SCHEDULED: "Scheduled",
  PUBLISHED: "Published", REPURPOSED: "Repurposed", ARCHIVED: "Archived",
});
export const PAYMENT_STATUS = toOptions({
  PENDING: "Pending", PARTIAL: "Partial", PAID: "Paid", OVERDUE: "Overdue", CANCELLED: "Cancelled",
});
export const CAMPAIGN_DURATION = [7, 14, 30, 60, 90].map((d) => ({ value: String(d), label: `${d} hari` }));

export const label = (opts: { value: string; label: string }[], v: string) => opts.find((o) => o.value === v)?.label ?? v;
export const pick = (rows: { id: string; name: string }[]) => rows.map((r) => ({ value: r.id, label: r.name }));
