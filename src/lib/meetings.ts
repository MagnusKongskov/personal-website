import { connectDB } from "@/lib/db";
import { MEETING_BOOKING_CUTOFF_MS } from "@/lib/meeting-config";
import { getMeetingJoinUrl } from "@/lib/meeting-config";
import type { MeetingSlotType } from "@/lib/meeting-config";
import { provisionZoomMeetingForUser, deleteZoomMeeting } from "@/lib/zoom";
import { MeetingSlot, type MeetingSlotDocument } from "@/models/MeetingSlot";
import { User, type UserDocument } from "@/models/User";

export async function deleteUnbookedSlotsPastBookingCutoff(): Promise<number> {
  await connectDB();

  const cutoff = new Date(Date.now() + MEETING_BOOKING_CUTOFF_MS);
  const result = await MeetingSlot.deleteMany({
    startTime: { $lte: cutoff },
    $or: [{ bookedBy: { $exists: false } }, { bookedBy: null }],
  });

  return result.deletedCount ?? 0;
}

export async function getAvailableSlots(
  includeBookedByMail?: string,
): Promise<MeetingSlotDocument[]> {
  await connectDB();

  await deleteUnbookedSlotsPastBookingCutoff();

  const now = new Date();
  const bookingCutoff = new Date(now.getTime() + MEETING_BOOKING_CUTOFF_MS);

  const slots = await MeetingSlot.find({
    startTime: { $gt: bookingCutoff },
    hidden: { $ne: true },
    ...isOpenSlotFilter(includeBookedByMail),
  })
    .sort({ startTime: 1 })
    .lean();

  return slots as MeetingSlotDocument[];
}

export async function getAdminOpenSlots(): Promise<MeetingSlotDocument[]> {
  await connectDB();

  const now = new Date();

  const slots = await MeetingSlot.find({
    startTime: { $gt: now },
    $or: [{ bookedBy: { $exists: false } }, { bookedBy: null }],
  })
    .sort({ startTime: 1 })
    .lean();

  return slots as MeetingSlotDocument[];
}

export async function getAllSlots(): Promise<MeetingSlotDocument[]> {
  await connectDB();

  const slots = await MeetingSlot.find().sort({ startTime: 1 }).lean();
  return slots as MeetingSlotDocument[];
}

const SLOT_DURATION_MS = 30 * 60 * 1000;
const MIN_SLOTS_TO_HIDE_ONE = 4;
const BOOKINGS_TO_REVEAL_HIDDEN = 2;

function isOpenSlotFilter(includeBookedByMail?: string) {
  const mail = includeBookedByMail?.toLowerCase();

  return {
    $or: [
      { bookedBy: { $exists: false } },
      { bookedBy: null },
      ...(mail ? [{ bookedBy: mail }] : []),
    ],
  };
}

async function revealHiddenSlotsInBatch(batchId: string): Promise<void> {
  const bookedVisibleCount = await MeetingSlot.countDocuments({
    batchId,
    hidden: { $ne: true },
    bookedBy: { $exists: true, $nin: [null, ""] },
  });

  if (bookedVisibleCount >= BOOKINGS_TO_REVEAL_HIDDEN) {
    await MeetingSlot.updateMany(
      { batchId, hidden: true },
      { $set: { hidden: false } },
    );
  }
}

async function assignBatchHiding(slots: MeetingSlotDocument[]): Promise<void> {
  if (slots.length < MIN_SLOTS_TO_HIDE_ONE) {
    return;
  }

  const batchId = crypto.randomUUID();

  await MeetingSlot.updateMany(
    { _id: { $in: slots.map((slot) => slot._id) } },
    { $set: { batchId } },
  );

  const hiddenIndex = Math.floor(Math.random() * slots.length);
  await MeetingSlot.findByIdAndUpdate(slots[hiddenIndex]._id, {
    $set: { hidden: true },
  });
}

