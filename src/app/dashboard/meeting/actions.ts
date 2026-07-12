"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  sendMeetingCancelledEmail,
  sendMeetingRescheduledEmail,
  sendMeetingScheduledEmail,
} from "@/lib/emails/send-meeting-email";
import { isValidIanaTimezone, resolveUserTimeZone } from "@/lib/meeting-format";
import {
  bookMeetingSlot,
  cancelMeeting,
  getAvailableSlots,
  getDisplayName,
  resolveMeetingJoinUrl,
} from "@/lib/meetings";
import { getUserByMail, updateUserTimezone } from "@/lib/users";

async function persistUserTimeZone(
  mail: string,
  clientTimeZone?: string,
): Promise<string> {
  const user = await getUserByMail(mail);
  const timeZone = resolveUserTimeZone(user?.timezone, clientTimeZone);

  if (
    clientTimeZone &&
    isValidIanaTimezone(clientTimeZone) &&
    clientTimeZone !== user?.timezone
  ) {
    await updateUserTimezone(mail, clientTimeZone);
  }

  return timeZone;
}

export async function updateUserTimezoneAction(timeZone: string) {
  const session = await auth();

  if (!session?.user?.email || !isValidIanaTimezone(timeZone)) {
    return;
  }

  const user = await getUserByMail(session.user.email);

  if (user?.timezone === timeZone) {
    return;
  }

  await updateUserTimezone(session.user.email, timeZone);
}

export async function getAvailableMeetingSlotsAction() {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "You must be signed in.", slots: [] };
  }

  const slots = await getAvailableSlots(session.user.email);

  return {
    slots: slots.map((slot) => ({
      id: String(slot._id),
      startTime: slot.startTime.toISOString(),
      slotType: slot.slotType ?? "normal",
    })),
  };
}

export async function scheduleMeetingAction(
  slotId: string,
  clientTimeZone?: string,
) {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "You must be signed in." };
  }

  const user = await getUserByMail(session.user.email);

  if (!user || (user.level !== "1.1" && user.level !== "1.2")) {
    return { error: "You cannot schedule a meeting at this stage." };
  }

  const timeZone = await persistUserTimeZone(
    session.user.email,
    clientTimeZone,
  );

  const result = await bookMeetingSlot({
    mail: session.user.email,
    slotId,
  });

  if (result.error || !result.user?.scheduledMeetingAt) {
    return { error: result.error ?? "Could not schedule meeting." };
  }

  const name = getDisplayName(result.user);
  const joinUrl = resolveMeetingJoinUrl(result.user);

  if (result.oldMeetingTime) {
    await sendMeetingRescheduledEmail({
      to: session.user.email,
      name,
      oldMeetingAt: result.oldMeetingTime,
      newMeetingAt: result.user.scheduledMeetingAt,
      timeZone,
      joinUrl,
    });
  } else {
    await sendMeetingScheduledEmail({
      to: session.user.email,
      name,
      meetingAt: result.user.scheduledMeetingAt,
      timeZone,
      joinUrl,
    });
  }

  revalidatePath("/dashboard");
  return {};
}

export async function rescheduleMeetingAction(
  slotId: string,
  clientTimeZone?: string,
) {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "You must be signed in." };
  }

  const user = await getUserByMail(session.user.email);

  if (!user || user.level !== "1.3" || !user.scheduledMeetingAt) {
    return { error: "You do not have a meeting to reschedule." };
  }

  const timeZone = await persistUserTimeZone(
    session.user.email,
    clientTimeZone,
  );

  const result = await bookMeetingSlot({
    mail: session.user.email,
    slotId,
  });

  if (result.error || !result.user?.scheduledMeetingAt || !result.oldMeetingTime) {
    return { error: result.error ?? "Could not reschedule meeting." };
  }

  await sendMeetingRescheduledEmail({
    to: session.user.email,
    name: getDisplayName(result.user),
    oldMeetingAt: result.oldMeetingTime,
    newMeetingAt: result.user.scheduledMeetingAt,
    timeZone,
    joinUrl: resolveMeetingJoinUrl(result.user),
  });

  revalidatePath("/dashboard");
  return {};
}

export async function cancelMeetingAction() {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: "You must be signed in." };
  }

  const user = await getUserByMail(session.user.email);

  if (!user || !user.scheduledMeetingAt) {
    return { error: "No meeting to cancel." };
  }

  const name = getDisplayName(user);
  const result = await cancelMeeting(session.user.email);

  if (result.error) {
    return { error: result.error };
  }

  await sendMeetingCancelledEmail({
    to: session.user.email,
    name,
  });

  revalidatePath("/dashboard");
  return {};
}
