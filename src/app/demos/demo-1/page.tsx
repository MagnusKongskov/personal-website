import Demo1 from "@/components/demos/Demo1";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo 1 — Personal Trainer",
  description: "Demo personal trainer website.",
};

export default function Demo1Page() {
  return <Demo1 />;
}
