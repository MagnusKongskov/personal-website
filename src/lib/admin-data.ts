import { connectDB } from "@/lib/db";
import { getMeetingJoinUrl } from "@/lib/meeting-config";
import { MeetingSlot } from "@/models/MeetingSlot";
import { User } from "@/models/User";

export type AdminScheduledMeeting = {
  email: string;
  name: string;
  meetingTime: Date;
  meetingLink: string;
};

export type AdminUserRow = {
  localPart: string;
  domain: string;
  level: string;
  levelUpdatedAt: Date;
};

export async function getScheduledMeetingsForAdmin(): Promise<
  AdminScheduledMeeting[]
> {
  await connectDB();

  const slots = await MeetingSlot.find({
    bookedBy: { $exists: true, $nin: [null, ""] },
  })
    .sort({ startTime: 1 })
    .lean();

  const emails = slots
    .map((slot) => slot.bookedBy as string)
    .filter(Boolean);
  const users = await User.find({ mail: { $in: emails } })
    .select({ mail: 1, name: 1 })
    .lean();
  const nameByEmail = new Map(
    users.map((user) => [user.mail, user.name?.trim() || "there"]),
  );

  return slots.map((slot) => ({
    email: slot.bookedBy as string,
    name: nameByEmail.get(slot.bookedBy as string) ?? "there",
    meetingTime: slot.startTime,
    meetingLink: slot.meetingJoinUrl ?? getMeetingJoinUrl(),
  }));
}

export async function getAllUsersForAdmin(): Promise<AdminUserRow[]> {
  await connectDB();

  const users = await User.find().sort({ createdAt: -1 }).lean();

  return users.map((user) => {
    const [localPart = "", domain = ""] = user.mail.split("@");

    return {
      localPart,
      domain,
      level: user.level,
      levelUpdatedAt:
        user.levelUpdatedAt ??
        user.updatedAt ??
        user.createdAt ??
        new Date(),
    };
  });
}
