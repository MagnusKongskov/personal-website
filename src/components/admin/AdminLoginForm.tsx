"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Container from "@/components/Container";
import { ADMIN_EMAIL } from "@/lib/admin";

type AdminLoginFormProps = {
  callbackUrl: string;
  showVerifyMessage: boolean;
  authError?: string | null;
};

export default function AdminLoginForm({
  callbackUrl,
  showVerifyMessage,
  authError = null,
}: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(authError);
  const [emailSent, setEmailSent] = useState(showVerifyMessage);

  async function handleEmailSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError("Access is restricted to the admin account.");
      return;
    }

    setIsEmailLoading(true);

    try {
      const result = await signIn("resend", {
        email: ADMIN_EMAIL,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError("Could not send the magic link. Please try again.");
      } else {
        setEmailSent(true);
      }
    } catch {
      setError("Could not send the magic link. Please try again.");
    } finally {
      setIsEmailLoading(false);
    }
  }

  return (
    <section className="py-12 sm:py-20">
      <Container>
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl border border-border bg-foreground/[0.03] p-8 sm:p-10">
            <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Admin sign in
            </h1>
            <p className="mt-4 text-center text-sm text-muted">
              Admin functionality for Magnus Kongskov&apos;s webpage. If you
              ended up here without talking to Magnus, you are probably on the
              wrong page.
            </p>

            {emailSent ? (
              <p className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                Check your email for a magic link to sign in.
              </p>
            ) : null}

            {error ? (
              <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <form onSubmit={handleEmailSignIn} className="mt-8 space-y-4">
              <label className="block">
                <span className="mb-2 block pl-1 text-sm font-medium">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted outline-none"
                />
              </label>

              <button
                type="submit"
                disabled={isEmailLoading}
                className="w-full rounded-full border border-transparent bg-secondary px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isEmailLoading ? "Sending link..." : "Sign in"}
              </button>
            </form>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <span aria-hidden>←</span>
              Back to home
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
