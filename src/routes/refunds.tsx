import { Link, createFileRoute } from "@tanstack/react-router";

import {
  LegalList,
  LegalPage,
  LegalSection,
  SupportEmail,
  legalHead,
} from "@/components/legal-page";
import { site } from "@/lib/site";

const Refunds = () => (
  <LegalPage title="Refund policy">
    <p className="text-muted-foreground leading-7">
      This policy covers one-time purchases of {site.name}. It sits alongside
      our{" "}
      <Link
        to="/terms"
        className="text-foreground underline underline-offset-4"
      >
        terms of service
      </Link>
      .
    </p>

    <LegalSection title="1. What you are buying">
      <p>
        A digital good delivered as read-only access to a private GitHub
        repository, tied to the email address you used at checkout. There is no
        physical shipment and no subscription. Access includes future updates at
        no extra cost.
      </p>
    </LegalSection>

    <LegalSection title="2. Right of withdrawal for consumers in the EU and UK">
      <p>
        Consumers normally have 14 days to withdraw from a purchase of digital
        content. Because the pack is made available immediately, that right ends
        once delivery starts.
      </p>
      <p>
        By completing checkout you ask us to begin delivery straight away and
        acknowledge that you lose the right of withdrawal once the repository
        access has been made available to you. If you would prefer to keep the
        14-day period, do not accept the repository invite and write to us
        instead.
      </p>
    </LegalSection>

    <LegalSection title="3. Refunds we do give">
      <LegalList>
        <li>
          You were charged twice, or charged for something you did not buy.
        </li>
        <li>
          You never received repository access and we could not fix it for you.
        </li>
        <li>
          The pack does not do what this site says it does, and we cannot
          resolve it with you.
        </li>
      </LegalList>
      <p>
        Where a refund applies, Polar returns the full amount to the original
        payment method. Repository access ends when the refund is issued.
      </p>
    </LegalSection>

    <LegalSection title="4. How to ask">
      <p>
        Write to <SupportEmail /> from the email address you used at checkout
        and tell us what went wrong. We answer every request, usually within two
        working days.
      </p>
    </LegalSection>

    <LegalSection title="5. Chargebacks">
      <p>
        If something is wrong, contact us first. A chargeback opened without
        contacting us suspends access while the bank reviews it, which is slower
        for everyone than a refund we issue directly.
      </p>
    </LegalSection>
  </LegalPage>
);

export const Route = createFileRoute("/refunds")({
  component: Refunds,
  head: () =>
    legalHead(
      "Refund policy",
      `How refunds and the right of withdrawal work for ${site.name}.`
    ),
});
