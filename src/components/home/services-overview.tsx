import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { LinkButton } from "@/components/ui/button";
import { ServiceCard } from "@/components/services/service-card";
import { services } from "@/content/services";
import { bookingPath } from "@/lib/site";

export function ServicesOverview() {
  return (
    <Section className="bg-ivory">
      <SectionHeader
        eyebrow="What we do"
        title="Everything your celebration needs"
        description="From full event coordination to a single cherished detail, our services come together around you — planned, styled and delivered as one."
      />

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, i) => (
          <Reveal key={service.id} as="li" delay={(i % 4) * 60}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </ul>

      <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <LinkButton href="/services" variant="outline">
          View All Services
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </LinkButton>
        <LinkButton href={bookingPath} variant="primary">
          Request a Tailored Quotation
        </LinkButton>
      </div>
    </Section>
  );
}