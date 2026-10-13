import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Service, enquireHref } from "@/content/services";
import { serviceIcons } from "./service-icons";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = serviceIcons[service.id] ?? serviceIcons["full-event-coordination"];

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-bronze/15 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-bronze/40 hover:shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-bronze/30 bg-lavender/40 text-bronze-dark">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <h3 className="mt-5 font-serif text-2xl leading-tight text-deep">
        {service.title}
      </h3>

      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-charcoal-soft">
        {service.short}
      </p>

      <Link
        href={enquireHref(service.id)}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-bronze-dark transition-colors hover:text-deep"
      >
        {service.enquireLabel}
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}