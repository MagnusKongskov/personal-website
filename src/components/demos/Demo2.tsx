import Image from "next/image";

const accent = "#ef4444";

const programs = [
  { name: "Strength Foundations", weeks: "12 weeks", level: "Beginner" },
  { name: "Power & Performance", weeks: "8 weeks", level: "Intermediate" },
  { name: "Competition Prep", weeks: "16 weeks", level: "Advanced" },
];

const stats = [
  { value: "500+", label: "Clients trained" },
  { value: "12 yrs", label: "Coaching experience" },
  { value: "86%", label: "Client retention" },
];

const inputClassName =
  "mt-1.5 w-full rounded-none border border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40";

export default function Demo2() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <p className="text-2xl font-black uppercase tracking-tighter">
            Jordan<span style={{ color: accent }}> Steel</span>
          </p>
          <button
            type="button"
            className="rounded-none border-2 px-5 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white hover:text-black"
            style={{ borderColor: accent, color: accent }}
          >
            Join now
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="relative h-56 sm:h-72">
          <Image
            src="/demo2-hero.png"
            alt="Personal trainer coaching a client in the gym"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 pb-12 pt-8 sm:pb-16 sm:pt-10">
          <p
            className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            No excuses. Just results.
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-tighter sm:text-7xl">
            Train harder.
            <br />
            Get stronger.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60">
            Elite coaching for athletes and lifters who refuse to settle. Raw
            programming, brutal accountability, real progress.
          </p>
        </div>
      </section>

      <section className="border-y-2 border-white/10 px-6 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p
                className="text-3xl font-black sm:text-4xl"
                style={{ color: accent }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">
            About me
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-white/70">
            <p>
              I grew up in a working-class neighborhood on Chicago&apos;s South
              Side, where the local gym was the one place that made sense to me.
              What started as an escape from a tough home life turned into a
              lifelong obsession with strength — not just lifting heavy, but
              building people who don&apos;t break under pressure.
            </p>
            <p>
              After competing in powerlifting for six years and earning my CSCS,
              I opened Steel Gym in 2016 with one rule: show up, do the work,
              and hold yourself to a higher standard. Twelve years later, that
              same philosophy drives every program I write and every client I
              coach.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">
            Programs
          </h2>
          <div className="mt-6 divide-y-2 divide-white/10 border-y-2 border-white/10">
            {programs.map((program) => (
              <div
                key={program.name}
                className="flex items-center justify-between gap-4 py-5"
              >
                <div>
                  <p className="text-lg font-bold uppercase tracking-tight">
                    {program.name}
                  </p>
                  <p className="mt-0.5 text-sm text-white/50">{program.weeks}</p>
                </div>
                <span
                  className="shrink-0 rounded-none px-3 py-1 text-xs font-bold uppercase tracking-wider"
                  style={{ backgroundColor: `${accent}22`, color: accent }}
                >
                  {program.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-8">
        <div
          className="mx-auto max-w-5xl border-2 p-6 sm:p-8"
          style={{ borderColor: accent }}
        >
          <p className="text-xl font-black uppercase tracking-tight">
            Contact me
          </p>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/demo2-jordan.png"
                alt="Jordan Steel, personal trainer"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 360px"
              />
            </div>

            <form className="space-y-4">
              <div>
                <label htmlFor="demo2-name" className="text-xs font-bold uppercase tracking-widest text-white/50">
                  Name
                </label>
                <input
                  id="demo2-name"
                  type="text"
                  placeholder="Your name"
                  className={inputClassName}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="demo2-email" className="text-xs font-bold uppercase tracking-widest text-white/50">
                  Email
                </label>
                <input
                  id="demo2-email"
                  type="email"
                  placeholder="you@email.com"
                  className={inputClassName}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="demo2-message" className="text-xs font-bold uppercase tracking-widest text-white/50">
                  Message
                </label>
                <textarea
                  id="demo2-message"
                  rows={4}
                  placeholder="Tell me about your goals..."
                  className={inputClassName}
                  readOnly
                />
              </div>
              <button
                type="button"
                className="w-full border-2 px-5 py-3 text-xs font-bold uppercase tracking-widest"
                style={{ borderColor: accent, color: accent }}
              >
                Send message
              </button>
              <p className="text-sm text-white/50">
                Chicago, IL · jordan@steelgym.com · (312) 555-0174
              </p>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}
