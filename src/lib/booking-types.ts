export const EVENT_TYPES = [
  "Wedding",
  "Birthday",
  "Corporate Event",
  "Luxury or Private Event",
  "Traditional Celebration",
  "Other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const CONTACT_METHODS = ["Email", "Phone", "WhatsApp"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export interface ReferenceImage {
  url: string;
  name: string;
}

export interface BookingEnquiry {
  eventType: string;
  eventTypeOther?: string;
  services: string[];
  eventDate?: string;
  flexibleDate: boolean;
  startTime?: string;
  endTime?: string;
  venue?: string;
  guestCount?: string;
  eventCity?: string;
  indoorOutdoor?: string;
  fullName: string;
  email: string;
  phone: string;
  contactMethod: ContactMethod;
  budgetGbp?: string;
  themeStyle?: string;
  additionalRequests?: string;
  dietaryRequirements?: string;
  referenceImages?: ReferenceImage[];
}

export const MAX_REFERENCE_IMAGES = 4;
export const MAX_IMAGE_BYTES = 2_500_000; // 2.5 MB per file
export const REFERENCE_BUCKET = "reference-images";

export const STATUSES = [
  "New",
  "Reviewing",
  "Quote Sent",
  "Confirmed",
  "Declined",
  "Completed",
] as const;

export const DEPOSIT_STATUSES = ["Not Requested", "Requested", "Paid", "Waived"] as const;