import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo",
  robots: { index: false, follow: false },
};

export default function DemoEmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">{children}</div>
  );
}
