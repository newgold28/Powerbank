import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, ArrowRight } from "lucide-react";
import { site, navLinks, bookingPath, privacyPath } from "@/lib/site";
import { Container } from "../ui/container";
import { Logo } from "./logo";
import { CurrentYear } from "./current-year";

const contactItems = [
  {
    href: site.phoneHref,
    icon: Phone,
    label: "Call us",
    value: site.phoneDisplay,
  },
  {
    href: site.emailHref,
    icon: Mail,
    label: "Email us",
    value: site.email,
  },
  {
    href: site.mapsHref,
    icon: MapPin,
    label: "Based in",
    value: site.location,
  },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo dark />
            <p className="mt-6 font-serif text-2xl text-bronze">
              “{site.tagline}”
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/70">
              Event planning and concierge services in {site.location}. We help
              you bring together everything a celebration needs — so you can
              enjoy the day.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-bronze">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory/80 transition-colors hover:text-bronze"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={bookingPath}
                  className="text-sm font-medium text-bronze transition-colors hover:text-bronze-dark"
                >
                  Request a Booking
                </Link>
              </li>
              <li>
                <Link
                  href={privacyPath}
                  className="text-sm text-ivory/80 transition-colors hover:text-bronze"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-bronze">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-4">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-start gap-3 text-sm text-ivory/80 transition-colors hover:text-bronze"
                    >
                      <Icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-bronze"
                        aria-hidden="true"
                      />
                      <span>
                        <span className="block text-xs text-ivory/50">{item.label}</span>
                        {item.value}
                      </span>
                    </a>
                  </li>
                );
              })}
              <li>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-sm text-ivory/80 transition-colors hover:text-bronze"
                >
                  <MessageCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-bronze"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-xs text-ivory/50">WhatsApp</span>
                    Chat with us
                  </span>
                </a>
              </li>
            </ul>
            <Link
              href={bookingPath}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-bronze/50 px-5 py-2.5 text-sm font-medium text-bronze transition-colors hover:bg-bronze hover:text-ivory"
            >
              Plan Your Event
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-ivory/10 pt-6 text-xs text-ivory/40 sm:flex-row">
          <p>
            © <CurrentYear /> {site.name}. All rights reserved.
          </p>
          <p>
            {site.location} · {site.phoneDisplay}
          </p>
        </div>
      </Container>
    </footer>
  );
}