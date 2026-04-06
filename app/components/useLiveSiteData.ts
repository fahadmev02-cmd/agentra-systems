"use client";

import { useEffect, useState } from "react";
import type { DynamicCaseStudy, LiveDemoCard, SiteMetricSnapshot, UnifiedLeadRecord } from "@/lib/site-dashboard";

interface LiveSiteData {
  metrics: SiteMetricSnapshot;
  allLeads: UnifiedLeadRecord[];
  recentLeads: UnifiedLeadRecord[];
  demoCards: LiveDemoCard[];
  caseStudy: DynamicCaseStudy;
  popularCategories: Array<{
    category: string;
    count: number;
  }>;
}

const fallbackData: LiveSiteData = {
  metrics: {
    totalQualifiedLeads: 0,
    totalWebsiteInquiries: 0,
    totalVoiceSessions: 0,
    completedVoiceSessions: 0,
    liveCallSessions: 0,
    totalLeadsCaptured: 0,
    qualificationRate: 0,
    featuredBusinessTypes: [],
    lastUpdated: new Date().toISOString(),
  },
  allLeads: [],
  recentLeads: [],
  demoCards: [],
  caseStudy: {
    title: "Live automation case study",
    subtitle: "Waiting for saved lead data",
    overview: "As leads and sessions are captured, this section updates from your real pipeline.",
    chips: [],
    problem: [],
    solution: [],
    results: [],
  },
  popularCategories: [],
};

export function useLiveSiteData() {
  const [data, setData] = useState<LiveSiteData>(fallbackData);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const response = await fetch("/api/site-data", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const nextData = (await response.json()) as LiveSiteData;
        if (mounted) {
          setData(nextData);
        }
      } catch {
        // Preserve the previous snapshot on polling failure.
      }
    }

    function handleRefresh() {
      void loadData();
    }

    void loadData();
    const interval = window.setInterval(loadData, 5000);
    window.addEventListener("agentra:data-refresh", handleRefresh);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener("agentra:data-refresh", handleRefresh);
    };
  }, []);

  return data;
}