"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  portfolioItems,
  portfolioCategories,
  type PortfolioItem,
} from "@/content/portfolio";

type Filter = "All" | (typeof portfolioCategories)[number];

export function Gallery({ extraItems = [] }: { extraItems?: PortfolioItem[] }) {
  const [filter, setFilter] = React.useState<Filter>("All");
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const allItems = React.useMemo<PortfolioItem[]>(
    () =>
      extraItems.length > 0 ? [...portfolioItems, ...extraItems] : portfolioItems,
    [extraItems]
  );

  const items = React.useMemo<PortfolioItem[]>(() => {
    const list =
      filter === "All"
        ? allItems
        : allItems.filter((item) => item.category === filter);
    return list;
  }, [filter, allItems]);

  const counts = React.useMemo(() => {
    const map = new Map<Filter, number>();
    map.set("All", allItems.length);
    for (const cat of portfolioCategories) {
      map.set(cat, allItems.filter((i) => i.category === cat).length);
    }
    return map;
  }, [allItems]);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  const close = React.useCallback(() => setActiveIndex(null), []);
  const prev = React.useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i - 1 + items.length) % items.length
      ),
    [items.length]
  );
  const next = React.useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length]
  );

  React.useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, prev, next]);

  return (
    <div>
      <p className="mb-6 text-sm text-charcoal-soft">
        Categories fill in as the owner adds captions. Images are shown
        unlabelled until their subject is verified.
      </p>

      <div
        role="group"
        aria-label="Filter portfolio by category"
        className="mb-10 flex flex-wrap gap-2.5"
      >
        {(["All", ...portfolioCategories] as Filter[]).map((cat) => {
          const count = counts.get(cat) ?? 0;
          const active = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setFilter(cat);
                setActiveIndex(null);
              }}
              disabled={!active && count === 0}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                active
                  ? "border-bronze-dark bg-bronze-dark text-ivory"
                  : count === 0
                    ? "cursor-not-allowed border-bronze/15 text-charcoal/35"
                    : "border-bronze/30 text-deep hover:border-bronze-dark hover:text-bronze-dark"
              )}
            >
              {cat}
              <span className={cn("ml-1.5 text-xs", active ? "text-ivory/70" : "text-charcoal/40")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-bronze/30 bg-white p-10 text-center text-charcoal-soft">
          No images in this category yet. Images are added by the business
          owner.
        </p>
      ) : (
        <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((item, index) => (
            <li key={item.id} className="mb-5 break-inside-avoid">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative block w-full overflow-hidden rounded-3xl text-left"
                aria-label={item.title || `Open image in lightbox`}
              >
                <Image
                  src={item.src}
                  alt={item.caption || item.title || "Event photograph"}
                  width={1200}
                  height={900}
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-deep/70 via-deep/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {(item.title || item.category) && (
                  <span className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.category ? (
                      <span className="text-xs font-semibold uppercase tracking-widest text-bronze">
                        {item.category}
                      </span>
                    ) : null}
                    {item.title ? (
                      <span className="mt-1 block font-serif text-2xl text-ivory">
                        {item.title}
                      </span>
                    ) : null}
                    {item.caption ? (
                      <span className="mt-1 block text-sm text-ivory/85">
                        {item.caption}
                      </span>
                    ) : null}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Lightbox */}
      {activeItem && activeIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title || "Event photograph"}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/95 p-4 sm:p-8"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-ivory/25"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-ivory/25 sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ivory/10 text-ivory transition-colors hover:bg-ivory/25 sm:right-6"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>

          <figure
            className="flex max-h-full w-full max-w-5xl flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[78vh] w-full overflow-hidden rounded-2xl bg-charcoal">
              <Image
                src={activeItem.src}
                alt={activeItem.caption || activeItem.title || "Event photograph"}
                width={1200}
                height={900}
                sizes="100vw"
                className="mx-auto max-h-[78vh] w-auto object-contain"
                priority
              />
            </div>
            <figcaption className="flex flex-col gap-1 text-center">
              {activeItem.title ? (
                <p className="font-serif text-2xl text-ivory">
                  {activeItem.title}
                </p>
              ) : null}
              {activeItem.category ? (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze">
                  {activeItem.category}
                </p>
              ) : null}
              {activeItem.caption ? (
                <p className="text-sm text-ivory/80">{activeItem.caption}</p>
              ) : null}
              <p className="flex items-center justify-center gap-4 text-xs text-ivory/50">
                {activeItem.location ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {activeItem.location}
                  </span>
                ) : null}
                {activeItem.date ? (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    {activeItem.date}
                  </span>
                ) : null}
                <span>
                  {activeIndex + 1} / {items.length}
                </span>
              </p>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
}