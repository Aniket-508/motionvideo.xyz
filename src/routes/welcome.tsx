import {
  createFileRoute,
  getRouteApi,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { LoaderIcon, PartyPopperIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { z } from "zod";

import { ConfettiSideCannons } from "@/components/confetti";
import { Brand } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SITE } from "@/constants/site";
import { authClient } from "@/lib/auth-client";
import { createMetadata } from "@/seo/metadata";
import { getCheckoutResult } from "@/server/functions";

interface WelcomeSearch {
  checkout_id?: string;
  preview?: "sent";
}

// Polar confirms the order a moment after it redirects here, so the first
// sign-in attempts can be refused until the order shows as paid.
const SEND_ATTEMPTS = 4;
const RETRY_DELAY_MS = 3000;

const routeApi = getRouteApi("/welcome");

const ThanksHeader = ({
  children,
  preorder,
  released,
}: {
  children: ReactNode;
  preorder: boolean;
  released: boolean;
}) => (
  <EmptyHeader>
    <EmptyMedia className="text-primary">
      <PartyPopperIcon aria-hidden className="size-8" />
    </EmptyMedia>
    <EmptyTitle className="text-base">
      Thanks for {preorder ? "preordering" : "buying"} {SITE.NAME}!
    </EmptyTitle>
    <EmptyDescription className="flex flex-col gap-2">
      {preorder && !released && (
        <span>
          Your prepaid preorder is confirmed. The skill pack and GitHub access
          arrive at launch, not immediately after checkout. Your receipt is
          available in the customer portal now.
        </span>
      )}
      <span>{children}</span>
    </EmptyDescription>
  </EmptyHeader>
);

const SignInLink = ({
  email,
  preorder,
  released,
  preview,
}: {
  email: string;
  preorder: boolean;
  released: boolean;
  preview: boolean;
}) => {
  const started = useRef(false);
  const [status, setStatus] = useState<"sending" | "sent" | "failed">(
    preview ? "sent" : "sending"
  );

  const send = async () => {
    if (preview) {
      return;
    }
    setStatus("sending");
    for (let attempt = 1; attempt <= SEND_ATTEMPTS; attempt += 1) {
      // Retries are sequential on purpose: each waits for Polar to catch up.
      // oxlint-disable-next-line no-await-in-loop
      const { error } = await authClient.signIn.magicLink({
        callbackURL: "/dashboard",
        email,
      });
      if (!error) {
        setStatus("sent");
        return;
      }
      if (attempt < SEND_ATTEMPTS) {
        const { promise, resolve } = Promise.withResolvers<undefined>();
        setTimeout(resolve, RETRY_DELAY_MS);
        // oxlint-disable-next-line no-await-in-loop
        await promise;
      }
    }
    setStatus("failed");
  };

  useEffect(() => {
    if (preview || started.current) {
      return;
    }
    started.current = true;
    void send();
  });

  if (status === "sending") {
    return (
      <ThanksHeader preorder={preorder} released={released}>
        Sending your sign-in link to <strong>{email}</strong>.
      </ThanksHeader>
    );
  }

  if (status === "failed") {
    return (
      <>
        <ThanksHeader preorder={preorder} released={released}>
          Your payment went through, but it hasn’t reached us yet. Try again in
          a moment, or sign in later with <strong>{email}</strong>.
        </ThanksHeader>
        <EmptyContent>
          <Button size="lg" onClick={send}>
            Send the link again
          </Button>
        </EmptyContent>
      </>
    );
  }

  return (
    <ThanksHeader preorder={preorder} released={released}>
      We sent a sign-in link to <strong>{email}</strong>. Open it to view your
      purchase in your dashboard. It expires in 15 minutes, and you can get a
      new one from the sign-in page with the same email.
    </ThanksHeader>
  );
};

const Welcome = () => {
  const checkout = routeApi.useLoaderData();
  const { preview: previewSearch } = routeApi.useSearch();
  const preview = import.meta.env.DEV && previewSearch === "sent";
  const router = useRouter();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Brand />
      <Empty className="w-full max-w-sm flex-none">
        {checkout.succeeded && checkout.email ? (
          <>
            <ConfettiSideCannons />
            <SignInLink
              email={checkout.email}
              preorder={checkout.preorder}
              released={checkout.released}
              preview={preview}
            />
          </>
        ) : (
          <>
            <EmptyHeader>
              <EmptyMedia className="text-muted-foreground">
                <LoaderIcon aria-hidden className="size-8 animate-spin" />
              </EmptyMedia>
              <EmptyTitle className="text-base">
                Confirming your payment
              </EmptyTitle>
              <EmptyDescription>
                This usually takes a few seconds.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" onClick={() => router.invalidate()}>
                Check again
              </Button>
            </EmptyContent>
          </>
        )}
      </Empty>
    </main>
  );
};

export const Route = createFileRoute("/welcome")({
  // Search and deps come before `loader` so their types flow into it.
  // Polar replaces `{CHECKOUT_ID}` in the success URL.
  validateSearch: (search): WelcomeSearch => ({
    checkout_id: z.string().safeParse(search.checkout_id).data,
    preview: search.preview === "sent" ? "sent" : undefined,
  }),
  loaderDeps: ({ search }) => ({
    checkoutId: search.checkout_id,
    preview: search.preview,
  }),
  loader: async ({ deps }) => {
    if (import.meta.env.DEV && deps.preview === "sent") {
      return {
        succeeded: true,
        email: "preview@example.com",
        preorder: true,
        released: false,
      };
    }
    const checkout = deps.checkoutId
      ? await getCheckoutResult({ data: { checkoutId: deps.checkoutId } })
      : null;
    // No or unknown checkout: buyers can still sign in with their email.
    if (!checkout) {
      throw redirect({ to: "/sign-in" });
    }
    return checkout;
  },
  component: Welcome,
  head: () => createMetadata({ noIndex: true, title: "Welcome" }),
});
