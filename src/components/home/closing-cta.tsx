import { MessageCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { site } from "@/lib/site";

export function ClosingCta() {
  return (
    <section className="bg-charcoal">
      <Container className="py-20 text-center sm:py-28">
        <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-bronze">
          <span className="inline-block h-px w-8 bg-bronze" aria-hidden="true" />
          Let&apos;s begin
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl font-serif text-4xl leading-[1.05] text-ivory sm:text-6xl">
          Let&apos;s Create Something
          <span className="block text-bronze">Unforgettable.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ivory/75">
          Tell us what you&apos;re celebrating, and let&apos;s start planning.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <LinkButton href="/book" variant="primary" size="lg">
            Request a Booking
          </LinkButton>
          <LinkButton
            href={site.whatsappHref}
            variant="light"
            size="lg"
            newTab
          >
            <MessageCircle className="h-5 w-5 text-bronze-dark" aria-hidden="true" />
            Chat on WhatsApp
          </LinkButton>
        </div>

        <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-ivory/50">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Available across {site.location} and beyond — tell us where your event is planned.
        </p>
      </Container>
    </section>
  );
}