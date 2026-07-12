import Script from "next/script";
import Container from "@/components/Container";
import { color1 } from "@/components/pw/colors";
import type { Metadata } from "next";
import MeetingScheduledRedirect from "./MeetingScheduledRedirect";

export const metadata: Metadata = {
  title: "Meeting Scheduled",
  description: "Your design call has been scheduled.",
};

const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export default function MeetingScheduledPage() {
  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] text-white">
      {googleAdsId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads-gtag" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAdsId}');
            `}
          </Script>
        </>
      ) : null}

      <section className="py-24">
        <Container>
          <div
            className="mx-auto max-w-lg rounded-2xl border p-8 text-center sm:p-10"
            style={{ borderColor: color1, backgroundColor: `${color1}14` }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Meeting scheduled
            </h1>
            <p className="mt-4 text-base text-white/75">
              Your design call has been booked. You will receive a confirmation
              email shortly.
            </p>
            <MeetingScheduledRedirect />
          </div>
        </Container>
      </section>
    </main>
  );
}
