"use client";

import { useEffect, useRef, useState } from "react";

const PHONE_NUMBER = "+45 30 49 41 19";
const PHONE_HREF = "tel:+4530494119";

export default function PhoneNumberModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsRevealed(false);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="underline transition-colors hover:text-foreground"
      >
        Show Phone Number
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute inset-0 bg-foreground/40"
            aria-hidden="true"
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="phone-number-heading"
            className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-muted transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 fill-none stroke-current stroke-2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <h2
              id="phone-number-heading"
              className="pr-8 text-lg font-semibold text-foreground"
            >
              My Phone Number
            </h2>

            <div className="mt-4 space-y-4 text-sm text-muted">
              <p>
                I have decided to put my phone number on my website, so people
                can call me and ask questions about my services. However to
                avoid spam I would kindly ask you to follow the rules below.
              </p>
              <p>
                <strong className="font-semibold text-foreground">
                  For Danish callers:
                </strong>{" "}
                My phone number is on Robinsonlisten and its therefore illegal
                to make sales call from Danish numbers.
              </p>
              <p>
                <strong className="font-semibold text-foreground">
                  For International callers:
                </strong>{" "}
                Please leave a text message with the intent of your call, before
                calling me.
              </p>
            </div>

            <div className="mt-6">
              {isRevealed ? (
                <a
                  href={PHONE_HREF}
                  className="flex items-center justify-center rounded-lg border border-border bg-foreground/[0.03] px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.06]"
                >
                  {PHONE_NUMBER}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRevealed(true)}
                  className="w-full rounded-lg border border-border bg-foreground/[0.03] px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.06]"
                >
                  Reveal Phone Number
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
