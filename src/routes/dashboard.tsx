import {
  createFileRoute,
  getRouteApi,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { CircleCheckIcon } from "lucide-react";
import { useState } from "react";

import { BuyButton, PppNotice } from "@/components/pricing";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { site } from "@/lib/site";
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
      <Card>
        <CardHeader>
          <CircleCheckIcon aria-hidden className="text-primary mb-2 size-6" />
          <CardTitle>You own {site.name}</CardTitle>
          <CardDescription>
            Open the customer portal to connect your GitHub account and get
            access to the private skill pack repository. Receipts and invoices
            live there too.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="cta" size="cta" onClick={openPortal} disabled={busy}>
            {busy ? "Opening…" : "Open customer portal"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get {site.name}</CardTitle>
        <CardDescription>
          One-time purchase. You’ll get access to the private skill pack
          repository and every future update.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PppNotice pricing={account.pricing} />
          <BuyButton pricing={account.pricing} />
        </div>
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
  head: () => ({ meta: [{ title: `Dashboard | ${site.domain}` }] }),
  loader: async () => {
    const account = await getAccount();
    if (!account) {
      throw redirect({ search: { redirect: "/dashboard" }, to: "/sign-in" });
    }
    return account;
  },
});
