import * as React from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
  tone = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em]",
        tone === "dark" ? "text-bronze-dark" : "text-bronze",
        className
      )}
    >
      <span className="inline-block h-px w-8 bg-current" aria-hidden="true" />
      {children}
    </p>
  );
}