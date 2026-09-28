import { Link, createFileRoute, getRouteApi } from "@tanstack/react-router";
import { MailCheckIcon } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { z } from "zod";

import { Logomark } from "@/components/logomark";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { site } from "@/lib/site";

interface SignInSearch {
  error?: string;
  redirect?: string;
}

const routeApi = getRouteApi("/sign-in");

// Same-origin paths only, never "//evil.com".
const safeRedirect = z
  .string()
  .startsWith("/")
  .refine((path) => !path.startsWith("//"));

const SignIn = () => {
  const search = routeApi.useSearch();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(
    search.error
      ? "That sign-in link is invalid or expired. Request a new one."
      : null
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    const callbackURL = search.redirect ?? "/dashboard";
    const { error: sendError } = await authClient.signIn.magicLink({
      email,
      callbackURL,
      errorCallbackURL: `/sign-in?redirect=${encodeURIComponent(callbackURL)}`,
    });
    if (sendError) {
      setStatus("idle");
      setError(
        sendError.message ?? "Could not send the sign-in link. Try again."
      );
      return;
    }
    setStatus("sent");
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Link
        to="/"
        className="flex items-center gap-2 font-semibold tracking-tight"
      >
        <Logomark className="h-5 w-auto" />
        {site.domain}
      </Link>
      <Card className="w-full max-w-sm">
        {status === "sent" ? (
          <CardHeader>
            <MailCheckIcon aria-hidden className="mb-2 size-6" />
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a sign-in link to <strong>{email}</strong>. It expires in
              15 minutes.
            </CardDescription>
          </CardHeader>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Enter your email and we’ll send you a sign-in link. No password
                needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                {error && (
                  <p role="alert" className="text-destructive text-sm">
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  variant="cta"
                  size="cta"
                  disabled={status === "sending"}
                >
                  {status === "sending"
                    ? "Sending…"
                    : "Email me a sign-in link"}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  );
};

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
  head: () => ({ meta: [{ title: `Sign in | ${site.domain}` }] }),
  validateSearch: (search): SignInSearch => ({
    error: z.string().safeParse(search.error).data,
    redirect: safeRedirect.safeParse(search.redirect).data,
  }),
});
