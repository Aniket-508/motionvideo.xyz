import { Link, createFileRoute, getRouteApi } from "@tanstack/react-router";
import { cn } from "cn";

import { DemoFrame } from "@/components/demo-frame";
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
import {
  agents,
  faqs,
  includes,
  renderers,
  site,
  steps,
  videos,
} from "@/lib/site";
import { getLandingData } from "@/server/functions";

const routeApi = getRouteApi("/");

const Landing = () => {
  const { pricing, signedIn } = routeApi.useLoaderData();

  return (
    <>
      <SiteHeader signedIn={signedIn} />
      <main
        id="main-content"
        className="flex flex-col gap-24 pt-12 pb-16 sm:pt-20"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6">
          <section className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-12">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Motion videos,
                <br />
                animated by your agent.
              </h1>
              <div className="flex flex-col gap-3">
                <LogoGroup logos={agents} label="Works with any agent" />
                <LogoGroup logos={renderers} label="Works with any stack" />
              </div>
            </div>
            <div className="flex flex-col gap-6 md:pt-2">
              <p className="text-muted-foreground text-lg text-pretty">
                A skill pack for the coding agent you already use. Add it to
                your repo and it renders videos from your real components. One
                prompt in, a polished product video out.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#pricing"
                  className={cn(
                    buttonVariants({ size: "cta", variant: "cta" })
                  )}
                >
                  Generate now
                </a>
                <span className="text-muted-foreground text-sm">
                  One-time purchase
                </span>
              </div>
            </div>
          </section>
          <DemoFrame src={videos.hero} variant="dashboard" />
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-24 px-6">
          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Product videos are hard.
              </h2>
              <p className="text-muted-foreground">
                Proper motion design used to mean After Effects or hiring a
                motion designer. So you screen-record instead: clean desktop,
                notifications off, a rehearsed cursor path. It never quite looks
                right.
              </p>
              <p className="text-muted-foreground">
                And a recording undersells the product. Washed-out colors,
                uneven pacing, and it’s out of date one sprint later.
              </p>
            </div>
            <DemoFrame
              src={videos.walkthrough}
              variant="dashboard"
              caption={{
                label: "Feature walkthrough",
                prompt: "Show off our new analytics dashboard",
              }}
            />
          </section>

          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Let your agent do the motion design.
              </h2>
              <p className="text-muted-foreground">
                {site.name} teaches it the craft: a set of skills, a reference
                film to learn from, and tuned presets. It writes the story
                first, then rebuilds each screen with your real tokens,
                components, and icons.
              </p>
              <p className="text-muted-foreground">
                It animates with tuned camera and motion presets and reviews its
                own frames before rendering. Prompt in, finished video out.
              </p>
            </div>
            <DemoFrame
              src={videos.teaser}
              variant="palette"
              caption={{
                label: "Launch teaser",
                prompt: "Make a 10s teaser for the command palette",
              }}
            />
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              How it works
            </h2>
            <ol className="flex flex-col gap-4">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                What’s included
              </h2>
              <p className="text-muted-foreground">
                More than a prompt. Your agent starts from worked examples, not
                a blank file.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {includes.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-2 rounded-xl border p-5"
                >
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.body}</p>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              Renders with{" "}
              {renderers.map((renderer) => renderer.name).join(", ")}.
            </p>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold tracking-tight">Questions</h2>
            <Accordion>
              {faqs.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section id="pricing" className="flex flex-col gap-8">
            <h2 className="text-center text-2xl font-semibold tracking-tight">
              Buy once, keep it forever.
            </h2>
            <PriceCard pricing={pricing} />
            <p className="text-muted-foreground text-center text-sm">
              Prices in USD. Taxes are calculated at checkout by Polar, our
              merchant of record. See the{" "}
              <Link
                to="/refunds"
                className="text-foreground underline underline-offset-4"
              >
                refund policy
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

export const Route = createFileRoute("/")({
  component: Landing,
  loader: () => getLandingData(),
});
