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

const Privacy = () => (
  <>
    <LegalPageHeader title="Privacy policy" />
    <p className="text-muted-foreground leading-7">
      {SITE.LEGAL.OPERATOR} runs {SITE.DOMAIN} and sells {SITE.NAME}, and is
      responsible for the personal data described below. We collect only what
      the checkout, sign-in, delivery, and contact features need in order to
      work.
    </p>

    <PageSection title="The short version">
      <PageList>
        <li>
          No analytics tools and no advertising trackers run on this site.
        </li>
        <li>We never sell personal data or rent it out.</li>
        <li>
          Card and billing details go to Polar, our merchant of record, and are
          never handled by us.
        </li>
      </PageList>
    </PageSection>

    <PageSection title="Data you give us">
      <PageList>
        <li>
          <strong className="text-foreground">Your email address</strong>, typed
          in at Polar’s checkout or on our sign-in page. We check it against
          your Polar orders and, if a paid order exists, email you a sign-in
          link.
        </li>
        <li>
          <strong className="text-foreground">Contact form messages</strong>:
          the name, email address, and text you enter. The message is sent to
          our inbox so we can answer you.
        </li>
      </PageList>
    </PageSection>

    <PageSection title="Data created as you use the site">
      <PageList>
        <li>
          <strong className="text-foreground">User record.</strong> On your
          first sign-in we save your email address and the time the record was
          created.
        </li>
        <li>
          <strong className="text-foreground">Sign-in tokens.</strong> Each
          emailed link contains a single-use token that stops working after 15
          minutes.
        </li>
        <li>
          <strong className="text-foreground">Sessions.</strong> Once signed in,
          your browser holds a session cookie for 7 days. The cookie is flagged
          HttpOnly and Secure, meaning page scripts can’t read it and it only
          travels over HTTPS. Alongside the session we store the IP address and
          user agent it was opened from. Signing out removes the session.
        </li>
        <li>
          <strong className="text-foreground">Abuse protection.</strong> We keep
          a per-IP count of requests for one minute so forms can’t be flooded.
        </li>
        <li>
          <strong className="text-foreground">Country and IP address.</strong>{" "}
          Cloudflare tells us which country each visit comes from, and we use
          that to pick a price adjusted for purchasing power. When you start a
          checkout we pass your country and IP address to Polar.
        </li>
      </PageList>
    </PageSection>

    <PageSection title="Data we see from partners">
      <PageList>
        <li>
          <strong className="text-foreground">Orders.</strong> Polar keeps the
          record of what you bought, the amount, the date, and your billing
          information. We look orders up at Polar when needed rather than
          storing our own copy.
        </li>
        <li>
          <strong className="text-foreground">GitHub username.</strong> Claiming
          repository access sends your GitHub username to Polar, which issues
          the invite. From then on GitHub lists you as a collaborator on our
          private repository, so we can see your username there.
        </li>
      </PageList>
    </PageSection>

    <PageSection title="Why we use it">
      <p>
        We use this data to carry out the purchase you asked for (letting you
        sign in and giving you the files), to reply when you write to us, to
        keep the site secure, and to meet tax and accounting obligations through
        Polar. Nothing is used for marketing profiles or advertising.
      </p>
    </PageSection>

    <PageSection title="Service providers">
      <p>A few companies process data for us, each for one job:</p>
      <PageList>
        <li>
          <strong className="text-foreground">Polar</strong>: checkout,
          payments, invoices, tax, refunds, and GitHub repository invites.
          Polar’s handling is described in its{" "}
          <a href="https://polar.sh/legal/privacy" className={linkClass}>
            privacy policy
          </a>
          .
        </li>
        <li>
          <strong className="text-foreground">Cloudflare</strong>: website
          hosting, our database, DNS, and forwarding of email sent to our
          address. As the host, it receives the IP address of every visit.
        </li>
        <li>
          <strong className="text-foreground">Resend</strong>: sending
          transactional email, such as sign-in links and contact form messages.
        </li>
        <li>
          <strong className="text-foreground">GitHub</strong>: hosting the
          private repository that contains the pack.
        </li>
      </PageList>
      <p>
        Beyond these providers, we disclose personal data only where a law
        compels us to. Business customers can read our{" "}
        <Link to="/dpa" className={linkClass}>
          data processing addendum
        </Link>{" "}
        for more detail.
      </p>
    </PageSection>

    <PageSection title="Retention">
      <PageList>
        <li>Sign-in tokens: 15 minutes.</li>
        <li>Sessions: 7 days, or less if you sign out.</li>
        <li>Per-IP request counts: one minute.</li>
        <li>User record: until you ask us to remove it.</li>
        <li>
          Contact messages: kept in our inbox for as long as they’re useful for
          supporting you, and deleted on request.
        </li>
        <li>Orders and invoices: according to Polar’s retention rules.</li>
      </PageList>
    </PageSection>

    <PageSection title="International transfers">
      <p>
        Our providers run infrastructure in several countries, so your data may
        be processed outside the country you live in. We rely on the safeguards
        those providers offer for such transfers.
      </p>
    </PageSection>

    <PageSection title="Your rights">
      <p>
        Subject to the law where you live, you can ask for a copy of the data we
        hold about you, have it corrected, or have it erased. Send the request
        to <SupportEmail />, ideally from the email address you checked out with
        so we can match it to your order. Where part of the data sits with
        Polar, we will pass the request on to them. You can also complain to
        your local data protection authority.
      </p>
    </PageSection>

    <PageSection title="Children">
      <p>
        {SITE.NAME} is meant for adults and professionals. If we learn that a
        child under 13 has given us personal data, we will delete it.
      </p>
    </PageSection>

    <PageSection title="Revisions">
      <p>
        When this policy changes, we update the date shown at the top of the
        page.
      </p>
    </PageSection>

    <PageSection title="Reaching us">
      <p>
        Privacy questions go to <SupportEmail />.
      </p>
    </PageSection>
  </>
);

export const Route = createFileRoute("/_pages/privacy")({
  component: Privacy,
  head: () => ({
    ...createMetadata({
      canonical: ROUTES.PRIVACY,
      description: `The personal data ${SITE.NAME} collects, why, and for how long.`,
      title: "Privacy policy",
    }),
    scripts: [breadcrumbJsonLd({ name: "Privacy", path: ROUTES.PRIVACY })],
  }),
});
