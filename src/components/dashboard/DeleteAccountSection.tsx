"use client";

import { useEffect, useState, useTransition } from "react";
import AlertMessage from "@/components/pw/AlertMessage";
import { color3 } from "@/components/pw/colors";
import { deleteAccountAction } from "@/app/dashboard/profile/actions";

type DeleteAccountSectionProps = {
  hasActiveHosting: boolean;
};

const HOSTING_EMAIL = "primary@magnuskongskov.dk";

const TERMINATION_TEMPLATE = `I would like to terminate the hosting agreement regarding the hosting of my website <insert your website domain>.

Termination date (mm/dd/yy):
Reason for termination (optional):
Delete user data (y/n): y`;

export default function DeleteAccountSection({
  hasActiveHosting,
}: DeleteAccountSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function closeModal() {
    setIsOpen(false);
    setConfirmation("");
    setError(null);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleDelete() {
    setError(null);

    startTransition(async () => {
      const result = await deleteAccountAction(confirmation);

      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <>
      <section className="flex justify-center pt-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: color3 }}
        >
          Delete account
        </button>
      </section>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/70" aria-hidden="true" />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-heading"
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#141414] p-6 shadow-xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 text-white/50 transition-colors hover:text-white"
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 fill-none stroke-current stroke-2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <h2
              id="delete-account-heading"
              className="pr-8 text-xl font-semibold text-white"
            >
              Delete account
            </h2>

            {hasActiveHosting ? (
              <>
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  You currently have an active hosting agreement. To continue
                  hosting your website we need your contact information. If you
                  wish to terminate your current hosting agreement and delete
                  your account please write an email to{" "}
                  <a
                    href={`mailto:${HOSTING_EMAIL}`}
                    className="text-white underline underline-offset-2"
                  >
                    {HOSTING_EMAIL}
                  </a>{" "}
                  using the following template:
                </p>
                <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-[#0a0a0a] p-4 text-sm leading-relaxed whitespace-pre-wrap text-white/80">
                  {TERMINATION_TEMPLATE}
                </pre>
              </>
            ) : (
              <>
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  You are about to permanently delete your account. Any
                  scheduled meetings will be cancelled. Please type
                  &quot;DELETE&quot; to confirm the deletion.
                </p>

                {error ? (
                  <AlertMessage variant="error" className="mt-4">
                    {error}
                  </AlertMessage>
                ) : null}

                <label className="mt-6 block">
                  <span className="mb-2 block text-sm font-medium text-white/80">
                    Confirmation
                  </span>
                  <input
                    type="text"
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    placeholder='Type "DELETE"'
                    className="w-full rounded-xl border border-white/15 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-red-400/60"
                  />
                </label>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending || confirmation !== "DELETE"}
                    className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundColor: color3 }}
                  >
                    {isPending ? "Deleting..." : "Delete account"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
