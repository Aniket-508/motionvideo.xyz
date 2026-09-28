import { createFileRoute } from "@tanstack/react-router";

import {
  LegalList,
  LegalPage,
  LegalSection,
  SupportEmail,
  legalHead,
} from "@/components/legal-page";
import { site } from "@/lib/site";

const linkClass = "text-foreground underline underline-offset-4";

const Privacy = () => (
  <LegalPage title="Privacy policy">
    <p className="text-muted-foreground leading-7">
      This policy describes what {site.operator} (“we”, “us”, or “our”)
      processes when you visit {site.domain}, buy {site.name}, or sign in to
      your purchase. It is short because the site keeps very little.
    </p>

    <LegalSection title="1. What we process">
      <LegalList>
        <li>
          <strong className="text-foreground">Email address.</strong> You give
          it to Polar at checkout, and to us when you sign in. We use it to look
          up your orders at Polar and to send you a sign-in link. We send
          nothing to an address without a purchase, and nothing but sign-in
          links to one with a purchase.
        </li>
        <li>
          <strong className="text-foreground">Account record.</strong> The first
          time you sign in we store your email address and when you signed up,
          so your session can refer to you.
        </li>
        <li>
          <strong className="text-foreground">Order details.</strong> Polar
          holds your orders: what you bought, when, the amount, and your billing
          details. We read them from Polar to show your purchase and do not keep
          a copy.
        </li>
        <li>
          <strong className="text-foreground">Session cookie.</strong> After you
          sign in, a session cookie keeps you signed in for 7 days. It is not
          readable by scripts and is only sent over HTTPS. We store the session
          with the IP address and browser user agent it was created from.
          Signing out deletes it.
        </li>
        <li>
          <strong className="text-foreground">Sign-in links.</strong> Each link
          carries a one-time token that expires after 15 minutes.
        </li>
        <li>
          <strong className="text-foreground">Country and IP address.</strong>{" "}
          Our host tells us which country a request comes from. We use it to
          show a price adjusted to local purchasing power, and pass the country
          and your IP address to Polar when you start a checkout.
        </li>
        <li>
          <strong className="text-foreground">Rate limits.</strong> To stop the
          sign-in form from being abused, we count sign-in requests per IP
          address for one minute.
        </li>
        <li>
          <strong className="text-foreground">GitHub username.</strong> When you
          claim repository access, Polar receives your GitHub username to send
          the invite, and GitHub shows it to us as a collaborator on the private
          repository.
        </li>
      </LegalList>
      <p>We run no analytics and no advertising trackers.</p>
    </LegalSection>

    <LegalSection title="2. Who else sees it">
      <LegalList>
        <li>
          <strong className="text-foreground">Polar</strong>, the merchant of
          record: payments, invoices, taxes, refunds, and repository invites
          happen there under{" "}
          <a href="https://polar.sh/legal/privacy" className={linkClass}>
            Polar’s privacy policy
          </a>
          .
        </li>
        <li>
          <strong className="text-foreground">Cloudflare</strong> hosts the site
          and its database, and sees the IP address of every request.
        </li>
        <li>
          <strong className="text-foreground">Resend</strong> delivers sign-in
          emails.
        </li>
        <li>
          <strong className="text-foreground">GitHub</strong> hosts the private
          repository you get access to.
        </li>
      </LegalList>
      <p>
        We do not sell your data and share it with no one else unless the law
        requires it.
      </p>
    </LegalSection>

    <LegalSection title="3. How long">
      <p>
        Sessions last 7 days or until you sign out, sign-in links 15 minutes,
        and rate-limit counts one minute. Your account record stays until you
        ask us to delete it. Polar keeps your orders under its own retention
        rules.
      </p>
    </LegalSection>

    <LegalSection title="4. Your rights">
      <p>
        Depending on where you live, you may ask what we hold about you, ask us
        to correct it, or ask us to delete it. Write to <SupportEmail /> from
        the email address you used at checkout. Because your orders live at
        Polar, we forward deletion requests to Polar too.
      </p>
    </LegalSection>

    <LegalSection title="5. Children">
      <p>
        This site is not intended for children under 13, and we do not knowingly
        process their data.
      </p>
    </LegalSection>

    <LegalSection title="6. Changes to this policy">
      <p>
        We may change this policy. The date at the top says when it last
        changed.
      </p>
    </LegalSection>

    <LegalSection title="7. Contact">
      <p>
        <SupportEmail />
      </p>
    </LegalSection>
  </LegalPage>
);

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () =>
    legalHead(
      "Privacy policy",
      `What ${site.domain} processes when you buy or sign in.`
    ),
});
