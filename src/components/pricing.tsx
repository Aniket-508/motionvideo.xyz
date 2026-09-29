import { cn } from "cn";
import { CheckIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BASE_PRICE_CENTS, formatUsd, PERKS } from "@/constants/pricing";
import { SITE } from "@/constants/site";

export const BuyButton = () => (
  <div className="flex flex-wrap items-center gap-4">
    <a href="/checkout" className={buttonVariants({ size: "lg" })}>
      Get {SITE.NAME} for {formatUsd(BASE_PRICE_CENTS)}
    </a>
    <span className="text-muted-foreground text-sm">One-time purchase</span>
  </div>
);

export const PriceCard = () => (
  <Card size="lg" className="mx-auto w-full max-w-sm">
    <CardHeader>
      <div className="flex flex-col gap-3">
        <CardTitle>{SITE.NAME}</CardTitle>
        <p className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold tracking-tight">
            {formatUsd(BASE_PRICE_CENTS)}
          </span>
          <span className="text-muted-foreground text-sm">one time</span>
        </p>
      </div>
    </CardHeader>
    <CardContent>
      <ul className="flex flex-col gap-3 text-sm">
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
    <CardFooter className="border-t-0 bg-transparent pt-0">
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
