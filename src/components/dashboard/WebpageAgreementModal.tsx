"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import AlertMessage from "@/components/pw/AlertMessage";
import { agreeAndCheckoutAction } from "@/app/dashboard/agreement/actions";

type WebpageAgreementModalProps = {
  color: string;
  isOpen: boolean;
  onClose: () => void;
};

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-none stroke-current stroke-2"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function WebpageAgreementModal({
  color,
  isOpen,
  onClose,
}: WebpageAgreementModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setAgreed(false);
      setError(null);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  function handleAgree() {
    setError(null);

    startTransition(async () => {
      const result = await agreeAndCheckoutAction();

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.url) {
        window.location.href = result.url;
      }
    });
  }

  if (!isOpen || !mounted) {
    return null;
  }

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="webpage-agreement-heading"
        className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2
            id="webpage-agreement-heading"
            className="text-xl font-semibold text-white"
          >
            Webpage agreement
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/50 transition-colors hover:text-white"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <iframe
            src="/api/account/webpage-agreement"
            title="Webpage agreement PDF"
            className="h-[50vh] w-full rounded-xl border border-white/10 bg-white"
          />
        </div>

        <div className="space-y-4 border-t border-white/10 px-6 py-4">
          <a
            href="/api/account/webpage-agreement"
            download="webpage-agreement.pdf"
            className="inline-flex text-sm font-medium underline transition-opacity hover:opacity-80"
            style={{ color }}
          >
            Download PDF
          </a>

          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-white/80">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 bg-transparent"
            />
            <span>I have read and agree to the terms listed above.</span>
          </label>

          {error ? <AlertMessage variant="error">{error}</AlertMessage> : null}

          <button
            type="button"
            onClick={handleAgree}
            disabled={!agreed || isPending}
            className="w-full rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: color }}
          >
            {isPending ? "Redirecting…" : "Agree and go to payment"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
