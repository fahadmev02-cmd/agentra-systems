import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getAdminPassword } from "@/lib/admin-auth";
import { clearAdminFailures, getAdminRateLimit, recordAdminFailure } from "@/lib/admin-rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const identifier = forwardedFor.split(",")[0]?.trim() || "local";
  const rateLimit = getAdminRateLimit(identifier);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Too many login attempts. Try again in ${rateLimit.retryAfterSeconds} seconds.`,
      },
      { status: 429 },
    );
  }

  const payload = (await request.json()) as { password?: string };

  if ((payload.password || "") !== getAdminPassword()) {
    recordAdminFailure(identifier);
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  clearAdminFailures(identifier);

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "authorized",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}