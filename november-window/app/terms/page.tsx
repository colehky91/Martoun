import LegalPage, { Section } from "@/components/LegalPage";

export const metadata = { title: "Terms of Service — The November Window" };

export default function Terms() {
  return (
    <LegalPage eyebrow="The fine print" title="Terms of Service" updated="AUGUST 13, 2026">
      <Section title="1. What this is">
        <p>
          The November Window (&ldquo;we&rdquo;, &ldquo;us&rdquo;, the &ldquo;Site&rdquo;) sells a self-paced
          online course and interactive playbook at thenovemberwindow.com (the &ldquo;Course&rdquo;). By
          purchasing or using the Course you agree to these terms. If you don&rsquo;t agree, please
          don&rsquo;t use the Site.
        </p>
      </Section>

      <Section title="2. Your purchase and access">
        <p>
          The Course is a one-time purchase of US$97.99 that grants you personal, lifetime access to
          the Course content as it exists and as it is updated. &ldquo;Lifetime&rdquo; means the lifetime of
          the product: for as long as we operate the Site.
        </p>
        <p>
          Access is tied to the email address you purchased with. Your account is for you alone —
          sharing login links, reselling access, or redistributing Course content is not permitted
          and may result in your access being suspended.
        </p>
      </Section>

      <Section title="3. Intellectual property">
        <p>
          All Course content — text, structure, checklists, prompts, templates, and video — is our
          intellectual property. You may use it for your own learning and your own business. You may
          not republish, resell, or share it, in whole or in part, without written permission.
        </p>
      </Section>

      <Section title="4. No income guarantees">
        <p>
          The Course teaches content-creation and marketing strategies. Results depend on your
          effort, timing, market conditions, and factors outside anyone&rsquo;s control. We make no
          promises or guarantees of revenue, audience growth, or any particular outcome. Nothing on
          the Site is financial, legal, or professional advice.
        </p>
      </Section>

      <Section title="5. Refunds">
        <p>
          Our refund policy is described on the <a href="/refunds">Refund Policy</a> page and forms
          part of these terms.
        </p>
      </Section>

      <Section title="6. Acceptable use">
        <p>
          Don&rsquo;t attempt to break, probe, or overload the Site; don&rsquo;t access other members&rsquo; data;
          don&rsquo;t use the Site for anything unlawful. We may suspend access that violates these terms.
        </p>
      </Section>

      <Section title="7. Limitation of liability">
        <p>
          To the maximum extent permitted by law, our total liability for any claim relating to the
          Course or the Site is limited to the amount you paid us. We are not liable for indirect,
          incidental, or consequential damages, or for interruptions to the Site outside our
          reasonable control.
        </p>
      </Section>

      <Section title="8. Changes">
        <p>
          We may update these terms from time to time; the &ldquo;last updated&rdquo; date above will change
          when we do. Material changes will be communicated by email or a notice on the Site.
          Continued use of the Course after changes means you accept the updated terms.
        </p>
      </Section>

      <Section title="9. Governing law and contact">
        <p>
          These terms are governed by the laws of Canada. Questions? Email{" "}
          <a href="mailto:access@thenovemberwindow.com">access@thenovemberwindow.com</a> — a human
          reads it.
        </p>
      </Section>
    </LegalPage>
  );
}