async function removeOverlappingSlotsInPeriod(
  periodStart: Date,
  periodEnd: Date,
): Promise<number> {
  const overlapping = await MeetingSlot.find({
    startTime: {
      $gt: new Date(periodStart.getTime() - SLOT_DURATION_MS),
      $lt: periodEnd,
    },
  });

  let deleted = 0;

  for (const slot of overlapping) {
    if (slot.bookedBy) {
      const bookedUser = await User.findOne({ mail: slot.bookedBy });

      if (bookedUser) {
        await clearZoomMeetingForUser(bookedUser);
      }

      await User.updateOne(
        { mail: slot.bookedBy },
        {
          $unset: {
            scheduledMeetingAt: "",
            meetingSlotId: "",
            meetingJoinUrl: "",
            zoomMeetingId: "",
          },
          $set: {
            meetingReminderSent: false,
            level: "1.2",
            levelUpdatedAt: new Date(),
          },
        },
      );
    }

    await MeetingSlot.deleteOne({ _id: slot._id });
    deleted += 1;
  }

  return deleted;
}

export async function createMeetingPeriodSlots({
  periodStart,
  periodEnd,
  slotType = "normal",
}: {
  periodStart: Date;
  periodEnd: Date;
  slotType?: MeetingSlotType;
}): Promise<{ created: number; skipped: number; error?: string }> {
  if (periodEnd <= periodStart) {
    return { created: 0, skipped: 0, error: "End time must be after start time." };
  }

  await connectDB();

  await removeOverlappingSlotsInPeriod(periodStart, periodEnd);

  let created = 0;
  let skipped = 0;
  const createdSlots: MeetingSlotDocument[] = [];

  for (
    let slotStart = periodStart.getTime();
    slotStart + SLOT_DURATION_MS <= periodEnd.getTime();
    slotStart += SLOT_DURATION_MS
  ) {
    if (new Date(slotStart) <= new Date()) {
      skipped += 1;
      continue;
    }

    try {
      const slot = await createMeetingSlot(new Date(slotStart), slotType);
      createdSlots.push(slot);
      created += 1;
    } catch {
      skipped += 1;
    }
  }

  await assignBatchHiding(createdSlots);

  return { created, skipped };
}

export async function createMeetingSlot(
  startTime: Date,
  slotType: MeetingSlotType = "normal",
): Promise<MeetingSlotDocument> {
  await connectDB();

  const slot = await MeetingSlot.create({ startTime, slotType });
  return slot.toObject() as MeetingSlotDocument;
}

export async function deleteMeetingSlot(slotId: string): Promise<{ error?: string }> {
  await connectDB();

  const slot = await MeetingSlot.findById(slotId);

  if (!slot) {
    return { error: "Slot not found." };
  }

  if (slot.bookedBy) {
    return { error: "Cannot delete a booked slot." };
  }

  await MeetingSlot.deleteOne({ _id: slotId });
  return {};
}

export async function releaseSlotForUser(mail: string): Promise<void> {
  await connectDB();

  const user = await User.findOne({ mail: mail.toLowerCase() });

  if (!user?.meetingSlotId) {
    return;
  }

  await MeetingSlot.findByIdAndUpdate(user.meetingSlotId, {
    $unset: {
      bookedBy: "",
      bookedAt: "",
      meetingJoinUrl: "",
      zoomMeetingId: "",
    },
  });
}

export async function cancelScheduledMeetingSilently(
  mail: string,
): Promise<void> {
  await connectDB();

  const user = await User.findOne({ mail: mail.toLowerCase() });

  if (!user) {
    return;
  }

  await clearZoomMeetingForUser(user);
  await releaseSlotForUser(mail);
}

