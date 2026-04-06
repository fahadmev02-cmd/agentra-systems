import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import twilio from "twilio";
import {
  getAppBaseUrl,
  hasPublicAppBaseUrl,
  getMissingVoiceEnvVars,
  sanitizePhoneNumber,
  type LeadSession,
} from "@/lib/voice-agent-config";
import { createLeadSession, updateLeadSession } from "@/lib/voice-session-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const missingEnvVars = getMissingVoiceEnvVars();
  if (missingEnvVars.length > 0) {
    return NextResponse.json(
      {
        error: `Missing required environment variables: ${missingEnvVars.join(", ")}`,
      },
      { status: 500 },
    );
  }

  if (!hasPublicAppBaseUrl()) {
    return NextResponse.json(
      {
        error:
          "APP_BASE_URL must be a public https URL so Twilio can reach your voice webhooks.",
      },
      { status: 500 },
    );
  }

  const payload = (await request.json()) as {
    name?: string;
    phoneNumber?: string;
  };

  const phoneNumber = sanitizePhoneNumber(payload.phoneNumber || "");
  const name = payload.name?.trim() || "";

  if (!phoneNumber.startsWith("+") || phoneNumber.length < 8) {
    return NextResponse.json(
      {
        error: "Enter a valid phone number in international format, for example +923001234567.",
      },
      { status: 400 },
    );
  }

  const sessionId = randomUUID();
  const now = new Date().toISOString();
  const session: LeadSession = {
    sessionId,
    status: "queued",
    createdAt: now,
    updatedAt: now,
    name: name || undefined,
    phoneNumber,
    transcript: [],
  };

  await createLeadSession(session);

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );
  const baseUrl = getAppBaseUrl();

  try {
    const call = await client.calls.create({
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER!,
      url: `${baseUrl}/api/twilio/voice?sessionId=${sessionId}&step=intro`,
      statusCallback: `${baseUrl}/api/twilio/status?sessionId=${sessionId}`,
      statusCallbackMethod: "POST",
    });

    await updateLeadSession(sessionId, {
      callSid: call.sid,
      status: "in-progress",
    });

    return NextResponse.json({
      message:
        "The AI assistant is calling now. It will introduce itself, ask for your preferred language, qualify your automation needs, and save the lead automatically.",
      sessionId,
      callSid: call.sid,
    });
  } catch (error) {
    await updateLeadSession(sessionId, { status: "failed" });

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Twilio could not start the call.",
      },
      { status: 500 },
    );
  }
}
