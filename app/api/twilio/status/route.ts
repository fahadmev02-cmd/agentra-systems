import { NextResponse } from "next/server";
import { updateLeadSession } from "@/lib/voice-session-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");
  const formData = await request.formData();
  const callStatus = formData.get("CallStatus")?.toString();

  if (!sessionId) {
    return NextResponse.json({ ok: true });
  }

  if (callStatus) {
    await updateLeadSession(sessionId, {
      status:
        callStatus === "completed"
          ? "completed"
          : callStatus === "failed"
            ? "failed"
            : "in-progress",
    });
  }

  return NextResponse.json({ ok: true });
}
