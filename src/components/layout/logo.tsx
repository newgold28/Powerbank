import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        aria-hidden="true"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-bronze/60 font-serif text-2xl text-bronze-dark transition-colors group-hover:bg-bronze/10"
        style={dark ? { borderColor: "rgb(255 252 247 / 0.5)" } : undefined}
      >
        A
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif text-xl tracking-wide",
            dark ? "text-ivory" : "text-deep"
          )}
        >
          AbiWande
        </span>
        <span
          className={cn(
            "mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.34em]",
            dark ? "text-bronze" : "text-bronze-dark"
          )}
        >
          Events · Concierge
        </span>
      </span>
    </Link>
  );
}