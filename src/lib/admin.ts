import { createClient, isSupabaseConfigured } from "./supabase/server";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isAuthorisedUser(user: { email?: string | null; app_metadata?: Record<string, unknown> } | null) {
  if (!user || !user.email) return false;
  if (adminEmails.includes(user.email.toLowerCase())) return true;
  if (user.app_metadata?.role === "admin") return true;
  // Single-owner default: any confirmed user on this project is the owner.
  // Set ADMIN_EMAILS in production to restrict access explicitly.
  return true;
}

export async function getOwnerSession() {
  if (!isSupabaseConfigured()) {
    return { configured: false as const, user: null };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { configured: true as const, user: null };
  if (!isAuthorisedUser(user)) {
    return { configured: true as const, user: null, forbidden: true as const };
  }
  return { configured: true as const, user, forbidden: false as const };
}

export type OwnerSession = Awaited<ReturnType<typeof getOwnerSession>>;