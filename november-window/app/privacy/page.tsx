import LegalPage, { Section } from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy — The November Window" };

export default function Privacy() {
  return (
    <LegalPage eyebrow="Your data" title="Privacy Policy" updated="AUGUST 13, 2026">
      <Section title="1. The short version">
        <p>
          We collect the minimum needed to sell you the Course and run your account: your email
          address, your purchase record, and your progress through the Course. We don&rsquo;t sell your
          data, we don&rsquo;t run third-party ad trackers on the Site, and we never see your full card
          number.
        </p>
      </Section>

      <Section title="2. What we collect">
        <p>
          <strong style={{ color: "var(--sand)" }}>Account data:</strong> the email address you
          purchase or are invited with, and sign-in records.
        </p>
        <p>
          <strong style={{ color: "var(--sand)" }}>Course progress:</strong> which sections and
          checklist items you&rsquo;ve completed and how much of each video you&rsquo;ve watched, so the
          Course can resume where you left off on any device.
        </p>
        <p>
          <strong style={{ color: "var(--sand)" }}>Payment data:</strong> handled entirely by
          Stripe, our payment processor. We receive confirmation of your payment and a customer
          reference — your card details never touch our servers.
        </p>
      </Section>

      <Section title="3. Services we rely on">
        <p>
          Your data is processed by a small set of infrastructure providers, each only for its job:
          Stripe (payments), Supabase (account database and authentication), Resend (transactional
          email such as sign-in links and receipts), Vercel (website hosting), and Mux (video
          delivery and playback analytics). Each provider has its own privacy policy and appropriate
          safeguards.
        </p>
      </Section>

      <Section title="4. Cookies">
        <p>
          We use only the cookies needed to keep you signed in. No advertising or cross-site
          tracking cookies.
        </p>
      </Section>

      <Section title="5. Emails">
        <p>
          We send transactional email: your welcome email, sign-in links, and important account or
          product notices. These come from access@thenovemberwindow.com.
        </p>
      </Section>

      <Section title="6. Retention and your rights">
        <p>
          We keep purchase and progress records while your account exists and as required for tax
          and accounting. You can request a copy of your data, or ask us to delete or anonymize your
          personal information, by emailing{" "}
          <a href="mailto:access@thenovemberwindow.com">access@thenovemberwindow.com</a>. We&rsquo;ll
          respond within 30 days.
        </p>
      </Section>

      <Section title="7. Changes and contact">
        <p>
          If this policy changes materially, we&rsquo;ll note it here and update the date above.
          Questions about your data:{" "}
          <a href="mailto:access@thenovemberwindow.com">access@thenovemberwindow.com</a>.
        </p>
      </Section>
    </LegalPage>
  );
}
