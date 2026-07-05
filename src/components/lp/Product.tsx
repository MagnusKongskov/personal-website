import Container from "@/components/Container";

const features = [
  "A detailed look into what works and doesn't work on your landing page.",
  "A word-for-word analysis on every word used on the page.",
  "A list of concrete suggestions you can apply today to boost your conversion rate.",
  "A report that covers all the must-haves for landing pages listed below.",
];

export default function Product() {
  return (
    <section id="product" className="py-5">
      <Container>
        <div className="mx-auto max-w-2xl rounded-2xl bg-foreground/[0.04] px-6 py-6 sm:px-8 sm:py-8">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            What you get
          </h2>

          <ul className="mt-4 list-disc space-y-3 pl-5 text-sm sm:text-base">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
