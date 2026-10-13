import { Sparkles, ShieldCheck, HeartHandshake, SlidersHorizontal } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { testimonials } from "@/content/testimonials";

const reasons = [
  {
    icon: HeartHandshake,
    title: "Personalised planning",
    text: "Every event starts with your story. We listen first, then plan around your taste, family and traditions.",
  },
  {
    icon: SlidersHorizontal,
    title: "Attention to detail",
    text: "The little things make a celebration feel effortless — we look after them so nothing is overlooked.",
  },
  {
    icon: Sparkles,
    title: "Cultural celebration",
    text: "Deeply comfortable with Nigerian and other African traditions, alongside modern and intercontinental styles.",
  },
  {
    icon: ShieldCheck,
    title: "One team, coordinated services",
    text: "We bring together trusted suppliers and manage them on your behalf — one point of contact, many less worries.",
  },
];

export function WhyAbiWande() {
  return (
    <Section className="relative overflow-hidden bg-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[-6rem] top-24 h-72 w-72 rounded-full bg-lavender/40 blur-3xl" />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <SectionHeader
            align="left"
            eyebrow="Why choose AbiWande?"
            title="Planning that lets you enjoy the celebration"
            description="We exist to make your journey to the big day calmer, clearer and more enjoyable — so the party starts long before your guests arrive."
          />
          <div className="mt-2 flex items-center gap-4 rounded-2xl border border-bronze/20 bg-white p-5 shadow-card">
            <p className="font-serif text-4xl text-bronze-dark">“</p>
            <p className="font-serif text-xl italic leading-snug text-deep">
              {`You Celebrate, We Handle the Rest.`}
            </p>
          </div>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <Reveal key={reason.title} as="li" delay={i * 80}>
                <div className="h-full rounded-3xl border border-bronze/15 bg-white p-7 shadow-card">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lavender/50 text-bronze-dark">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl text-deep">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                    {reason.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>

      {testimonials.length > 0 ? (
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-3xl border border-bronze/15 bg-white p-7 shadow-card"
            >
              <p className="font-serif text-lg italic leading-relaxed text-deep">
                “{t.quote}”
              </p>
              <footer className="mt-4 text-sm">
                <span className="font-semibold text-bronze-dark">{t.name}</span>
                <span className="text-charcoal-soft"> · {t.event}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      ) : null}
    </Section>
  );
}