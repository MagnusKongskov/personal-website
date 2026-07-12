"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import AlertMessage from "@/components/pw/AlertMessage";
import {
  cancelMeetingAction,
  getAvailableMeetingSlotsAction,
  rescheduleMeetingAction,
  scheduleMeetingAction,
} from "@/app/dashboard/meeting/actions";
import { LAUNCH_OFFER_BANNER_TEXT } from "@/lib/meeting-config";
import type { MeetingSlotType } from "@/lib/meeting-config";
import { color3 } from "@/components/pw/colors";
import { formatMeetingTimeLocal, getBrowserTimeZone } from "@/lib/meeting-format";

type MeetingSlotOption = {
  id: string;
  startTime: string;
  slotType: MeetingSlotType;
};

type MeetingSchedulerProps = {
  color: string;
  mode: "schedule" | "edit";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getLocalDateKey(iso: string): string {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatSlotTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

function formatSelectedDateLabel(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

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

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-none stroke-current stroke-2"
    >
      {direction === "left" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

function LaunchOfferDot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`rounded-full bg-orange-500 ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

export default function MeetingScheduler({
  color,
  mode,
  isOpen: controlledIsOpen,
  onOpenChange,
  hideTrigger = false,
}: MeetingSchedulerProps) {
  const router = useRouter();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [slots, setSlots] = useState<MeetingSlotOption[]>([]);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [viewMonth, setViewMonth] = useState(() => getMonthStart(new Date()));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(nextOpen);
      } else {
        setInternalIsOpen(nextOpen);
      }
    },
    [isControlled, onOpenChange],
  );

  const resetModalState = useCallback(() => {
    setError(null);
    setSelectedSlotId("");
    setSelectedDateKey(null);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    resetModalState();
  }, [resetModalState, setOpen]);

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
  }, [closeModal, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    async function loadSlots() {
      const result = await getAvailableMeetingSlotsAction();

      if (cancelled) {
        return;
      }

      if (result.error) {
        setError(result.error);
        setSlots([]);
      } else {
        setSlots(result.slots);

        if (result.slots[0]) {
          const firstDateKey = getLocalDateKey(result.slots[0].startTime);
          setSelectedDateKey(firstDateKey);
          setViewMonth(getMonthStart(new Date(result.slots[0].startTime)));
          setSelectedSlotId(result.slots[0].id);
        } else {
          setSelectedDateKey(null);
          setSelectedSlotId("");
        }
      }

      setIsLoading(false);
    }

    void loadSlots();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const slotsByDate = useMemo(() => {
    const grouped = new Map<string, MeetingSlotOption[]>();

    for (const slot of slots) {
      const dateKey = getLocalDateKey(slot.startTime);
      const existing = grouped.get(dateKey) ?? [];
      existing.push(slot);
      grouped.set(dateKey, existing);
    }

    return grouped;
  }, [slots]);

  const availableDateKeys = useMemo(
    () => new Set(slotsByDate.keys()),
    [slotsByDate],
  );

  const launchOfferDateKeys = useMemo(() => {
    const keys = new Set<string>();

    for (const slot of slots) {
      if (slot.slotType === "launch_offer") {
        keys.add(getLocalDateKey(slot.startTime));
      }
    }

    return keys;
  }, [slots]);

  const selectedDateSlots = useMemo(() => {
    if (!selectedDateKey) {
      return [];
    }

    return slotsByDate.get(selectedDateKey) ?? [];
  }, [selectedDateKey, slotsByDate]);

  const monthLabel = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(viewMonth);

  const calendarDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const mondayBasedOffset = (firstDayOfMonth.getDay() + 6) % 7;
    const cells: Array<{ dateKey: string | null; day: number | null }> = [];

    for (let index = 0; index < mondayBasedOffset; index += 1) {
      cells.push({ dateKey: null, day: null });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push({ dateKey, day });
    }

    return cells;
  }, [viewMonth]);

  const canGoToPreviousMonth = useMemo(() => {
    const previousMonth = addMonths(viewMonth, -1);
    const lastDayPreviousMonth = new Date(
      previousMonth.getFullYear(),
      previousMonth.getMonth() + 1,
      0,
    );

    for (const dateKey of availableDateKeys) {
      const [year, month, day] = dateKey.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      if (date <= lastDayPreviousMonth) {
        return true;
      }
    }

    return false;
  }, [availableDateKeys, viewMonth]);

  const canGoToNextMonth = useMemo(() => {
    const nextMonth = addMonths(viewMonth, 1);
    const firstDayNextMonth = nextMonth;

    for (const dateKey of availableDateKeys) {
      const [year, month, day] = dateKey.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      if (date >= firstDayNextMonth) {
        return true;
      }
    }

    return false;
  }, [availableDateKeys, viewMonth]);

  function handleSelectDate(dateKey: string) {
    if (!availableDateKeys.has(dateKey)) {
      return;
    }

    setSelectedDateKey(dateKey);

    const dateSlots = slotsByDate.get(dateKey) ?? [];
    setSelectedSlotId(dateSlots[0]?.id ?? "");
  }

  function handleSubmit() {
    if (!selectedSlotId) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const timeZone = getBrowserTimeZone();
      const action =
        mode === "schedule" ? scheduleMeetingAction : rescheduleMeetingAction;
      const result = await action(selectedSlotId, timeZone);

      if (result.error) {
        setError(result.error);
        return;
      }

      closeModal();
      onOpenChange?.(false);

      if (mode === "schedule") {
        router.push("/ms");
        return;
      }

      router.refresh();
    });
  }

  function handleCancelMeeting() {
    setError(null);

    startTransition(async () => {
      const result = await cancelMeetingAction();

      if (result.error) {
        setError(result.error);
        return;
      }

      closeModal();
      onOpenChange?.(false);
      router.refresh();
    });
  }

  const triggerLabel =
    mode === "schedule" ? "Book meeting" : "Choose a new time";

  const modal =
    isOpen && isMounted ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="presentation"
        onClick={closeModal}
      >
        <div className="absolute inset-0 bg-black/70" aria-hidden="true" />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="meeting-scheduler-heading"
          className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#141414] p-6 shadow-xl sm:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 text-white/50 transition-colors hover:text-white"
            aria-label="Close"
          >
            <CloseIcon />
          </button>

          <h2
            id="meeting-scheduler-heading"
            className="pr-8 text-xl font-semibold text-white"
          >
            {mode === "schedule" ? "Book a meeting" : "Change meeting time"}
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Pick an available date, then choose a time slot.
          </p>

          {error ? (
            <AlertMessage variant="error" className="mt-4">
              {error}
            </AlertMessage>
          ) : null}

          {isLoading ? (
            <p className="mt-6 text-sm text-white/60">
              Loading available times...
            </p>
          ) : slots.length === 0 ? (
            <p className="mt-6 text-sm text-white/75">
              No available meeting times right now. Please check back soon.
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setViewMonth(addMonths(viewMonth, -1))}
                    disabled={!canGoToPreviousMonth}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous month"
                  >
                    <ChevronIcon direction="left" />
                  </button>

                  <p className="text-sm font-medium text-white">{monthLabel}</p>

                  <button
                    type="button"
                    onClick={() => setViewMonth(addMonths(viewMonth, 1))}
                    disabled={!canGoToNextMonth}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Next month"
                  >
                    <ChevronIcon direction="right" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {WEEKDAY_LABELS.map((label) => (
                    <div
                      key={label}
                      className="py-1 text-xs font-medium uppercase tracking-wide text-white/40"
                    >
                      {label}
                    </div>
                  ))}

                  {calendarDays.map((cell, index) => {
                    if (!cell.dateKey || cell.day === null) {
                      return <div key={`empty-${index}`} aria-hidden="true" />;
                    }

                    const isAvailable = availableDateKeys.has(cell.dateKey);
                    const isSelected = selectedDateKey === cell.dateKey;
                    const hasLaunchOffer = launchOfferDateKeys.has(cell.dateKey);

                    return (
                      <button
                        key={cell.dateKey}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => handleSelectDate(cell.dateKey!)}
                        className={[
                          "relative mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors",
                          isAvailable
                            ? "cursor-pointer text-white hover:bg-white/10"
                            : "cursor-default text-white/20",
                          isSelected ? "font-semibold text-white" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        style={
                          isSelected
                            ? { backgroundColor: color }
                            : isAvailable
                              ? { boxShadow: `inset 0 0 0 1px ${color}55` }
                              : undefined
                        }
                        aria-label={
                          isAvailable
                            ? `Available on ${cell.dateKey}`
                            : `Unavailable on ${cell.dateKey}`
                        }
                        aria-pressed={isSelected}
                      >
                        {hasLaunchOffer ? (
                          <LaunchOfferDot className="absolute right-1 top-1 h-2 w-2" />
                        ) : null}
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDateKey ? (
                <div>
                  <p className="text-sm font-medium text-white">
                    {formatSelectedDateLabel(selectedDateKey)}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {selectedDateSlots.map((slot) => {
                      const isSelected = selectedSlotId === slot.id;
                      const isLaunchOffer = slot.slotType === "launch_offer";

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={[
                            "relative overflow-visible rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                            isSelected
                              ? "border-transparent text-white"
                              : "border-white/15 text-white/80 hover:border-white/30 hover:text-white",
                          ].join(" ")}
                          style={
                            isSelected ? { backgroundColor: color } : undefined
                          }
                          aria-pressed={isSelected}
                        >
                          {isLaunchOffer ? (
                            <span className="absolute -right-1 -top-2 z-10 rounded bg-orange-500 px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-white">
                              {LAUNCH_OFFER_BANNER_TEXT}
                            </span>
                          ) : null}
                          {formatSlotTime(slot.startTime)}
                        </button>
                      );
                    })}
                  </div>

                  {selectedSlotId ? (
                    <p className="mt-3 text-xs text-white/50">
                      {formatMeetingTimeLocal(
                        new Date(
                          selectedDateSlots.find(
                            (slot) => slot.id === selectedSlotId,
                          )!.startTime,
                        ),
                      )}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !selectedSlotId || isLoading}
              className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: color }}
            >
              {isPending
                ? "Saving..."
                : mode === "schedule"
                  ? "Schedule meeting"
                  : "Save new time"}
            </button>

            {mode === "edit" ? (
              <button
                type="button"
                onClick={handleCancelMeeting}
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: color3 }}
              >
                Cancel meeting
              </button>
            ) : null}
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      {!hideTrigger ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: color }}
          >
            {triggerLabel}
          </button>
        </div>
      ) : null}

      {modal ? createPortal(modal, document.body) : null}
    </>
  );
}
