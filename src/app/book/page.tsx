import type { Metadata } from "next";
import { CalendarPlus, MessageCircle, ShieldCheck, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { LinkButton } from "@/components/ui/button";
import { BookingForm } from "@/components/booking/booking-form";
import { serviceById, serviceDisplayName } from "@/content/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Booking",
  description:
    "Request a tailored quotation from AbiWande Events & Concierge in Manchester. Tell us about your wedding, birthday, corporate or luxury event and we'll take it from there.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;
  const rawService = params.service ?? "";
  const match = serviceById(rawService) ?? serviceById(serviceDisplayName(rawService).replace(/\s+/g, "-"));
  const initialService = match?.id;

  return (
    <>
      <section className="border-b border-bronze/15 bg-paper">
        <Container className="py-14 sm:py-20">
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-bronze-dark">
              <span className="inline-block h-px w-10 bg-bronze/70" aria-hidden="true" />
              Bookings
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-[1.02] tracking-tight text-deep sm:text-6xl">
              Request a Booking
            </h1>
            {initialService ? (
              <p className="mt-5 text-lg leading-relaxed text-charcoal-soft">
                You&apos;re enquiring about{" "}
                <strong className="font-semibold text-deep">
                  {serviceDisplayName(initialService)}
                </strong>
                . You can change or add more services below.
              </p>
            ) : (
              <p className="mt-5 text-lg leading-relaxed text-charcoal-soft">
                Tell us about the celebration you have in mind. This enquiry
                lets us check availability and prepare a tailored quotation —
                your date is only reserved once we confirm the details together.
              </p>
            )}
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <Reveal>
            <BookingForm initialService={initialService} />
          </Reveal>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-bronze/15 bg-white p-7 shadow-card">
              <h2 className="flex items-center gap-2 font-serif text-2xl text-deep">
                <Clock className="h-5 w-5 text-bronze-dark" aria-hidden="true" />
                What happens next?
              </h2>
              <ol className="mt-4 space-y-3 text-sm text-charcoal-soft">
                {[
                  "We review your enquiry and check availability.",
                  "We send a tailored quotation and discuss the details.",
                  "Once you agree, we confirm your booking together.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lavender/60 font-serif text-xs text-bronze-dark">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-4 rounded-xl bg-lavender/30 p-3 text-xs leading-relaxed text-deep">
                Sending an enquiry does not confirm your booking — availability
                and a quotation are always agreed first.
              </p>
            </div>

            <div className="rounded-3xl bg-charcoal p-7 text-ivory">
              <h2 className="font-serif text-2xl text-ivory">Prefer to talk now?</h2>
              <p className="mt-2 text-sm text-ivory/75">
                Call, WhatsApp or email us and we&apos;ll help you get started right
                away.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <LinkButton href={site.whatsappHref} variant="light" size="sm" newTab>
                  <MessageCircle className="h-4 w-4 text-bronze-dark" aria-hidden="true" />
                  WhatsApp us
                </LinkButton>
                <LinkButton href={`tel:${site.phoneHref}`} variant="outline" size="sm">
                  <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                  Call {site.phoneDisplay}
                </LinkButton>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-3xl border border-bronze/15 bg-white p-6 text-sm text-charcoal-soft">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-bronze-dark" aria-hidden="true" />
              <p>
                Your details are stored securely and only ever used to respond
                to your enquiry. See our{" "}
                <a href="/privacy" className="font-semibold underline decoration-bronze underline-offset-2 hover:text-bronze-dark">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}