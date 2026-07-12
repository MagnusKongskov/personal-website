import Container from "@/components/Container";
import BuyButton from "@/components/pw/BuyButton";
import Arrow from "@/components/pw/Arrow";
import { color3 } from "@/components/pw/colors";

type PackageBox = {
  header: string;
  value?: string;
  items: string[];
};

const packages: PackageBox[] = [
  {
    header: "$500 google ads credit (incl. copywriting)",
    value: "$500",
    items: [
      "Get customers to your website now",
      "Increase your chances of being shown in searches",
      "Ads written to ensure maximum ROI on ads",
    ],
  },
  {
    header: "Personal webpage design",
    value: "$440",
    items: [
      "A personalized design fitted exactly to your brand.",
      "A website optimized to convert vistors to customers.",
      "A SEO optimized webpage, that will show up in Google searches.",
    ],
  },
  {
    header: "1 year of hosting + support",
    value: "$340",
    items: [
      "A hosted webpage",
      "Personalized domain",
      "SSL certificate",
      "Support if changes to the webpage is needed.",
    ],
  },
];

function PackageCard({ box }: { box: PackageBox }) {
  return (
    <div
      className="flex h-full flex-col rounded-2xl border p-5 sm:p-6"
      style={{ borderColor: color3, backgroundColor: `${color3}14` }}
    >
      <h3 className="text-lg font-semibold text-white">{box.header}</h3>
      {box.value ? (
        <p className="mt-1 text-sm font-medium" style={{ color: color3 }}>
          Value: {box.value}
        </p>
      ) : null}
      <ul className="mt-4 flex-1 space-y-2 text-sm leading-relaxed text-white/75">
        {box.items.map((item) => (
          <li key={item} className="flex gap-2">
            <span style={{ color: color3 }} aria-hidden>
              ·
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FunnelArrow({ index }: { index: number }) {
  const startX = 16.67 + index * 33.33;
  const isMiddle = index === 1;

  return (
    <Arrow
      startX={startX}
      startY={2}
      endX={50}
      endY={68}
      fromColor={color3}
      bend={isMiddle ? 0 : 12}
      strokeWidth={3}
      endInset={14}
      className="h-20 w-full sm:h-24"
      viewBox="0 0 100 80"
    />
  );
}

export default function BuySection() {
  return (
    <section className="py-6 sm:py-8">
      <Container>
        <h2
          className="mb-2 text-center text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: color3 }}
        >
          Launch offer (<s>$1280</s> $900)
        </h2>
        <p className="mb-10 text-center text-sm text-white/75 sm:text-base">
          Launch offer: Save 380$ when booking a meeting before June 19th.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((box) => (
            <PackageCard key={box.header} box={box} />
          ))}
        </div>

        <div className="mt-2 hidden grid-cols-3 overflow-visible pb-1 lg:grid">
          {packages.map((box, index) => (
            <FunnelArrow key={box.header} index={index} />
          ))}
        </div>

        <div className="mt-2 flex justify-center overflow-visible pb-1 lg:hidden">
          <Arrow
            startX={16}
            startY={2}
            endX={16}
            endY={48}
            fromColor={color3}
            bend={8}
            strokeWidth={3}
            endInset={10}
            className="h-20 w-10"
            viewBox="0 0 32 56"
          />
        </div>

        <div
          className="mx-auto mt-4 max-w-xl rounded-2xl border p-6 sm:p-8"
          style={{ borderColor: color3, backgroundColor: `${color3}18` }}
        >
          <h3 className="text-xl font-semibold text-white sm:text-2xl">
            Launch offer: Get everything for 900$.
          </h3>
          <p className="mt-1 text-sm font-medium" style={{ color: color3 }}>
            Value: $1280
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/80 sm:text-base">
            <li>
              <ul className="list-disc list-inside">
                <li>$500 google ads credit (incl. copywriting)</li>
                <li>Webpage design</li>
                <li>1 year of hosting and support.</li>
              </ul>
            </li>
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3">
            <BuyButton
              color={color3}
              label="Sign up and book a design call now"
              className="px-8 py-3 text-base"
            />
            <p className="text-center text-sm text-white/70">
              Meetings before June 19th are subject to a 380$ discount.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
