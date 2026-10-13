export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/goals", label: "Goals", icon: "Target" },
  { href: "/daily", label: "Daily Actions", icon: "CalendarCheck" },
  { href: "/prospects", label: "Prospects", icon: "Users" },
  { href: "/pipeline", label: "Sales Pipeline", icon: "Kanban" },
  { href: "/customers", label: "Customers", icon: "Heart" },
  { href: "/retention", label: "Testimoni & Referral", icon: "Award" },
  { href: "/offers", label: "Offers", icon: "Package" },
  { href: "/projects", label: "Projects", icon: "FolderKanban" },
  { href: "/content", label: "Content", icon: "Megaphone" },
  { href: "/revenue", label: "Revenue", icon: "Wallet" },
  { href: "/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/notifications", label: "Notifikasi", icon: "Bell" },
  { href: "/strategy", label: "Strategy", icon: "Compass" },
  { href: "/settings", label: "Settings", icon: "Settings" },
] as const;

export const DEAL_STAGES = [
  "LEAD",
  "CONTACTED",
  "QUALIFIED",
  "DISCOVERY",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const;

export const DEAL_STAGE_LABELS: Record<(typeof DEAL_STAGES)[number], string> = {
  LEAD: "Lead",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  DISCOVERY: "Discovery",
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost",
};

/** Probabilitas default per tahap; dapat diubah per deal. */
export const DEAL_STAGE_PROBABILITY: Record<(typeof DEAL_STAGES)[number], number> = {
  LEAD: 5,
  CONTACTED: 10,
  QUALIFIED: 25,
  DISCOVERY: 40,
  PROPOSAL: 55,
  NEGOTIATION: 75,
  WON: 100,
  LOST: 0,
};

export const FLYWHEEL_STEPS = [
  "Personal Brand",
  "Content",
  "Audience",
  "Prospects",
  "Conversations",
  "Offers",
  "Sales",
  "Delivery",
  "Testimonials",
  "Referrals",
  "Repeat Orders",
  "Digital Products",
  "Scalable Revenue",
  "Reinvestment",
] as const;

export const DEMO_LABEL = "DEMO";
