"use client";

import { useState, useTransition } from "react";
import AlertMessage from "@/components/pw/AlertMessage";
import { startPaymentAction } from "@/app/dashboard/agreement/actions";

type PaymentButtonProps = {
  color: string;
};

export default function PaymentButton({ color }: PaymentButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);

    startTransition(async () => {
      const result = await startPaymentAction();

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.url) {
        window.location.href = result.url;
      }
    });
  }

  return (
    <div className="mt-4 flex flex-col items-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ backgroundColor: color }}
      >
        {isPending ? "Redirecting…" : "Complete payment"}
      </button>
      {error ? (
        <div className="mt-3">
          <AlertMessage variant="error">{error}</AlertMessage>
        </div>
      ) : null}
    </div>
  );
}
