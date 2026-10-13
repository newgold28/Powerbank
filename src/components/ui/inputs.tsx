import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-base text-charcoal placeholder:text-charcoal/40 transition-colors focus:outline-none focus:ring-2 focus:ring-bronze/40";

export function Label({
  htmlFor,
  children,
  required,
  className,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-1.5 flex items-baseline gap-1 text-sm font-medium text-deep",
        className
      )}
    >
      {children}
      {required ? (
        <span className="text-bronze-dark" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-xs leading-relaxed text-charcoal/55">{children}</p>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
      {message}
    </p>
  );
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, invalid, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          fieldBase,
          invalid ? "border-red-400" : "border-bronze/25",
          className
        )}
        {...props}
      />
    );
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          fieldBase,
          "min-h-32 resize-y",
          invalid ? "border-red-400" : "border-bronze/25",
          className
        )}
        {...props}
      />
    );
  }
);

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, invalid, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          fieldBase,
          "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2348364F%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-no-repeat pr-10",
          invalid ? "border-red-400" : "border-bronze/25",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {label ? (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      ) : null}
      {children}
      {hint ? <FieldHint>{hint}</FieldHint> : null}
      <FieldError message={error} />
    </div>
  );
}