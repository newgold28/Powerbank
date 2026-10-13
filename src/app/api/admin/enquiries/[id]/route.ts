import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { STATUSES, DEPOSIT_STATUSES } from "@/lib/booking-types";

const UPDATABLE = {
  status: (v: unknown) => typeof v === "string" && (STATUSES as readonly string[]).includes(v),
  notes: (v: unknown) => typeof v === "string" && v.length <= 5000,
  quote_amount: (v: unknown) =>
    v === null || (typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1e9),
  deposit_status: (v: unknown) =>
    typeof v === "string" && (DEPOSIT_STATUSES as readonly string[]).includes(v),
  deposit_amount: (v: unknown) =>
    v === null || (typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1e9),
} as const;

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getOwnerSession();
  if (!session.configured || !session.user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid body." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  for (const [key, validator] of Object.entries(UPDATABLE)) {
    if (key in body) {
      if (!validator(body[key])) {
        return NextResponse.json(
          { ok: false, message: `Invalid value for ${key}.` },
          { status: 422 }
        );
      }
      update[key] = body[key] === "" ? null : body[key];
    }
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: false, message: "Nothing to update." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("enquiries")
    .update(update)
    .eq("id", id);

  if (error) {
    console.error("Failed to update enquiry", error);
    return NextResponse.json({ ok: false, message: "Update failed." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}