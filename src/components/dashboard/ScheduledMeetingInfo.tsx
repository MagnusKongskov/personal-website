"use client";

import { useEffect, useRef, useState } from "react";
import MeetingScheduler from "@/components/dashboard/MeetingScheduler";
import {
  downloadMeetingIcs,
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
} from "@/lib/calendar";
import { formatMeetingTimeLocal } from "@/lib/meeting-format";
import { MEETING_BOOKING_CUTOFF_MS } from "@/lib/meeting-config";

type ScheduledMeetingInfoProps = {
  color: string;
  meetingAt: string;
  joinUrl: string;
};

const MEETING_TITLE = "Design call with Magnus Kongskov";

function PenIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

export default function ScheduledMeetingInfo({
  color,
  meetingAt,
  joinUrl,
}: ScheduledMeetingInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCalendarMenuOpen, setIsCalendarMenuOpen] = useState(false);
  const [formattedTime, setFormattedTime] = useState("");
  const [canJoin, setCanJoin] = useState(false);
  const calendarMenuRef = useRef<HTMLDivElement>(null);

  const calendarEvent = {
    title: MEETING_TITLE,
    startTime: meetingAt,
    joinUrl,
  };

  useEffect(() => {
    setFormattedTime(formatMeetingTimeLocal(new Date(meetingAt)));
  }, [meetingAt]);

  useEffect(() => {
    function updateJoinAvailability() {
      const timeUntilMeeting = new Date(meetingAt).getTime() - Date.now();
      setCanJoin(timeUntilMeeting <= MEETING_BOOKING_CUTOFF_MS);
    }

    updateJoinAvailability();
    const interval = window.setInterval(updateJoinAvailability, 60_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [meetingAt]);

  useEffect(() => {
    if (!isCalendarMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        calendarMenuRef.current &&
        !calendarMenuRef.current.contains(event.target as Node)
      ) {
        setIsCalendarMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCalendarMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCalendarMenuOpen]);

  return (
    <>
      <div className="mt-4 w-full space-y-4">
        <div
          className="w-full rounded-xl border border-white/10 bg-[#0a0a0a]/60 px-4 py-3"
          style={{ borderColor: `${color}55` }}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-white/50">
            Scheduled meeting
          </p>
          <p className="mt-1 text-base font-medium text-white">
            {formattedTime || "Loading meeting time..."}
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/40"
          >
            <PenIcon />
            Change meeting
          </button>

          <div className="relative w-full" ref={calendarMenuRef}>
            <button
              type="button"
              onClick={() => setIsCalendarMenuOpen((open) => !open)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/40"
              aria-expanded={isCalendarMenuOpen}
              aria-haspopup="menu"
            >
              <CalendarIcon />
              Add to calendar
            </button>

            {isCalendarMenuOpen ? (
              <div
                role="menu"
                className="absolute left-0 top-full z-20 mt-2 min-w-52 overflow-hidden rounded-xl border border-white/10 bg-[#141414] py-1 shadow-xl"
              >
                <a
                  role="menuitem"
                  href={getGoogleCalendarUrl(calendarEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsCalendarMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Google Calendar
                </a>
                <a
                  role="menuitem"
                  href={getOutlookCalendarUrl(calendarEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsCalendarMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Outlook
                </a>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    downloadMeetingIcs(calendarEvent);
                    setIsCalendarMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2.5 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Apple Calendar (.ics)
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          {canJoin ? (
            <a
              href={joinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: color }}
            >
              Join
              <ExternalLinkIcon />
            </a>
          ) : (
            <>
              <span
                aria-disabled="true"
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white blur-[2px] opacity-60"
                style={{ backgroundColor: color }}
              >
                Join
                <ExternalLinkIcon />
              </span>
              <p className="text-xs text-white/50">
                Link is available 3 hours before the meeting
              </p>
            </>
          )}
        </div>
      </div>

      <MeetingScheduler
        color={color}
        mode="edit"
        isOpen={isEditing}
        onOpenChange={setIsEditing}
        hideTrigger
      />
    </>
  );
}
