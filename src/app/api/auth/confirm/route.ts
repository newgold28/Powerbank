import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Handles both PKCE email links (code) and email OTP links (token_hash),
 * then redirects the owner into the dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/admin";

  const redirectTo = new URL(next, origin);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    redirectTo.searchParams.set("error", "auth-not-configured");
    return NextResponse.redirect(redirectTo);
  }

  const response = NextResponse.redirect(redirectTo);

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const fail = new URL("/admin/login", origin);
      fail.searchParams.set("error", "link-expired");
      return NextResponse.redirect(fail);
    }
    return response;
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as "email" | "magiclink" | "recovery" | "invite" | "email_change",
      token_hash: tokenHash,
    });
    if (error) {
      const fail = new URL("/admin/login", origin);
      fail.searchParams.set("error", "link-expired");
      return NextResponse.redirect(fail);
    }
    return response;
  }

  return NextResponse.redirect(new URL("/admin/login", origin));
}