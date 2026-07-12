import { Resend } from "resend";
import {
  buildMeetingCancelledEmail,
  buildMeetingReminderEmail,
  buildMeetingRescheduledEmail,
  buildMeetingScheduledEmail,
  buildMeetingNoShowEmail,
  buildAdminMeetingCancelledEmail,
  buildWebpageAgreementUploadedEmail,
} from "@/lib/emails/meeting";
import { buildAccountDeletedEmail } from "@/lib/emails/account";
import { formatMeetingTime } from "@/lib/meeting-format";

const resendFrom =
  process.env.RESEND_FROM_EMAIL ?? "Magnus Kongskov <auto@magnuskongskov.dk>";

async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set; skipping email send.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: resendFrom,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}

export async function sendMeetingScheduledEmail({
  to,
  name,
  meetingAt,
  timeZone,
  joinUrl,
}: {
  to: string;
  name: string;
  meetingAt: Date;
  timeZone: string;
  joinUrl: string;
}) {
  const meetingTime = formatMeetingTime(meetingAt, timeZone);
  const email = buildMeetingScheduledEmail({ name, meetingTime });
  await sendEmail({ to, ...email });
}

export async function sendMeetingRescheduledEmail({
  to,
  name,
  oldMeetingAt,
  newMeetingAt,
  timeZone,
  joinUrl,
}: {
  to: string;
  name: string;
  oldMeetingAt: Date;
  newMeetingAt: Date;
  timeZone: string;
  joinUrl: string;
}) {
  const email = buildMeetingRescheduledEmail({
    name,
    oldMeetingTime: formatMeetingTime(oldMeetingAt, timeZone),
    newMeetingTime: formatMeetingTime(newMeetingAt, timeZone),
  });
  await sendEmail({ to, ...email });
}

export async function sendMeetingCancelledEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const email = buildMeetingCancelledEmail({ name });
  await sendEmail({ to, ...email });
}

export async function sendMeetingReminderEmail({
  to,
  name,
  meetingAt,
  timeZone,
  joinUrl,
}: {
  to: string;
  name: string;
  meetingAt: Date;
  timeZone: string;
  joinUrl: string;
}) {
  const email = buildMeetingReminderEmail({
    name,
    meetingTime: formatMeetingTime(meetingAt, timeZone),
    joinUrl,
  });
  await sendEmail({ to, ...email });
}

export async function sendAccountDeletedEmail({ to }: { to: string }) {
  const email = buildAccountDeletedEmail();
  await sendEmail({ to, ...email });
}

const primaryFrom = "Magnus Kongskov <primary@magnuskongskov.dk>";

async function sendPrimaryEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set; skipping email send.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: primaryFrom,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}

export async function sendMeetingNoShowEmail({
  to,
  name,
  meetingTime,
}: {
  to: string;
  name: string;
  meetingTime: string;
}) {
  const email = buildMeetingNoShowEmail({ name, meetingTime });
  await sendPrimaryEmail({ to, ...email });
}

export async function sendAdminMeetingCancelledEmail({
  to,
  name,
  meetingTime,
}: {
  to: string;
  name: string;
  meetingTime: string;
}) {
  const email = buildAdminMeetingCancelledEmail({ name, meetingTime });
  await sendPrimaryEmail({ to, ...email });
}

export async function sendWebpageAgreementUploadedEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const email = buildWebpageAgreementUploadedEmail({ name });
  await sendPrimaryEmail({ to, ...email });
}
