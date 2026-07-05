"use client";

import { useState } from "react";
import Container from "@/components/Container";
import { DELIVERY_TIME_HIGH, DELIVERY_TIME_LOW } from "@/lib/constants";

const faqs = [
  {
    question: "How much will I except my conversion rate to increase.",
    answer:
      "No landing page is perfect, and anyone can benefit from taking an extra look at their landing page. Many times small changes will increase conversion rate by 20 or 30%.",
  },
  {
    question: "How many pages is a landing page review?",
    answer:
      "It depends on how well-optimized the landing page is in the first place! Most reports will take up 8 to 12 pages of text and pictures. But don't worry! All of the improvement suggestions will be summarized at the end of the report. You don't need to read the whole thing.",
  },
  {
    question: "How will I recieve my landing page review.",
    answer: `You will recieve a comprehensive report sent to your mail as a PDF-file. The expected delivery time is between ${DELIVERY_TIME_LOW} and ${DELIVERY_TIME_HIGH} days.`,
  },
  {
    question: "Why wouldn't I just use AI to make my own landing page report?",
    answer:
      "AI are very good at some things, but not so good at others. Even the frontier model AI's struggle with visual comprehesion, and strugles to understand how a human reads a page. AI's are also bad at making the microoptimizations that you will get in a report written by a human.",
  },
  {
    question: "Do I need to share my codebase for the landing page review?",
    answer:
      "No! The review is based on the authentic experience of a customer visting your webpage. All you need to do is leave a link to your public webpage in the form below.",
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-5 w-5 shrink-0 text-muted transition-transform duration-300 ease-in-out ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="bg-foreground/[0.02] py-5"
    >
      <Container>
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
        <dl className="mt-12 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            const hideOnMobile = index === 1 || index === 2;

            return (
              <div
                key={faq.question}
                className={`rounded-2xl border border-border bg-background${
                  hideOnMobile ? " hidden sm:block" : ""
                }`}
              >
                <dt>
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold transition-colors hover:text-accent"
                  >
                    <span>{faq.question}</span>
                    <ChevronIcon open={isOpen} />
                  </button>
                </dt>
                <dd
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-muted">{faq.answer}</p>
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}
