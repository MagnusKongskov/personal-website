import Container from "@/components/Container";
import { color2 } from "@/components/pw/colors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Your personal trainer website package is on its way.",
};

export default function PwDashboardPage() {
  return (
    <section className="py-24">
      <Container>
        <div
          className="mx-auto max-w-2xl rounded-2xl border p-8 sm:p-10"
          style={{ borderColor: color2, backgroundColor: `${color2}14` }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Thank you for your purchase
          </h1>
          <p className="mt-6 text-base leading-relaxed text-white/75">
            Your payment was successful. We will reach out within 2–3 days to
            schedule your design call. If you have any questions, contact me at{" "}
            <a
              href="mailto:primary@magnuskongskov.dk"
              className="underline transition-opacity hover:opacity-80"
              style={{ color: color2 }}
            >
              primary@magnuskongskov.dk
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
