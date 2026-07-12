"use client";

import { useEffect, useState, useTransition } from "react";
import {
  adminCancelMeetingAction,
  meetingNoShowAction,
  meetingNotInterestedAction,
  sendWebpageAgreementAction,
} from "@/app/admin/meeting-actions";
import type { AdminScheduledMeeting } from "@/lib/admin-data";

type AdminMeetingActionsProps = {
  meeting: AdminScheduledMeeting;
};

type ActiveDialog = "cancel" | "agreement" | null;

export default function AdminMeetingActions({ meeting }: AdminMeetingActionsProps) {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [sendCancelEmail, setSendCancelEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!activeDialog) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDialog();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeDialog]);

  function closeDialog() {
    setActiveDialog(null);
    setError(null);
    setSendCancelEmail(true);
  }

  function runAction(action: () => Promise<{ error?: string; success?: boolean }>) {
    setError(null);

    startTransition(async () => {
      const result = await action();

      if (result.error) {
        setError(result.error);
        return;
      }

      closeDialog();
    });
  }

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => runAction(() => meetingNoShowAction(meeting.email))}
          disabled={isPending}
          className="rounded-full border border-border px-4 py-2 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          No-show
        </button>
        <button
          type="button"
          onClick={() => runAction(() => meetingNotInterestedAction(meeting.email))}
          disabled={isPending}
          className="rounded-full border border-border px-4 py-2 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          Not interested
        </button>
        <button
          type="button"
          onClick={() => setActiveDialog("agreement")}
          disabled={isPending}
          className="rounded-full border border-border px-4 py-2 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          Send webpage agreement
        </button>
        <button
          type="button"
          onClick={() => setActiveDialog("cancel")}
          disabled={isPending}
          className="rounded-full border border-border px-4 py-2 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          Cancel meeting
        </button>
      </div>

      {error && !activeDialog ? (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      ) : null}

      {activeDialog === "cancel" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
          onClick={closeDialog}
        >
          <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-meeting-heading"
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id="cancel-meeting-heading"
              className="text-lg font-semibold text-foreground"
            >
              Cancel meeting
            </h3>
            <p className="mt-2 text-sm text-muted">
              Cancel the meeting for {meeting.email} and set their level back to
              1.2.
            </p>

            <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={sendCancelEmail}
                onChange={(event) => setSendCancelEmail(event.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <span>Send standard mail</span>
            </label>

            {error ? (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDialog}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() =>
                  runAction(() =>
                    adminCancelMeetingAction(meeting.email, sendCancelEmail),
                  )
                }
                disabled={isPending}
                className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
              >
                {isPending ? "Cancelling…" : "Confirm cancel"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {activeDialog === "agreement" ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
          onClick={closeDialog}
        >
          <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="send-agreement-heading"
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id="send-agreement-heading"
              className="text-lg font-semibold text-foreground"
            >
              Send webpage agreement
            </h3>
            <p className="mt-2 text-sm text-muted">
              Upload a PDF agreement for {meeting.name} ({meeting.email}). Their
              level will be set to 1.3.1.
            </p>

            <form
              className="mt-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                formData.set("email", meeting.email);
                runAction(() => sendWebpageAgreementAction(formData));
              }}
            >
              <input
                type="file"
                name="pdf"
                accept="application/pdf"
                required
                className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-background"
              />

              {error ? (
                <p className="text-sm text-red-400">{error}</p>
              ) : null}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
                >
                  {isPending ? "Uploading…" : "Upload and send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
