import { randomUUID } from "node:crypto";
import twilio from "twilio";
import { getAppBaseUrl, sanitizePhoneNumber, type LeadSession } from "@/lib/voice-agent-config";
import { createLeadSession } from "@/lib/voice-session-store";

export const runtime = "nodejs";

const { VoiceResponse } = twilio.twiml;

export async function POST(request: Request) {
  const formData = await request.formData();
  const callSid = formData.get("CallSid")?.toString();
  const callerNumber = sanitizePhoneNumber(formData.get("From")?.toString() || "Unknown caller");
  const sessionId = randomUUID();
  const now = new Date().toISOString();

  const session: LeadSession = {
    sessionId,
    callSid,
    status: "in-progress",
    createdAt: now,
    updatedAt: now,
    phoneNumber: callerNumber || "Unknown caller",
    transcript: [],
  };

  await createLeadSession(session);

  const response = new VoiceResponse();
  response.redirect(`${getAppBaseUrl()}/api/twilio/voice?sessionId=${sessionId}&step=intro`);

  return new Response(response.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}