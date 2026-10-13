import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOwnerSession } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { EnquiriesManager } from "@/components/admin/enquiries-manager";
import { PortfolioManager } from "@/components/admin/portfolio-manager";
import { createClient } from "@/lib/supabase/server";
import type { DbEnquiry } from "@/lib/enquiry-types";
import { STATUSES } from "@/lib/booking-types";

export const metadata: Metadata = {
  title: "Owner Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; service?: string; q?: string }>;
}) {
  const session = await getOwnerSession();
  if (!session.user) redirect("/admin/login");

  const params = await searchParams;
  const statusFilter =
    params.status && (STATUSES as readonly string[]).includes(params.status)
      ? params.status
      : "";
  const q = params.q?.trim() ?? "";
  const serviceFilter = params.service ?? "";

  let enquiries: DbEnquiry[] = [];
  let dbError: string | null = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    let query = supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter) query = query.eq("status", statusFilter);
    if (serviceFilter) query = query.contains("services", [serviceFilter]);
    if (q) {
      query = query.or(
        `full_name.ilike.%${escapeLike(q)}%,email.ilike.%${escapeLike(q)}%,event_type.ilike.%${escapeLike(q)}%,event_city.ilike.%${escapeLike(q)}%`
      );
    }
    const { data, error } = await query;
    if (error) {
      console.error("Failed to load enquiries", error);
      dbError = error.message;
    } else {
      enquiries = (data ?? []) as unknown as DbEnquiry[];
    }
  }

  return (
    <Container className="py-10 sm:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bronze-dark">
            Owner dashboard
          </p>
          <h1 className="mt-2 font-serif text-4xl text-deep sm:text-5xl">
            Bookings &amp; enquiries
          </h1>
          <p className="mt-2 text-sm text-charcoal-soft">
            Signed in as {session.user.email}. Private client data only —
            never visible on the public website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-bronze/30 px-4 py-2 text-sm font-medium text-deep hover:border-bronze-dark"
          >
            View website
          </Link>
          <SignOutButton />
        </div>
      </header>

      {dbError ? (
        <p className="mt-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Could not load enquiries: {dbError}. Check that the &quot;enquiries&quot; table
          exists and its Row Level Security policies allow the owner role.
        </p>
      ) : null}

      <EnquiriesManager
        enquiries={enquiries}
        statusFilter={statusFilter}
        search={q}
        serviceFilter={serviceFilter}
      />

      <PortfolioManager />
    </Container>
  );
}

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="rounded-full bg-deep px-4 py-2 text-sm font-medium text-ivory hover:bg-deep-soft"
      >
        Sign out
      </button>
    </form>
  );
}

async function signOutAction() {
  "use server";
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function escapeLike(value: string) {
  return value.replace(/[%_\\]/g, "\\$&");
}