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

const Dpa = () => (
  <>
    <LegalPageHeader title="Data processing addendum" />
    <p className="text-muted-foreground leading-7">
      This addendum is for companies and other organizations that buy{" "}
      {SITE.NAME}. It explains, in plain language, how {SITE.LEGAL.OPERATOR}{" "}
      handles personal data connected to a business purchase. It supplements our{" "}
      <Link to="/terms" className={linkClass}>
        terms of service
      </Link>{" "}
      and{" "}
      <Link to="/privacy" className={linkClass}>
        privacy policy
      </Link>
      , and applies automatically to every business order.
    </p>

    <PageSection title="Scope">
      <p>
        {SITE.NAME} is a set of files that you run with your own coding agent on
        your own machines. We don’t host your code, your components, or the
        videos you render, and we never receive them. The only personal data
        this addendum covers is the small amount needed to sell and deliver the
        pack: mainly the email addresses, GitHub usernames, and sign-in sessions
        of the people at your organization who use it.
      </p>
    </PageSection>

    <PageSection title="Who is responsible for what">
      <PageList>
        <li>
          For data collected through {SITE.DOMAIN} itself (sessions, sign-in
          tokens, request counts, contact messages), we act as the controller.
        </li>
        <li>
          Where a purchase involves data about your staff, such as the address a
          colleague uses to sign in or the GitHub account they link, we use it
          only to deliver and support the purchase you made, and for no other
          purpose.
        </li>
        <li>
          Polar is the merchant of record and handles payment and billing data
          under its own terms as an independent party.
        </li>
      </PageList>
    </PageSection>

    <PageSection title="Subprocessors">
      <p>We rely on the following providers:</p>
      <PageList>
        <li>
          <strong className="text-foreground">Polar</strong>: checkout,
          payments, invoicing, tax, refunds, and repository invites.
        </li>
        <li>
          <strong className="text-foreground">Cloudflare</strong>: hosting,
          database, DNS, email forwarding, and cookieless web analytics.
        </li>
        <li>
          <strong className="text-foreground">Resend</strong>: transactional
          email.
        </li>
        <li>
          <strong className="text-foreground">GitHub</strong>: hosting of the
          private repository.
        </li>
      </PageList>
      <p>
        If we add or swap a subprocessor, this list is updated and the date at
        the top of the page changes.
      </p>
    </PageSection>

    <PageSection title="How the data is protected">
      <PageList>
        <li>All traffic to the site is encrypted with HTTPS.</li>
        <li>
          Session cookies are HttpOnly and Secure, sessions end after 7 days,
          and sign-in links expire after 15 minutes.
        </li>
        <li>
          Access to the production systems, the database, and the repository
          settings is limited to {SITE.LEGAL.OPERATOR}.
        </li>
        <li>
          We collect as little as possible: no passwords, no payment card data,
          no advertising trackers, no analytics cookies, and no copy of the work
          you create.
        </li>
      </PageList>
    </PageSection>

    <PageSection title="Transfers across borders">
      <p>
        We operate from {SITE.LEGAL.JURISDICTION}, and our subprocessors run
        infrastructure in multiple regions, including the United States. Data
        may therefore be processed outside your country. We use providers that
        offer recognized transfer safeguards, such as the EU Standard
        Contractual Clauses, where these are required.
      </p>
    </PageSection>

    <PageSection title="Security incidents">
      <p>
        If we become aware of a breach affecting personal data related to your
        organization, we will notify you without undue delay, tell you what we
        know, and keep you updated on the steps we take in response.
      </p>
    </PageSection>

    <PageSection title="Requests from individuals">
      <p>
        Your staff, or you on their behalf, can ask for access, correction, or
        deletion of their data by writing to <SupportEmail />. If a request
        reaches us that concerns your organization, we will help you respond to
        it.
      </p>
    </PageSection>

    <PageSection title="Deletion">
      <p>
        On request, we delete the user records and sessions linked to your
        organization and remove the associated GitHub accounts from the
        repository, which ends their access. Billing records held by Polar are
        kept for as long as tax law requires.
      </p>
    </PageSection>

    <PageSection title="Getting a signed copy">
      <p>
        If your procurement process needs a countersigned version of this
        addendum, email <SupportEmail /> with your organization’s legal name,
        address, and the email used for the order. We will send back a copy for
        signature.
      </p>
    </PageSection>
  </>
);

export const Route = createFileRoute("/_pages/dpa")({
  component: Dpa,
  head: () => ({
    ...createMetadata({
      canonical: ROUTES.DPA,
      description: `How ${SITE.NAME} processes personal data for business customers.`,
      title: "Data processing addendum",
    }),
    scripts: [breadcrumbJsonLd({ name: "DPA", path: ROUTES.DPA })],
  }),
});
