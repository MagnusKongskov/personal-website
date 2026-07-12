"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createMeetingPeriodAction,
  deleteMeetingSlotAction,
} from "@/app/admin/actions";
import { AdminField, AdminSection } from "@/components/admin/AdminSection";
import { formatMeetingTimeAdmin } from "@/lib/meeting-format";
import type { MeetingSlotType } from "@/lib/meeting-config";

type SlotItem = {
  id: string;
  startTime: string;
  hidden: boolean;
  slotType: MeetingSlotType;
};

type AdminAddMeetingSlotsProps = {
  slots: SlotItem[];
};

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export default function AdminAddMeetingSlots({ slots }: AdminAddMeetingSlotsProps) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotType, setSlotType] = useState<MeetingSlotType>("normal");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const availableSlots = slots.filter((slot) => !slot.hidden);
  const hiddenSlots = slots.filter((slot) => slot.hidden);

  function renderSlotList(
    items: SlotItem[],
    emptyMessage: string,
    options?: { showHiddenLabel?: boolean },
  ) {
    if (items.length === 0) {
      return <p className="mt-3 text-sm text-muted">{emptyMessage}</p>;
    }

    return (
      <ul className="mt-3 space-y-2">
        {items.map((slot) => (
          <li
            key={slot.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-sm">
                {formatMeetingTimeAdmin(new Date(slot.startTime))}
              </span>
              {options?.showHiddenLabel ? (
                <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted">
                  Hidden
                </span>
              ) : null}
              {slot.slotType === "launch_offer" ? (
                <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                  Launch offer
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(slot.id)}
              disabled={isPending && deletingSlotId === slot.id}
              aria-label="Delete meeting slot"
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border p-2 text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              <TrashIcon />
            </button>
          </li>
        ))}
      </ul>
    );
  }

  function handleSubmit() {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await createMeetingPeriodAction(
        date,
        startTime,
        endTime,
        slotType,
      );

      if (result.error) {
        setError(result.error);
        return;
      }

      setSuccess(
        `Created ${result.created} slot${result.created === 1 ? "" : "s"}.`,
      );
      setDate("");
      setStartTime("");
      setEndTime("");
      setSlotType("normal");
      router.refresh();
    });
  }

  function handleDelete(slotId: string) {
    setError(null);
    setSuccess(null);
    setDeletingSlotId(slotId);

    startTransition(async () => {
      const result = await deleteMeetingSlotAction(slotId);

      setDeletingSlotId(null);

      if (result.error) {
        setError(result.error);
        return;
      }

      setSuccess("Success");
      router.refresh();
    });
  }

  return (
    <AdminSection
      title="Add meeting slots"
      description="Add a time period and 30-minute bookable slots will be created automatically. Overlapping open or scheduled slots are removed first. Times are in Copenhagen (Europe/Copenhagen)."
    >
      {error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </p>
      ) : null}

      <div className="mt-6">
        <h3 className="text-sm font-medium">Available meeting slots</h3>
        {renderSlotList(availableSlots, "No available meeting slots.")}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium">Hidden slots</h3>
        {renderSlotList(hiddenSlots, "No hidden slots.", { showHiddenLabel: true })}
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium">Slot type</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
            <input
              type="radio"
              name="slot-type"
              value="normal"
              checked={slotType === "normal"}
              onChange={() => setSlotType("normal")}
              className="accent-secondary"
            />
            Normal
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
            <input
              type="radio"
              name="slot-type"
              value="launch_offer"
              checked={slotType === "launch_offer"}
              onChange={() => setSlotType("launch_offer")}
              className="accent-secondary"
            />
            Launch offer
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <AdminField
          id="slot-date"
          label="Date"
          type="date"
          value={date}
          onChange={setDate}
        />
        <AdminField
          id="slot-start"
          label="Start time"
          type="time"
          value={startTime}
          onChange={setStartTime}
        />
        <AdminField
          id="slot-end"
          label="End time"
          type="time"
          value={endTime}
          onChange={setEndTime}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-6 inline-flex rounded-full border border-transparent bg-secondary px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating slots..." : "Create 30-minute slots"}
      </button>
    </AdminSection>
  );
}
