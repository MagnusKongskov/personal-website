"use client";

import Script from "next/script";
import { useEffect } from "react";

const CALENDLY_URL = "https://calendly.com/primary-magnuskongskov/30min";
const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

type CalendlyBookButtonProps = {
  color: string;
  label?: string;
  className?: string;
};

export default function CalendlyBookButton({
  color,
  label = "Book meeting",
  className = "",
}: CalendlyBookButtonProps) {
  useEffect(() => {
    if (document.querySelector(`link[href="${CALENDLY_CSS}"]`)) {
      return;
    }

    const link = document.createElement("link");
    link.href = CALENDLY_CSS;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const openCalendly = () => {
    window.Calendly?.initPopupWidget({ url: CALENDLY_URL });
  };

  return (
    <>
      <Script src={CALENDLY_JS} strategy="lazyOnload" />
      <button
        type="button"
        onClick={openCalendly}
        className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 ${className}`.trim()}
        style={{ backgroundColor: color }}
      >
        {label}
      </button>
    </>
  );
}
