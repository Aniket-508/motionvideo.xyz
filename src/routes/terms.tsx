import { Link, createFileRoute } from "@tanstack/react-router";

import {
  LegalList,
  LegalPage,
  LegalSection,
  SupportEmail,
  legalHead,
} from "@/components/legal-page";
import { site } from "@/lib/site";

const linkClass = "text-foreground underline underline-offset-4";

const Terms = () => (
  <LegalPage title="Terms of service">
    <p className="text-muted-foreground leading-7">
      These terms govern your use of {site.domain} and the digital goods sold on
      it, operated by {site.operator} (“we”, “us”, or “our”). By buying or using
      a good you agree to them. If you do not agree, do not buy.
    </p>

    <LegalSection title="1. What we sell">
      <p>
        We sell {site.name}, a digital good: a pack of agent skills (files that
        teach a coding agent such as Claude Code, Cursor, or Codex how to plan
        and render product videos with Remotion from your own code), a reference
        project, motion presets, and a cursor set. It is a one-time purchase.
        There is no subscription and no physical shipment. We do not host or run
        any AI service: you run the skills with your own agent on your own
        machine.
      </p>
    </LegalSection>

    <LegalSection title="2. Buying">
      <p>
        <a href="https://polar.sh" className={linkClass}>
          Polar
        </a>{" "}
        is the merchant of record. Polar runs the checkout, charges you, issues
        your invoice, collects and remits taxes, and processes refunds under its
        own terms. The price is shown on this site before you check out. Prices
        may be adjusted to local purchasing power based on your country; the
        price you see is the price you pay before tax.
      </p>
    </LegalSection>

    <LegalSection title="3. Delivery and access">
      <p>
        The pack is delivered as read-only access to a private GitHub
        repository. Right after payment, Polar lets you connect your GitHub
        account from its customer portal and sends the repository invite; you
        need a GitHub account to accept it. Polar also emails you a link to the
        portal.
      </p>
      <p>
        There are no passwords. You can return to your purchase at any time by
        signing in on this site with the email address you used at checkout: we
        email a sign-in link to that address, which works for 15 minutes. Anyone
        who can read that inbox can open your purchase, so keep it secure.
        Updates to the pack are pushed to the same repository at no extra cost.
      </p>
    </LegalSection>

    <LegalSection title="4. License">
      <p>
        When you buy the pack, we grant you a personal, non-exclusive,
        non-transferable license to use its files.
      </p>
      <LegalList>
        <li>
          You may use the pack in any repository you work on, on any number of
          machines, with any agent, including for client work.
        </li>
        <li>
          You may not share, sell, publish, or otherwise redistribute the pack’s
          files, in whole or in part, or give access to people who have not
          bought it.
        </li>
        <li>
          What you make with the help of the pack (videos, code, and other
          output) is yours. We claim nothing in it.
        </li>
      </LegalList>
      <p>We keep every right in the pack not granted here.</p>
    </LegalSection>

    <LegalSection title="5. Refunds">
      <p>
        Refunds follow our{" "}
        <Link to="/refunds" className={linkClass}>
          refund policy
        </Link>
        . Where a refund applies, Polar returns the amount to the original
        payment method and repository access ends when the refund is issued.
      </p>
    </LegalSection>

    <LegalSection title="6. Acceptable use">
      <p>You agree not to:</p>
      <LegalList>
        <li>Bypass or attempt to bypass the purchase check.</li>
        <li>Share your sign-in links or repository access with others.</li>
        <li>Interfere with, overload, or scrape the site.</li>
        <li>
          Use the pack to create content that infringes someone else’s rights or
          breaks the law.
        </li>
      </LegalList>
      <p>
        We may end access to a purchase that is used in breach of these terms.
      </p>
    </LegalSection>

    <LegalSection title="7. Changes to the pack">
      <p>
        We may update the pack over time and may stop selling it. A purchase
        made before the pack is withdrawn keeps its access.
      </p>
    </LegalSection>

    <LegalSection title="8. Disclaimer and liability">
      <p>
        The pack is provided as is. Coding agents are not deterministic, so we
        do not promise a particular result from using it. You are responsible
        for any third-party licenses your own use needs, such as a Remotion
        company license. To the extent the law allows, our liability for any
        claim connected to the pack is limited to the amount you paid for it.
        Nothing in these terms limits consumer rights that cannot be waived.
      </p>
    </LegalSection>

    <LegalSection title="9. Governing law">
      <p>
        These terms are governed by the laws of {site.jurisdiction}. Before any
        formal legal action, you agree to contact us and try to resolve the
        matter informally for at least 30 days.
      </p>
    </LegalSection>

    <LegalSection title="10. Changes to these terms">
      <p>
        We may change these terms. The date at the top says when they last
        changed. Changes apply to purchases made after that date.
      </p>
    </LegalSection>

    <LegalSection title="11. Contact">
      <p>
        <SupportEmail />
      </p>
    </LegalSection>
  </LegalPage>
);

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () =>
    legalHead(
      "Terms of service",
      `The terms for buying and using ${site.name}.`
    ),
});
