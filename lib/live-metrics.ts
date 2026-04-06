import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import * as XLSX from "xlsx";

const dataDirectory = path.join(process.cwd(), "data");
const qualifiedLeadsPath = path.join(dataDirectory, "qualified-leads.xlsx");
const websiteInquiriesPath = path.join(dataDirectory, "website-inquiries.xlsx");
const sessionsDirectory = path.join(dataDirectory, "voice-sessions");

interface VoiceSessionSnapshot {
  status?: "queued" | "in-progress" | "completed" | "failed";
  businessType?: string;
  updatedAt?: string;
}

export interface LiveMetrics {
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

function readWorkbookRowCount(filePath: string) {
  try {
    const workbook = XLSX.readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return 0;
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, {
      defval: "",
    });

    return rows.length;
  } catch {
    return 0;
  }
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

export async function getLiveMetrics(): Promise<LiveMetrics> {
  const [voiceSessions] = await Promise.all([readVoiceSessions()]);
  const totalQualifiedLeads = readWorkbookRowCount(qualifiedLeadsPath);
  const totalWebsiteInquiries = readWorkbookRowCount(websiteInquiriesPath);
  const totalVoiceSessions = voiceSessions.length;
  const completedVoiceSessions = voiceSessions.filter(
    (session) => session.status === "completed",
  ).length;
  const liveCallSessions = voiceSessions.filter(
    (session) => session.status === "queued" || session.status === "in-progress",
  ).length;
  const totalLeadsCaptured = totalQualifiedLeads + totalWebsiteInquiries;
  const qualificationRate = totalVoiceSessions
    ? Math.round((completedVoiceSessions / totalVoiceSessions) * 100)
    : 0;

  const featuredBusinessTypes = Array.from(
    new Set(
      voiceSessions
        .map((session) => session.businessType?.trim())
        .filter(Boolean) as string[],
    ),
  ).slice(0, 3);

  const latestUpdate = voiceSessions
    .map((session) => session.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  return {
    totalQualifiedLeads,
    totalWebsiteInquiries,
    totalVoiceSessions,
    completedVoiceSessions,
    liveCallSessions,
    totalLeadsCaptured,
    qualificationRate,
    featuredBusinessTypes,
    lastUpdated: latestUpdate ?? new Date().toISOString(),
  };
}