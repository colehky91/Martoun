import { Resend } from "resend";
import { welcomeEmail } from "@/emails/welcome";

// instantiated per-call: the constructor throws without a key, which breaks `next build`
export async function sendWelcomeEmail(to: string, magicLink: string) {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const result = await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to,
    subject: "You're in — The November Window",
    html: welcomeEmail(magicLink),
  });
  // the SDK reports API failures in `error` without throwing — surface them in logs
  if (result.error) {
    console.error(`welcome email to ${to} FAILED:`, JSON.stringify(result.error));
  } else {
    console.log(`welcome email sent to ${to} (id ${result.data?.id})`);
  }
  return result;
}
