import Image from "next/image";

const navy = "#1a2b4a";
const coral = "#e85d4c";
const sand = "#f3ece4";

const services = [
  {
    title: "Private Sessions",
    detail: "60-minute sessions built around your body, schedule, and goals.",
  },
  {
    title: "Nutrition Guidance",
    detail: "Simple meal frameworks — no fad diets, no overwhelm.",
  },
  {
    title: "Remote Check-ins",
    detail: "Weekly video reviews to keep you on track between visits.",
  },
];

const galleryImages = [
  { src: "/demo1-gallery-1.png", alt: "Kettlebell training session in the gym" },
  { src: "/demo1-gallery-2.png", alt: "Outdoor resistance band workout" },
  { src: "/demo1-gallery-3.png", alt: "Small group training with dumbbells" },
];

export default function Demo1() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: sand, color: navy }}>
      <header className="border-b px-6 py-6" style={{ borderColor: `${navy}18` }}>
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em]">
          Marcus Hale
        </p>
      </header>

      <section className="px-6 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:items-center md:gap-10">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: coral }}
            >
              Personal training · Denver, CO
            </p>
            <h1 className="mt-5 text-[2.5rem] font-medium leading-[1.05] tracking-tight sm:text-6xl">
              Stronger habits.
              <br />
              Steadier progress.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed opacity-70">
              I work with people who want structure without rigidity — coaching
              that fits your life and builds results you can keep.
            </p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image
              src="/demo1-trainer.png"
              alt="Marcus Hale, personal trainer"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
              priority
            />
          </div>
        </div>
      </section>

      <section className="px-6 pb-12 sm:pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div
              className="col-span-2 rounded-sm p-6 sm:p-8"
              style={{ backgroundColor: navy, color: sand }}
            >
              <p className="text-4xl font-medium sm:text-5xl">200+</p>
              <p className="mt-2 text-sm uppercase tracking-widest opacity-70">
                Clients coached
              </p>
            </div>
            <div
              className="rounded-sm p-5"
              style={{ backgroundColor: `${coral}18` }}
            >
              <p className="text-2xl font-medium">6 yrs</p>
              <p className="mt-1 text-xs uppercase tracking-wider opacity-60">
                Experience
              </p>
            </div>
            <div
              className="rounded-sm p-5"
              style={{ backgroundColor: `${navy}10` }}
            >
              <p className="text-2xl font-medium">NASM</p>
              <p className="mt-1 text-xs uppercase tracking-wider opacity-60">
                Certified
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-y px-6 py-12"
        style={{ borderColor: `${navy}18`, backgroundColor: "#ebe3d9" }}
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-medium sm:text-3xl">
            How I help
          </h2>
          <div
            className="mt-8 grid gap-px sm:grid-cols-3"
            style={{ backgroundColor: `${navy}15` }}
          >
            {services.map((service, index) => (
              <article
                key={service.title}
                className="p-6 sm:p-7"
                style={{ backgroundColor: "#ebe3d9" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: coral }}
                >
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-lg font-medium">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-65">
                  {service.detail}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div
          className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 rounded-sm p-8 sm:flex-row sm:items-center sm:p-10"
          style={{ backgroundColor: navy, color: sand }}
        >
          <div>
            <p className="text-xl font-medium sm:text-2xl">
              First session is on me.
            </p>
            <p className="mt-2 text-sm opacity-70">
              Let&apos;s map your goals and see if we&apos;re a good fit.
            </p>
          </div>
          <button
            type="button"
            className="px-6 py-3 text-sm font-semibold uppercase tracking-wider"
            style={{ backgroundColor: coral, color: "#fff" }}
          >
            Claim free session
          </button>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <h2 className="text-center text-2xl font-medium sm:text-3xl">
            Training gallery
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {galleryImages.map((image) => (
              <div
                key={image.src}
                className="relative aspect-[4/3] overflow-hidden rounded-sm"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 300px"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-sm opacity-50">
        marcus@steadycoach.com · (303) 555-0198
      </footer>
    </div>
  );
}
