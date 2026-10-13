"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, LogIn, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/inputs";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [magicPending, setMagicPending] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (active && session) router.replace("/admin");
      } catch {
        // not configured
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(error.message);
        setSubmitting(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Sign-in is not available yet — Supabase auth must be configured.");
      setSubmitting(false);
    }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Please enter your email address first.");
      return;
    }
    setMagicPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/confirm?next=/admin`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setNotice("Check your inbox — we've sent you a secure sign-in link.");
      }
    } catch {
      setError("Email sign-in is not available yet — Supabase must be configured, including email auth.");
    } finally {
      setMagicPending(false);
    }
  }

  return (
    <form onSubmit={signIn} className="space-y-5" noValidate>
      <div className="flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lavender/60 text-bronze-dark">
          <KeyRound className="h-7 w-7" aria-hidden="true" />
        </div>
      </div>
      <h1 className="text-center font-serif text-4xl text-deep">Owner sign in</h1>
      <p className="text-center text-sm text-charcoal-soft">
        Restricted area for AbiWande Events &amp; Concierge. Enquiries are never
        shown publicly.
      </p>

      {error ? (
        <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p role="status" className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
          {notice}
        </p>
      ) : null}

      <Field label="Email address" htmlFor="admin-email" required>
        <Input
          id="admin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Field>
      <Field label="Password" htmlFor="admin-password" required>
        <Input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </Field>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <LogIn className="h-4 w-4" aria-hidden="true" />
        )}
        Sign in
      </Button>

      <div className="relative text-center">
        <span className="absolute inset-x-0 top-1/2 h-px bg-bronze/15" aria-hidden="true" />
        <span className="relative bg-white px-3 text-xs text-charcoal/50">or</span>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={sendMagicLink}
        disabled={magicPending}
      >
        {magicPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Mail className="h-4 w-4" aria-hidden="true" />
        )}
        Email me a sign-in link
      </Button>
    </form>
  );
}