"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import AlertMessage from "@/components/pw/AlertMessage";
import { color2 } from "@/components/pw/colors";

const CHECKOUT_ERROR_MESSAGES: Record<string, string> = {
  "You must be signed in.":
    "Please sign in before continuing to checkout.",
  "Payment service is not configured.":
    "Checkout is temporarily unavailable. Please try again later.",
  "Payment product is not configured.":
    "Checkout is temporarily unavailable. Please try again later.",
  "Failed to create checkout session.":
    "We could not start checkout. Please try again.",
};

function getCheckoutErrorMessage(error?: string): string {
  if (!error) {
    return "We could not start checkout. Please try again.";
  }

  return CHECKOUT_ERROR_MESSAGES[error] ?? error;
}

export default function CheckoutClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function startCheckout() {
      try {
        const response = await fetch("/api/checkout/pw", {
          method: "POST",
        });

        const data = (await response.json()) as { url?: string; error?: string };

        if (!response.ok || !data.url) {
          if (!cancelled) {
            setError(getCheckoutErrorMessage(data.error));
          }
          return;
        }

        window.location.href = data.url;
      } catch {
        if (!cancelled) {
          setError("We could not start checkout. Please try again.");
        }
      }
    }

    void startCheckout();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <section className="py-24">
      <Container>
        <div
          className="mx-auto max-w-lg rounded-2xl border p-8 text-center sm:p-10"
          style={{ borderColor: color2, backgroundColor: `${color2}14` }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {error ? "Checkout unavailable" : "Redirecting to checkout"}
          </h1>
          {error ? (
            <AlertMessage variant="error" className="mt-6 text-left">
              {error}
            </AlertMessage>
          ) : (
            <p className="mt-4 text-base text-white/75">
              Please wait while we prepare your secure Stripe checkout.
            </p>
          )}
          {error ? (
            <button
              type="button"
              onClick={() => router.push("/pw/checkout")}
              className="mt-8 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: color2 }}
            >
              Try again
            </button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
