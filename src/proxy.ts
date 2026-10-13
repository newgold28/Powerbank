import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Next.js 16 "proxy" (formerly middleware).
 * Refreshes the Supabase auth cookie on every request so the owner's
 * session does not expire while browsing the dashboard.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let response = NextResponse.next({ request });

  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value }) =>
          response.cookies.set(name, value)
        );
      },
    },
  });

  // Refreshes the session if it has expired and swaps the cookies.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on admin routes and auth-related API routes. Everything else is
     * static and does not need the session.
     */
    "/admin/:path*",
    "/api/auth/:path*",
    "/book",
  ],
};