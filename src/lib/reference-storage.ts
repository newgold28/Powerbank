import { createClient, isConfigured } from "./supabase/client";
import { REFERENCE_BUCKET } from "./booking-types";

export function storageBucket() {
  return REFERENCE_BUCKET;
}

export function referenceStorageConfigured() {
  return isConfigured();
}

/**
 * Uploads a private reference image and returns its storage path.
 * The path is stored on the enquiry; the owner generates signed URLs
 * from the dashboard, so client files are never publicly readable.
 */
export async function uploadReferenceImage(file: File): Promise<{ path: string }> {
  const supabase = createClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(REFERENCE_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    console.error("Reference image upload failed", error);
    throw new Error(
      error.message.includes("Bucket")
        ? "Reference image uploads are not configured on this account yet."
        : "One of your images could not be uploaded. Please try again."
    );
  }
  return { path };
}