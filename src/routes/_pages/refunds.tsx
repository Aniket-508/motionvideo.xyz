import { Link, createFileRoute } from "@tanstack/react-router";

import {
  LegalPageHeader,
  PageList,
  PageSection,
  SupportEmail,
} from "@/components/page";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { breadcrumbJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

const linkClass = "text-foreground underline underline-offset-4";

const Refunds = () => (
  <>
    <LegalPageHeader title="Refund policy" />
    <p className="text-muted-foreground leading-7">
      This policy covers one-time purchases of {SITE.NAME}, sold by{" "}
      {SITE.LEGAL.OPERATOR}. It sits alongside our{" "}
      <Link to="/terms" className={linkClass}>
        terms of service
      </Link>
      .
    </p>

    <PageSection title="1. What you are buying">
      <p>
        {SITE.NAME} is a digital pack delivered as read-only access to a private
        GitHub repository. There is no physical shipment and no subscription.
        Prepaid preorders cost $79 until Friday, October 2, 2026, 9:00 AM ET, or
        the first 100 paid preorders, whichever comes first; afterward the price
        is $99. A preorder is delivered at the October 2, 2026 launch, not
        immediately: after launch you claim repository access with your GitHub
        account in Polar’s customer portal. Access includes future updates to
        the same repository at no extra cost.
      </p>
    </PageSection>

    <PageSection title="2. Before delivery">
      <p>
        Until you have claimed repository access, you can cancel a preorder for
        a full refund. Write to <SupportEmail />; you do not need to give a
        reason.
      </p>
    </PageSection>

    <PageSection title="3. Right of withdrawal for consumers in the EU and UK">
      <p>
        Consumers normally have 14 days to withdraw from a purchase of digital
        content. Because the pack is digital content, that right ends once
        delivery starts.
      </p>
      <p>
        By claiming repository access, you ask us to begin delivery and
        acknowledge that you lose the right of withdrawal once access has been
        granted to you. If you would prefer to keep the 14-day period, do not
        claim access and write to us instead.
      </p>
    </PageSection>

    <PageSection title="4. Refunds we do give after delivery">
      <PageList>
        <li>
          You were charged twice, or charged for something you did not buy.
        </li>
        <li>
          Repository access never reached you, and we could not fix it for you.
        </li>
        <li>
          The pack does not do what this site says it does, and we cannot
          resolve it with you.
        </li>
      </PageList>
      <p>
        Where a refund applies, Polar, as merchant of record, returns the full
        amount to the original payment method. Repository access, if already
        granted, ends when the refund is issued. This does not limit any rights
        you have under the law where you live.
      </p>
    </PageSection>

    <PageSection title="5. How to ask">
      <p>
        Write to <SupportEmail /> from the email address you used at checkout
        and tell us what went wrong. We answer every request, usually within two
        working days.
      </p>
    </PageSection>

    <PageSection title="6. Chargebacks">
      <p>
        If something is wrong, contact us first. A chargeback opened without
        contacting us suspends access to the pack while the bank reviews it,
        which is slower for everyone than a refund we issue directly.
      </p>
    </PageSection>
  </>
);

export const Route = createFileRoute("/_pages/refunds")({
  component: Refunds,
  head: () => ({
    ...createMetadata({
      canonical: ROUTES.REFUNDS,
      description: `When ${SITE.NAME} purchases can be refunded and how to ask.`,
      title: "Refund policy",
    }),
    scripts: [breadcrumbJsonLd({ name: "Refunds", path: ROUTES.REFUNDS })],
  }),
});
