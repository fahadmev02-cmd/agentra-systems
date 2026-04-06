import AdminDashboardClient from "@/app/admin/AdminDashboardClient";
import { getSiteDashboardData } from "@/lib/site-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getSiteDashboardData();
  const crmEmail = process.env.CRM_EMAIL || "";

  return (
    <main className="min-h-screen bg-[#060816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <AdminDashboardClient
          leads={data.allLeads}
          metrics={data.metrics}
          caseStudy={data.caseStudy}
          crmEmail={crmEmail}
        />
      </div>
    </main>
  );
}