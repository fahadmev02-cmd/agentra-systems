import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import * as XLSX from "xlsx";

const dataDirectory = path.join(process.cwd(), "data");
const qualifiedLeadsPath = path.join(dataDirectory, "qualified-leads.xlsx");
const websiteInquiriesPath = path.join(dataDirectory, "website-inquiries.xlsx");
const sessionsDirectory = path.join(dataDirectory, "voice-sessions");

type LeadSource = "website-inquiry" | "qualified-lead" | "voice-session";

interface QualifiedWorkbookRow {
  Name?: string;
  "Phone number"?: string;
  "Business type"?: string;
  Requirement?: string;
  Budget?: string;
  Summary?: string;
}

interface WebsiteWorkbookRow {
  Name?: string;
  "Business Type"?: string;
  Email?: string;
  "Mobile Number"?: string;
  Requirement?: string;
  Source?: string;
  "Created At"?: string;
}

interface VoiceSessionSnapshot {
  sessionId: string;
  status?: "queued" | "in-progress" | "completed" | "failed";
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  phoneNumber?: string;
  businessType?: string;
  customerNeeds?: string;
  automationTarget?: string;
  budget?: string;
  summary?: string;
  transcript?: string[];
}

export interface UnifiedLeadRecord {
  id: string;
  source: LeadSource;
  sourceLabel: string;
  name: string;
  businessType: string;
  phoneNumber: string;
  email: string;
  requirement: string;
  budget: string;
  summary: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  transcript: string[];
}

export interface SiteMetricSnapshot {
  totalQualifiedLeads: number;
  totalWebsiteInquiries: number;
  totalVoiceSessions: number;
  completedVoiceSessions: number;
  liveCallSessions: number;
  totalLeadsCaptured: number;
  qualificationRate: number;
  featuredBusinessTypes: string[];
  lastUpdated: string;
}

export interface LiveDemoCard {
  id: string;
  title: string;
  subtitle: string;
  sourceLabel: string;
  status: string;
  contact: string;
  primaryMessage: string;
  responseMessage: string;
  chips: string[];
  tone: "blue" | "cyan" | "purple" | "green";
}

export interface DynamicCaseStudy {
  title: string;
  subtitle: string;
  overview: string;
  chips: string[];
  problem: string[];
  solution: string[];
  results: Array<{ label: string; value: string }>;
}

export interface SiteDashboardData {
  metrics: SiteMetricSnapshot;
  allLeads: UnifiedLeadRecord[];
  recentLeads: UnifiedLeadRecord[];
  demoCards: LiveDemoCard[];
  caseStudy: DynamicCaseStudy;
  popularCategories: Array<{
    category: string;
    count: number;
  }>;
}

function buildCategoryProfile(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("fitness") || normalized.includes("gym")) {
    return {
      description:
        "AI coaching, plan delivery, nutrition support, and premium upsell automation for fitness brands.",
      serviceItems: ["WhatsApp coaching bots", "Plan delivery flows", "Check-in automation", "Upsell nurture sequences"],
      metrics: ["Always-on coaching", "Faster replies", "Upsell-ready leads"],
    };
  }

  if (normalized.includes("real estate")) {
    return {
      description:
        "Lead qualification, budget capture, instant follow-up, and appointment booking for property pipelines.",
      serviceItems: ["Lead response bots", "Budget qualification", "Site-visit booking", "Follow-up sequences"],
      metrics: ["Faster inquiry response", "Better lead scoring", "Booked consultations"],
    };
  }

  if (normalized.includes("ecommerce")) {
    return {
      description:
        "Support agents, order-status flows, returns automation, and cart-recovery messaging for online stores.",
      serviceItems: ["Order support bots", "Returns automation", "FAQ systems", "Revenue recovery flows"],
      metrics: ["24/7 support", "Lower ticket load", "Recovered revenue"],
    };
  }

  if (normalized.includes("health") || normalized.includes("clinic") || normalized.includes("salon")) {
    return {
      description:
        "AI reception, appointment booking, follow-up reminders, and service qualification for healthcare and appointment businesses.",
      serviceItems: ["AI reception", "Booking assistants", "Reminder automation", "Service qualification"],
      metrics: ["No missed bookings", "Reminder coverage", "Less manual admin"],
    };
  }

  if (normalized.includes("launch") || normalized.includes("new business")) {
    return {
      description:
        "Lead capture, market qualification, and automation systems for businesses setting up their first repeatable sales pipeline.",
      serviceItems: ["Launch intake flows", "Lead qualification", "Offer routing", "Follow-up automation"],
      metrics: ["Clearer lead intake", "Faster qualification", "Pipeline setup"],
    };
  }

  return {
    description:
      "Custom AI agents and workflow automation shaped around the exact lead categories entering your pipeline.",
    serviceItems: ["Custom AI agents", "Lead routing", "Workflow automation", "CRM sync systems"],
    metrics: ["Live lead response", "Automation-first ops", "Cross-channel coverage"],
  };
}

