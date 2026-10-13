import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { LinkButton } from "@/components/ui/button";
import { ServiceCard } from "@/components/services/service-card";
import {
  services,
  serviceGroups,
  fullCoordinationService,
  enquireHref,
  type ServiceGroup,
} from "@/content/services";

export const metadata: Metadata = {
  title: "Services & Event Planning",
  description:
    "Explore the full range of AbiWande Events & Concierge services: luxury events, weddings, catering, Afro DJs, photography, traditional attire and more in Manchester.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything your celebration needs, in one place"
        description="Sixteen coordinated services — from full event planning to the finest details. Prices are tailored to each event, so request a personal quotation."
      />

      {serviceGroups.map((group, gi) => {
        const grouped = services.filter((s) => s.group === group.name);
        return (
          <section
            key={group.name}
            className={gi % 2 === 0 ? "bg-ivory" : "bg-paper"}
          >
            <Container className="py-16 sm:py-20">
              <SectionHeader
                align="left"
                eyebrow={group.name}
                title={groupedTitle(group.name)}
                description={group.description}
              />
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {grouped.map((service, i) => (
                  <Reveal key={service.id} as="li" delay={(i % 4) * 60}>
                    <ServiceCard service={service} />
                  </Reveal>
                ))}
              </ul>
            </Container>
          </section>
        );
      })}

      {/* Full coordination banner */}
      <section className="bg-charcoal">
        <Container className="py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-bronze">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                One team for the whole day
              </p>
              <h2 className="mt-4 font-serif text-4xl text-ivory sm:text-5xl">
                Prefer us to handle it all?
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ivory/75">
                Planning a full event — or a celebration that needs several
                services at once? Select multiple services in your enquiry, or
                choose full event coordination and we&apos;ll manage the suppliers,
                styling and schedule for you.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <LinkButton href={enquireHref(fullCoordinationService.id)} variant="primary" size="lg">
                Request Full Event Coordination
              </LinkButton>
              <LinkButton href="/book" variant="light" size="lg">
                Request a Tailored Quotation
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function groupedTitle(group: ServiceGroup) {
  const titles: Record<ServiceGroup, string> = {
    "Event Planning": "Planned around you",
    Entertainment: "The sound and the scene",
    "Food & Hospitality": "Menus worth the occasion",
    "Photography & Event Presentation": "Dressed and remembered beautifully",
    "Event Essentials": "The practical pieces, sorted",
  };
  return titles[group];
}