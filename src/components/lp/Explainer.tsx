"use client";

import { useState } from "react";
import Container from "@/components/Container";

const topics = [
  {
    title: "📑 Selection of content",
    content: "",
  },
  {
    title: "🌐 Page composition",
    content: "",
  },
  {
    title: "📖 Individual word and picture choices",
    content: "",
  },
  {
    title: "🎨 Graphical design choices",
    content: "",
  },
  {
    title: "📲 Mobile functionality (optional)",
    content: "",
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

export default function Explainer() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      id="about"
      className="bg-foreground/[0.02] py-5"
    >
      <Container>
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          The 5 must-haves for a great landing page
        </h2>

        <dl className="mt-12 space-y-4">
          {topics.map((topic, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={topic.title}
                className="rounded-2xl border border-border bg-background"
              >
                <dt>
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold transition-colors hover:text-accent"
                  >
                    <span>{topic.title}</span>
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
                    {topic.content && (
                      <p className="px-6 pb-5 text-sm text-muted">
                        {topic.content}
                      </p>
                    )}
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
