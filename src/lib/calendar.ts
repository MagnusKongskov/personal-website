const MEETING_DURATION_MS = 30 * 60 * 1000;

function formatIcsUtc(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function foldIcsLine(line: string): string {
  const maxLength = 75;
  if (line.length <= maxLength) {
    return line;
  }

  const parts = [line.slice(0, maxLength)];

  for (let index = maxLength; index < line.length; index += maxLength - 1) {
    parts.push(` ${line.slice(index, index + maxLength - 1)}`);
  }

  return parts.join("\r\n");
}

export type MeetingCalendarEvent = {
  title: string;
  startTime: string;
  joinUrl: string;
  description?: string;
};

export function buildMeetingIcsContent({
  title,
  startTime,
  joinUrl,
  description,
}: MeetingCalendarEvent): string {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + MEETING_DURATION_MS);
  const uid = `meeting-${start.getTime()}@magnuskongskov.dk`;
  const details =
    description ??
    "30 minute design call to discuss your website. Join using the link below.";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Magnus Kongskov//Meeting Scheduler//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsUtc(new Date())}`,
    `DTSTART:${formatIcsUtc(start)}`,
    `DTEND:${formatIcsUtc(end)}`,
    foldIcsLine(`SUMMARY:${escapeIcsText(title)}`),
    foldIcsLine(
      `DESCRIPTION:${escapeIcsText(`${details}\n\nJoin: ${joinUrl}`)}`,
    ),
    foldIcsLine(`LOCATION:${escapeIcsText(joinUrl)}`),
    `URL:${joinUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return `${lines.join("\r\n")}\r\n`;
}

export function downloadMeetingIcs(event: MeetingCalendarEvent): void {
  const content = buildMeetingIcsContent(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "design-call.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatGoogleCalendarDate(date: Date): string {
  return formatIcsUtc(date).replace(/Z$/, "Z");
}

export function getGoogleCalendarUrl(event: MeetingCalendarEvent): string {
  const start = new Date(event.startTime);
  const end = new Date(start.getTime() + MEETING_DURATION_MS);
  const details =
    event.description ??
    "30 minute design call to discuss your website.";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatGoogleCalendarDate(start)}/${formatGoogleCalendarDate(end)}`,
    details: `${details}\n\nJoin: ${event.joinUrl}`,
    location: event.joinUrl,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarUrl(event: MeetingCalendarEvent): string {
  const start = new Date(event.startTime);
  const end = new Date(start.getTime() + MEETING_DURATION_MS);
  const details =
    event.description ??
    "30 minute design call to discuss your website.";

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: `${details}\n\nJoin: ${event.joinUrl}`,
    location: event.joinUrl,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
