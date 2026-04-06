import { NextResponse } from "next/server";
import { getSiteDashboardData } from "@/lib/site-dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { metrics } = await getSiteDashboardData();

  return NextResponse.json(metrics, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}