import { z } from "zod";

const money = z.coerce.number().min(0, "Tidak boleh negatif").max(1e13);
const optionalText = z.string().trim().max(2000).optional().transform((v) => (v ? v : undefined));
const optionalDate = z
  .union([z.string(), z.date()])
  .optional()
  .transform((v) => (v ? new Date(v) : undefined))
  .refine((d) => d === undefined || !Number.isNaN(d.getTime()), "Tanggal tidak valid");
const requiredDate = z.coerce.date();
const pct = z.coerce.number().int().min(0).max(100);

export const goalSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    description: optionalText,
    category: z.enum([
      "REVENUE", "PROFIT", "SALES", "CUSTOMERS", "LEADS", "CONTENT", "PROJECTS",
      "PERSONAL_DEVELOPMENT", "MARKETING", "PRODUCT_DEVELOPMENT", "CUSTOM",
    ]),
    metric: z.string().trim().min(1).max(40),
    targetValue: money,
    currentValue: money.default(0),
    startDate: requiredDate,
    endDate: requiredDate,
    status: z.enum(["ACTIVE", "ACHIEVED", "PAUSED", "CANCELLED"]).default("ACTIVE"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  })
  .refine((g) => g.endDate >= g.startDate, { path: ["endDate"], message: "Tanggal akhir harus setelah tanggal mulai" });

export const taskSchema = z.object({
  title: z.string().trim().min(2).max(200),
  category: z.enum(["REVENUE", "SALES", "PROSPECTING", "FOLLOW_UP", "CONTENT", "DELIVERY", "STRATEGIC", "OTHER"]).default("OTHER"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  estimatedMinutes: z.coerce.number().int().min(0).max(1440).optional(),
  dueDate: optionalDate,
  prospectId: z.string().cuid().optional(),
  customerId: z.string().cuid().optional(),
  projectId: z.string().cuid().optional(),
  goalId: z.string().cuid().optional(),
});

export const taskStatusSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "SKIPPED"]),
});

export const prospectSchema = z.object({
  name: z.string().trim().min(2).max(120),
  businessName: optionalText,
  contact: optionalText,
  email: z.string().trim().email().optional().or(z.literal("").transform(() => undefined)),
  whatsapp: optionalText,
  instagram: optionalText,
  website: optionalText,
  industry: optionalText,
  location: optionalText,
  source: optionalText,
  potentialValue: money.default(0),
  probability: pct.default(10),
  status: z.enum(["NEW", "CONTACTED", "RESPONDED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST", "DORMANT"]).default("NEW"),
  notes: optionalText,
  nextFollowUpAt: optionalDate,
  offerId: z.string().cuid().optional().or(z.literal("").transform(() => undefined)),
  contentId: z.string().cuid().optional().or(z.literal("").transform(() => undefined)),
  isColdOutreach: z.coerce.boolean().default(false),
});

export const dealSchema = z.object({
  name: z.string().trim().min(2).max(160),
  prospectId: z.string().cuid(),
  offerId: z.string().cuid().optional().or(z.literal("").transform(() => undefined)),
  stage: z.enum(["LEAD", "CONTACTED", "QUALIFIED", "DISCOVERY", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]).default("LEAD"),
  value: money,
  probability: pct.default(10),
  expectedCloseDate: optionalDate,
  notes: optionalText,
  nextAction: optionalText,
  lostReason: optionalText,
});

export const dealStageSchema = z.object({
  id: z.string().cuid(),
  stage: z.enum(["LEAD", "CONTACTED", "QUALIFIED", "DISCOVERY", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]),
  lostReason: optionalText,
});

export const customerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  businessName: optionalText,
  email: z.string().trim().email().optional().or(z.literal("").transform(() => undefined)),
  whatsapp: optionalText,
  instagram: optionalText,
  referralSource: optionalText,
  notes: optionalText,
});

export const offerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(60),
  description: optionalText,
  price: money,
  cost: money.default(0),
  deliveryDays: z.coerce.number().int().min(0).max(365).optional(),
  revisionLimit: z.coerce.number().int().min(0).max(100).optional(),
  isActive: z.coerce.boolean().default(true),
  targetCustomer: optionalText,
  salesMessage: optionalText,
});

export const projectSchema = z.object({
  name: z.string().trim().min(2).max(160),
  customerId: z.string().cuid().optional().or(z.literal("").transform(() => undefined)),
  dealId: z.string().cuid().optional().or(z.literal("").transform(() => undefined)),
  offerId: z.string().cuid().optional().or(z.literal("").transform(() => undefined)),
  status: z.enum(["PLANNING", "WAITING_FOR_CONTENT", "IN_PROGRESS", "REVIEW", "REVISION", "COMPLETED", "ARCHIVED"]).default("PLANNING"),
  deadline: optionalDate,
  value: money.default(0),
  cost: money.default(0),
  completion: pct.default(0),
  hoursSpent: z.coerce.number().min(0).max(100000).default(0),
  revisions: z.coerce.number().int().min(0).default(0),
  notes: optionalText,
});

