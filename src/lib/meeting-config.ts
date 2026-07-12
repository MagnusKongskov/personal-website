export const MEETING_TIMEZONE = "Europe/Copenhagen";

/** Unbooked slots are removed this many hours before their start time. */
export const MEETING_BOOKING_CUTOFF_HOURS = 3;
export const MEETING_BOOKING_CUTOFF_MS =
  MEETING_BOOKING_CUTOFF_HOURS * 60 * 60 * 1000;

export const MEETING_SLOT_TYPES = ["normal", "launch_offer"] as const;
export type MeetingSlotType = (typeof MEETING_SLOT_TYPES)[number];

export const LAUNCH_OFFER_BANNER_TEXT = "Launch: Save 380$";

export function getMeetingJoinUrl(): string {
  return process.env.MEETING_JOIN_URL ?? "https://meet.google.com";
}
