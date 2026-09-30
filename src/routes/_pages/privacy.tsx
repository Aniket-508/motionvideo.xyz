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
      This policy describes what {SITE.LEGAL.OPERATOR} (“we”, “us”, or “our”)
      processes when you visit {SITE.DOMAIN}, buy {SITE.NAME}, sign in, or write
      to us. It is short because the site keeps very little. We do not sell your
      data, and no advertising trackers run on this site.
    </p>

    <PageSection title="1. What we process">
      <PageList>
        <li>
          <strong className="text-foreground">Email address</strong>: you give
          it to Polar at checkout, and to us when you sign in. We use it to find
          your orders at Polar, to send you a sign-in link, and to email you
          about delivery of your purchase. We send nothing to an address that
          has no paid order, and a purchase does not subscribe you to a
          marketing list.
        </li>
        <li>
          <strong className="text-foreground">Order details</strong>: Polar
          holds your orders: what you bought, when, the amount, and your billing
          details. We read them from Polar when needed rather than storing our
          own copy. When you start a checkout we pass your IP address to Polar.
        </li>
        <li>
          <strong className="text-foreground">User record</strong>: on your
          first sign-in we save your email address and the time the record was
          created.
        </li>
        <li>
          <strong className="text-foreground">
            Sign-in links and sessions
          </strong>
          : each emailed link carries a single-use token that works for 15
          minutes. Once you sign in, a session cookie keeps you signed in for 7
          days. It is HttpOnly and Secure, so page scripts can’t read it and it
          only travels over HTTPS. Alongside the session we store the IP address
          and user agent it was opened from. Signing out ends the session.
        </li>
        <li>
          <strong className="text-foreground">GitHub username</strong>: after
          launch, claiming repository access in Polar’s customer portal shares
          your GitHub username with Polar for the invite, and GitHub lists you
          as a collaborator on our private repository, where we can see it.
        </li>
        <li>
          <strong className="text-foreground">Contact form messages</strong>:
          the name, email address, subject, and message you enter, sent to our
          inbox so we can answer you.
        </li>
        <li>
          <strong className="text-foreground">Rate limits</strong>: to keep the
          contact form from being flooded, we count its submissions per IP
          address for one minute.
        </li>
        <li>
          <strong className="text-foreground">Analytics</strong>: we use
          Cloudflare Web Analytics to see how the site is used. When a page
          loads, a script sends the page address, the referring page, your
          browser’s user agent, and page load timings to Cloudflare, which
          reports them to us only as aggregate counts, such as visits per page,
          top referrers, and countries. It sets no cookies, uses no local
          storage, and does not fingerprint you or follow you across sites.
        </li>
      </PageList>
      <p>
        We use this data to carry out the purchase you asked for, to reply when
        you write to us, to keep the site secure, to understand which pages are
        read, and to meet tax and accounting obligations through Polar. Nothing
        is used for advertising or marketing profiles.
      </p>
    </PageSection>

    <PageSection title="2. Who else sees it">
      <PageList>
        <li>
          <strong className="text-foreground">Polar</strong>: the merchant of
          record. Payment, invoices, taxes, refunds, and GitHub repository
          invites happen there under{" "}
          <a href="https://polar.sh/legal/privacy" className={linkClass}>
            Polar’s privacy policy
          </a>
          .
        </li>
        <li>
          <strong className="text-foreground">Cloudflare</strong>: hosts the
          site, our database, DNS, and email forwarding, and sees the IP address
          of every request, as any host does. It also runs the analytics
          described above, under{" "}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            className={linkClass}
          >
            Cloudflare’s privacy policy
          </a>
          .
        </li>
        <li>
          <strong className="text-foreground">Resend</strong>: delivers our
          emails, such as sign-in links and contact form messages.
        </li>
        <li>
          <strong className="text-foreground">GitHub</strong>: hosts the private
          repository that contains the pack.
        </li>
      </PageList>
      <p>
        We share your data with no one else unless the law requires it. Business
        customers can read our{" "}
        <Link to="/dpa" className={linkClass}>
          data processing addendum
        </Link>{" "}
        for more detail. These providers run infrastructure in several
        countries, so your data may be processed outside the country you live
        in; we rely on the transfer safeguards they offer.
      </p>
    </PageSection>

    <PageSection title="3. How long">
      <PageList>
        <li>Sign-in links: 15 minutes.</li>
        <li>Sessions: 7 days, or until you sign out.</li>
        <li>Rate limit counts: one minute.</li>
        <li>User record: until you ask us to delete it.</li>
        <li>
          Contact messages: in our inbox for as long as they help us support
          you, and deleted on request.
        </li>
        <li>
          Orders and invoices: under Polar’s retention rules. Analytics: under
          Cloudflare’s.
        </li>
      </PageList>
    </PageSection>

    <PageSection title="4. Your rights">
      <p>
        Depending on where you live, you may ask what we hold about you, ask us
        to correct it, or ask us to delete it. Write to <SupportEmail /> from
        the email address you used at checkout so we can match it to your order.
        Because your orders live at Polar, we pass deletion requests on to Polar
        too. You can also complain to your local data protection authority. To
        keep your visits out of our analytics, block{" "}
        <code>static.cloudflareinsights.com</code> in your browser or with a
        content blocker.
      </p>
    </PageSection>

    <PageSection title="5. Children">
      <p>
        This site is not intended for children under 13, and we do not knowingly
        process their data. If we learn that we have, we will delete it.
      </p>
    </PageSection>

    <PageSection title="6. Changes to this policy">
      <p>
        We may change this policy. The date at the top says when it last
        changed.
      </p>
    </PageSection>

    <PageSection title="7. Contact">
      <p>
        <SupportEmail />
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
