import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Eyebrow } from "./eyebrow";

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-bronze/15 bg-paper",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-24 right-[-6rem] h-80 w-80 rounded-full bg-lavender/50 blur-3xl" />
      </div>
      <Container className="relative py-16 sm:py-24">
        <div className="max-w-3xl">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="mt-5 font-serif text-5xl leading-[1.02] tracking-tight text-deep sm:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 text-lg leading-relaxed text-charcoal-soft">
              {description}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}