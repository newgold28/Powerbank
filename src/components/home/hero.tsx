import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory">
      {/* Subtle decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-32 right-[-10%] h-[34rem] w-[34rem] rounded-full bg-lavender/50 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-8%] h-[26rem] w-[26rem] rounded-full bg-bronze/10 blur-3xl" />
      </div>

      <Container className="relative py-16 sm:py-24 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-bronze-dark">
              <span className="inline-block h-px w-10 bg-bronze/70" aria-hidden="true" />
              Luxury Events · Manchester
            </p>

            <h1 className="mt-6 font-serif text-5xl leading-[1.02] tracking-tight text-deep sm:text-6xl lg:text-7xl">
              {site.name.split(" Events")[0]}
              <span className="block text-bronze-dark">
                Events &amp; Concierge
              </span>
            </h1>

            <p className="mt-6 font-serif text-2xl italic text-bronze sm:text-3xl">
              “{site.tagline}”
            </p>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal-soft">
              Exceptional events, thoughtful planning and unforgettable
              experiences. From intimate celebrations to elegant weddings and
              corporate occasions, we help bring your vision to life.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <LinkButton href="/book" variant="primary" size="lg">
                Plan Your Event
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </LinkButton>
              <LinkButton href="/portfolio" variant="outline" size="lg">
                Explore Our Work
              </LinkButton>
            </div>

            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-deep">
              {["Weddings", "Birthdays", "Corporate", "Traditional Celebrations"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-bronze" aria-hidden="true" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
              <Image
                src="/images/hero.jpg"
                alt="Beautifully styled event by AbiWande Events & Concierge"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-8 -left-6 w-36 overflow-hidden rounded-2xl border-4 border-ivory shadow-card sm:-left-10 sm:w-48">
              <div className="relative aspect-square">
                <Image
                  src="/images/hero-secondary.jpg"
                  alt="Event styling detail"
                  fill
                  sizes="(max-width: 640px) 144px, 192px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute -right-3 top-6 rotate-3 rounded-2xl border border-bronze/30 bg-ivory/95 px-5 py-3 shadow-card backdrop-blur-sm sm:right-[-1.5rem]">
              <p className="font-serif text-2xl leading-none text-bronze-dark">A–Z</p>
              <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-deep">
                Celebration
                <br />
                Planning
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}