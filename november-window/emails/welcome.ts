/** Plain HTML string — no extra deps needed. Matches the course palette. */
export function welcomeEmail(magicLink: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#071916;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#071916;padding:40px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0"
             style="background:#0B2320;border:1px solid #255049;border-radius:4px;">
        <tr><td style="padding:36px 40px 8px;">
          <div style="font-size:11px;letter-spacing:3px;color:#FF7A1A;text-transform:uppercase;font-family:'Courier New',monospace;">
            Access granted
          </div>
          <h1 style="color:#EDE4D3;font-size:30px;line-height:1.05;margin:14px 0 10px;text-transform:uppercase;">
            The November Window
          </h1>
          <p style="color:#9FAFA7;font-size:15px;line-height:1.6;margin:0 0 26px;">
            Your payment went through and your seat is live. One click below signs you in —
            no password to remember. Your progress saves automatically as you work through
            the playbook.
          </p>
          <a href="${magicLink}"
             style="display:inline-block;background:#FF7A1A;color:#0A1614;font-weight:bold;
                    font-size:15px;padding:14px 30px;border-radius:2px;text-decoration:none;
                    text-transform:uppercase;letter-spacing:1px;">
            Open the playbook
          </a>
          <p style="color:#9FAFA7;font-size:12.5px;line-height:1.6;margin:28px 0 0;">
            The button expires after one use. Need back in later? Go to the site and use
            "Log in" — a fresh link lands in this inbox.
          </p>
        </td></tr>
        <tr><td style="padding:26px 40px 32px;border-top:1px solid #1B3E38;">
          <p style="color:#5c6f68;font-size:11px;margin:0;">
            You're receiving this because you purchased access to The November Window.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
