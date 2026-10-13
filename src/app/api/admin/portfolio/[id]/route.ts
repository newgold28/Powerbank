import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getOwnerSession } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getOwnerSession();
  if (!session.configured || !session.user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = await createClient();
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (error) {
    console.error("Failed to delete portfolio item", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  revalidatePath("/portfolio");
  return NextResponse.json({ ok: true });
}