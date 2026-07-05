const BRAND_ORANGE = "#f97316";
const BRAND_TEAL = "#2ec4b6";

export function buildMagicLinkText(url: string): string {
  return [
    "Sign in to your personal trainer dashboard",
    "",
    url,
    "",
    "This link expires in 24 hours. If you did not request it, you can ignore this email.",
    "",
    "— Magnus Kongskov",
  ].join("\n");
}

export function buildMagicLinkHtml(url: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sign in to your dashboard</title>
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
                Sign in to your dashboard
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 8px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.78);">
                Click the button below to complete sign in. This link is valid for 24 hours.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 28px 32px 12px;">
              <a
                href="${url}"
                style="display: inline-block; padding: 14px 28px; border-radius: 9999px; background-color: ${BRAND_ORANGE}; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none;"
              >
                Sign in
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 32px 32px;">
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: rgba(255, 255, 255, 0.45);">
                If the button does not work, copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0; font-size: 13px; line-height: 1.6; word-break: break-all;">
                <a href="${url}" style="color: ${BRAND_TEAL}; text-decoration: underline;">${url}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 28px;">
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: rgba(255, 255, 255, 0.45);">
                If you did not request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
