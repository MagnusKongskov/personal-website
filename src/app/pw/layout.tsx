import type { Metadata } from "next";
import PwFooter from "@/components/pw/Footer";
import PwSessionProvider from "@/components/pw/SessionProvider";

export const metadata: Metadata = {
  title: "Personal Trainer Website",
  description:
    "Level up your personal trainer business with a professional website, Google Ads, and ongoing support.",
};

export default function PersonalWebpageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PwSessionProvider>
      <main className="min-h-screen w-full bg-[#0a0a0a] text-white">
        {children}
        <PwFooter />
      </main>
    </PwSessionProvider>
  );
}
