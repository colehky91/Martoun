import { Resend } from "resend";
import { welcomeEmail } from "@/emails/welcome";

// instantiated per-call: the constructor throws without a key, which breaks `next build`
export async function sendWelcomeEmail(to: string, magicLink: string) {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  return resend.emails.send({
    from: process.env.RESEND_FROM!,
    to,
    subject: "You're in — The November Window",
    html: welcomeEmail(magicLink),
  });
}
