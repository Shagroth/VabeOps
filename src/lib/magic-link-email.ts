// Magic-link email templates. Kept as a local copy of Auth.js's default
// Resend templates (@auth/core/lib/utils/email.js) because that path
// isn't part of @auth/core's public package exports — only
// `@auth/core/providers/*` is. Copying it here (a) keeps the email
// Auth.js pilot users already see unchanged and (b) makes the template
// trivially unit-testable, which the deep import wouldn't be.

const BRAND_COLOR = "#346df1";
const BUTTON_TEXT_COLOR = "#fff";

export function magicLinkEmailHtml({ url, host }: { url: string; host: string }): string {
  const escapedHost = host.replace(/\./g, "&#8203;.");
  return `
<body style="background: #f9f9f9;">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: #fff; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${BRAND_COLOR}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${BUTTON_TEXT_COLOR}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${BRAND_COLOR}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #444;">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

export function magicLinkEmailText({ url, host }: { url: string; host: string }): string {
  return `Sign in to ${host}\n${url}\n\n`;
}
