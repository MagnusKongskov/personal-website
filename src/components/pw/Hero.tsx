import Image from "next/image";
import Container from "@/components/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative isolate flex h-[min(70vh,520px)] w-full flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/heropw.png"
            alt="Personal trainer deadlifting in a gym"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "center 90%" }}
            sizes="100vw"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 z-1 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-[#0a0a0a]/30" />
        <Container className="relative z-10 pb-6 pt-8 sm:pb-8">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Level up your personal trainer business today
          </h1>
        </Container>
      </div>
    </section>
  );
}
