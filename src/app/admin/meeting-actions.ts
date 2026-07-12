"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";
import {
  sendAdminMeetingCancelledEmail,
  sendMeetingNoShowEmail,
  sendMeetingReminderEmail,
  sendWebpageAgreementUploadedEmail,
} from "@/lib/emails/send-meeting-email";
import { formatMeetingTime, resolveUserTimeZone } from "@/lib/meeting-format";
import {
  cancelMeeting,
  getDisplayName,
  markReminderSent,
  resolveMeetingJoinUrl,
} from "@/lib/meetings";
import { connectDB } from "@/lib/db";
import { getUserByMail } from "@/lib/users";
import { User } from "@/models/User";

const MAX_PDF_BYTES = 10 * 1024 * 1024;

async function requireAdmin() {
  const session = await auth();

  if (!isAdminEmail(session?.user?.email)) {
    return { error: "Unauthorized." as const };
  }

  return { session };
}

async function getMeetingUser(email: string) {
  const user = await getUserByMail(email);

  if (!user?.scheduledMeetingAt) {
    return { error: "No scheduled meeting found for this user." as const };
  }

  const timeZone = resolveUserTimeZone(user.timezone);
  const meetingTime = formatMeetingTime(user.scheduledMeetingAt, timeZone);
  const name = getDisplayName(user);

  return { user, meetingTime, name };
}

export async function meetingNoShowAction(email: string) {
  const admin = await requireAdmin();
  if (admin.error) {
    return admin;
  }

  const meeting = await getMeetingUser(email);
  if ("error" in meeting) {
    return meeting;
  }

  const result = await cancelMeeting(email);
  if (result.error) {
    return { error: result.error };
  }

  try {
    await sendMeetingNoShowEmail({
      to: email,
      name: meeting.name,
      meetingTime: meeting.meetingTime,
    });
  } catch (error) {
    console.error("Failed to send no-show email:", error);
    return { error: "User level updated, but the email could not be sent." };
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true as const };
}

export async function meetingNotInterestedAction(email: string) {
  const admin = await requireAdmin();
  if (admin.error) {
    return admin;
  }

  const meeting = await getMeetingUser(email);
  if ("error" in meeting) {
    return meeting;
  }

  const result = await cancelMeeting(email);
  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true as const };
}

export async function sendWebpageAgreementAction(formData: FormData) {
  const admin = await requireAdmin();
  if (admin.error) {
    return admin;
  }

  const email = formData.get("email");

  if (typeof email !== "string" || !email) {
    return { error: "User email is required." };
  }

  const file = formData.get("pdf");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "A PDF file is required." };
  }

  if (file.type !== "application/pdf") {
    return { error: "Only PDF files are supported." };
  }

  if (file.size > MAX_PDF_BYTES) {
    return { error: "PDF must be 10 MB or smaller." };
  }

  const meeting = await getMeetingUser(email);
  if ("error" in meeting) {
    return meeting;
  }

  const pdfBuffer = Buffer.from(await file.arrayBuffer());

  await connectDB();

  const cancelResult = await cancelMeeting(email);
  if (cancelResult.error) {
    return { error: cancelResult.error };
  }

  await User.updateOne(
    { mail: email.toLowerCase() },
    {
      $set: {
        level: "1.3.1",
        levelUpdatedAt: new Date(),
        webpageAgreementPdf: pdfBuffer,
      },
    },
  );

  try {
    await sendWebpageAgreementUploadedEmail({
      to: email,
      name: meeting.name,
    });
  } catch (error) {
    console.error("Failed to send webpage agreement email:", error);
    return {
      error: "Agreement uploaded and level updated, but the email could not be sent.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true as const };
}

export async function adminCancelMeetingAction(
  email: string,
  sendEmail: boolean,
) {
  const admin = await requireAdmin();
  if (admin.error) {
    return admin;
  }

  const meeting = await getMeetingUser(email);
  if ("error" in meeting) {
    return meeting;
  }

  const result = await cancelMeeting(email);
  if (result.error) {
    return { error: result.error };
  }

  if (sendEmail) {
    try {
      await sendAdminMeetingCancelledEmail({
        to: email,
        name: meeting.name,
        meetingTime: meeting.meetingTime,
      });
    } catch (error) {
      console.error("Failed to send cancel meeting email:", error);
      return {
        error: "Meeting cancelled, but the email could not be sent.",
      };
    }
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true as const };
}

export async function sendMeetingReminderAction(email: string) {
  const admin = await requireAdmin();
  if (admin.error) {
    return admin;
  }

  const meeting = await getMeetingUser(email);
  if ("error" in meeting) {
    return meeting;
  }

  const { user, name } = meeting;
  const timeZone = resolveUserTimeZone(user.timezone);

  try {
    await sendMeetingReminderEmail({
      to: email,
      name,
      meetingAt: user.scheduledMeetingAt!,
      timeZone,
      joinUrl: resolveMeetingJoinUrl(user),
    });
    await markReminderSent(email);
  } catch (error) {
    console.error("Failed to send meeting reminder email:", error);
    return { error: "The reminder email could not be sent." };
  }

  revalidatePath("/admin");
  return { success: true as const };
}
