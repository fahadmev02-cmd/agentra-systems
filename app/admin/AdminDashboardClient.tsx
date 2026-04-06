"use client";

import { useMemo, useState } from "react";
import type { DynamicCaseStudy, SiteMetricSnapshot, UnifiedLeadRecord } from "@/lib/site-dashboard";

interface AdminDashboardClientProps {
  leads: UnifiedLeadRecord[];
  metrics: SiteMetricSnapshot;
  caseStudy: DynamicCaseStudy;
  crmEmail: string;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminDashboardClient({ leads, metrics, caseStudy, crmEmail }: AdminDashboardClientProps) {
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [businessFilter, setBusinessFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<"updatedAt" | "name" | "businessType" | "status">("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const sourceOptions = useMemo(
    () => Array.from(new Set(leads.map((lead) => lead.sourceLabel))),
    [leads],
  );
  const statusOptions = useMemo(
    () => Array.from(new Set(leads.map((lead) => lead.status))),
    [leads],
  );
  const businessOptions = useMemo(
    () => Array.from(new Set(leads.map((lead) => lead.businessType))).filter(Boolean),
    [leads],
  );

  const filteredLeads = useMemo(
    () => leads.filter((lead) => {
      if (sourceFilter !== "all" && lead.sourceLabel !== sourceFilter) {
        return false;
      }

      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }

      if (businessFilter !== "all" && lead.businessType !== businessFilter) {
        return false;
      }

      const normalizedQuery = searchQuery.trim().toLowerCase();
      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        lead.name,
        lead.sourceLabel,
        lead.businessType,
        lead.phoneNumber,
        lead.email,
        lead.requirement,
        lead.summary,
        lead.status,
      ]
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(normalizedQuery)) {
        return false;
      }

      return true;
    }),
    [leads, sourceFilter, statusFilter, businessFilter, searchQuery],
  );

  const sortedLeads = useMemo(() => {
    const nextLeads = [...filteredLeads];
    nextLeads.sort((left, right) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortKey === "updatedAt") {
        return (Date.parse(left.updatedAt) - Date.parse(right.updatedAt)) * direction;
      }

      return left[sortKey].localeCompare(right[sortKey]) * direction;
    });
    return nextLeads;
  }, [filteredLeads, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedLeads.length / pageSize));
  const paginatedLeads = useMemo(
    () => sortedLeads.slice((page - 1) * pageSize, page * pageSize),
    [page, sortedLeads],
  );

  function resetFilters() {
    setSourceFilter("all");
    setStatusFilter("all");
    setBusinessFilter("all");
    setSearchQuery("");
    setSortKey("updatedAt");
    setSortDirection("desc");
    setPage(1);
  }

  function updateSort(nextSortKey: typeof sortKey) {
    setPage(1);
    if (nextSortKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextSortKey);
    setSortDirection("desc");
  }

  function handleExportCsv() {
    const headers = [
      "Name",
      "Source",
      "Business Type",
      "Phone Number",
      "Email",
      "Requirement",
      "Budget",
      "Summary",
      "Status",
      "Updated At",
    ];

    const escapeValue = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = sortedLeads.map((lead) => [
      lead.name,
      lead.sourceLabel,
      lead.businessType,
      lead.phoneNumber,
      lead.email,
      lead.requirement,
      lead.budget,
      lead.summary,
      lead.status,
      formatDate(lead.updatedAt),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => escapeValue(String(value))).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `agentra-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Agentra Admin</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Live lead dashboard</h1>
          <p className="mt-3 max-w-3xl text-slate-400">
            Review website inquiries, AI voice sessions, qualified exports, and the live metrics feeding the homepage.
          </p>
          {crmEmail && (
            <p className="mt-3 text-sm text-slate-400">
              CRM inbox: <a href={`mailto:${crmEmail}`} className="text-cyan-300 hover:text-cyan-200">{crmEmail}</a>
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500">Updated {formatDate(metrics.lastUpdated)}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total lead records", value: `${metrics.totalLeadsCaptured}` },
          { label: "Website inquiries", value: `${metrics.totalWebsiteInquiries}` },
          { label: "Voice sessions", value: `${metrics.totalVoiceSessions}` },
          { label: "Qualified leads", value: `${metrics.totalQualifiedLeads}` },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-3 text-4xl font-bold text-cyan-300">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-500">Search leads</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search by name, business, phone, email, requirement..."
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition-all focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-500">Source</label>
            <select
              value={sourceFilter}
              onChange={(event) => {
                setSourceFilter(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All sources</option>
              {sourceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-500">Status</label>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-slate-500">Business type</label>
            <select
              value={businessFilter}
              onChange={(event) => {
                setBusinessFilter(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All business types</option>
              {businessOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-400">Showing {sortedLeads.length} of {leads.length} captured records.</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10"
            >
              Reset Filters
            </button>
            {crmEmail && (
              <a
                href={`mailto:${crmEmail}?subject=Agentra%20Lead%20Pipeline&body=Review%20the%20latest%20lead%20pipeline%20from%20the%20admin%20dashboard.`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10"
              >
                Open CRM Email
              </a>
            )}
            <button
              type="button"
              onClick={handleExportCsv}
              className="rounded-full bg-gradient-to-r from-cyan-400 via-brand-blue to-blue-600 px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.01]"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-semibold">Filtered lead records</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-slate-500">
            <button type="button" onClick={() => updateSort("updatedAt")} className="rounded-full border border-white/10 px-3 py-1 hover:border-cyan-300/30 hover:text-white">
              Sort: Updated {sortKey === "updatedAt" ? `(${sortDirection})` : ""}
            </button>
            <button type="button" onClick={() => updateSort("name")} className="rounded-full border border-white/10 px-3 py-1 hover:border-cyan-300/30 hover:text-white">
              Sort: Name {sortKey === "name" ? `(${sortDirection})` : ""}
            </button>
            <button type="button" onClick={() => updateSort("businessType")} className="rounded-full border border-white/10 px-3 py-1 hover:border-cyan-300/30 hover:text-white">
              Sort: Business {sortKey === "businessType" ? `(${sortDirection})` : ""}
            </button>
            <button type="button" onClick={() => updateSort("status")} className="rounded-full border border-white/10 px-3 py-1 hover:border-cyan-300/30 hover:text-white">
              Sort: Status {sortKey === "status" ? `(${sortDirection})` : ""}
            </button>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Name</th>
                  <th className="pb-3 pr-4 font-medium">Source</th>
                  <th className="pb-3 pr-4 font-medium">Business</th>
                  <th className="pb-3 pr-4 font-medium">Contact</th>
                  <th className="pb-3 pr-4 font-medium">Requirement</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {paginatedLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="py-4 pr-4">{lead.name}</td>
                    <td className="py-4 pr-4">{lead.sourceLabel}</td>
                    <td className="py-4 pr-4">{lead.businessType}</td>
                    <td className="py-4 pr-4 text-slate-300">{lead.email !== "Not captured" ? `${lead.email} / ${lead.phoneNumber}` : lead.phoneNumber}</td>
                    <td className="py-4 pr-4 max-w-[22rem] text-slate-300">{lead.requirement}</td>
                    <td className="py-4 pr-4 capitalize">{lead.status}</td>
                    <td className="py-4">{formatDate(lead.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Case-study driver</h2>
            <p className="mt-4 text-sm text-slate-400">{caseStudy.overview}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {caseStudy.chips.map((chip) => (
                <span key={chip} className="rounded-full border border-cyan-300/15 bg-cyan-300/5 px-3 py-1 text-xs uppercase tracking-[0.16em] text-cyan-300">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-semibold">Pipeline stats</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {caseStudy.results.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}