import { NextResponse } from "next/server";
import { getSiteDashboardData } from "@/lib/site-dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSiteDashboardData();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}