function readWorkbookRows<T>(filePath: string) {
  try {
    const workbook = XLSX.readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return [] as T[];
    }

    return XLSX.utils.sheet_to_json<T>(workbook.Sheets[firstSheetName], {
      defval: "",
    });
  } catch {
    return [] as T[];
  }
}

function normalizeDate(value?: string) {
  if (!value) {
    return new Date(0).toISOString();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

function normalizeText(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function normalizeBusinessType(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "Unspecified business";
  }

  const cleaned = trimmed.replace(/[.?!]+$/g, "");
  const normalized = cleaned.toLowerCase();

  if (normalized.includes("start a new business")) {
    return "New Business Launch";
  }

  if (normalized.includes("real estate")) {
    return "Real Estate";
  }

  if (normalized.includes("ecommerce") || normalized.includes("e-commerce")) {
    return "Ecommerce";
  }

  if (normalized.includes("fitness") || normalized.includes("gym")) {
    return "Fitness";
  }

  if (normalized.includes("clinic") || normalized.includes("health")) {
    return "Healthcare";
  }

  return cleaned
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function readVoiceSessions() {
  try {
    const files = await readdir(sessionsDirectory);
    const sessions = await Promise.all(
      files
        .filter((fileName) => fileName.endsWith(".json"))
        .map(async (fileName) => {
          const raw = await readFile(path.join(sessionsDirectory, fileName), "utf8");
          return JSON.parse(raw) as VoiceSessionSnapshot;
        }),
    );

    return sessions;
  } catch {
    return [] as VoiceSessionSnapshot[];
  }
}

function buildRequirementFromSession(session: VoiceSessionSnapshot) {
  return [session.customerNeeds, session.automationTarget]
    .filter(Boolean)
    .join(" | ") || `Requested automation guidance for ${normalizeBusinessType(session.businessType).toLowerCase()}`;
}

function buildVoiceSummary(session: VoiceSessionSnapshot) {
  if (session.summary?.trim()) {
    return session.summary.trim();
  }

  if (session.status === "completed") {
    return `AI voice qualification completed for ${normalizeBusinessType(session.businessType).toLowerCase()}.`;
  }

  if (session.status === "failed") {
    return "Voice qualification started but the call did not complete.";
  }

  return "Voice qualification is actively collecting business details.";
}

function getTone(index: number): LiveDemoCard["tone"] {
  const tones: LiveDemoCard["tone"][] = ["blue", "cyan", "purple", "green"];
  return tones[index % tones.length];
}

export async function getUnifiedLeadRecords() {
  const qualifiedRows = readWorkbookRows<QualifiedWorkbookRow>(qualifiedLeadsPath);
  const websiteRows = readWorkbookRows<WebsiteWorkbookRow>(websiteInquiriesPath);
  const voiceSessions = await readVoiceSessions();

  const qualifiedRecords: UnifiedLeadRecord[] = qualifiedRows.map((row, index) => ({
    id: `qualified-${index}`,
    source: "qualified-lead",
    sourceLabel: "Qualified Lead",
    name: normalizeText(row.Name, "Not provided"),
    businessType: normalizeBusinessType(row["Business type"]),
    phoneNumber: normalizeText(row["Phone number"], "No phone number"),
    email: "Not captured",
    requirement: normalizeText(row.Requirement, "No requirement captured"),
    budget: normalizeText(row.Budget, "Not shared"),
    summary: normalizeText(row.Summary, "Lead exported from the AI qualification flow."),
    status: "completed",
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
    transcript: [],
  }));

  const websiteRecords: UnifiedLeadRecord[] = websiteRows.map((row, index) => ({
    id: `website-${index}`,
    source: "website-inquiry",
    sourceLabel: "Website Inquiry",
    name: normalizeText(row.Name, "Not provided"),
    businessType: normalizeBusinessType(row["Business Type"]),
    phoneNumber: normalizeText(row["Mobile Number"], "No phone number"),
    email: normalizeText(row.Email, "No email"),
    requirement: normalizeText(row.Requirement, "No requirement captured"),
    budget: "Not shared",
    summary: `Website inquiry from ${normalizeText(row.Name, "a visitor")} captured for follow-up.`,
    status: "new",
    createdAt: normalizeDate(row["Created At"]),
    updatedAt: normalizeDate(row["Created At"]),
    transcript: [],
  }));

  const voiceRecords: UnifiedLeadRecord[] = voiceSessions.map((session) => ({
    id: session.sessionId,
    source: "voice-session",
    sourceLabel: "Voice Session",
    name: normalizeText(session.name, "Voice lead"),
    businessType: normalizeBusinessType(session.businessType),
    phoneNumber: normalizeText(session.phoneNumber, "No phone number"),
    email: "Not captured",
    requirement: buildRequirementFromSession(session),
    budget: normalizeText(session.budget, "Not shared"),
    summary: buildVoiceSummary(session),
    status: normalizeText(session.status, "new"),
    createdAt: normalizeDate(session.createdAt),
    updatedAt: normalizeDate(session.updatedAt ?? session.createdAt),
    transcript: session.transcript ?? [],
  }));

  return [...websiteRecords, ...qualifiedRecords, ...voiceRecords].sort(
    (left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt),
  );
}

export async function getSiteDashboardData(): Promise<SiteDashboardData> {
  const records = await getUnifiedLeadRecords();
  const recentLeads = records.slice(0, 8);

  const totalQualifiedLeads = records.filter((record) => record.source === "qualified-lead").length;
  const totalWebsiteInquiries = records.filter((record) => record.source === "website-inquiry").length;
  const voiceRecords = records.filter((record) => record.source === "voice-session");
  const totalVoiceSessions = voiceRecords.length;
  const completedVoiceSessions = voiceRecords.filter((record) => record.status === "completed").length;
  const liveCallSessions = voiceRecords.filter(
    (record) => record.status === "queued" || record.status === "in-progress",
  ).length;
  const totalLeadsCaptured = records.length;
  const qualificationRate = totalVoiceSessions
    ? Math.round((completedVoiceSessions / totalVoiceSessions) * 100)
    : 0;

  const featuredBusinessTypes = Array.from(
    new Set(
      records
        .map((record) => record.businessType)
        .filter((businessType) => businessType && businessType !== "Unspecified business"),
    ),
  ).slice(0, 3);

  const popularCategories = Array.from(
    records.reduce((accumulator, record) => {
      if (record.businessType === "Unspecified business") {
        return accumulator;
      }

      accumulator.set(record.businessType, (accumulator.get(record.businessType) || 0) + 1);
      return accumulator;
    }, new Map<string, number>()),
  )
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([category, count]) => ({ category, count }));

  const metrics: SiteMetricSnapshot = {
    totalQualifiedLeads,
    totalWebsiteInquiries,
    totalVoiceSessions,
    completedVoiceSessions,
    liveCallSessions,
    totalLeadsCaptured,
    qualificationRate,
    featuredBusinessTypes,
    lastUpdated: recentLeads[0]?.updatedAt ?? new Date().toISOString(),
  };

  const demoCards: LiveDemoCard[] = recentLeads.slice(0, 4).map((record, index) => ({
    id: record.id,
    title:
      record.businessType !== "Unspecified business"
        ? `${record.businessType} workflow`
        : `${record.sourceLabel} pipeline`,
    subtitle: `${record.sourceLabel} from ${record.name}`,
    sourceLabel: record.sourceLabel,
    status: record.status,
    contact: record.email !== "Not captured"
      ? `${record.email} • ${record.phoneNumber}`
      : record.phoneNumber,
    primaryMessage: record.requirement,
    responseMessage: record.summary,
    chips: [record.businessType, record.status, record.budget].filter(Boolean),
    tone: getTone(index),
  }));

  const featuredBusiness = featuredBusinessTypes[0] ?? "AI automation";
  const categoryProfile = buildCategoryProfile(featuredBusiness);
  const caseStudy: DynamicCaseStudy = {
    title: `${featuredBusiness} lead flow running on live automation data`,
    subtitle:
      recentLeads[0]?.source === "voice-session"
        ? "Built from saved AI call sessions and follow-up records"
        : "Built from saved inquiries, qualified leads, and automation exports",
    overview: `This case study now reflects the actual business activity moving through your website, CTA form, and voice qualification system. Instead of fixed copy, it updates from the saved leads and sessions already in your pipeline.`,
    chips: [
      `${metrics.totalLeadsCaptured} total records`,
      `${metrics.completedVoiceSessions} completed AI calls`,
      `${metrics.totalWebsiteInquiries} website inquiries`,
    ],
    problem: [
      `Inbound demand from ${featuredBusiness} businesses was landing in separate channels without a unified view.`,
      "Manual follow-up made it hard to qualify leads consistently across web and voice touchpoints.",
      "Static marketing proof did not reflect the real leads the system was already capturing.",
    ],
    solution: [
      "Merged website inquiries, voice sessions, and exported qualified leads into one live data layer.",
      "Connected homepage sections directly to saved lead records so demos and proof update automatically.",
      "Added an admin dashboard to review captured businesses, requirements, contacts, and pipeline status.",
    ],
    results: [
      { label: "Total lead records", value: `${metrics.totalLeadsCaptured}` },
      { label: "Completed AI calls", value: `${metrics.completedVoiceSessions}` },
      { label: "Qualification rate", value: `${metrics.qualificationRate}%` },
      { label: "Active pipelines", value: `${metrics.liveCallSessions}` },
    ],
  };

  return {
    metrics,
    allLeads: records,
    recentLeads,
    demoCards,
    caseStudy,
    popularCategories,
  };
}