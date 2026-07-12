import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PwSessionProvider from "@/components/pw/SessionProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin dashboard.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PwSessionProvider>
      <Header />
      <main className="w-full pt-20">{children}</main>
      <Footer />
    </PwSessionProvider>
  );
}
