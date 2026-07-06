"use client";

import { useState } from "react";
import Container from "@/components/Container";
import { color2 } from "@/components/pw/colors";
import { PW_DEMOS } from "@/lib/pw-demos";

export default function Demos() {
  const [activeId, setActiveId] = useState("demo-2");
  const activeDemo =
    PW_DEMOS.find((demo) => demo.id === activeId) ?? PW_DEMOS[1];

  return (
    <section id="demos" className="py-6 sm:py-8">
      <Container>
        <div className="text-center">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: color2 }}
          >
            Demos
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-white/75 sm:text-lg">
            Preview three example websites built for personal trainers. Pick a
            style to see how your brand could look online.
          </p>
        </div>

        <div className="mt-8 sm:hidden">
          <label htmlFor="demo-select" className="sr-only">
            Select a demo website
          </label>
          <select
            id="demo-select"
            value={activeId}
            onChange={(event) => setActiveId(event.target.value)}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors focus:border-[#f97316]"
          >
            {PW_DEMOS.map((demo) => (
              <option key={demo.id} value={demo.id} className="bg-[#1a1a1a]">
                {demo.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="mt-8 hidden gap-2 sm:flex sm:justify-center"
          role="tablist"
          aria-label="Demo websites"
        >
          {PW_DEMOS.map((demo) => {
            const isActive = demo.id === activeId;

            return (
              <button
                key={demo.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`demo-panel-${demo.id}`}
                id={`demo-tab-${demo.id}`}
                onClick={() => setActiveId(demo.id)}
                className="rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors sm:px-6 sm:text-base"
                style={
                  isActive
                    ? {
                        borderColor: color2,
                        backgroundColor: `${color2}22`,
                        color: "#fff",
                      }
                    : {
                        borderColor: "rgba(255,255,255,0.15)",
                        backgroundColor: "rgba(255,255,255,0.04)",
                        color: "rgba(255,255,255,0.75)",
                      }
                }
              >
                {demo.label}
              </button>
            );
          })}
        </div>

        <div
          id={`demo-panel-${activeDemo.id}`}
          role="tabpanel"
          aria-labelledby={`demo-tab-${activeDemo.id}`}
          className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-black/40"
        >
          <iframe
            key={activeDemo.id}
            src={activeDemo.path}
            title={activeDemo.label}
            className="h-[min(72vh,680px)] w-full bg-white"
            loading="lazy"
          />
        </div>
        <p className="mt-3 text-center text-sm text-white/50">
          Demos are view only.
        </p>
      </Container>
    </section>
  );
}
