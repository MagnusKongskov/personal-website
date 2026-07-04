import Container from "@/components/Container";

const placeholderItems = [
  { id: 1, title: "Project One", category: "Design" },
  { id: 2, title: "Project Two", category: "Development" },
  { id: 3, title: "Project Three", category: "Photography" },
  { id: 4, title: "Project Four", category: "Writing" },
  { id: 5, title: "Project Five", category: "Design" },
  { id: 6, title: "Project Six", category: "Development" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24">
      <Container>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Gallery
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Showcase your work, projects, or photos. Replace the placeholders with
          your own images and links.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderItems.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-border bg-foreground/[0.03] transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/3] bg-foreground/10 transition-colors group-hover:bg-foreground/15" />
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-accent">
                  {item.category}
                </p>
                <h3 className="mt-1 font-semibold">{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
