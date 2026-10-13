import {
  CONTACT_METHODS,
  EVENT_TYPES,
  MAX_IMAGE_BYTES,
  MAX_REFERENCE_IMAGES,
  type BookingEnquiry,
} from "./booking-types";

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s-]{7,20}$/;
const WORD_RE = /^[\p{L}\p{N}\s'’.,&()/-]{2,120}$/u;

export function validateBookingPayload(payload: unknown): ValidationResult {
  const errors: Record<string, string> = {};
  const p = (payload ?? {}) as Partial<BookingEnquiry> & Record<string, unknown>;
  if (typeof p !== "object" || p === null) {
    return { ok: false, errors: { _form: "Invalid request." } };
  }

  // Event type
  if (!p.eventType || !EVENT_TYPES.includes(p.eventType as never)) {
    errors.eventType = "Please choose an event type.";
  }
  if (p.eventType === "Other" && p.eventTypeOther && !maxLen(String(p.eventTypeOther), 120)) {
    errors.eventTypeOther = "Please keep this under 120 characters.";
  }

  // Services
  if (!Array.isArray(p.services) || p.services.length === 0) {
    errors.services = "Select at least one service.";
  } else if (p.services.some((s) => typeof s !== "string" || s.length > 80)) {
    errors.services = "One of the selected services is invalid.";
  }

  // Contact
  if (!p.fullName || !WORD_RE.test(String(p.fullName))) {
    errors.fullName = "Please enter your full name.";
  }
  if (!p.email || !EMAIL_RE.test(String(p.email))) {
    errors.email = "Please enter a valid email address.";
  }
  if (!p.phone || !PHONE_RE.test(String(p.phone))) {
    errors.phone = "Please enter a valid phone number.";
  }
  if (!p.contactMethod || !CONTACT_METHODS.includes(p.contactMethod as never)) {
    errors.contactMethod = "Please choose a contact method.";
  }

  // Optional free text lengths
  for (const key of ["eventTypeOther", "themeStyle", "additionalRequests", "dietaryRequirements"] as const) {
    const v = p[key];
    if (v && !maxLen(String(v), 2000)) errors[key] = "Please keep this under 2000 characters.";
  }
  for (const key of ["venue", "eventCity"] as const) {
    const v = p[key];
    if (v && !maxLen(String(v), 160)) errors[key] = "Please keep this under 160 characters.";
  }
  for (const key of ["eventDate", "startTime", "endTime", "guestCount", "indoorOutdoor"] as const) {
    const v = p[key];
    if (v && !maxLen(String(v), 80)) errors[key] = "Please keep this under 80 characters.";
  }

  // Budget
  const budget = p.budgetGbp;
  if (budget !== undefined && budget !== "" && budget !== null) {
    const n = Number(String(budget).replace(/[£,]/g, ""));
    if (Number.isNaN(n) || n < 0 || n > 10_000_000) {
      errors.budgetGbp = "Please enter a valid budget in GBP.";
    }
  }

  // Reference images
  const images = p.referenceImages;
  if (images !== undefined && images !== null) {
    if (!Array.isArray(images)) {
      errors.referenceImages = "Invalid image uploads.";
    } else if (images.length > MAX_REFERENCE_IMAGES) {
      errors.referenceImages = `You can upload a maximum of ${MAX_REFERENCE_IMAGES} images.`;
    } else {
      const parsed = images as { url?: unknown; name?: unknown }[];
      const ok = parsed.every(
        (i) =>
          typeof i?.name === "string" &&
          i.name.length <= 160 &&
          typeof i?.url === "string" &&
          i.url.length < 1000 &&
          (i.url.startsWith("https://") || /^[a-zA-Z0-9-]+\.[a-z0-9]{3,5}$/i.test(i.url))
      );
      if (!ok) {
        errors.referenceImages = "One of the uploaded images is invalid.";
      }
    }
  }

  // Honeypot: bots fill the hidden "company" field.
  const company = (p as unknown as Record<string, unknown>).company;
  if (typeof company === "string" && company.length > 0) {
    errors._form = "Your enquiry could not be processed.";
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

export function fileValidationError(file: File): string | null {
  if (typeof file !== "object" || file === null || !file.name || !file.size) {
    return "Invalid file.";
  }
  if (!/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)) {
    return `"${file.name}" is not an accepted image type. Use JPG, PNG, WEBP or HEIC.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `"${file.name}" is larger than 2.5 MB. Please choose a smaller image.`;
  }
  return null;
}

function maxLen(value: string, len: number) {
  return value.trim().length <= len;
}