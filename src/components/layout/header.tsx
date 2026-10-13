"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, CalendarPlus, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, site } from "@/lib/site";
import { Logo } from "./logo";
import { LinkButton } from "../ui/button";

export function Header() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while the mobile menu is open.
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-bronze/15 bg-ivory/90 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10"
      >
        <Logo />

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative text-sm font-medium tracking-wide transition-colors",
                    active
                      ? "text-bronze-dark"
                      : "text-deep hover:text-bronze-dark",
                    "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-bronze after:transition-all",
                    active ? "after:w-full" : "after:w-0 hover:after:w-full"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <LinkButton href="/book" variant="primary" size="sm">
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            Plan Your Event
          </LinkButton>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={site.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with AbiWande on WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-bronze/40 text-bronze-dark"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-bronze/40 text-deep"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "border-t border-bronze/15 bg-ivory lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-6">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-xl px-4 py-3 font-serif text-2xl",
                  active
                    ? "bg-lavender text-deep"
                    : "text-deep hover:bg-lavender/50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-4 flex flex-col gap-3 px-2">
            <LinkButton href="/book" variant="primary" className="w-full" onClick={() => setOpen(false)}>
              <CalendarPlus className="h-4 w-4" aria-hidden="true" />
              Plan Your Event
            </LinkButton>
            <LinkButton
              href={site.whatsappHref}
              variant="outline"
              newTab
              className="w-full"
              onClick={() => setOpen(false)}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat on WhatsApp
            </LinkButton>
          </div>
        </div>
      </div>
    </header>
  );
}