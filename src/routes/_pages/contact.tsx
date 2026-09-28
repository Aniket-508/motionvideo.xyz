import { createFileRoute } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";

import { PageHeader } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LINK } from "@/constants/links";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { contactSchema } from "@/lib/contact";
import { breadcrumbJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";
import { sendContactMessage } from "@/server/functions";

const inlineLink = "text-foreground underline underline-offset-4";

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = contactSchema.safeParse({
      email: form.get("email"),
      message: form.get("message"),
      name: form.get("name"),
      website: form.get("website") ?? "",
    });
    if (!input.success) {
      setError(
        "Add your name, a valid email, and a message of at least 10 characters."
      );
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      const result = await sendContactMessage({ data: input.data });
      if (!result.ok) {
        setStatus("idle");
        setError(result.error);
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError(
        `Your message couldn’t be sent. Please email ${LINK.EMAIL} instead.`
      );
    }
  };

  // ⌘/Ctrl + Enter sends from the message box.
  const onMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <>
      <PageHeader
        title="Contact"
        intro="Questions about the pack, a purchase, or a partnership? Send a message and we’ll reply by email."
      />
      {status === "sent" ? (
        <div className="bg-muted/50 flex items-start gap-3 rounded-xl p-5">
          <CheckIcon aria-hidden className="text-primary mt-0.5 size-5" />
          <div className="flex flex-col gap-1">
            <p className="font-medium">Message sent</p>
            <p className="text-muted-foreground text-sm">
              Thanks for writing. We usually reply within two working days.
            </p>
          </div>
        </div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                maxLength={100}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={6}
              className="min-h-36"
              onKeyDown={onMessageKeyDown}
            />
          </div>
          {/* Honeypot: hidden from people and assistive tech. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />
          {error && (
            <p role="alert" className="text-destructive text-sm">
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" size="lg" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send message"}
            </Button>
            <span className="text-muted-foreground text-sm">
              or press ⌘ Enter
            </span>
          </div>
        </form>
      )}

      <p className="text-muted-foreground">
        Prefer something else? Email{" "}
        <a href={`mailto:${LINK.EMAIL}`} className={inlineLink}>
          {LINK.EMAIL}
        </a>{" "}
        or send a DM on X to{" "}
        <a href={LINK.X} className={inlineLink}>
          {SITE.AUTHOR.TWITTER}
        </a>
        .
      </p>
    </>
  );
};

export const Route = createFileRoute("/_pages/contact")({
  component: Contact,
  head: () => ({
    ...createMetadata({
      canonical: ROUTES.CONTACT,
      description: `Get in touch with the team behind ${SITE.NAME}.`,
      title: "Contact",
    }),
    scripts: [breadcrumbJsonLd({ name: "Contact", path: ROUTES.CONTACT })],
  }),
});
