"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";
import { parseCopenhagenDateTime } from "@/lib/meeting-format";
import type { MeetingSlotType } from "@/lib/meeting-config";
import { MEETING_SLOT_TYPES } from "@/lib/meeting-config";
import { createMeetingPeriodSlots, deleteMeetingSlot } from "@/lib/meetings";

export async function createMeetingPeriodAction(
  date: string,
  startTime: string,
  endTime: string,
  slotType: MeetingSlotType = "normal",
) {
  const session = await auth();

  if (!isAdminEmail(session?.user?.email)) {
    return { error: "Unauthorized." };
  }

  if (!date || !startTime || !endTime) {
    return { error: "Date, start time, and end time are required." };
  }

  if (!MEETING_SLOT_TYPES.includes(slotType)) {
    return { error: "Invalid slot type." };
  }

  const periodStart = parseCopenhagenDateTime(date, startTime);
  const periodEnd = parseCopenhagenDateTime(date, endTime);

  if (Number.isNaN(periodStart.getTime()) || Number.isNaN(periodEnd.getTime())) {
    return { error: "Invalid date or time." };
  }

  const result = await createMeetingPeriodSlots({ periodStart, periodEnd, slotType });

  if (result.error) {
    return { error: result.error };
  }

  if (result.created === 0) {
    return {
      error:
        "No slots were created. Choose a future time period in Copenhagen time.",
    };
  }

  revalidatePath("/admin");
  return { created: result.created, skipped: result.skipped };
}

export async function deleteMeetingSlotAction(slotId: string) {
  const session = await auth();

  if (!isAdminEmail(session?.user?.email)) {
    return { error: "Unauthorized." };
  }

  if (!slotId) {
    return { error: "Slot ID is required." };
  }

  const result = await deleteMeetingSlot(slotId);

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/admin");
  return { success: true as const };
}
