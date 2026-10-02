import { cn } from "cn";
import { CheckIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { formatUsd, PERKS, PRICE_CENTS } from "@/constants/pricing";

const buyLabel = `Buy now for ${formatUsd(PRICE_CENTS)}`;

export const BuyButton = () => (
  <div className="flex flex-wrap items-center gap-4">
    <a href="/checkout" className={buttonVariants({ size: "lg" })}>
      {buyLabel}
    </a>
    <span className="text-muted-foreground text-sm">One-time purchase</span>
  </div>
);

export const PriceCard = () => (
  <Card size="lg" className="mx-auto w-full max-w-sm">
    <CardHeader>
      <p className="flex flex-wrap items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-tight">
          {formatUsd(PRICE_CENTS)}
        </span>
        <span className="text-muted-foreground text-sm">one time</span>
      </p>
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
        {buyLabel}
      </a>
    </CardFooter>
  </Card>
);
