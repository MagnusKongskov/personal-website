import Demo2 from "@/components/demos/Demo2";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo 2 — Personal Trainer",
  description: "Demo personal trainer website.",
};

export default function Demo2Page() {
  return <Demo2 />;
}
