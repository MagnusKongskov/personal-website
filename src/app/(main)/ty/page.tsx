import Container from "@/components/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for your purchase",
};

export default function ThankYouPage() {
  return (
    <section className="py-24">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Thank you for your purchase
        </h1>
        <p className="mt-6 max-w-2xl text-muted">
          I expect to deliver your detailed landing page review in 3 to 5 days.
          If you have any questions in the meantime feel free to contact me at{" "}
          <a
            href="mailto:primary@magnuskongskov.dk"
            className="text-foreground underline transition-colors hover:opacity-80"
          >
            primary@magnuskongskov.dk
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
