import { NextResponse } from "next/server";
import { sendMeetingReminderEmail } from "@/lib/emails/send-meeting-email";
import { resolveUserTimeZone } from "@/lib/meeting-format";
import {
  deleteUnbookedSlotsPastBookingCutoff,
  getDisplayName,
  getUsersNeedingReminders,
  markReminderSent,
  resolveMeetingJoinUrl,
} from "@/lib/meetings";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deletedSlots = await deleteUnbookedSlotsPastBookingCutoff();
  const users = await getUsersNeedingReminders();
  let sent = 0;

  for (const user of users) {
    if (!user.scheduledMeetingAt) {
      continue;
    }

    try {
      await sendMeetingReminderEmail({
        to: user.mail,
        name: getDisplayName(user),
        meetingAt: user.scheduledMeetingAt,
        timeZone: resolveUserTimeZone(user.timezone),
        joinUrl: resolveMeetingJoinUrl(user),
      });
      await markReminderSent(user.mail);
      sent += 1;
    } catch (error) {
      console.error(`Failed to send reminder to ${user.mail}:`, error);
    }
  }

  return NextResponse.json({ ok: true, sent, deletedSlots });
}
