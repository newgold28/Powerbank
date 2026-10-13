import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getOwnerSession } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

const CATEGORIES = new Set([
  "Weddings",
  "Luxury Events",
  "Birthdays",
  "Corporate Events",
  "Catering",
  "Traditional Celebrations",
  "Photography & Videography",
  "Cakes & Desserts",
  "Events",
]);

const SAFE_SRC = /^\/?images\/(portfolio|admin)\/[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp)/;

export async function GET() {
  const session = await getOwnerSession();
  if (!session.configured || !session.user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true, items: data });
}

export async function POST(request: Request) {
  const session = await getOwnerSession();
  if (!session.configured || !session.user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid body." }, { status: 400 });
  }

  const src = String(body.src ?? "");
  const category = String(body.category ?? "Events");
  const title = String(body.title ?? "").slice(0, 120);
  const caption = String(body.caption ?? "").slice(0, 400);
  const location = String(body.location ?? "").slice(0, 160);
  const date = String(body.date ?? "").slice(0, 80);

  if (!SAFE_SRC.test(src) && !src.startsWith("https://")) {
    return NextResponse.json(
      { ok: false, message: "Invalid image source." },
      { status: 422 }
    );
  }
  if (!CATEGORIES.has(category)) {
    return NextResponse.json({ ok: false, message: "Invalid category." }, { status: 422 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({
      src: src.startsWith("/") ? src : `/${src}`,
      category,
      title,
      caption,
      location,
      date,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create portfolio item", error);
    return NextResponse.json({ ok: false, message: "Could not save item." }, { status: 500 });
  }

  revalidatePath("/portfolio");
  return NextResponse.json({ ok: true, id: data.id });
}