import Image from "next/image";

const accent = "#4a7c59";

const offerings = [
  {
    title: "Movement & Mobility",
    detail: "Restore range of motion and build a resilient body.",
  },
  {
    title: "Strength Training",
    detail: "Progressive programs that respect your pace and recovery.",
  },
  {
    title: "Mind-Body Coaching",
    detail: "Breathwork, stress management, and sustainable habits.",
  },
];

const testimonials = [
  {
    quote:
      "Sam's approach changed how I think about fitness. It stopped feeling like a chore.",
    name: "Jamie R., client since 2023",
  },
  {
    quote:
      "I came in with chronic back pain and low energy. Six months later I feel stronger than I did in my twenties.",
    name: "Priya M., client since 2024",
  },
  {
    quote:
      "The sessions are calm but effective. Sam listens first and builds a plan that actually sticks.",
    name: "Daniel K., client since 2022",
  },
  {
    quote:
      "I was skeptical about online coaching, but the weekly check-ins kept me accountable without burning me out.",
    name: "Elena V., client since 2025",
  },
];

export default function Demo3() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2c2c]">
      <header className="px-6 py-6">
        <div className="mx-auto flex max-w-3xl items-baseline justify-between">
          <p className="text-xl font-medium tracking-tight">Sam Chen</p>
          <p className="text-sm text-[#6b6b6b]">Wellness Coach</p>
        </div>
      </header>

      <section className="px-6 pb-10 pt-2 sm:pb-14">
        <div className="mx-auto max-w-3xl">
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src="/demo3-hero.png"
              alt="Wellness coach leading a stretching session in a bright studio"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
          </div>
          <h1 className="text-4xl font-medium leading-snug tracking-tight sm:text-5xl">
            Train with intention.
            <br />
            <span style={{ color: accent }}>Live with balance.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-[#6b6b6b]">
            I help professionals build sustainable fitness routines that fit
            real life — not the other way around.
          </p>
          <div className="mt-10 h-px w-16" style={{ backgroundColor: accent }} />
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-sm font-medium uppercase tracking-widest text-[#6b6b6b]">
            About me
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-[#6b6b6b]">
            <p>
              Before I became a coach, I spent eight years in corporate tech —
              long hours, constant travel, and a body that kept breaking down.
              Yoga and strength training pulled me back from burnout, and I
              realized most of my colleagues needed the same kind of guidance,
              not another aggressive bootcamp.
            </p>
            <p>
              I trained with NASM and the National Academy of Sports Medicine&apos;s
              corrective exercise specialists, then built a practice in Portland
              focused on sustainable movement. Today I work with busy
              professionals who want to feel strong, mobile, and clear-headed
              without rebuilding their entire schedule.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-sm font-medium uppercase tracking-widest text-[#6b6b6b]">
            What I offer
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {offerings.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[#e8e4df] p-5"
              >
                <p className="text-lg font-medium">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-3xl space-y-6">
          {testimonials.map((item) => (
            <blockquote
              key={item.name}
              className="rounded-2xl p-8 sm:p-10"
              style={{ backgroundColor: `${accent}12` }}
            >
              <p className="text-lg font-medium leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-[#6b6b6b]">
                — {item.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <footer className="px-6 py-10">
        <div className="mx-auto max-w-3xl text-center">
          <button
            type="button"
            className="rounded-full px-8 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: accent }}
          >
            Schedule a call
          </button>
          <p className="mt-6 text-sm text-[#9a9a9a]">
            Portland, OR · sam@balancedbody.co
          </p>
        </div>
      </footer>
    </div>
  );
}
