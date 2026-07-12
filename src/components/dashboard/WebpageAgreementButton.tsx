"use client";

import { useState } from "react";
import WebpageAgreementModal from "@/components/dashboard/WebpageAgreementModal";

type WebpageAgreementButtonProps = {
  color: string;
};

export default function WebpageAgreementButton({ color }: WebpageAgreementButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: color }}
        >
          View webpage agreement
        </button>
      </div>

      <WebpageAgreementModal
        color={color}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
