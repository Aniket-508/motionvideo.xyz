import {
  createFileRoute,
  getRouteApi,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { CircleCheckIcon } from "lucide-react";
import { useState } from "react";

import { BuyButton } from "@/components/pricing";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { PREORDER_LIMIT } from "@/constants/pricing";
import { SITE } from "@/constants/site";
import { authClient } from "@/lib/auth-client";
import { createMetadata } from "@/seo/metadata";
import { getAccount, getPortalUrl } from "@/server/functions";

const routeApi = getRouteApi("/dashboard");

const PurchaseCard = () => {
  const account = routeApi.useLoaderData();
  const { preview: previewSearch } = routeApi.useSearch();
  const preview = import.meta.env.DEV && previewSearch === "purchased";
  const [busy, setBusy] = useState(false);

  let portalLabel = busy ? "Opening…" : "Open customer portal";
  if (preview) {
    portalLabel = "Customer portal (preview)";
  }
  const openPortal = async () => {
    setBusy(true);
    try {
      window.location.href = await getPortalUrl();
    } catch {
      setBusy(false);
    }
  };

  if (account.purchased) {
    return (
      <Empty className="bg-card border border-solid">
        <EmptyHeader>
          <EmptyMedia className="text-primary">
            <CircleCheckIcon aria-hidden className="size-8" />
          </EmptyMedia>
          <EmptyTitle className="text-base">You own {SITE.NAME}</EmptyTitle>
          <EmptyDescription>
            {account.preorder && !account.offer.released
              ? "Your prepaid preorder is confirmed. The skill pack and GitHub access arrive at launch, not immediately after checkout. The customer portal has your receipts and invoices now."
              : "Open the customer portal to connect your GitHub account and get access to the private skill pack repository. Receipts and invoices live there too."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="lg" onClick={openPortal} disabled={busy || preview}>
            {portalLabel}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <Card size="lg">
      <CardHeader>
        <CardTitle>Get {SITE.NAME}</CardTitle>
        <CardDescription>
          {account.offer.released
            ? "One-time purchase. You’ll get access to the private skill pack repository and every future update."
            : "Prepaid preorder. The skill pack and GitHub access arrive at launch, not immediately after checkout. Every future update is included."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BuyButton offer={account.offer} />
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { email } = routeApi.useLoaderData();
  const { preview: previewSearch } = routeApi.useSearch();
  const preview = import.meta.env.DEV && previewSearch === "purchased";
  const navigate = useNavigate();

  const signOut = async () => {
    await authClient.signOut();
    await navigate({ to: "/" });
  };

  return (
    <>
      <SiteHeader signedIn />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm">{email}</p>
          </div>
          {preview ? (
            <span className="text-muted-foreground text-sm">
              Local UI preview
            </span>
          ) : (
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
          )}
        </div>
        <PurchaseCard />
      </main>
      <SiteFooter />
    </>
  );
};

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => createMetadata({ noIndex: true, title: "Dashboard" }),
  validateSearch: (search) => ({
    preview:
      search.preview === "purchased" ? ("purchased" as const) : undefined,
  }),
  loaderDeps: ({ search }) => ({ preview: search.preview }),
  loader: async ({ deps }) => {
    if (import.meta.env.DEV && deps.preview === "purchased") {
      return {
        email: "preview@example.com",
        purchased: true,
        preorder: true,
        offer: {
          active: true,
          sold: 0,
          limit: PREORDER_LIMIT,
          released: false,
        },
      };
    }
    const account = await getAccount();
    if (!account) {
      throw redirect({ search: { redirect: "/dashboard" }, to: "/sign-in" });
    }
    return account;
  },
});
