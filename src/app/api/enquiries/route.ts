import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { validateBookingPayload } from "@/lib/validate";
import { confirmToCustomer, notifyOwner, emailConfigured } from "@/lib/email";
import type { BookingEnquiry } from "@/lib/booking-types";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { _form: "Invalid request body." } },
      { status: 400 }
    );
  }

  const validation = validateBookingPayload(payload);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, errors: validation.errors },
      { status: 422 }
    );
  }

  const enquiry = payload as BookingEnquiry;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        code: "storage-not-configured",
        message:
          "Backend storage is not configured yet. Connect a Supabase project to store enquiries and send notifications.",
      },
      { status: 503 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("enquiries")
    .insert({
      event_type: enquiry.eventType,
      event_type_other: enquiry.eventTypeOther ?? null,
      services: enquiry.services,
      event_date: enquiry.eventDate ?? null,
      flexible_date: enquiry.flexibleDate,
      start_time: enquiry.startTime ?? null,
      end_time: enquiry.endTime ?? null,
      venue: enquiry.venue ?? null,
      guest_count: enquiry.guestCount ?? null,
      event_city: enquiry.eventCity ?? null,
      indoor_outdoor: enquiry.indoorOutdoor ?? null,
      full_name: enquiry.fullName,
      email: enquiry.email,
      phone: enquiry.phone,
      contact_method: enquiry.contactMethod,
      budget_gbp: enquiry.budgetGbp
        ? Number(String(enquiry.budgetGbp).replace(/[£,]/g, ""))
        : null,
      theme_style: enquiry.themeStyle ?? null,
      additional_requests: enquiry.additionalRequests ?? null,
      dietary_requirements: enquiry.dietaryRequirements ?? null,
      reference_images: enquiry.referenceImages ?? [],
      status: "New",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to store enquiry", error);
    return NextResponse.json(
      {
        ok: false,
        code: "storage-error",
        message: "We could not store your enquiry right now. Please try again later.",
      },
      { status: 500 }
    );
  }

  const id = data.id;

  const owner = await notifyOwner(enquiry, id);
  const customer = emailConfigured()
    ? await confirmToCustomer(enquiry)
    : { sent: false, reason: "not-configured" as const };

  return NextResponse.json({
    ok: true,
    id,
    notifications: {
      owner: owner.sent,
      customer: customer.sent,
    },
  });
}