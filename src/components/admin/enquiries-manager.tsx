"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Phone,
  Mail,
  MessageCircle,
  ChevronRight,
  Save,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { cn, formatDate, formatGbp } from "@/lib/utils";
import type { DbEnquiry } from "@/lib/enquiry-types";
import { STATUSES, DEPOSIT_STATUSES } from "@/lib/booking-types";
import { services, serviceDisplayName } from "@/content/services";
import { Field, Input, Select, Textarea } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";

interface SignedImage {
  path?: string;
  name?: string;
  url: string | null;
  error?: string | null;
}

export function EnquiriesManager({
  enquiries,
  statusFilter,
  search,
  serviceFilter,
}: {
  enquiries: DbEnquiry[];
  statusFilter: string;
  search: string;
  serviceFilter: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [drafts, setDrafts] = React.useState<Record<string, DbEnquiry>>({});
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [images, setImages] = React.useState<Record<string, SignedImage[]>>({});

  const active = enquiries.find((e) => e.id === activeId) ?? null;
  const draft = active ? (drafts[active.id] ?? active) : null;

  function setParam(key: string, value: string, keep = false) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (!keep) next.delete("q");
    router.push(`/admin?${next.toString()}`);
    router.refresh();
  }

  function updateDraft<K extends keyof DbEnquiry>(key: K, value: DbEnquiry[K]) {
    if (!active) return;
    setDrafts((d) => ({
      ...d,
      [active.id]: {
        ...(d[active.id] ?? active),
        [key]: value,
      },
    }));
  }

  async function save() {
    if (!active || !draft) return;
    setSavingId(active.id);
    try {
      const res = await fetch(`/api/admin/enquiries/${active.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: draft.status,
          notes: draft.notes,
          quote_amount: draft.quote_amount,
          deposit_status: draft.deposit_status,
          deposit_amount: draft.deposit_amount,
        }),
      });
      if (res.ok) {
        setDrafts((d) => {
          const next = { ...d };
          delete next[active.id];
          return next;
        });
        router.refresh();
      } else {
        alert("Could not save changes. Please try again.");
      }
    } finally {
      setSavingId(null);
    }
  }

  React.useEffect(() => {
    if (!active || images[active.id]) return;
    fetch(`/api/admin/enquiries/${active.id}/images`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setImages((m) => ({ ...m, [active.id]: data.images }));
      })
      .catch(() => {});
  }, [active, images]);

  return (
    <div className="mt-10">
      <h2 className="font-serif text-3xl text-deep">Enquiries</h2>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" aria-hidden="true" />
          <input
            key={search}
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") setParam("q", e.currentTarget.value.trim());
            }}
            placeholder="Search name, email, type, city…"
            className="w-64 rounded-full border border-bronze/25 bg-white py-2.5 pl-9 pr-4 text-sm"
            aria-label="Search enquiries"
          />
        </div>
        <Select
          value={serviceFilter}
          onChange={(e) => setParam("service", e.target.value)}
          className="w-56 rounded-full py-2.5 text-sm"
          aria-label="Filter by service"
        >
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setParam("status", e.target.value)}
          className="w-44 rounded-full py-2.5 text-sm"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        {(statusFilter || search || serviceFilter) ? (
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="text-sm font-medium text-bronze-dark underline underline-offset-2"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {/* Counts */}
      <p className="mt-4 text-sm text-charcoal-soft">
        {enquiries.length} enquiry{enquiries.length === 1 ? "" : "s"} found.
      </p>

      {enquiries.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-bronze/30 bg-white p-10 text-center text-charcoal-soft">
          No enquiries match. New submissions from the booking form will appear
          here.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-bronze/10 overflow-hidden rounded-2xl border border-bronze/15 bg-white">
          {enquiries.map((enquiry) => {
            const isOpen = activeId === enquiry.id;
            return (
              <li key={enquiry.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(isOpen ? null : enquiry.id);
                  }}
                  aria-expanded={isOpen}
                  className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 text-left transition-colors hover:bg-paper"
                >
                  <ChevronRight
                    className={cn("h-4 w-4 text-bronze", isOpen && "rotate-90")}
                    aria-hidden="true"
                  />
                  <span className="min-w-40 flex-1">
                    <span className="block font-semibold text-deep">
                      {enquiry.full_name}
                    </span>
                    <span className="block text-xs text-charcoal-soft">
                      {enquiry.event_type}
                      {enquiry.event_city ? ` · ${enquiry.event_city}` : ""} ·{" "}
                      {formatDate(enquiry.created_at)}
                    </span>
                  </span>
                  <span className="hidden text-xs text-charcoal/50 sm:block">
                    {enquiry.services.length} service
                    {enquiry.services.length === 1 ? "" : "s"}
                  </span>
                  <StatusBadge status={enquiry.status} />
                </button>

                {isOpen && draft ? (
                  <div className="grid gap-8 border-t border-bronze/15 bg-paper p-6 lg:grid-cols-[1.2fr_1fr]">
                    {/* Read-only summary */}
                    <div>
                      <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                        <Row k="Contact" v={`${draft.email} · ${draft.phone}`} big />
                        <Row k="Preferred contact" v={draft.contact_method ?? "—"} />
                        <Row k="Event type" v={draft.event_type + (draft.event_type_other ? ` — ${draft.event_type_other}` : "")} />
                        <Row k="Services" v={draft.services.map(serviceDisplayName).join(", ")} />
                        <Row k="Event date" v={draft.event_date ?? "—"} />
                        <Row k="Date flexible" v={draft.flexible_date ? "Yes" : "No"} />
                        <Row k="Time" v={[draft.start_time, draft.end_time].filter(Boolean).join(" – ") || "—"} />
                        <Row k="Venue" v={draft.venue ?? "—"} />
                        <Row k="City" v={draft.event_city ?? "—"} />
                        <Row k="Guests" v={draft.guest_count ?? "—"} />
                        <Row k="Setting" v={draft.indoor_outdoor ?? "—"} />
                        <Row k="Budget" v={formatGbp(draft.budget_gbp) || "—"} />
                        <Row k="Theme / style" v={draft.theme_style ?? "—"} />
                        <Row k="Dietary / catering" v={draft.dietary_requirements ?? "—"} />
                        <Row k="Additional requests" v={draft.additional_requests ?? "—"} />
                        <Row k="Submitted" v={formatDate(draft.created_at)} />
                      </dl>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <a
                          href={`mailto:${draft.email}`}
                          className="inline-flex items-center gap-2 rounded-full bg-deep px-4 py-2 text-sm font-medium text-ivory hover:bg-deep-soft"
                        >
                          <Mail className="h-4 w-4" aria-hidden="true" />
                          Email
                        </a>
                        <a
                          href={`tel:${draft.phone.replace(/[^+\d]/g, "")}`}
                          className="inline-flex items-center gap-2 rounded-full border border-bronze/40 px-4 py-2 text-sm font-medium text-deep hover:border-bronze-dark"
                        >
                          <Phone className="h-4 w-4" aria-hidden="true" />
                          Call
                        </a>
                        <a
                          href={`https://wa.me/${draft.phone.replace(/[^+\d]/g, "")}?text=${encodeURIComponent("Hello, this is AbiWande Events & Concierge regarding your event enquiry.")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-bronze/40 px-4 py-2 text-sm font-medium text-deep hover:border-bronze-dark"
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          WhatsApp
                        </a>
                      </div>

                      {draft.reference_images?.length ? (
                        <div className="mt-6">
                          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-deep">
                            <ImageIcon className="h-4 w-4 text-bronze-dark" aria-hidden="true" />
                            Reference images
                          </p>
                          {active?.id && images[active.id] ? (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                              {images[active.id].map((img) =>
                                img.url ? (
                                  <a key={img.path ?? img.name} href={img.url} target="_blank" rel="noopener noreferrer" className="aspect-square overflow-hidden rounded-xl border border-bronze/20 bg-white">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={img.url}
                                      alt={img.name ?? "Reference image"}
                                      className="h-full w-full object-cover"
                                    />
                                  </a>
                                ) : (
                                  <p key={img.path ?? img.name} className="flex aspect-square items-center rounded-xl border border-dashed border-bronze/30 p-2 text-center text-xs text-charcoal-soft">
                                    {img.error ?? "Image unavailable"}
                                  </p>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-charcoal-soft">Loading signed links…</p>
                          )}
                        </div>
                      ) : null}
                    </div>

                    {/* Editable panel */}
                    <div className="space-y-4 rounded-2xl border border-bronze/15 bg-white p-6">
                      <h3 className="font-serif text-2xl text-deep">Manage enquiry</h3>
                      <Field label="Status" htmlFor="status">
                        <Select
                          id="status"
                          value={draft.status}
                          onChange={(e) => updateDraft("status", e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </Field>
                      <Field label="Agreed quotation (GBP)" htmlFor="quote">
                        <Input
                          id="quote"
                          type="number"
                          min={0}
                          inputMode="numeric"
                          value={draft.quote_amount ?? ""}
                          onChange={(e) =>
                            updateDraft(
                              "quote_amount",
                              e.target.value === "" ? null : Number(e.target.value)
                            )
                          }
                        />
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Deposit status" htmlFor="deposit-status">
                          <Select
                            id="deposit-status"
                            value={draft.deposit_status ?? ""}
                            onChange={(e) => updateDraft("deposit_status", e.target.value)}
                          >
                            <option value="">Not set</option>
                            {DEPOSIT_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </Select>
                        </Field>
                        <Field label="Deposit (GBP)" htmlFor="deposit-amount">
                          <Input
                            id="deposit-amount"
                            type="number"
                            min={0}
                            inputMode="numeric"
                            value={draft.deposit_amount ?? ""}
                            onChange={(e) =>
                              updateDraft(
                                "deposit_amount",
                                e.target.value === "" ? null : Number(e.target.value)
                              )
                            }
                          />
                        </Field>
                      </div>
                      <Field
                        label="Private notes"
                        htmlFor="notes"
                        hint="Only you see this — never included in client emails."
                      >
                        <Textarea
                          id="notes"
                          value={draft.notes ?? ""}
                          onChange={(e) => updateDraft("notes", e.target.value)}
                          placeholder="e.g. Wants purple theme, needs hall in Manchester…"
                        />
                      </Field>
                      <Button
                        type="button"
                        onClick={save}
                        disabled={savingId === (active?.id ?? null)}
                        className="w-full"
                      >
                        {savingId === active?.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                          <Save className="h-4 w-4" aria-hidden="true" />
                        )}
                        Save changes
                      </Button>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-center text-xs text-charcoal/50">
        Statuses: {STATUSES.join(" · ")}
      </p>
    </div>
  );
}

function Row({ k, v, big }: { k: string; v: string; big?: boolean }) {
  return (
    <div className={cn(big && "sm:col-span-2")}>
      <dt className="text-xs font-semibold uppercase tracking-wider text-bronze-dark">{k}</dt>
      <dd className="mt-0.5 break-words text-charcoal-soft">{v}</dd>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  New: "bg-lavender text-deep",
  Reviewing: "bg-amber-100 text-amber-900",
  "Quote Sent": "bg-sky-100 text-sky-900",
  Confirmed: "bg-emerald-100 text-emerald-900",
  Declined: "bg-red-100 text-red-900",
  Completed: "bg-charcoal text-ivory",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        statusStyles[status] ?? "bg-paper text-charcoal-soft"
      )}
    >
      {status}
    </span>
  );
}