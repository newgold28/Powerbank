import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Eyebrow } from "./eyebrow";

export function Section({
  id,
  children,
  className,
  containerClassName,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 max-w-2xl sm:mb-16",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <Eyebrow
          tone={tone}
          className={cn(align === "center" && "justify-center")}
        >
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2
        className={cn(
          "mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl",
          tone === "dark" ? "text-deep" : "text-ivory"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-charcoal-soft" : "text-ivory/80"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}