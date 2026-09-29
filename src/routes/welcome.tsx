import {
  createFileRoute,
  getRouteApi,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { LoaderIcon, MailCheckIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { z } from "zod";

import { ConfettiSideCannons } from "@/components/confetti";
import {
  AuthCard,
  LinkSentMessage,
  SignInPanel,
  StatusPanel,
} from "@/components/login-form";
import { Button } from "@/components/ui/button";
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

// Stacked under the invisible sign-in form so this page keeps the exact size
// of /sign-in.
const ThanksView = ({
  children,
  icon,
  preorder,
  action,
}: {
  children: ReactNode;
  icon: ReactNode;
  preorder: boolean;
  action?: ReactNode;
}) => (
  <StatusPanel
    action={action}
    icon={icon}
    title={`Thanks for ${preorder ? "preordering" : "buying"} ${SITE.NAME}!`}
  >
    {children}
  </StatusPanel>
);

const SignInLink = ({
  email,
  preorder,
  preview,
}: {
  email: string;
  preorder: boolean;
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
      <ThanksView
        icon={
          <LoaderIcon aria-hidden className="size-8 animate-spin text-black" />
        }
        preorder={preorder}
      >
        Sending your sign-in link to <strong>{email}</strong>.
      </ThanksView>
    );
  }

  if (status === "failed") {
    return (
      <ThanksView
        icon={<MailCheckIcon aria-hidden className="size-8 text-black" />}
        preorder={preorder}
        action={
          <Button size="lg" onClick={send}>
            Send the link again
          </Button>
        }
      >
        Your payment went through, but it hasn’t reached us yet. Try again in a
        moment, or sign in later with <strong>{email}</strong>.
      </ThanksView>
    );
  }

  return (
    <ThanksView
      icon={<MailCheckIcon aria-hidden className="size-8 text-black" />}
      preorder={preorder}
    >
      <LinkSentMessage email={email} />
    </ThanksView>
  );
};

const Welcome = () => {
  const checkout = routeApi.useLoaderData();
  const { preview: previewSearch } = routeApi.useSearch();
  const preview = import.meta.env.DEV && previewSearch === "sent";
  const router = useRouter();

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <AuthCard>
        <SignInPanel
          hidden
          email=""
          error={null}
          onEmailChange={() => null}
          onSubmit={(event) => event.preventDefault()}
          status="idle"
        />
        {checkout.succeeded && checkout.email ? (
          <>
            <ConfettiSideCannons />
            <SignInLink
              email={checkout.email}
              preorder={checkout.preorder}
              preview={preview}
            />
          </>
        ) : (
          <StatusPanel
            icon={
              <LoaderIcon
                aria-hidden
                className="size-8 animate-spin text-black"
              />
            }
            title="Confirming your payment"
            action={
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.invalidate()}
              >
                Check again
              </Button>
            }
          >
            This usually takes a few seconds.
          </StatusPanel>
        )}
      </AuthCard>
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
