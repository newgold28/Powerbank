import { MessagesSquare, Lightbulb, FileText, CalendarCheck } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    icon: MessagesSquare,
    number: "01",
    title: "Tell us about your event",
    text: "Share the basics — the type of event, approximate date and what you have in mind.",
  },
  {
    icon: Lightbulb,
    number: "02",
    title: "Discuss your ideas and requirements",
    text: "We talk through your vision, style, budget and the services that matter most to you.",
  },
  {
    icon: FileText,
    number: "03",
    title: "Receive a tailored quotation",
    text: "You get a clear, personalised quotation based on what you need — no fixed, off-the-shelf prices.",
  },
  {
    icon: CalendarCheck,
    number: "04",
    title: "Confirm your booking and plan the details",
    text: "Once you accept, we agree the details together and get to work. Your date is only reserved when confirmed.",
  },
];

export function HowItWorks() {
  return (
    <Section className="bg-lavender/40">
      <SectionHeader
        eyebrow="How it works"
        title="From first idea to unforgettable day"
        description="A simple, transparent way to begin. Sending an enquiry is a request for availability and a quotation — it does not confirm a booking."
      />

      <ol className="relative grid gap-6 md:grid-cols-4">
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-7 hidden h-px bg-bronze/40 md:block"
        />
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <Reveal key={step.number} as="li" delay={i * 90}>
              <div className="relative h-full rounded-3xl border border-bronze/15 bg-white/80 p-7 text-left backdrop-blur-sm">
                <div className="relative flex w-fit items-center gap-3">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-deep text-ivory">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="font-serif text-3xl text-bronze-dark/50">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-2xl leading-snug text-deep">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">
                  {step.text}
                </p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}