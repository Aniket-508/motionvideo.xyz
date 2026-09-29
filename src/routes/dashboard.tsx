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
import { SITE } from "@/constants/site";
import { authClient } from "@/lib/auth-client";
import { createMetadata } from "@/seo/metadata";
import { getAccount, getPortalUrl } from "@/server/functions";

const routeApi = getRouteApi("/dashboard");

const PurchaseCard = () => {
  const account = routeApi.useLoaderData();
  const [busy, setBusy] = useState(false);

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
      <Empty>
        <EmptyHeader>
          <EmptyMedia className="text-primary">
            <CircleCheckIcon aria-hidden className="size-8" />
          </EmptyMedia>
          <EmptyTitle className="text-base">You own {SITE.NAME}</EmptyTitle>
          <EmptyDescription>
            Open the customer portal to connect your GitHub account and get
            access to the private skill pack repository. Receipts and invoices
            live there too.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="lg" onClick={openPortal} disabled={busy}>
            {busy ? "Opening…" : "Open customer portal"}
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
          One-time purchase. You’ll get access to the private skill pack
          repository and every future update.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BuyButton />
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { email } = routeApi.useLoaderData();
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
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
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
  loader: async () => {
    const account = await getAccount();
    if (!account) {
      throw redirect({ search: { redirect: "/dashboard" }, to: "/sign-in" });
    }
    return account;
  },
});
