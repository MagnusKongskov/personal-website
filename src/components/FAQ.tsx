import Container from "@/components/Container";

const faqs = [
  {
    question: "What do you do?",
    answer:
      "Add a brief answer about your profession or main area of work.",
  },
  {
    question: "How can I work with you?",
    answer:
      "Describe how people can collaborate with you or hire your services.",
  },
  {
    question: "Where are you based?",
    answer: "Share your location or whether you work remotely.",
  },
  {
    question: "What's the best way to reach you?",
    answer:
      "Point visitors to your preferred contact method or the form below.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="border-t border-border bg-foreground/[0.02] py-24">
      <Container>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-muted">
          Common questions visitors might have. Edit or add items as needed.
        </p>
        <dl className="mt-12 space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <dt className="font-semibold">{faq.question}</dt>
              <dd className="mt-2 text-sm text-muted">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
