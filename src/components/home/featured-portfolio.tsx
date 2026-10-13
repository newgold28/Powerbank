import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { LinkButton } from "@/components/ui/button";

const featured = [
  { src: "/images/portfolio/portfolio-05.jpg", alt: "Portrait of a beautifully dressed celebration guest", span: "lg:col-span-1 lg:row-span-2" },
  { src: "/images/portfolio/portfolio-16.jpg", alt: "Landscape-style event photograph", span: "lg:col-span-2" },
  { src: "/images/portfolio/portfolio-24.jpg", alt: "Event space photograph", span: "lg:col-span-1" },
  { src: "/images/portfolio/portfolio-33.jpg", alt: "Celebration in full swing", span: "lg:col-span-1" },
  { src: "/images/portfolio/portfolio-40.jpg", alt: "Guest in traditional attire", span: "lg:col-span-1" },
] as const;

export function FeaturedPortfolio() {
  return (
    <Section className="bg-paper">
      <SectionHeader
        eyebrow="Featured portfolio"
        title="Moments we helped weave together"
        description="A glimpse of the celebrations, styling and details we coordinate. Each image can be captioned, categorised and replaced as the portfolio grows — sign in to manage or edit <code>src/content/portfolio.ts</code>."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[16rem]">
        {featured.map((item, i) => (
          <Reveal key={item.src} delay={i * 70} className={item.span}>
            <Link
              href="/portfolio#gallery"
              className="group relative block h-full w-full overflow-hidden rounded-3xl"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
              />
              <span className="absolute inset-0 bg-deep/0 transition-colors duration-300 group-hover:bg-deep/20" />
              <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-ivory/90 text-bronze-dark opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center">
        <LinkButton href="/portfolio" variant="primary" size="lg">
          Explore Our Portfolio
          <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
        </LinkButton>
      </div>
    </Section>
  );
}