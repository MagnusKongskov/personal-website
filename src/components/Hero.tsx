import Container from "@/components/Container";

export default function Hero() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
          Welcome
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Hi, I&apos;m Your Name
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          A short tagline about who you are and what you do. Edit this section
          to introduce yourself.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#contact"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Get in touch
          </a>
          <a
            href="#about"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground/5"
          >
            Learn more
          </a>
        </div>
      </Container>
    </section>
  );
}
