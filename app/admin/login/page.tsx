import AdminLoginClient from "@/app/admin/login/AdminLoginClient";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const nextPath = resolvedSearchParams.next || "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#060816] px-6 text-white">
      <AdminLoginClient nextPath={nextPath} />
    </main>
  );
}