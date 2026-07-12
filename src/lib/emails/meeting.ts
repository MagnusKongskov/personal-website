const BRAND_ORANGE = "#f97316";
const BRAND_TEAL = "#2ec4b6";

export function buildEmailShell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #141414; border: 1px solid #262626; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; background: linear-gradient(180deg, rgba(249, 115, 22, 0.12) 0%, rgba(20, 20, 20, 0) 100%);">
              <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${BRAND_TEAL};">
                Magnus Kongskov
              </p>
              <h1 style="margin: 0; font-size: 28px; line-height: 1.2; font-weight: 700; color: #ffffff;">
                ${title}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              ${bodyHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function paragraph(text: string): string {
  return `<p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.78);">${text}</p>`;
}

export function signature(): string {
  return `<p style="margin: 24px 0 0; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.78);">Best regards<br/>Magnus Kongskov</p>`;
}

export function buildMeetingScheduledEmail({
  name,
  meetingTime,
}: {
  name: string;
  meetingTime: string;
}) {
  const text = [
    `Hi ${name}`,
    "",
    "Thanks for scheduling a meeting where we can discuss the design and features for your new website.",
    "",
    `The meeting is scheduled for ${meetingTime} and is expected to last for 25-30 minutes.`,
    "",
    "I will send you a reminder 3 hours before the meeting with a link to join the meeting.",
    "",
    "Best regards",
    "Magnus Kongskov",
  ].join("\n");

  const html = buildEmailShell(
    "Meeting scheduled",
    [
      paragraph(`Hi ${name}`),
      paragraph(
        "Thanks for scheduling a meeting where we can discuss the design and features for your new website.",
      ),
      paragraph(
        `The meeting is scheduled for <strong style="color: #ffffff;">${meetingTime}</strong> and is expected to last for 25-30 minutes.`,
      ),
      paragraph(
        "I will send you a reminder 3 hours before the meeting with a link to join the meeting.",
      ),
      signature(),
    ].join(""),
  );

  return { subject: "Meeting scheduled", text, html };
}

export function buildMeetingRescheduledEmail({
  name,
  oldMeetingTime,
  newMeetingTime,
}: {
  name: string;
  oldMeetingTime: string;
  newMeetingTime: string;
}) {
  const text = [
    `Hi ${name}`,
    "",
    `You have rescheduled our meeting from ${oldMeetingTime} to ${newMeetingTime}.`,
    "",
    "I will send you a reminder 3 hours before the meeting with a link to join the meeting.",
    "",
    "Best regards",
    "Magnus Kongskov",
  ].join("\n");

  const html = buildEmailShell(
    "Meeting rescheduled",
    [
      paragraph(`Hi ${name}`),
      paragraph(
        `You have rescheduled our meeting from <strong style="color: #ffffff;">${oldMeetingTime}</strong> to <strong style="color: #ffffff;">${newMeetingTime}</strong>.`,
      ),
      paragraph(
        "I will send you a reminder 3 hours before the meeting with a link to join the meeting.",
      ),
      signature(),
    ].join(""),
  );

  return { subject: "Meeting rescheduled", text, html };
}

export function buildMeetingCancelledEmail({ name }: { name: string }) {
  const text = [
    `Hi ${name}`,
    "",
    "You have cancelled our scheduled meeting.",
    "",
    "You can schedule a new meeting on magnuskongskov.dk/dashboard.",
    "",
    "Best regards",
    "Magnus Kongskov",
  ].join("\n");

  const html = buildEmailShell(
    "Meeting cancelled",
    [
      paragraph(`Hi ${name}`),
      paragraph("You have cancelled our scheduled meeting."),
      paragraph(
        'You can schedule a new meeting on <a href="https://magnuskongskov.dk/dashboard" style="color: ' +
          BRAND_TEAL +
          ';">magnuskongskov.dk/dashboard</a>.',
      ),
      signature(),
    ].join(""),
  );

  return { subject: "Meeting cancelled", text, html };
}

export function buildMeetingReminderEmail({
  name,
  meetingTime,
  joinUrl,
}: {
  name: string;
  meetingTime: string;
  joinUrl: string;
}) {
  const text = [
    `Hi ${name}`,
    "",
    `I'm looking forward to our meeting at ${meetingTime}`,
    "",
    "You can join the meeting by using the link below:",
    joinUrl,
    "",
    "Best regards",
    "Magnus Kongskov",
  ].join("\n");

  const html = buildEmailShell(
    "Meeting reminder",
    [
      paragraph(`Hi ${name}`),
      paragraph(
        `I'm looking forward to our meeting at <strong style="color: #ffffff;">${meetingTime}</strong>`,
      ),
      paragraph("You can join the meeting by using the link below:"),
      `<p style="margin: 0 0 16px;"><a href="${joinUrl}" style="display: inline-block; padding: 14px 28px; border-radius: 9999px; background-color: ${BRAND_ORANGE}; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none;">Join meeting</a></p>`,
      `<p style="margin: 0; font-size: 13px; line-height: 1.6; word-break: break-all;"><a href="${joinUrl}" style="color: ${BRAND_TEAL}; text-decoration: underline;">${joinUrl}</a></p>`,
      signature(),
    ].join(""),
  );

  return { subject: "Meeting reminder", text, html };
}

export function buildAdminMagicLinkText(url: string): string {
  return [
    "Sign in to admin",
    "",
    url,
    "",
    "This link expires in 24 hours. If you did not request it, you can ignore this email.",
    "",
    "— Magnus Kongskov",
  ].join("\n");
}

export function buildAdminMagicLinkHtml(url: string): string {
  return buildEmailShell(
    "Sign in to admin",
    [
      paragraph(
        "Click the button below to complete sign in. This link is valid for 24 hours.",
      ),
      `<p style="margin: 24px 0 12px; text-align: center;"><a href="${url}" style="display: inline-block; padding: 14px 28px; border-radius: 9999px; background-color: ${BRAND_ORANGE}; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none;">Sign in</a></p>`,
      `<p style="margin: 0; font-size: 13px; line-height: 1.6; word-break: break-all; color: rgba(255, 255, 255, 0.45);">If the button does not work, copy and paste this link into your browser:<br/><a href="${url}" style="color: ${BRAND_TEAL}; text-decoration: underline;">${url}</a></p>`,
    ].join(""),
  );
}

export function buildMeetingNoShowEmail({
  name,
  meetingTime,
}: {
  name: string;
  meetingTime: string;
}) {
  const text = [
    `Hi ${name}`,
    "",
    `We had a scheduled meeting at ${meetingTime}, but you didn't show up.`,
    "",
    "If you are still interested in a personal website, you can schedule a new meeting at magnuskongskov.dk/pw/dashboard",
    "",
    "Best regards",
    "Magnus Kongskov",
  ].join("\n");

  const html = buildEmailShell(
    "Missed meeting",
    [
      paragraph(`Hi ${name}`),
      paragraph(
        `We had a scheduled meeting at <strong style="color: #ffffff;">${meetingTime}</strong>, but you didn't show up.`,
      ),
      paragraph(
        'If you are still interested in a personal website, you can schedule a new meeting at <a href="https://magnuskongskov.dk/pw/dashboard" style="color: ' +
          BRAND_TEAL +
          ';">magnuskongskov.dk/pw/dashboard</a>',
      ),
      signature(),
    ].join(""),
  );

  return { subject: "Missed meeting", text, html };
}

export function buildAdminMeetingCancelledEmail({
  name,
  meetingTime,
}: {
  name: string;
  meetingTime: string;
}) {
  const text = [
    `Hi ${name}`,
    "",
    `Due to unforseen circumstances i will unfortunatily have to cancel our meeting ${meetingTime}`,
    "",
    "You can schedule a new meeting at magnuskongskov.dk/pw/dashboard",
    "",
    "Im sorry for the inconvenience",
    "",
    "Best regards",
    "Magnus Kongskov",
  ].join("\n");

  const html = buildEmailShell(
    "Meeting cancelled",
    [
      paragraph(`Hi ${name}`),
      paragraph(
        `Due to unforseen circumstances i will unfortunatily have to cancel our meeting <strong style="color: #ffffff;">${meetingTime}</strong>`,
      ),
      paragraph(
        'You can schedule a new meeting at <a href="https://magnuskongskov.dk/pw/dashboard" style="color: ' +
          BRAND_TEAL +
          ';">magnuskongskov.dk/pw/dashboard</a>',
      ),
      paragraph("Im sorry for the inconvenience"),
      signature(),
    ].join(""),
  );

  return { subject: "Meeting cancelled", text, html };
}

export function buildWebpageAgreementUploadedEmail({ name }: { name: string }) {
  const text = [
    `Hi ${name}`,
    "",
    "Thanks for the meeting.",
    "",
    "I have uploaded an webpage agreement, which you can accept at magnuskongskov.dk/pw/dashboard.",
    "",
    "Once you have accepted the agreement and confirmed the payment i will start working on your website.",
    "",
    "Best regards",
    "Magnus Kongskov",
  ].join("\n");

  const html = buildEmailShell(
    "Webpage agreement ready",
    [
      paragraph(`Hi ${name}`),
      paragraph("Thanks for the meeting."),
      paragraph(
        'I have uploaded an webpage agreement, which you can accept at <a href="https://magnuskongskov.dk/pw/dashboard" style="color: ' +
          BRAND_TEAL +
          ';">magnuskongskov.dk/pw/dashboard</a>.',
      ),
      paragraph(
        "Once you have accepted the agreement and confirmed the payment i will start working on your website.",
      ),
      signature(),
    ].join(""),
  );

  return { subject: "Webpage agreement ready", text, html };
}
