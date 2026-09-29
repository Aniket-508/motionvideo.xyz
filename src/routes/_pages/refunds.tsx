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
      {SITE.NAME} is sold as a single payment for a digital pack delivered
      through access to a private GitHub repository. A prepaid preorder costs
      $79 until Thursday, October 1, 2026 (UTC date), or the first 100 paid
      preorders, whichever comes first; afterward the price is $99. The preorder
      pack is delivered at launch, not immediately. This page forms part of our{" "}
      <Link to="/terms" className={linkClass}>
        terms of service
      </Link>
      .
    </p>

    <PageSection title="Before delivery">
      <p>
        If you preordered and the pack has not yet been delivered, email
        <SupportEmail /> to request a refund. You do not need to give a reason.
      </p>
    </PageSection>

    <PageSection title="Other situations where you get your money back">
      <PageList>
        <li>
          A billing mistake: you paid more than once for the same order, or a
          charge appeared that you didn’t make.
        </li>
        <li>
          Repository access never reached you, and we weren’t able to fix the
          problem.
        </li>
        <li>
          The pack fails to work the way this site describes it, and we couldn’t
          get it working together with you.
        </li>
      </PageList>
    </PageSection>

    <PageSection title="After launch">
      <p>
        After launch, claim the Polar GitHub repository access benefit using a
        GitHub account in Polar’s customer portal. Paying for a preorder does
        not give you immediate repository access. If you have a problem after
        delivery, contact us; we will help resolve it under this policy and any
        rights that apply where you live.
      </p>
    </PageSection>

    <PageSection title="Requesting a refund">
      <p>
        Send a short note to <SupportEmail /> explaining the problem. Writing
        from the address you used at checkout helps us find your order quickly.
        You’ll hear back within two working days.
      </p>
    </PageSection>

    <PageSection title="Once a refund is approved">
      <p>
        Polar, as merchant of record, sends the full amount back to the card or
        payment method you used. If repository access has already been
        delivered, it is removed.
      </p>
    </PageSection>

    <PageSection title="Please talk to us before your bank">
      <p>
        Disputing the charge with your bank usually takes weeks, and your access
        may be paused while the dispute is open. An email to us is almost always
        the faster route, so please try that before filing a chargeback.
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
