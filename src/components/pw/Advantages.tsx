import Container from "@/components/Container";

const advantages = [
  "Have a good online presence.",
  "Increase your customer intake, through Google Ads, and organic visits.",
  "Get shown in google searches and in AI search result.",
  "It only takes you 30 minutes and I will handle the rest.",
];

export default function Advantages() {
  return (
    <section className="py-6 sm:py-8">
      <Container>
        <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Why should you get a personal webpage today?
          </h2>

          <ul className="mt-6 space-y-4">
            {advantages.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-base leading-relaxed text-white/85 sm:text-lg"
              >
                <span className="shrink-0" aria-hidden>
                  ✅
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
