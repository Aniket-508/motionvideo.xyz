import {
  createFileRoute,
  getRouteApi,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { LoaderIcon, MailCheckIcon, PartyPopperIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { Brand } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { site } from "@/lib/site";
import { getCheckoutResult } from "@/server/functions";

interface WelcomeSearch {
  checkout_id?: string;
}

// Polar confirms the order a moment after it redirects here, so the first
// sign-in attempts can be refused until the order shows as paid.
const SEND_ATTEMPTS = 4;
const RETRY_DELAY_MS = 3000;

const routeApi = getRouteApi("/welcome");

const SignInLink = ({ email }: { email: string }) => {
  const started = useRef(false);
  const [status, setStatus] = useState<"sending" | "sent" | "failed">(
    "sending"
  );

  const send = async () => {
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
    if (started.current) {
      return;
    }
    started.current = true;
    void send();
  });

  if (status === "sending") {
    return (
      <CardHeader>
        <LoaderIcon aria-hidden className="mb-2 size-6 animate-spin" />
        <CardTitle>Sending your sign-in link</CardTitle>
        <CardDescription>
          Emailing a sign-in link to <strong>{email}</strong>.
        </CardDescription>
      </CardHeader>
    );
  }

  if (status === "failed") {
    return (
      <>
        <CardHeader>
          <CardTitle>We couldn’t send the link yet</CardTitle>
          <CardDescription>
            Your payment went through, but it hasn’t reached us yet. Try again
            in a moment, or sign in later with <strong>{email}</strong>.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="cta" size="cta" onClick={send}>
            Send the link again
          </Button>
        </CardFooter>
      </>
    );
  }

  return (
    <CardHeader>
      <MailCheckIcon aria-hidden className="mb-2 size-6" />
      <CardTitle>Check your email</CardTitle>
      <CardDescription>
        We sent a sign-in link to <strong>{email}</strong>. Open it to get your
        purchase. It expires in 15 minutes, and you can always get a new one
        from the sign-in page with the same email.
      </CardDescription>
    </CardHeader>
  );
};

const Welcome = () => {
  const checkout = routeApi.useLoaderData();
  const router = useRouter();

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Brand />
      <Card className="w-full max-w-sm">
        {checkout.succeeded && checkout.email ? (
          <>
            <CardHeader>
              <PartyPopperIcon aria-hidden className="mb-2 size-6" />
              <CardTitle>Thanks for buying {site.name}!</CardTitle>
            </CardHeader>
            <SignInLink email={checkout.email} />
          </>
        ) : (
          <>
            <CardHeader>
              <LoaderIcon aria-hidden className="mb-2 size-6 animate-spin" />
              <CardTitle>Confirming your payment</CardTitle>
              <CardDescription>
                This usually takes a few seconds.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" onClick={() => router.invalidate()}>
                Check again
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </main>
  );
};

export const Route = createFileRoute("/welcome")({
  // Search and deps come before `loader` so their types flow into it.
  // Polar replaces `{CHECKOUT_ID}` in the success URL.
  validateSearch: (search): WelcomeSearch => ({
    checkout_id: z.string().safeParse(search.checkout_id).data,
  }),
  loaderDeps: ({ search }) => ({ checkoutId: search.checkout_id }),
  loader: async ({ deps }) => {
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
  head: () => ({
    meta: [
      { title: `Welcome | ${site.name}` },
      { content: "noindex", name: "robots" },
    ],
  }),
});
