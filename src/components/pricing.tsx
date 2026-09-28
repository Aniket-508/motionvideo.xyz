import { cn } from "cn";
import { CheckIcon, GlobeIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PERKS } from "@/constants/pricing";
import { SITE } from "@/constants/site";
import { formatUsd } from "@/lib/ppp";
import type { Pricing } from "@/server/polar";

export const BuyButton = ({ pricing }: { pricing: Pricing }) => (
  <div className="flex flex-wrap items-center gap-3">
    <a href="/checkout" className={buttonVariants({ size: "lg" })}>
      Get {SITE.NAME} for {formatUsd(pricing.priceCents)}
    </a>
    <span className="text-muted-foreground text-sm">One-time purchase</span>
  </div>
);

export const PppNotice = ({ pricing }: { pricing: Pricing }) => {
  if (pricing.discountPercent === null || pricing.country === null) {
    return null;
  }
  const country =
    new Intl.DisplayNames(["en"], { type: "region" }).of(pricing.country) ??
    pricing.country;
  return (
    <p className="border-primary/40 bg-primary/10 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm">
      <GlobeIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>
        Looks like you’re in {country}. We’ve applied a{" "}
        <strong>{pricing.discountPercent}% purchasing power discount</strong>,
        so it’s {formatUsd(pricing.priceCents)} instead of{" "}
        {formatUsd(pricing.basePriceCents)}.
      </span>
    </p>
  );
};

export const PriceCard = ({ pricing }: { pricing: Pricing }) => {
  const discounted = pricing.priceCents !== pricing.basePriceCents;
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <div className="flex flex-col gap-2">
          <CardTitle>{SITE.NAME}</CardTitle>
          <p className="flex items-baseline gap-2">
            <span className="text-4xl font-semibold tracking-tight">
              {formatUsd(pricing.priceCents)}
            </span>
            {discounted && (
              <span className="text-muted-foreground text-lg line-through">
                {formatUsd(pricing.basePriceCents)}
              </span>
            )}
            <span className="text-muted-foreground text-sm">one time</span>
          </p>
          <PppNotice pricing={pricing} />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2 text-sm">
          {PERKS.map((perk) => (
            <li key={perk} className="flex gap-2">
              <CheckIcon
                aria-hidden
                className="text-primary mt-0.5 size-4 shrink-0"
              />
              {perk}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <a
          href="/checkout"
          className={cn(
            buttonVariants({ className: "w-full", size: "cta", variant: "cta" })
          )}
        >
          Buy now
        </a>
      </CardFooter>
    </Card>
  );
};
