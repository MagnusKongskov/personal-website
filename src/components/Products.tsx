import Link from "next/link";
import Container from "@/components/Container";

const products = [
  {
    title: "Landing Page Review",
    description:
      "Get an independent, expert review of your landing page with concrete suggestions to boost conversions.",
    href: "/lp",
  },
  {
    title: "Personal Webpage",
    description:
      "Level up your personal business with a website package containing both a webpage, hosting and 500$ worth of Google Ads credits.",
    href: "/pw",
  },
];

export default function Products() {
  return (
    <section id="products" className="py-5">
      <Container>
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Products
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {products.map((product) => (
            <div
              key={product.href}
              className="flex flex-col rounded-2xl border border-border bg-foreground/[0.03] p-6 sm:p-8"
            >
              <h3 className="text-xl font-semibold tracking-tight">
                {product.title}
              </h3>
              <p className="mt-3 text-sm text-muted sm:text-base">
                {product.description}
              </p>
              <div className="mt-6 flex justify-end">
                <Link
                  href={product.href}
                  className="inline-flex rounded-full border border-transparent bg-secondary px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  Learn more
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
