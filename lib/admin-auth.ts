import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "agentra_admin_session";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "agentra-admin";
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === "authorized";
}