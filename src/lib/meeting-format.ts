import { MEETING_TIMEZONE } from "@/lib/meeting-config";

const FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZoneName: "short",
};

export function isValidIanaTimezone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** Format a meeting time in a specific IANA timezone (for emails and admin). */
export function formatMeetingTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    ...FORMAT_OPTIONS,
    timeZone,
  }).format(date);
}

/** Format a meeting time in the runtime's local timezone (browser on the client). */
export function formatMeetingTimeLocal(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", FORMAT_OPTIONS).format(date);
}

/** Admin slot entry uses Copenhagen time. */
export function formatMeetingTimeAdmin(date: Date): string {
  return formatMeetingTime(date, MEETING_TIMEZONE);
}

export function parseCopenhagenDateTime(date: string, time: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const copenhagenFormatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: MEETING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const target = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;

  for (let offset = -3; offset <= 3; offset++) {
    const candidate = new Date(
      Date.UTC(year, month - 1, day, hour - offset, minute),
    );

    if (copenhagenFormatter.format(candidate) === target) {
      return candidate;
    }
  }

  return new Date(Date.UTC(year, month - 1, day, hour - 2, minute));
}

export function resolveUserTimeZone(
  storedTimeZone?: string | null,
  clientTimeZone?: string | null,
): string {
  if (clientTimeZone && isValidIanaTimezone(clientTimeZone)) {
    return clientTimeZone;
  }

  if (storedTimeZone && isValidIanaTimezone(storedTimeZone)) {
    return storedTimeZone;
  }

  return "UTC";
}

export function getBrowserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
