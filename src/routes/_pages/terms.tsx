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

const Terms = () => (
  <>
    <LegalPageHeader title="Terms of service" />
    <p className="text-muted-foreground leading-7">
      These terms govern your use of {SITE.DOMAIN} and the {SITE.NAME} pack sold
      on it, operated by {SITE.LEGAL.OPERATOR} (“we”, “us”, or “our”). By buying
      or using {SITE.NAME} you agree to them. If you do not agree, do not buy.
    </p>

    <PageSection title="1. What we sell">
      <p>
        {SITE.NAME} is a digital good: a pack of agent skills, which are
        instruction files plus example code that teach a coding agent (Claude
        Code, Codex, Cursor, Antigravity, Copilot, and similar tools) to design
        and animate motion videos, such as showreels, intros, and launch films,
        from code and your own UI components. Videos are rendered on your
        computer with open-source programmatic renderers such as Remotion,
        HyperFrames, Editframe, or fframes.
      </p>
      <p>
        It is a one-time purchase. There is no subscription and no physical
        shipment. We don’t run an AI model or a video generation service; all of
        the work happens in your tools, on your hardware.
      </p>
    </PageSection>

    <PageSection title="2. Buying">
      <p>
        <a href="https://polar.sh" className={linkClass}>
          Polar
        </a>{" "}
        is the merchant of record. Polar runs the checkout, charges you, issues
        your invoice, collects and remits taxes, and processes refunds under its
        own terms. The price is $99, paid once. The price is shown before you
        check out, and taxes are added where they apply.
      </p>
    </PageSection>

    <PageSection title="3. Delivery and access">
      <p>
        The pack lives in a private GitHub repository. After checkout you claim
        read-only access to the repository through the Polar GitHub repository
        access benefit in Polar’s customer portal, using your GitHub account.
        You need a GitHub account to receive the files.
      </p>
      <p>
        There are no passwords. Checkout works as a guest, and to come back you
        request a sign-in link at the{" "}
        <Link to="/sign-in" className={linkClass}>
          sign-in page
        </Link>
        . We only send links to addresses with a paid order, and each link works
        for 15 minutes. Right after payment, the welcome page sends the first
        one for you. Anyone who can read that inbox can open your purchase, so
        keep it secure.
      </p>
      <p>
        Updates pushed to the same repository are included at no extra cost for
        as long as the repository is maintained.
      </p>
    </PageSection>

    <PageSection title="4. License">
      <p>
        When you buy {SITE.NAME}, we grant you a personal, non-exclusive,
        non-transferable license to use its files. The license is per person.
      </p>
      <PageList>
        <li>
          You may use the skills in any project you work on, including client
          work, on any number of machines, and with any agent.
        </li>
        <li>
          You may not share, sell, publish, or otherwise redistribute the pack’s
          files, in whole or in part, for example in a public repository,
          template, or package, or make them available to people who have not
          bought it.
        </li>
        <li>
          What you and your agent make with the pack (videos, code, and other
          output) is yours to keep, publish, and sell. We claim nothing in it.
        </li>
      </PageList>
      <p>We keep every right in the pack and its files not granted here.</p>
    </PageSection>

    <PageSection title="5. Refunds">
      <p>
        Refunds follow our{" "}
        <Link to="/refunds" className={linkClass}>
          refund policy
        </Link>
        . Where a refund applies, Polar returns the amount to the original
        payment method, and repository access, if already granted, ends when the
        refund is issued.
      </p>
    </PageSection>

    <PageSection title="6. Acceptable use">
      <p>You agree not to:</p>
      <PageList>
        <li>Bypass or attempt to bypass the check that confirms a purchase.</li>
        <li>
          Share your sign-in links or repository access with others. A sign-in
          link opens your purchase for whoever holds it until it expires.
        </li>
        <li>Scrape, overload, or otherwise interfere with {SITE.DOMAIN}.</li>
        <li>
          Use the pack to make material that is unlawful or infringes the rights
          of others.
        </li>
      </PageList>
      <p>
        We may remove access from a purchase that is used in breach of these
        terms.
      </p>
    </PageSection>

    <PageSection title="7. Changes to the pack">
      <p>
        We may update, reorganize, or retire parts of the pack over time, and we
        may stop selling it. A purchase made before sales stop keeps its access.
      </p>
    </PageSection>

    <PageSection title="8. Disclaimer and liability">
      <p>
        {SITE.NAME} is provided as is. Coding agents are not deterministic, so
        we do not promise a particular video or result from using the pack. The
        renderers the skills rely on are third-party projects with their own
        licenses; if your use needs a paid license from one of them (a Remotion
        company license, for instance), getting it is up to you.
      </p>
      <p>
        To the extent the law allows, our liability for any claim connected to{" "}
        {SITE.NAME} is limited to the amount you paid for it. Nothing in these
        terms limits rights you have as a consumer that cannot be waived.
      </p>
    </PageSection>

    <PageSection title="9. Governing law">
      <p>
        These terms are governed by the laws of {SITE.LEGAL.JURISDICTION}.
        Before any formal legal action, you agree to contact us and try to
        resolve the matter informally for at least 30 days.
      </p>
    </PageSection>

    <PageSection title="10. Changes to these terms">
      <p>
        We may change these terms. The date at the top says when they last
        changed. Changes apply to purchases made after that date.
      </p>
    </PageSection>

    <PageSection title="11. Contact">
      <p>
        <SupportEmail />
      </p>
    </PageSection>
  </>
);

export const Route = createFileRoute("/_pages/terms")({
  component: Terms,
  head: () => ({
    ...createMetadata({
      canonical: ROUTES.TERMS,
      description: `The rules for purchasing and using ${SITE.NAME}.`,
      title: "Terms of service",
    }),
    scripts: [breadcrumbJsonLd({ name: "Terms", path: ROUTES.TERMS })],
  }),
});
