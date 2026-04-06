"use client";

import { useEffect, useState } from "react";

export interface LiveMetricsSnapshot {
  totalQualifiedLeads: number;
  totalWebsiteInquiries: number;
  totalVoiceSessions: number;
  completedVoiceSessions: number;
  liveCallSessions: number;
  totalLeadsCaptured: number;
  qualificationRate: number;
  featuredBusinessTypes: string[];
  lastUpdated: string;
}

const fallbackMetrics: LiveMetricsSnapshot = {
  totalQualifiedLeads: 0,
  totalWebsiteInquiries: 0,
  totalVoiceSessions: 0,
  completedVoiceSessions: 0,
  liveCallSessions: 0,
  totalLeadsCaptured: 0,
  qualificationRate: 0,
  featuredBusinessTypes: [],
  lastUpdated: new Date().toISOString(),
};

export function useLiveMetrics() {
  const [metrics, setMetrics] = useState<LiveMetricsSnapshot>(fallbackMetrics);

  useEffect(() => {
    let isMounted = true;

    async function loadMetrics() {
      try {
        const response = await fetch("/api/live-metrics", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const nextMetrics = (await response.json()) as LiveMetricsSnapshot;
        if (isMounted) {
          setMetrics(nextMetrics);
        }
      } catch {
        // Keep previous metrics if polling fails.
      }
    }

    loadMetrics();
    const interval = window.setInterval(loadMetrics, 15000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return metrics;
}