export async function bookMeetingSlot({
  mail,
  slotId,
}: {
  mail: string;
  slotId: string;
}): Promise<{ error?: string; oldMeetingTime?: Date; user?: UserDocument }> {
  await connectDB();

  const user = await User.findOne({ mail: mail.toLowerCase() });

  if (!user) {
    return { error: "User not found." };
  }

  const oldMeetingTime = user.scheduledMeetingAt
    ? new Date(user.scheduledMeetingAt)
    : undefined;
  const oldSlotId = user.meetingSlotId;
  const bookingCutoff = new Date(Date.now() + MEETING_BOOKING_CUTOFF_MS);

  const slot = await MeetingSlot.findOneAndUpdate(
    {
      _id: slotId,
      hidden: { $ne: true },
      ...isOpenSlotFilter(mail),
      startTime: { $gt: bookingCutoff },
    },
    {
      $set: {
        bookedBy: mail.toLowerCase(),
        bookedAt: new Date(),
      },
    },
    { new: true },
  );

  if (!slot) {
    return { error: "This time slot is no longer available." };
  }

  if (oldSlotId && oldSlotId !== slotId) {
    await MeetingSlot.findByIdAndUpdate(oldSlotId, {
      $unset: {
        bookedBy: "",
        bookedAt: "",
        meetingJoinUrl: "",
        zoomMeetingId: "",
      },
    });
  }

  const zoomMeeting = await provisionZoomMeetingForUser({
    mail: user.mail,
    name: user.name,
    startTime: slot.startTime,
    existingMeetingId: user.zoomMeetingId,
  }).catch((error) => {
    console.error("Failed to create Zoom meeting:", error);
    return null;
  });

  user.scheduledMeetingAt = slot.startTime;
  user.meetingSlotId = String(slot._id);
  user.meetingReminderSent = false;
  user.level = "1.3";
  user.levelUpdatedAt = new Date();

  if (zoomMeeting) {
    user.meetingJoinUrl = zoomMeeting.joinUrl;
    user.zoomMeetingId = zoomMeeting.meetingId;

    await MeetingSlot.findByIdAndUpdate(slot._id, {
      $set: {
        meetingJoinUrl: zoomMeeting.joinUrl,
        zoomMeetingId: zoomMeeting.meetingId,
      },
    });
  } else {
    user.meetingJoinUrl = getMeetingJoinUrl();
    user.zoomMeetingId = undefined;
  }

  await user.save();

  if (slot.batchId) {
    await revealHiddenSlotsInBatch(slot.batchId);
  }

  return {
    oldMeetingTime,
    user: user.toObject() as UserDocument,
  };
}

export async function cancelMeeting(mail: string): Promise<{ error?: string; user?: UserDocument }> {
  await connectDB();

  const user = await User.findOne({ mail: mail.toLowerCase() });

  if (!user?.scheduledMeetingAt) {
    return { error: "No meeting scheduled." };
  }

  await clearZoomMeetingForUser(user);
  await releaseSlotForUser(mail);

  user.scheduledMeetingAt = undefined;
  user.meetingSlotId = undefined;
  user.meetingJoinUrl = undefined;
  user.zoomMeetingId = undefined;
  user.meetingReminderSent = false;
  user.level = "1.2";
  user.levelUpdatedAt = new Date();
  await user.save();

  return { user: user.toObject() as UserDocument };
}

export async function getUsersNeedingReminders(): Promise<UserDocument[]> {
  await connectDB();

  const now = new Date();
  const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);

  const users = await User.find({
    scheduledMeetingAt: { $gt: now, $lte: threeHoursFromNow },
    meetingReminderSent: { $ne: true },
  }).lean();

  return users as UserDocument[];
}

export async function markReminderSent(mail: string): Promise<void> {
  await connectDB();
  await User.updateOne(
    { mail: mail.toLowerCase() },
    { $set: { meetingReminderSent: true } },
  );
}

export function getDisplayName(user: UserDocument | null): string {
  const name = user?.name?.trim();
  return name || "there";
}

export function resolveMeetingJoinUrl(user: UserDocument | null): string {
  return user?.meetingJoinUrl ?? getMeetingJoinUrl();
}

async function clearZoomMeetingForUser(user: UserDocument): Promise<void> {
  if (!user.zoomMeetingId) {
    return;
  }

  try {
    await deleteZoomMeeting(user.zoomMeetingId);
  } catch (error) {
    console.error(`Failed to delete Zoom meeting ${user.zoomMeetingId}:`, error);
  }
}
