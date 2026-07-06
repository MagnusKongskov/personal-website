"use client";

import { useState } from "react";
import Image from "next/image";
import Container from "@/components/Container";

type GallerySlide = {
  id: number;
  caption: string;
  placeholderClass: string;
  src?: string;
  alt?: string;
};

const slides: GallerySlide[] = [
  {
    id: 1,
    caption: "Jordan Steel — Personal Trainer",
    src: "/lp-gallery-1.png",
    alt: "Jordan Steel personal trainer demo website with bold hero section",
    placeholderClass: "bg-foreground/10",
  },
  { id: 2, caption: "Project Two", placeholderClass: "bg-foreground/15" },
  { id: 3, caption: "Project Three", placeholderClass: "bg-foreground/20" },
  { id: 4, caption: "Project Four", placeholderClass: "bg-foreground/25" },
];

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
    >
      {direction === "left" ? (
        <path
          fillRule="evenodd"
          d="M11.78 5.22a.75.75 0 010 1.06L8.06 10l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.5a.75.75 0 010-1.06l4.25-4.5a.75.75 0 011.06 0z"
          clipRule="evenodd"
        />
      ) : (
        <path
          fillRule="evenodd"
          d="M8.22 5.22a.75.75 0 011.06 0l4.25 4.5a.75.75 0 010 1.06l-4.25 4.5a.75.75 0 11-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 010-1.06z"
          clipRule="evenodd"
        />
      )}
    </svg>
  );
}

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];

  function goToPrevious() {
    setCurrentIndex((index) => (index === 0 ? slides.length - 1 : index - 1));
  }

  function goToNext() {
    setCurrentIndex((index) => (index === slides.length - 1 ? 0 : index + 1));
  }

  return (
    <section id="gallery" className="py-5">
      <Container>
        <div>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous image"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-foreground/5"
            >
              <ArrowIcon direction="left" />
            </button>

            <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-foreground/[0.03]">
              <div
                className={`relative aspect-[4/3] transition-colors ${currentSlide.placeholderClass}`}
              >
                {"src" in currentSlide && currentSlide.src ? (
                  <Image
                    src={currentSlide.src}
                    alt={currentSlide.alt ?? currentSlide.caption}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority={currentIndex === 0}
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    role="img"
                    aria-label={currentSlide.caption}
                  />
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next image"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-foreground/5"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted sm:text-base">
            <span className="font-medium text-foreground">
              {currentSlide.caption}
            </span>{" "}
            ({currentIndex + 1} / {slides.length})
          </p>
        </div>
      </Container>
    </section>
  );
}
