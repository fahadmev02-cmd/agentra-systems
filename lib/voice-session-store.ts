import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { LeadSession } from "@/lib/voice-agent-config";

const dataDirectory = path.join(process.cwd(), "data");
const sessionsDirectory = path.join(dataDirectory, "voice-sessions");

async function ensureSessionDirectory() {
  await mkdir(sessionsDirectory, { recursive: true });
}

function getSessionPath(sessionId: string) {
  return path.join(sessionsDirectory, `${sessionId}.json`);
}

export async function createLeadSession(session: LeadSession) {
  await ensureSessionDirectory();
  await writeFile(getSessionPath(session.sessionId), JSON.stringify(session, null, 2), "utf8");
}

export async function getLeadSession(sessionId: string) {
  await ensureSessionDirectory();

  try {
    const raw = await readFile(getSessionPath(sessionId), "utf8");
    return JSON.parse(raw) as LeadSession;
  } catch {
    return null;
  }
}

export async function updateLeadSession(sessionId: string, updates: Partial<LeadSession>) {
  const existing = await getLeadSession(sessionId);

  if (!existing) {
    return null;
  }

  const nextSession: LeadSession = {
    ...existing,
    ...updates,
    transcript: updates.transcript ?? existing.transcript,
    updatedAt: new Date().toISOString(),
  };

  await createLeadSession(nextSession);
  return nextSession;
}
