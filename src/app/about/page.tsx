import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";
import { site } from "@/lib/site";
import { aboutContent } from "@/content/about";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet AbiWande Events & Concierge — a Manchester event planning and concierge service focused on memorable celebrations and stress-free host experiences.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Planning that lets you enjoy the day"
        description="A warm, detail-led event and concierge service based in Manchester — created for people who want their celebration handled beautifully."
      />

      <Container className="py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-soft">
              <Image
                src="/images/about.jpg"
                alt="AbiWande Events & Concierge"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-4 rotate-2 rounded-2xl border border-bronze/25 bg-ivory px-6 py-4 shadow-card sm:right-[-1.5rem]">
              <p className="font-serif text-xl italic text-deep">
                “{site.tagline}”
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-4xl leading-tight text-deep sm:text-5xl">
              {aboutContent.heading}
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-charcoal-soft">
              {aboutContent.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-6 rounded-2xl border border-bronze/20 bg-paper p-5 text-sm leading-relaxed text-charcoal-soft">
              <strong className="font-semibold text-deep">Note:</strong> This
              biography is a neutral placeholder. Add AbiWande&apos;s own story,
              experience and values by editing the{" "}
              <code className="rounded bg-lavender/60 px-1.5 py-0.5 font-mono text-xs">
                src/content/about.ts
              </code>{" "}
              file.
            </p>
            <div className="mt-8">
              <LinkButton href="/book" variant="primary" size="lg">
                Start Planning Your Event
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>

      {/* Values strip */}
      <section className="border-y border-bronze/15 bg-paper">
        <Container className="py-12 sm:py-16">
          <ul className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Personal",
                text: "Every celebration is matched to the people at its heart.",
              },
              {
                title: "Refined",
                text: "Clean styling, considered details and a premium feel.",
              },
              {
                title: "Reliable",
                text: "Communications that are clear, honest and organised.",
              },
            ].map((value) => (
              <li key={value.title} className="text-center sm:text-left">
                <p className="font-serif text-3xl text-bronze-dark">
                  {value.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                  {value.text}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}