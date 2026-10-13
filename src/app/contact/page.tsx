import type { Metadata } from "next";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  CalendarPlus,
  ArrowRight,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { site, bookingPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact AbiWande Events & Concierge in Manchester by phone, WhatsApp or email to plan your wedding, birthday, corporate or luxury event.",
};

const cards = [
  {
    icon: Phone,
    title: "Call us",
    value: site.phoneDisplay,
    href: site.phoneHref,
    note: "Available for bookings and enquiries.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: site.phoneDisplay,
    href: site.whatsappHref,
    note: "Quickest for a chat about your event.",
  },
  {
    icon: Mail,
    title: "Email",
    value: site.email,
    href: site.emailHref,
    note: "For detailed enquiries and quotations.",
  },
  {
    icon: MapPin,
    title: "Location",
    value: site.location,
    href: site.mapsHref,
    note: "Planning events across the UK and beyond.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's start the conversation"
        description="Reach us on any channel below, or send a booking enquiry and we'll get back to you about availability and the next steps."
      />

      <Container className="py-16 sm:py-24">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <li key={card.title}>
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex h-full flex-col rounded-3xl border border-bronze/15 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-bronze/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lavender/50 text-bronze-dark">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 font-serif text-2xl text-deep">
                    {card.title}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-bronze-dark group-hover:text-deep">
                    {card.value}
                  </p>
                  <p className="mt-2 flex-1 text-sm text-charcoal-soft">
                    {card.note}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-bronze-dark">
                    Open
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-3xl border border-bronze/15 bg-paper p-8 sm:p-10">
            <h2 className="font-serif text-3xl text-deep sm:text-4xl">
              Plan your event with us
            </h2>
            <p className="mt-4 leading-relaxed text-charcoal-soft">
              Tell us what you&apos;re celebrating and the details you have in mind.
              Submitting an enquiry lets us check availability and prepare a
              tailored quotation — nothing is confirmed until we&apos;ve agreed the
              details together.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={bookingPath} variant="primary" size="lg">
                <CalendarPlus className="h-5 w-5" aria-hidden="true" />
                Request a Booking
              </LinkButton>
              <LinkButton
                href={site.whatsappHref}
                variant="outline"
                size="lg"
                newTab
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Chat on WhatsApp
              </LinkButton>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-charcoal-soft">
              <Clock className="h-4 w-4 text-bronze-dark" aria-hidden="true" />
              We aim to reply to every enquiry within two working days.
            </p>
          </div>

          <div className="min-h-[16rem] overflow-hidden rounded-3xl border border-bronze/15 shadow-card">
            <iframe
              title="Map of Manchester, United Kingdom"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-2.35%2C53.42%2C-2.15%2C53.52&layer=mapnik&marker=53.4808%2C-2.2426"
              className="h-full min-h-[16rem] w-full border-0"
              loading="lazy"
            />
            <p className="border-t border-bronze/15 bg-ivory px-4 py-3 text-center text-xs text-charcoal-soft">
              Based in {site.location} ·{" "}
              <a
                href={site.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-bronze underline-offset-2 hover:text-bronze-dark"
              >
                Open in Google Maps
              </a>
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}