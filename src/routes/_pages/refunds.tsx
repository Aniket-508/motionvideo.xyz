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
      {SITE.NAME} is sold as a single payment for digital files, handed over
      through access to a private GitHub repository. Since the files can’t be
      returned once you have them, refunds are limited to the situations below.
      This page forms part of our{" "}
      <Link to="/terms" className={linkClass}>
        terms of service
      </Link>
      .
    </p>

    <PageSection title="Situations where you get your money back">
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

    <PageSection title="Withdrawal rights in the EU and UK">
      <p>
        If you’re a consumer in the EU or UK, the law normally lets you cancel a
        digital purchase within 14 days. During checkout you agree to receive
        the pack immediately and confirm you understand that this cancellation
        right is lost once access is delivered. Changing your mind after that
        point is not, by itself, a reason for a refund.
      </p>
      <p>
        Want to keep the 14 days? Don’t claim repository access; email us within
        the period instead.
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
        payment method you used. At the same time, your access to the repository
        is removed.
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
