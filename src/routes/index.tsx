import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { cn } from "cn";

import { DemoFrame } from "@/components/demo-frame";
import { FeatureArt } from "@/components/feature-art";
import { LogoGroup } from "@/components/logo-group";
import { PriceCard } from "@/components/pricing";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { FAQS } from "@/constants/faqs";
import { FEATURES } from "@/constants/features";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { AGENTS, RENDERERS } from "@/constants/stack";
import { STEPS } from "@/constants/steps";
import { VIDEOS } from "@/constants/videos";
import { faqJsonLd, productJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";
import { getLandingData } from "@/server/functions";

const routeApi = getRouteApi("/");

const sectionTitle = "text-2xl font-semibold tracking-tight";

const Landing = () => {
  const { signedIn } = routeApi.useLoaderData();

  return (
    <>
      <SiteHeader signedIn={signedIn} />
      <main
        id="main-content"
        className="flex flex-col gap-24 pt-12 pb-8 sm:pt-20"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6">
          <section className="grid gap-8 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-16">
            <div className="flex flex-col justify-between gap-6">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Motion design,
                <br />
                written in code.
              </h1>
              <div className="flex flex-col gap-3">
                <LogoGroup logos={AGENTS} label="Works with any agent" />
                <LogoGroup logos={RENDERERS} label="Works with any stack" />
              </div>
            </div>
            <div className="flex flex-col justify-between gap-6">
              <p className="text-muted-foreground text-lg text-pretty">
                Agent skills that teach your coding agent real motion design:
                timing, easing, and choreography. Showreels, intros, and launch
                films, rendered from a prompt.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#pricing"
                  className={cn(
                    buttonVariants({ size: "cta", variant: "cta" })
                  )}
                >
                  See pricing
                </a>
                <span className="text-muted-foreground text-sm">
                  One-time purchase
                </span>
              </div>
            </div>
          </section>
          <DemoFrame src={VIDEOS.hero} variant="dashboard" />
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-24 px-6">
          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className={sectionTitle}>
                Motion design without a timeline.
              </h2>
              <p className="text-muted-foreground">
                Good motion is mostly judgment: how long to hold, when things
                overlap, which easing makes a move feel intentional. That
                judgment usually lives in keyframe tools and years of practice.
              </p>
              <p className="text-muted-foreground">
                {SITE.NAME} writes it down for your agent. It storyboards the
                beats, then animates type, shapes, and your own components in
                code, so every frame is reviewable and every change is a
                re-render away.
              </p>
            </div>
            <DemoFrame
              src={VIDEOS.showreel}
              variant="dashboard"
              caption={{
                label: "Portfolio showreel",
                prompt: "A 15s intro reel for my portfolio",
              }}
            />
          </section>

          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className={sectionTitle}>From showreels to launch films.</h2>
              <p className="text-muted-foreground">
                The same skills cover the videos that ship with a product:
                launch films, feature updates, and changelog clips, built from
                the interface you already have instead of a redraw.
              </p>
              <p className="text-muted-foreground">
                You stay in charge of the cut. Review the storyboard, ask for
                changes in plain words, and render again.
              </p>
            </div>
            <DemoFrame
              src={VIDEOS.launch}
              variant="palette"
              caption={{
                label: "shadercn launch film",
                prompt: "A 15s launch film for shadercn",
              }}
            />
          </section>

          <section
            id="how-it-works"
            className="flex scroll-mt-8 flex-col gap-6"
          >
            <h2 className={sectionTitle}>How it works</h2>
            <ol className="flex flex-col gap-3.5">
              {STEPS.map((step, i) => (
                <li key={step} className="flex items-baseline gap-3.5">
                  <span className="text-muted-foreground w-6 shrink-0 font-mono text-sm tabular-nums">
                    0{i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section id="features" className="flex scroll-mt-8 flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className={sectionTitle}>What’s in the pack</h2>
              <p className="text-muted-foreground">
                Everything your agent needs to go from a sentence to a rendered
                file, without starting from a blank composition.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((item) => (
                <div
                  key={item.title}
                  className="bg-card flex flex-col gap-4 rounded-xl border p-4"
                >
                  <FeatureArt kind={item.art} />
                  <div className="flex flex-col gap-1.5 px-1 pb-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="faq" className="flex scroll-mt-8 flex-col gap-6">
            <h2 className={sectionTitle}>FAQ</h2>
            <Accordion>
              {FAQS.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  {/* Roomier rows here only; the shared trigger keeps its default padding. */}
                  {/* oxlint-disable-next-line shadcn/no-restyle */}
                  <AccordionTrigger className="py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section id="pricing" className="flex scroll-mt-8 flex-col gap-8">
            <h2 className={cn(sectionTitle, "text-center")}>
              One price. Every update.
            </h2>
            <PriceCard />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    ...createMetadata({
      canonical: ROUTES.HOME,
      description: SITE.DESCRIPTION.LONG,
    }),
    scripts: [productJsonLd(), faqJsonLd()],
  }),
  loader: () => getLandingData(),
});
