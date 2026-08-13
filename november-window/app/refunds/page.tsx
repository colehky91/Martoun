import LegalPage, { Section } from "@/components/LegalPage";

export const metadata = { title: "Refund Policy — The November Window" };

export default function Refunds() {
  return (
    <LegalPage eyebrow="Read before you buy" title="Refund Policy" updated="AUGUST 13, 2026">
      <Section title="All sales are final">
        <p>
          <strong style={{ color: "var(--sand)" }}>
            The November Window is a digital product with instant access, and all sales are final.
            No refunds are offered, for any reason, once your purchase is complete.
          </strong>
        </p>
        <p>
          The moment your payment goes through, the complete course — every section, checklist,
          prompt, and template — is delivered to your account. Like any digital good, it can&rsquo;t
          be &ldquo;returned,&rdquo; so we don&rsquo;t offer refunds. Please make sure the Course is
          right for you before purchasing: the full curriculum is listed on the sales page, and you
          can email us questions before buying.
        </p>
      </Section>

      <Section title="By purchasing, you agree">
        <p>
          Completing checkout constitutes your acknowledgment and acceptance of this no-refund
          policy. This policy is stated on the sales page and at checkout before any payment is
          made.
        </p>
      </Section>

      <Section title="The one exception: billing errors">
        <p>
          Genuine billing mistakes are always corrected — a duplicate charge, a charge without
          access being granted, or an incorrect amount. Email{" "}
          <a href="mailto:access@thenovemberwindow.com">access@thenovemberwindow.com</a> from your
          purchase email with the subject &ldquo;Billing&rdquo; and we&rsquo;ll fix it promptly. This
          covers processing errors only — it is not a refund channel.
        </p>
      </Section>

      <Section title="Access problems">
        <p>
          If you paid and can&rsquo;t get in, that&rsquo;s our problem to fix, fast. Email{" "}
          <a href="mailto:access@thenovemberwindow.com">access@thenovemberwindow.com</a> and
          we&rsquo;ll restore your access.
        </p>
      </Section>
    </LegalPage>
  );
}
