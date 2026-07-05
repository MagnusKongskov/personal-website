import Link from "next/link";
import Container from "@/components/Container";
import { color2 } from "@/components/pw/colors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Failed",
  description: "Your checkout did not complete.",
};

export default function CheckoutFailedPage() {
  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white">
      <section className="py-24">
        <Container>
          <div
            className="mx-auto max-w-lg rounded-2xl border p-8 text-center sm:p-10"
            style={{ borderColor: color2, backgroundColor: `${color2}14` }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Checkout failed
            </h1>
            <p className="mt-4 text-base text-white/75">
              Your payment was not completed. Please try again when you are ready.
            </p>
            <Link
              href="/pw/checkout"
              className="mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: color2 }}
            >
              Try again
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
