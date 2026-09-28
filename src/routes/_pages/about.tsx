import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, PageSection } from "@/components/page";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { withUtm } from "@/lib/utm";
import { breadcrumbJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

const inlineLink = "text-foreground underline underline-offset-4";

const About = () => (
  <>
    <PageHeader
      title={`About ${SITE.NAME}`}
      intro="A small, independent product for developers who would rather write motion than keyframe it."
    />
    <PageSection title="Why it exists">
      <p>
        Motion design makes a portfolio, a launch, or a small update feel
        crafted, but it usually means keyframe tools, a lot of practice, or a
        motion designer’s calendar. Most developers skip it, or settle for a
        screen recording.
      </p>
      <p>
        Coding agents can already write animation code. What they lack is taste:
        how long to hold, what overlaps, which easing feels right. {SITE.NAME}{" "}
        writes that knowledge down so your agent can storyboard and animate
        showreels, intros, and launch films on its own, and redo them whenever
        something changes.
      </p>
    </PageSection>

    <PageSection title="What it is">
      <p>
        {SITE.NAME} is a pack of agent skills: instruction files, scene
        starters, and motion tokens that live in your repository. Your own agent
        reads them, writes the scenes in code, and renders them on your machine
        with an open-source renderer such as Remotion, HyperFrames, Editframe,
        or fframes. There is no hosted service, no credits, and no subscription.
      </p>
    </PageSection>

    <PageSection title="Who makes it">
      <p>
        {SITE.NAME} is built by{" "}
        <a href={withUtm(LINK.AUTHOR_WEBSITE, "about")} className={inlineLink}>
          {SITE.LEGAL.OPERATOR}
        </a>
        , a frontend engineer in {SITE.LEGAL.JURISDICTION} who cares about
        visual craft and runs{" "}
        <a href={withUtm(LINK.SHADCN_LABS, "about")} className={inlineLink}>
          Shadcn Labs
        </a>
        . This website is{" "}
        <a href={LINK.GITHUB_REPO} className={inlineLink}>
          open source
        </a>
        ; the skill pack is sold separately.
      </p>
    </PageSection>
  </>
);

export const Route = createFileRoute("/_pages/about")({
  component: About,
  head: () => ({
    ...createMetadata({
      canonical: ROUTES.ABOUT,
      description: `Why ${SITE.NAME} exists and who makes it.`,
      title: `About ${SITE.NAME}`,
    }),
    scripts: [breadcrumbJsonLd({ name: "About", path: ROUTES.ABOUT })],
  }),
});
