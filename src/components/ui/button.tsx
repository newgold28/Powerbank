import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-bronze-dark text-ivory hover:bg-bronze shadow-[0_10px_24px_-12px_rgb(155,90,46,0.7)]",
  accent:
    "bg-deep text-ivory hover:bg-deep-soft shadow-[0_10px_24px_-14px_rgb(72,54,79,0.8)]",
  outline:
    "border border-bronze/60 bg-transparent text-deep hover:border-bronze-dark hover:bg-bronze/5",
  ghost: "text-deep hover:text-bronze-dark hover:bg-lavender/40",
  light:
    "bg-ivory text-deep hover:bg-white shadow-[0_10px_24px_-16px_rgb(0,0,0,0.5)]",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const buttonVariants = (
  variant: Variant = "primary",
  size: Size = "md"
) => cn(base, variants[variant], sizes[size]);

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants(variant, size), className)}
      {...props}
    />
  );
}

interface LinkButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: Variant;
  size?: Size;
  newTab?: boolean;
}

export function LinkButton({
  className,
  href,
  variant,
  size,
  newTab,
  children,
  ...props
}: LinkButtonProps) {
  const external = href.startsWith("http") || href.startsWith("tel") || href.startsWith("mailto") || href.startsWith("https://wa.me");
  const isNext = href.startsWith("/");
  const target = newTab || external ? "_blank" : undefined;
  const rel = external ? "noopener noreferrer" : undefined;

  const cls = cn(buttonVariants(variant, size), className);

  if (isNext && !external) {
    return (
      <Link href={href} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} target={target} rel={rel} {...props}>
      {children}
    </a>
  );
}