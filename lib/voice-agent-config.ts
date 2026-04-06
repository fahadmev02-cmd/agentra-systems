export type LeadLanguage = "english" | "hindi" | "hinglish";

export interface LeadSession {
  sessionId: string;
  callSid?: string;
  status: "queued" | "in-progress" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  name?: string;
  phoneNumber: string;
  language?: LeadLanguage;
  businessType?: string;
  customerNeeds?: string;
  automationTarget?: string;
  dynamicQuestion?: string;
  dynamicAnswer?: string;
  budget?: string;
  summary?: string;
  transcript: string[];
}

export interface LeadRow {
  name: string;
  phoneNumber: string;
  businessType: string;
  requirement: string;
  budget: string;
  summary: string;
}

export const languageOptions: Record<LeadLanguage, { sayLanguage: string; label: string }> = {
  english: { sayLanguage: "en-US", label: "English" },
  hindi: { sayLanguage: "hi-IN", label: "Hindi" },
  hinglish: { sayLanguage: "en-IN", label: "Hinglish" },
};

export function getAppBaseUrl() {
  return process.env.APP_BASE_URL?.replace(/\/$/, "") ?? "";
}

export function hasPublicAppBaseUrl() {
  const baseUrl = getAppBaseUrl();

  if (!baseUrl.startsWith("https://")) {
    return false;
  }

  return !/(localhost|127\.0\.0\.1)/i.test(baseUrl);
}

export function getMissingVoiceEnvVars() {
  const requiredVars = [
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER",
    "GROQ_API_KEY",
    "APP_BASE_URL",
  ];

  return requiredVars.filter((key) => !process.env[key]);
}

export function detectLanguage(input?: string, digits?: string): LeadLanguage {
  const normalizedInput = (input ?? "").toLowerCase();
  const normalizedDigits = (digits ?? "").trim();

  if (normalizedDigits === "2" || normalizedInput.includes("hindi")) {
    return "hindi";
  }

  if (
    normalizedDigits === "3" ||
    normalizedInput.includes("hinglish") ||
    normalizedInput.includes("hindi and english")
  ) {
    return "hinglish";
  }

  return "english";
}

export function normalizeBudget(input?: string) {
  return input?.trim() || "Not shared";
}

export function sanitizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/[^\d+]/g, "").trim();
}

export function buildLeadRequirement(session: LeadSession) {
  return [session.customerNeeds, session.automationTarget, session.dynamicAnswer]
    .filter(Boolean)
    .join(" | ");
}

export function toLeadRow(session: LeadSession): LeadRow {
  return {
    name: session.name || "Not provided",
    phoneNumber: session.phoneNumber,
    businessType: session.businessType || "Not captured",
    requirement: buildLeadRequirement(session) || "Not captured",
    budget: session.budget || "Not shared",
    summary: session.summary || "Summary unavailable",
  };
}
