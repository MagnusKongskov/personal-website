"use client";

import { useEffect, useState } from "react";

const VISIBLE_MS = 3000;
const FADE_MS = 500;

type FeedbackBubbleProps = {
  message: string;
  variant?: "error" | "success";
  theme?: "light" | "dark";
  onDismiss?: () => void;
};

const lightStyles = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-green-200 bg-green-50 text-green-700",
  errorArrow: "border-t-red-50",
  successArrow: "border-t-green-50",
} as const;

const darkStyles = {
  error: "border-red-400/40 bg-[#1a1010] text-red-300",
  success: "border-[#2ec4b6]/40 bg-[#2ec4b6]/10 text-[#8ce8df]",
  errorArrow: "border-t-[#1a1010]",
  successArrow: "border-t-[#102220]",
} as const;

export default function FeedbackBubble({
  message,
  variant = "error",
  theme = "light",
  onDismiss,
}: FeedbackBubbleProps) {
  const isError = variant === "error";
  const styles = theme === "dark" ? darkStyles : lightStyles;
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    setIsFading(false);

    const fadeTimer = window.setTimeout(() => setIsFading(true), VISIBLE_MS);
    return () => window.clearTimeout(fadeTimer);
  }, [message]);

  useEffect(() => {
    if (!isFading) return;

    const dismissTimer = window.setTimeout(() => onDismiss?.(), FADE_MS);
    return () => window.clearTimeout(dismissTimer);
  }, [isFading, onDismiss]);

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border px-3 py-2 text-center text-sm shadow-md transition-opacity duration-500 ease-out ${
        isFading ? "pointer-events-none opacity-0" : "opacity-100"
      } ${isError ? styles.error : styles.success}`}
    >
      {message}
      <span
        aria-hidden
        className={`absolute left-1/2 top-full -translate-x-1/2 border-[6px] border-transparent transition-opacity duration-500 ease-out ${
          isFading ? "opacity-0" : "opacity-100"
        } ${isError ? styles.errorArrow : styles.successArrow}`}
      />
    </div>
  );
}
