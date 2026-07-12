import { MEETING_TIMEZONE } from "@/lib/meeting-config";

const ZOOM_TOKEN_URL = "https://zoom.us/oauth/token";
const ZOOM_API_BASE = "https://api.zoom.us/v2";
const MEETING_DURATION_MINUTES = 30;

type ZoomTokenResponse = {
  access_token: string;
  expires_in: number;
};

type ZoomMeetingResponse = {
  id: number;
  join_url: string;
};

let cachedToken: { token: string; expiresAt: number } | null = null;

export function isZoomConfigured(): boolean {
  return Boolean(
    process.env.ZOOM_ACCOUNT_ID &&
      process.env.ZOOM_CLIENT_ID &&
      process.env.ZOOM_CLIENT_SECRET,
  );
}

function formatZoomStartTime(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: MEETING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}

async function getZoomAccessToken(): Promise<string> {
  if (!isZoomConfigured()) {
    throw new Error("Zoom is not configured.");
  }

  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const credentials = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(
    `${ZOOM_TOKEN_URL}?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Zoom token request failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as ZoomTokenResponse;

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

export async function createZoomMeeting({
  startTime,
  attendeeEmail,
  attendeeName,
}: {
  startTime: Date;
  attendeeEmail: string;
  attendeeName?: string;
}): Promise<{ joinUrl: string; meetingId: string }> {
  const token = await getZoomAccessToken();
  const userId = process.env.ZOOM_USER_ID ?? "me";
  const topic = attendeeName
    ? `Website design call – ${attendeeName}`
    : `Website design call – ${attendeeEmail}`;

  const response = await fetch(`${ZOOM_API_BASE}/users/${userId}/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic,
      type: 2,
      start_time: formatZoomStartTime(startTime),
      duration: MEETING_DURATION_MINUTES,
      timezone: MEETING_TIMEZONE,
      settings: {
        join_before_host: false,
        waiting_room: true,
        approval_type: 2,
        registrants_email_notification: false,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Zoom meeting creation failed: ${response.status} ${body}`);
  }

  const data = (await response.json()) as ZoomMeetingResponse;

  return {
    joinUrl: data.join_url,
    meetingId: String(data.id),
  };
}

export async function deleteZoomMeeting(meetingId: string): Promise<void> {
  if (!meetingId) {
    return;
  }

  const token = await getZoomAccessToken();

  const response = await fetch(`${ZOOM_API_BASE}/meetings/${meetingId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    return;
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Zoom meeting deletion failed: ${response.status} ${body}`);
  }
}

export async function provisionZoomMeetingForUser({
  mail,
  name,
  startTime,
  existingMeetingId,
}: {
  mail: string;
  name?: string;
  startTime: Date;
  existingMeetingId?: string;
}): Promise<{ joinUrl: string; meetingId: string } | null> {
  if (!isZoomConfigured()) {
    return null;
  }

  if (existingMeetingId) {
    try {
      await deleteZoomMeeting(existingMeetingId);
    } catch (error) {
      console.error("Failed to delete previous Zoom meeting:", error);
    }
  }

  return createZoomMeeting({
    startTime,
    attendeeEmail: mail,
    attendeeName: name,
  });
}
