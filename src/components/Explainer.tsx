import Container from "@/components/Container";

export default function Explainer() {
  return (
    <section id="about" className="border-t border-border bg-foreground/[0.02] py-24">
      <Container>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          About me
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Use this section to explain who you are, what you do, and what you care
          about. Replace this placeholder copy with your own story.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "What I do",
              description:
                "Describe your profession, skills, or current focus here.",
            },
            {
              title: "What I value",
              description:
                "Share the principles or values that guide your work.",
            },
            {
              title: "What I'm exploring",
              description:
                "Highlight projects, interests, or goals you're pursuing.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
