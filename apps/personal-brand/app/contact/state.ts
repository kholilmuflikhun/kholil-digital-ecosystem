export type ContactValues = Partial<Record<
  "name" | "email" | "whatsapp" | "preferredContact" | "businessName" | "serviceCategory" | "message" | "budgetRange" | "timeline",
  string
>>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; message: string; fieldErrors: Record<string, string[]>; values: ContactValues }
  | { status: "error"; message: string; values: ContactValues; whatsappUrl?: string }
  | { status: "not_configured"; message: string; values: ContactValues; whatsappUrl?: string }
  | { status: "rate_limited"; message: string; values: ContactValues };

export const initialContactState: ContactState = { status: "idle" };
