"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Container from "@/components/Container";

function FittingTextBlock({
  as: Tag,
  lines,
  maxSize,
  minSize,
  className = "",
}: {
  as: "h1" | "p";
  lines: [string, string];
  maxSize: number;
  minSize: number;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      const lineEls = el.querySelectorAll("[data-line]");
      let size = maxSize;
      el.style.fontSize = `${size}px`;

      const overflows = () =>
        Array.from(lineEls).some(
          (line) => line.scrollWidth > line.clientWidth,
        );

      while (overflows() && size > minSize) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
    };

    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(el);
    if (el.parentElement) {
      observer.observe(el.parentElement);
    }

    return () => observer.disconnect();
  }, [lines, maxSize, minSize]);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, index) => (
        <span key={index} data-line className="block whitespace-nowrap">
          {line}
        </span>
      ))}
    </Tag>
  );
}

export default function Hero() {
  return (
    <section className="pt-20 pb-5 sm:pt-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="min-w-0 text-left lg:col-span-2">
            <FittingTextBlock
              as="h1"
              lines={[
                "Boost conversions on your",
                "webpage today",
              ]}
              maxSize={44}
              minSize={18}
              className="font-bold tracking-tight"
            />
            <FittingTextBlock
              as="p"
              lines={[
                "Get an independent review of your landing page",
                "from an expert in landing page conversions.",
              ]}
              maxSize={22}
              minSize={11}
              className="mt-4 text-muted"
            />
          </div>

          <div className="hidden lg:col-span-1 lg:block">
            <Image
              src="/heroimage.png"
              alt="Sample landing page review report"
              width={1024}
              height={1024}
              priority
              className="h-auto w-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