export const contentSchema = z.object({
  title: z.string().trim().min(2).max(200),
  platform: z.enum(["INSTAGRAM", "TIKTOK", "FACEBOOK", "LINKEDIN", "THREADS", "YOUTUBE", "WEBSITE", "OTHER"]),
  pillar: z.enum(["EDUCATION", "PORTFOLIO", "CASE_STUDY", "BEHIND_THE_SCENES", "SELLING", "PERSONAL_BRAND", "THOUGHT_LEADERSHIP"]),
  format: optionalText,
  status: z.enum(["IDEA", "DRAFT", "READY", "SCHEDULED", "PUBLISHED", "REPURPOSED", "ARCHIVED"]).default("IDEA"),
  publishDate: optionalDate,
  cta: optionalText,
  offerId: z.string().cuid().optional().or(z.literal("").transform(() => undefined)),
  campaignId: z.string().cuid().optional().or(z.literal("").transform(() => undefined)),
  reach: z.coerce.number().int().min(0).default(0),
  profileVisits: z.coerce.number().int().min(0).default(0),
  dms: z.coerce.number().int().min(0).default(0),
  productionCost: money.default(0),
});

export const revenueSchema = z.object({
  date: requiredDate,
  customerId: z.string().cuid().optional().or(z.literal("").transform(() => undefined)),
  offerId: z.string().cuid().optional().or(z.literal("").transform(() => undefined)),
  dealId: z.string().cuid().optional().or(z.literal("").transform(() => undefined)),
  grossRevenue: money,
  cost: money.default(0),
  paymentStatus: z.enum(["PENDING", "PARTIAL", "PAID", "OVERDUE", "CANCELLED"]).default("PENDING"),
  paymentMethod: optionalText,
  reference: optionalText,
  channel: optionalText,
  dueDate: optionalDate,
  notes: optionalText,
});

export const expenseSchema = z.object({
  date: requiredDate,
  category: z.string().trim().min(2).max(60),
  amount: money,
  note: optionalText,
});

export const campaignSchema = z.object({
  name: z.string().trim().min(2).max(120),
  durationDays: z.coerce.number().int().min(1).max(365),
  startDate: requiredDate,
  goalSummary: optionalText,
  strategy: optionalText,
  revenueTarget: money.optional(),
  salesTarget: z.coerce.number().int().min(0).optional(),
  contentTarget: z.coerce.number().int().min(0).optional(),
  prospectTarget: z.coerce.number().int().min(0).optional(),
  useTemplate: z.coerce.boolean().default(true),
});

export const dailyActivitySchema = z.object({
  date: requiredDate,
  prospectsContacted: z.coerce.number().int().min(0).default(0),
  responses: z.coerce.number().int().min(0).default(0),
  qualifiedLeads: z.coerce.number().int().min(0).default(0),
  followUps: z.coerce.number().int().min(0).default(0),
  proposals: z.coerce.number().int().min(0).default(0),
  dealsWon: z.coerce.number().int().min(0).default(0),
  contentPublished: z.coerce.number().int().min(0).default(0),
  hoursWorked: z.coerce.number().min(0).max(24).default(0),
  notes: optionalText,
});

export const settingsSchema = z.object({
  name: z.string().trim().min(2).max(80),
  currency: z.string().trim().length(3).toUpperCase(),
  locale: z.string().trim().min(2).max(10),
  averageOrderValue: money,
  conversionRate: z.coerce.number().min(0.001).max(1),
  qualificationRate: z.coerce.number().min(0.001).max(1),
  responseRate: z.coerce.number().min(0.001).max(1),
  scoreCritical: z.coerce.number().int().min(1).max(99),
  scoreNeedsWork: z.coerce.number().int().min(1).max(99),
  scoreOnTrack: z.coerce.number().int().min(1).max(100),
  repeatWindowDays: z.coerce.number().int().min(7).max(365),
});

export const strategySchema = z.object({
  vision: optionalText,
  mission: optionalText,
  positioning: optionalText,
  valueProposition: optionalText,
  idealCustomer: optionalText,
  offersSummary: optionalText,
  acquisitionChannels: optionalText,
  growthStrategy: optionalText,
  competitiveEdge: optionalText,
});

export const weeklyReviewSchema = z.object({
  weekStart: requiredDate,
  answers: z.record(z.string().max(60), z.string().max(3000)),
});

export const idSchema = z.object({ id: z.string().cuid() });
