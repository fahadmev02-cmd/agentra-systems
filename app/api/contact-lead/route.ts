import { NextResponse } from "next/server";
import { appendWebsiteInquiry } from "@/lib/website-inquiry-workbook";
import { sanitizePhoneNumber } from "@/lib/voice-agent-config";
import { getPersistentStorageError, isEphemeralDeployment } from "@/lib/deployment-mode";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (isEphemeralDeployment()) {
    return NextResponse.json(
      {
        error: getPersistentStorageError("Website lead capture"),
      },
      { status: 503 },
    );
  }

  let payload: {
    name?: string;
    businessType?: string;
    email?: string;
    phoneNumber?: string;
    requirement?: string;
  };

  try {
    payload = (await request.json()) as {
      name?: string;
      businessType?: string;
      email?: string;
      phoneNumber?: string;
      requirement?: string;
    };
  } catch {
    return NextResponse.json(
      { error: "Could not read the inquiry payload." },
      { status: 400 },
    );
  }

  const name = payload.name?.trim() || "";
  const businessType = payload.businessType?.trim() || "";
  const email = payload.email?.trim() || "";
  const phoneNumber = sanitizePhoneNumber(payload.phoneNumber || "");
  const requirement = payload.requirement?.trim() || "";

  if (!name || !businessType || !email || !phoneNumber) {
    return NextResponse.json(
      {
        error: "Name, business type, email, and mobile number are required.",
      },
      { status: 400 },
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  if (!phoneNumber.startsWith("+") || phoneNumber.length < 8) {
    return NextResponse.json(
      {
        error: "Enter a valid mobile number in international format, for example +923001234567.",
      },
      { status: 400 },
    );
  }

  try {
    await appendWebsiteInquiry({
      name,
      businessType,
      email,
      mobileNumber: phoneNumber,
      requirement: requirement || "Not provided",
      source: "CTA form",
      createdAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        error: "Could not save your details right now.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Your details have been captured. We will reach out with the next steps shortly.",
  });
}