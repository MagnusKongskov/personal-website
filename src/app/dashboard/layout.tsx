import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal trainer website dashboard.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/pw/login?callbackUrl=/dashboard");
  }

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white">
      {children}
    </main>
  );
}
