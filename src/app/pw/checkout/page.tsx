import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your personal trainer website purchase.",
};

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/pw/login?callbackUrl=/pw/checkout");
  }

  return <CheckoutClient />;
}
