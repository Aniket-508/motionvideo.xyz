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
      {SITE.NAME} is run by {SITE.LEGAL.OPERATOR}. On this page, “I”, “we”, and
      “us” all mean the same person. These terms apply when you browse{" "}
      {SITE.DOMAIN} or purchase {SITE.NAME}. Completing a purchase means you
      accept them, so please read them first.
    </p>

    <PageSection title="The product in short">
      <p>
        {SITE.NAME} is a pack of agent skills: instruction files plus example
        code. Your own coding agent (Claude Code, Codex, Cursor, Gemini CLI,
        Copilot, and similar tools) reads them and uses them to design and
        animate motion videos, such as showreels, intros, and launch films, from
        code and your own UI components. The videos are rendered on your
        computer with open-source programmatic renderers such as Remotion,
        HyperFrames, Editframe, or fframes.
      </p>
      <p>
        You pay once. Nothing renews, and nothing is shipped. We don’t operate
        an AI model or a video generation service; all of the work happens in
        your tools, on your hardware.
      </p>
    </PageSection>

    <PageSection title="Payment through Polar">
      <p>
        Orders are handled by{" "}
        <a href="https://polar.sh" className={linkClass}>
          Polar
        </a>
        , which acts as the merchant of record. That means Polar is the party
        that takes your payment, sends the invoice, deals with sales tax or VAT,
        and pays out any refund, all under Polar’s own terms. The price is
        displayed before checkout. It may differ from country to country because
        we adjust it for local purchasing power; taxes are added on top where
        they apply.
      </p>
    </PageSection>

    <PageSection title="Getting your copy">
      <p>
        The pack lives in a private GitHub repository. Your purchase comes with
        read-only access to it, which you claim from Polar’s customer portal by
        linking a GitHub account. Without a GitHub account you can’t receive the
        files, so please make sure you have one.
      </p>
      <p>
        Future improvements are pushed to that same repository. You get them at
        no additional charge for as long as the repository is maintained.
      </p>
    </PageSection>

    <PageSection title="Signing in">
      <p>
        You don’t create a password with us. Checkout works as a guest, and when
        you want to come back you request a one-time link at the{" "}
        <Link to="/sign-in" className={linkClass}>
          sign-in page
        </Link>
        . Links are only sent to addresses that have a paid order, and each one
        expires 15 minutes after it is sent. Right after payment, the welcome
        page sends the first link for you. Because the link goes to your
        mailbox, protecting that mailbox is your responsibility.
      </p>
    </PageSection>

    <PageSection title="What your license allows">
      <p>
        Each purchase gives one person a license to the pack. It is
        non-exclusive and you can’t transfer it to someone else. Within that
        license you are free to:
      </p>
      <PageList>
        <li>
          use the skills in as many of your own projects as you like, on any
          machine and with any agent;
        </li>
        <li>use them for work you do for clients;</li>
        <li>
          keep, publish, and sell whatever you create with them. Videos, code,
          and other output belong to you, and we make no claim over them.
        </li>
      </PageList>
    </PageSection>

    <PageSection title="What it doesn’t allow">
      <PageList>
        <li>
          Passing the pack’s files, or any portion of them, to people who
          haven’t bought it, whether for free or for money.
        </li>
        <li>
          Publishing the files, for example in a public repository, template, or
          package.
        </li>
        <li>
          Sharing your repository access or your sign-in links, or trying to get
          around the check that confirms a purchase.
        </li>
        <li>Overloading, scraping, or otherwise disrupting {SITE.DOMAIN}.</li>
        <li>
          Using the pack to make material that is unlawful or infringes on the
          rights of others.
        </li>
      </PageList>
      <p>
        Ownership of the pack itself stays with us. Only the rights listed above
        are granted to you.
      </p>
    </PageSection>

    <PageSection title="Refunds">
      <p>
        When you can get your money back is explained in the{" "}
        <Link to="/refunds" className={linkClass}>
          refund policy
        </Link>
        . A refunded order loses its repository access.
      </p>
    </PageSection>

    <PageSection title="Keeping or losing access">
      <p>
        We may improve, reorganize, or retire parts of the pack, and we may stop
        offering it for sale. Stopping sales does not take access away from
        people who have already paid. We can, however, remove access from an
        order that breaks these terms.
      </p>
    </PageSection>

    <PageSection title="No guarantees about results">
      <p>
        Output from a coding agent varies between runs, models, and codebases,
        so we can’t promise that the pack will produce any specific video for
        you. We sell it in the state it is in, without warranties beyond those
        the law requires. The renderers the skills rely on are third-party
        projects with their own licenses; if your use needs a paid license from
        one of them (a Remotion company license, for instance), getting it is up
        to you.
      </p>
    </PageSection>

    <PageSection title="Limit on liability">
      <p>
        As far as the law permits, the most we will owe you for any claim
        related to {SITE.NAME} is what you paid for it. This does not reduce any
        consumer protection that the law says cannot be signed away.
      </p>
    </PageSection>

    <PageSection title="Disputes">
      <p>
        The laws of {SITE.LEGAL.JURISDICTION} apply to these terms. If a problem
        comes up, please email us before starting any legal process and give us
        30 days to try to sort it out with you.
      </p>
    </PageSection>

    <PageSection title="Updates to this page">
      <p>
        We may revise these terms from time to time and will change the date
        shown above when we do. A revised version applies to orders placed after
        that date.
      </p>
    </PageSection>

    <PageSection title="Questions">
      <p>
        Email <SupportEmail /> and we’ll get back to you.
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
