"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const REDIRECT_DELAY_MS = 1500;

export default function MeetingScheduledRedirect() {
  const router = useRouter();

  useEffect(() => {
    const sendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_MEETING_CONVERSION_SEND_TO;

    if (sendTo && typeof window.gtag === "function") {
      window.gtag("event", "conversion", { send_to: sendTo });
    }

    const timer = window.setTimeout(() => {
      router.replace("/dashboard");
    }, REDIRECT_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [router]);

  return (
    <p className="mt-4 text-sm text-white/50">
      Returning to your dashboard...
    </p>
  );
}
