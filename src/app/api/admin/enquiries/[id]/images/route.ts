import { NextResponse } from "next/server";
import { getOwnerSession } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/service";

const SAFE_PATH = /^[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp|heic|heif)$/;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getOwnerSession();
  if (!session.configured || !session.user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await context.params;
  const images = await loadImages(id);
  return NextResponse.json({ ok: true, images });
}

async function loadImages(id: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("enquiries")
    .select("reference_images")
    .eq("id", id)
    .single();

  const list = (data?.reference_images ?? []) as { path?: string; url?: string; name?: string }[];
  const safe = list
    .map((img) => ({
      path: img.path ?? img.url ?? "",
      name: img.name ?? "reference image",
    }))
    .filter(
      (img) =>
        typeof img.path === "string" &&
        img.path.length > 0 &&
        (img.path.startsWith("https://") || SAFE_PATH.test(img.path))
    );
  if (safe.length === 0) return [];
  if (safe.every((img) => img.path!.startsWith("https://"))) {
    return safe.map((img) => ({ ...img, url: img.path }));
  }

  // Sign private paths so the owner can view client uploads.
  try {
    const service = createServiceClient();
    const bucket = service.storage.from("reference-images");
    const signed = await Promise.all(
      safe.map(async (img) => {
        if (img.path!.startsWith("https://")) {
          return { ...img, url: img.path };
        }
        const { data, error } = await bucket.createSignedUrl(img.path!, 3600);
        return { ...img, url: error ? null : data.signedUrl, error: error?.message ?? null };
      })
    );
    return signed;
  } catch {
    return safe.map((img) => ({ ...img, url: null, error: "signing unavailable" }));
  }
}