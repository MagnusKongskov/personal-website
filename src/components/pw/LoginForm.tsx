"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Container from "@/components/Container";
import AlertMessage from "@/components/pw/AlertMessage";
import { color2 } from "@/components/pw/colors";

type LoginFormProps = {
  callbackUrl: string;
  showVerifyMessage: boolean;
  authError?: string | null;
};

export default function LoginForm({
  callbackUrl,
  showVerifyMessage,
  authError = null,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(authError);
  const [emailSent, setEmailSent] = useState(showVerifyMessage);

  async function handleGoogleSignIn() {
    setError(null);
    setIsGoogleLoading(true);

    try {
      await signIn("google", { callbackUrl });
    } catch {
      setError("Could not start Google sign up. Please try again.");
      setIsGoogleLoading(false);
    }
  }

  async function handleEmailSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsEmailLoading(true);

    try {
      const result = await signIn("resend", {
        email: email.trim(),
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
    <section className="relative min-h-[80vh] py-12 sm:py-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#f97316]/10 to-transparent"
        aria-hidden
      />

      <Container className="relative">
        <div className="mx-auto max-w-lg">
          <div
            className="rounded-2xl border p-8 sm:p-10"
            style={{ borderColor: color2, backgroundColor: `${color2}10` }}
          >
            <h1 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Sign up to get started
            </h1>

            {emailSent ? (
              <AlertMessage variant="success" className="mt-6">
                Check your email for a magic link to complete sign up.
              </AlertMessage>
            ) : null}

            {error ? (
              <AlertMessage variant="error" className="mt-6">
                {error}
              </AlertMessage>
            ) : null}

            <div className="mt-8 space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isEmailLoading}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isGoogleLoading ? "Redirecting..." : "Sign up with Google"}
              </button>

              <div className="flex items-center gap-3 text-sm text-white/50">
                <span className="h-px flex-1 bg-white/15" />
                <span>or</span>
                <span className="h-px flex-1 bg-white/15" />
              </div>

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-white/80">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/15 bg-[#0a0a0a] px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#f97316]/60"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isGoogleLoading || isEmailLoading}
                  className="w-full rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ backgroundColor: color2 }}
                >
                  {isEmailLoading ? "Sending link..." : "Sign up with email"}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/pw"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <span aria-hidden>←</span>
              Back to personal trainer page
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
