import { createClient as createSupabase } from "@supabase/supabase-js";

/**
 * Service-role client. SERVER ONLY — never import this into a client
 * component or expose the key. Used to create signed URLs for private
 * reference images uploaded by clients.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured (server-only)."
    );
  }
  return createSupabase(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}