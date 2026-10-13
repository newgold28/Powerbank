"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Upload,
  X,
  MessageCircle,
  FileWarning,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Button,
  LinkButton,
} from "@/components/ui/button";
import {
  Field,
  Input,
  Textarea,
  Select,
} from "@/components/ui/inputs";
import { services, fullCoordinationService } from "@/content/services";
import { site, privacyPath } from "@/lib/site";
import {
  CONTACT_METHODS,
  EVENT_TYPES,
  MAX_REFERENCE_IMAGES,
  type BookingEnquiry,
  type ContactMethod,
} from "@/lib/booking-types";
import { validateBookingPayload, fileValidationError } from "@/lib/validate";
import {
  referenceStorageConfigured,
  uploadReferenceImage,
} from "@/lib/reference-storage";

const STEPS = [
  "Event Type",
  "Event Details",
  "Contact Information",
  "Budget & Preferences",
  "Review & Submit",
] as const;

type FileWithStatus = {
  file: File;
  error?: string;
};

type NotConfiguredState = {
  message: string;
};

export function BookingForm({ initialService }: { initialService?: string }) {
  const [step, setStep] = React.useState(0);
  const [form, setForm] = React.useState<BookingEnquiry>({
    eventType: EVENT_TYPES[0],
    services: initialService ? [initialService] : [],
    flexibleDate: false,
    contactMethod: "Email",
    fullName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [files, setFiles] = React.useState<FileWithStatus[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<{
    id?: string;
    note?: string;
  } | null>(null);
  const [notConfigured, setNotConfigured] = React.useState<NotConfiguredState | null>(null);

  const storageReady = React.useMemo(() => {
    try {
      return referenceStorageConfigured();
    } catch {
      return false;
    }
  }, []);

  const allServiceOptions = React.useMemo(
    () => [fullCoordinationService, ...services],
    []
  );

  const set = <K extends keyof BookingEnquiry>(key: K, value: BookingEnquiry[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  function validateStep(stepIndex: number): boolean {
    const nextErrors: Record<string, string> = {};
    if (stepIndex === 0) {
      if (!form.eventType) nextErrors.eventType = "Please choose an event type.";
      if (form.services.length === 0)
        nextErrors.services = "Select at least one service.";
    } else if (stepIndex === 2) {
      if (!form.fullName.trim()) nextErrors.fullName = "Please enter your full name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
        nextErrors.email = "Please enter a valid email address.";
      if (!/^[+()\d\s-]{7,20}$/.test(form.phone))
        nextErrors.phone = "Please enter a valid phone number.";
      if (!form.contactMethod) nextErrors.contactMethod = "Choose a contact method.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function toggleService(id: string) {
    set("services", form.services.includes(id)
      ? form.services.filter((s) => s !== id)
      : [...form.services, id]);
  }

  function onFilesSelected(nextFiles: File[]) {
    const merged = [...files];
    for (const file of nextFiles) {
      if (merged.length >= MAX_REFERENCE_IMAGES) break;
      const error = fileValidationError(file);
      merged.push({ file, error: error ?? undefined });
    }
    setFiles(merged);
  }

  function removeFile(index: number) {
    setFiles((f) => f.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setServerError(null);
    setNotConfigured(null);

    const validation = validateBookingPayload({
      ...form,
      company: (document.getElementById("company") as HTMLInputElement | null)?.value ?? "",
    });
    if (!validation.ok) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const referenceImages: { url: string; name: string }[] = [];
      if (files.some((f) => f.error)) {
        setFiles((fs) =>
          fs.map((f) =>
            f.error ? { ...f, error: "Remove the invalid file before submitting." } : f
          )
        );
        setIsSubmitting(false);
        setStep(3);
        return;
      }

      if (files.length > 0) {
        if (!storageReady) {
          setNotConfigured({
            message:
              "Reference image uploads are not configured yet, so your images could not be attached. Your enquiry would still be sent without them.",
          });
        } else {
          setIsUploading(true);
          try {
            for (const item of files) {
              const { path } = await uploadReferenceImage(item.file);
              referenceImages.push({ url: path, name: item.file.name });
            }
          } catch (err) {
            setIsUploading(false);
            setServerError(
              err instanceof Error ? err.message : "Image upload failed."
            );
            setIsSubmitting(false);
            return;
          }
        }
      }

      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, referenceImages }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (result.code === "storage-not-configured") {
          setNotConfigured({ message: result.message ?? "Backend storage is not configured yet." });
        } else if (result.errors) {
          setErrors(result.errors);
        } else {
          setServerError(result.message ?? "Something went wrong. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      setSuccess({
        id: result.id as string | undefined,
        note:
          result.notifications?.owner === false || result.notifications?.customer === false
            ? "Email notifications are not fully configured yet, but your enquiry has been recorded securely."
            : undefined,
      });
    } catch {
      setServerError("Network error — please try again.");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  }

  // ---------- Success screen ----------
  if (success) {
    return (
      <div className="rounded-3xl border border-bronze/20 bg-white p-8 shadow-soft sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lavender/60 text-bronze-dark">
          <Check className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-center font-serif text-4xl text-deep">
          Your enquiry has been received
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center leading-relaxed text-charcoal-soft">
          Thank you for contacting AbiWande Events &amp; Concierge. Your event
          enquiry has been received. We will review your requirements and
          contact you about availability and the next steps. Your event is not
          confirmed until we have agreed on the details with you.
        </p>
        {success.id ? (
          <p className="mt-4 text-center text-xs text-charcoal-soft">
            Reference: <code className="font-mono">{success.id}</code>
          </p>
        ) : null}
        {success.note ? (
          <p className="mx-auto mt-4 max-w-lg rounded-2xl border border-bronze/20 bg-paper p-4 text-center text-sm text-charcoal-soft">
            <FileWarning className="mr-1 inline h-4 w-4 text-bronze-dark" aria-hidden="true" />
            {success.note}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LinkButton href={site.whatsappHref} variant="primary" newTab>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Continue the conversation on WhatsApp
          </LinkButton>
          <LinkButton href="/" variant="outline">
            Back to homepage
          </LinkButton>
        </div>
      </div>
    );
  }

  // ---------- "Not configured" honest state ----------
  if (notConfigured) {
    return (
      <div className="rounded-3xl border border-amber-300 bg-amber-50 p-8 sm:p-10">
        <h2 className="font-serif text-3xl text-deep">
          This booking system isn&apos;t live yet
        </h2>
        <p className="mt-4 leading-relaxed text-charcoal-soft">
          {notConfigured.message}
        </p>
        <p className="mt-3 leading-relaxed text-charcoal-soft">
          This won&apos;t be shown to visitors once the owner connects storage
          and email. For now, you can reach us directly:
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton href={`mailto:${site.email}?subject=${encodeURIComponent("Booking enquiry — " + form.eventType)}&body=${encodeURIComponent(summaryForMailto(form))}`} variant="primary">
            Email your enquiry instead
          </LinkButton>
          <LinkButton href={site.whatsappHref} variant="outline" newTab>
            Chat on WhatsApp
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-bronze/20 bg-white shadow-soft">
      {/* Stepper */}
      <ol className="flex items-center justify-between gap-1 border-b border-bronze/15 px-6 py-5 sm:px-10" aria-label="Booking steps">
        {STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={label} className="flex flex-1 flex-col items-center gap-2 text-center">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i >= step}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                  done && "border-bronze-dark bg-bronze-dark text-ivory",
                  current && "border-bronze-dark bg-ivory text-bronze-dark",
                  !done && !current && "border-bronze/25 bg-ivory text-charcoal/40"
                )}
              >
                {done ? <Check className="h-4 w-4" aria-hidden="true" /> : i + 1}
              </button>
              <span
                className={cn(
                  "hidden text-[0.6rem] font-semibold uppercase tracking-widest sm:block",
                  current ? "text-bronze-dark" : "text-charcoal/45"
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < STEPS.length - 1) {
            if (validateStep(step)) setStep((s) => s + 1);
          } else {
            void handleSubmit();
          }
        }}
        noValidate
      >
        <div className="h-4 w-px border-0" aria-hidden="true" />
        <input
          type="text"
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] top-0 h-0 w-0 opacity-0"
        />

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          {/* ---------------- STEP 1 ---------------- */}
          {step === 0 && (
            <fieldset>
              <legend className="font-serif text-3xl text-deep">
                What are you celebrating?
              </legend>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set("eventType", type)}
                    aria-pressed={form.eventType === type}
                    className={cn(
                      "rounded-2xl border px-5 py-4 text-left transition-colors",
                      form.eventType === type
                        ? "border-bronze-dark bg-lavender/40 text-deep"
                        : "border-bronze/20 bg-ivory text-charcoal-soft hover:border-bronze/50"
                    )}
                  >
                    <span className="flex items-center gap-3 text-base font-semibold">
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border",
                          form.eventType === type
                            ? "border-bronze-dark bg-bronze-dark text-ivory"
                            : "border-bronze/40 bg-white"
                        )}
                      >
                        {form.eventType === type ? (
                          <Check className="h-3 w-3" aria-hidden="true" />
                        ) : null}
                      </span>
                      {type}
                    </span>
                  </button>
                ))}
              </div>
              {form.eventType === "Other" ? (
                <div className="mt-4">
                  <Field label="Describe your event type" htmlFor="other-type">
                    <Input
                      id="other-type"
                      value={form.eventTypeOther ?? ""}
                      onChange={(e) => set("eventTypeOther", e.target.value)}
                      placeholder="e.g. Engagement party"
                      maxLength={120}
                    />
                  </Field>
                </div>
              ) : null}

              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-deep">
                  Which services do you need?
                  <span className="ml-1 text-bronze-dark">*</span>
                </p>
                {errors.services ? (
                  <p role="alert" className="mb-2 text-xs font-medium text-red-700">
                    {errors.services}
                  </p>
                ) : null}
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {allServiceOptions.map((service) => {
                    const selected = form.services.includes(service.id);
                    return (
                      <label
                        key={service.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                          selected
                            ? "border-bronze-dark bg-lavender/40 font-medium text-deep"
                            : "border-bronze/20 bg-ivory text-charcoal-soft hover:border-bronze/50"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-[#9B5A2E]"
                          checked={selected}
                          onChange={() => toggleService(service.id)}
                        />
                        <span>{service.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </fieldset>
          )}

          {/* ---------------- STEP 2 ---------------- */}
          {step === 1 && (
            <fieldset>
              <legend className="font-serif text-3xl text-deep">
                Tell us about your event
              </legend>
              <p className="mt-2 text-sm text-charcoal-soft">
                Share whatever you already know — everything here is optional
                and can be refined later.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Preferred event date" htmlFor="event-date">
                  <Input
                    id="event-date"
                    type="date"
                    value={form.eventDate ?? ""}
                    onChange={(e) => set("eventDate", e.target.value)}
                  />
                </Field>
                <div className="flex items-end">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-bronze/20 bg-ivory px-4 py-3 text-sm text-charcoal-soft">
                    <input
                      type="checkbox"
                      checked={form.flexibleDate}
                      onChange={(e) => set("flexibleDate", e.target.checked)}
                      className="h-4 w-4 accent-[#9B5A2E]"
                    />
                    My date is flexible
                  </label>
                </div>
                <Field label="Start time (if known)" htmlFor="start-time">
                  <Input
                    id="start-time"
                    type="time"
                    value={form.startTime ?? ""}
                    onChange={(e) => set("startTime", e.target.value)}
                  />
                </Field>
                <Field label="End time (if known)" htmlFor="end-time">
                  <Input
                    id="end-time"
                    type="time"
                    value={form.endTime ?? ""}
                    onChange={(e) => set("endTime", e.target.value)}
                  />
                </Field>
                <Field
                  label="Venue or location (if known)"
                  htmlFor="venue"
                  hint="Not sure yet? Leave blank and we can help you find a venue."
                >
                  <Input
                    id="venue"
                    value={form.venue ?? ""}
                    onChange={(e) => set("venue", e.target.value)}
                    placeholder="e.g. Event hall or hotel name"
                    maxLength={160}
                  />
                </Field>
                <Field label="Event city" htmlFor="event-city">
                  <Input
                    id="event-city"
                    value={form.eventCity ?? ""}
                    onChange={(e) => set("eventCity", e.target.value)}
                    placeholder="e.g. Manchester"
                    maxLength={160}
                  />
                </Field>
                <Field label="Expected guest count" htmlFor="guest-count">
                  <Select
                    id="guest-count"
                    value={form.guestCount ?? ""}
                    onChange={(e) => set("guestCount", e.target.value)}
                  >
                    <option value="">Select a range…</option>
                    <option>1 – 25</option>
                    <option>26 – 50</option>
                    <option>51 – 100</option>
                    <option>101 – 200</option>
                    <option>201 – 400</option>
                    <option>400+</option>
                  </Select>
                </Field>
                <Field label="Indoor or outdoor?" htmlFor="indoor-outdoor">
                  <Select
                    id="indoor-outdoor"
                    value={form.indoorOutdoor ?? ""}
                    onChange={(e) => set("indoorOutdoor", e.target.value)}
                  >
                    <option value="">No preference</option>
                    <option>Indoor</option>
                    <option>Outdoor</option>
                    <option>Mixed</option>
                  </Select>
                </Field>
              </div>
            </fieldset>
          )}

          {/* ---------------- STEP 3 ---------------- */}
          {step === 2 && (
            <fieldset>
              <legend className="font-serif text-3xl text-deep">
                How can we reach you?
              </legend>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Full name" htmlFor="full-name" required error={errors.fullName}>
                    <Input
                      id="full-name"
                      value={form.fullName ?? ""}
                      onChange={(e) => set("fullName", e.target.value)}
                      invalid={Boolean(errors.fullName)}
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                  </Field>
                </div>
                <Field label="Email address" htmlFor="email" required error={errors.email}>
                  <Input
                    id="email"
                    type="email"
                    value={form.email ?? ""}
                    onChange={(e) => set("email", e.target.value)}
                    invalid={Boolean(errors.email)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Field>
                <Field label="Phone number" htmlFor="phone" required error={errors.phone}>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone ?? ""}
                    onChange={(e) => set("phone", e.target.value)}
                    invalid={Boolean(errors.phone)}
                    placeholder="e.g. 07700 000000"
                    autoComplete="tel"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <p className="mb-2 text-sm font-medium text-deep">
                    Preferred contact method
                    <span className="ml-1 text-bronze-dark">*</span>
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {CONTACT_METHODS.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => set("contactMethod", method as ContactMethod)}
                        aria-pressed={form.contactMethod === method}
                        className={cn(
                          "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                          form.contactMethod === method
                            ? "border-bronze-dark bg-bronze-dark text-ivory"
                            : "border-bronze/30 bg-ivory text-deep hover:border-bronze-dark"
                        )}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </fieldset>
          )}

          {/* ---------------- STEP 4 ---------------- */}
          {step === 3 && (
            <fieldset>
              <legend className="font-serif text-3xl text-deep">
                Budget and preferences
              </legend>
              <p className="mt-2 text-sm text-charcoal-soft">
                All of these are optional. It helps us tailor a realistic
                quotation for you.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field
                  label="Estimated budget (GBP)"
                  htmlFor="budget"
                  hint="If you'd rather discuss this by phone, just leave it blank."
                  error={errors.budgetGbp}
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-deep" aria-hidden="true">
                      £
                    </span>
                    <Input
                      id="budget"
                      inputMode="numeric"
                      value={form.budgetGbp ?? ""}
                      onChange={(e) => set("budgetGbp", e.target.value)}
                      invalid={Boolean(errors.budgetGbp)}
                      className="pl-9"
                      placeholder="e.g. 5000"
                    />
                  </div>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Event theme or style" htmlFor="theme-style">
                    <Input
                      id="theme-style"
                      value={form.themeStyle ?? ""}
                      onChange={(e) => set("themeStyle", e.target.value)}
                      placeholder="e.g. Elegant purple and gold, traditional Nigerian wedding"
                      maxLength={2000}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Catering / dietary requirements" htmlFor="dietary">
                    <Textarea
                      id="dietary"
                      value={form.dietaryRequirements ?? ""}
                      onChange={(e) => set("dietaryRequirements", e.target.value)}
                      placeholder="e.g. Vegetarian options, kids' meals, halal"
                      maxLength={2000}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Additional requests" htmlFor="additional">
                    <Textarea
                      id="additional"
                      value={form.additionalRequests ?? ""}
                      onChange={(e) => set("additionalRequests", e.target.value)}
                      placeholder="Anything else we should know?"
                      maxLength={2000}
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <p className="mb-2 text-sm font-medium text-deep">
                    Reference images <span className="font-normal text-charcoal/50">(optional)</span>
                  </p>
                  <div className="rounded-2xl border border-dashed border-bronze/30 bg-ivory p-5">
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-bronze/20 bg-white px-4 py-6 text-center text-sm text-charcoal-soft hover:border-bronze/50">
                      <Upload className="h-6 w-6 text-bronze-dark" aria-hidden="true" />
                      <span className="font-medium text-deep">Choose reference images</span>
                      <span className="text-xs">
                        Up to {MAX_REFERENCE_IMAGES} images, max 2.5 MB each (JPG, PNG, WEBP, HEIC)
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
                        className="sr-only"
                        onChange={(e) => {
                          onFilesSelected(Array.from(e.target.files ?? []));
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {!storageReady && files.length > 0 ? (
                      <p className="mt-2 text-xs text-bronze-dark">
                        Uploads aren&apos;t configured yet — files will be listed but not attached.
                      </p>
                    ) : null}
                    {files.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                        {files.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between gap-3 rounded-xl border border-bronze/15 bg-white px-4 py-2.5 text-sm"
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              {item.error ? (
                                <FileWarning className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                              ) : (
                                <Check className="h-4 w-4 shrink-0 text-bronze-dark" aria-hidden="true" />
                              )}
                              <span className={cn("truncate", item.error && "text-red-700")}>
                                {item.file.name}
                              </span>
                            </span>
                            <div className="flex shrink-0 items-center gap-3">
                              {item.error ? <span className="text-xs text-red-700">{item.error}</span> : null}
                              <button
                                type="button"
                                onClick={() => removeFile(i)}
                                aria-label={`Remove ${item.file.name}`}
                                className="text-charcoal/50 hover:text-red-600"
                              >
                                <X className="h-4 w-4" aria-hidden="true" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
            </fieldset>
          )}

          {/* ---------------- STEP 5 ---------------- */}
          {step === 4 && (
            <fieldset>
              <legend className="font-serif text-3xl text-deep">
                Review your enquiry
              </legend>
              <dl className="mt-6 divide-y divide-bronze/10 overflow-hidden rounded-2xl border border-bronze/15 bg-paper text-sm">
                <SummaryRow label="Event type" value={form.eventType + (form.eventTypeOther ? ` — ${form.eventTypeOther}` : "")} />
                <SummaryRow
                  label="Services"
                  value={form.services
                    .map((id) => {
                      const match = allServiceOptions.find((s) => s.id === id);
                      return match ? match.title : id;
                    })
                    .join(", ")}
                />
                <SummaryRow label="Preferred date" value={form.eventDate || "Flexible — no fixed date"} />
                <SummaryRow label="Time" value={[form.startTime, form.endTime].filter(Boolean).join(" – ") || "To be decided"} />
                <SummaryRow label="Venue" value={form.venue || "Help me find a venue"} />
                <SummaryRow label="City" value={form.eventCity || "—"} />
                <SummaryRow label="Guests" value={form.guestCount || "—"} />
                <SummaryRow label="Setting" value={form.indoorOutdoor || "No preference"} />
                <SummaryRow label="Budget" value={form.budgetGbp ? `£${form.budgetGbp}` : "Not specified — discuss later"} />
                <SummaryRow label="Theme / style" value={form.themeStyle || "—"} />
                <SummaryRow label="Catering / dietary" value={form.dietaryRequirements || "—"} />
                <SummaryRow label="Additional requests" value={form.additionalRequests || "—"} />
                <SummaryRow label="Reference images" value={files.length ? `${files.length} image(s) attached` : "None"} />
                <SummaryRow label="Contact" value={`${form.fullName} · ${form.email} · ${form.phone} (${form.contactMethod})`} />
              </dl>

              <div className="mt-6 rounded-2xl border border-lavender bg-lavender/30 p-5 text-sm leading-relaxed text-deep">
                <strong className="font-semibold">Privacy notice:</strong> The
                information you share is used only to respond to your event
                enquiry and is stored securely. We never publish or sell it.
                See our{" "}
                <Link href={privacyPath} className="font-semibold underline decoration-bronze underline-offset-2">
                  Privacy Policy
                </Link>
                . Submitting this form is a request for availability and a
                quotation — it does not confirm a booking.
              </div>

              {serverError ? (
                <p role="alert" className="mt-4 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                  {serverError}
                </p>
              ) : null}
            </fieldset>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-bronze/15 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <LinkButton href={site.whatsappHref} variant="outline" size="sm" newTab>
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Prefer WhatsApp?
            </LinkButton>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="min-w-44"
            >
              {isSubmitting || isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {isUploading ? "Uploading images…" : "Sending…"}
                </>
              ) : step === STEPS.length - 1 ? (
                <>
                  Send Booking Enquiry
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[12rem_1fr] sm:gap-4">
      <dt className="font-semibold text-deep">{label}</dt>
      <dd className="text-charcoal-soft">{value}</dd>
    </div>
  );
}

function summaryForMailto(form: BookingEnquiry) {
  return [
    `Event type: ${form.eventType}${form.eventTypeOther ? ` (${form.eventTypeOther})` : ""}`,
    "Services: " + form.services.join(", "),
    form.eventDate ? `Preferred date: ${form.eventDate}` : "",
    form.flexibleDate ? "Date flexible: Yes" : "",
    form.startTime || form.endTime
      ? `Time: ${form.startTime ?? ""} – ${form.endTime ?? ""}`
      : "",
    form.venue ? `Venue: ${form.venue}` : "",
    form.eventCity ? `City: ${form.eventCity}` : "",
    form.guestCount ? `Guests: ${form.guestCount}` : "",
    form.budgetGbp ? `Budget: £${form.budgetGbp}` : "",
    form.themeStyle ? `Theme: ${form.themeStyle}` : "",
    `Contact: ${form.fullName} · ${form.phone} · ${form.email}`,
  ]
    .filter(Boolean)
    .join("\n");
}