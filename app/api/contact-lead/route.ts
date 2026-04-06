import { NextResponse } from "next/server";
import { appendWebsiteInquiry } from "@/lib/website-inquiry-workbook";
import { sanitizePhoneNumber } from "@/lib/voice-agent-config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    name?: string;
    businessType?: string;
    email?: string;
    phoneNumber?: string;
    requirement?: string;
  };

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

  await appendWebsiteInquiry({
    name,
    businessType,
    email,
    mobileNumber: phoneNumber,
    requirement: requirement || "Not provided",
    source: "CTA form",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    message: "Your details have been captured. We will reach out with the next steps shortly.",
  });
}