import type { ReactNode } from "react";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { site } from "@/lib/site";

export const LegalPage = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <>
    <SiteHeader signedIn={false} />
    <main
      id="main-content"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16 sm:py-24"
    >
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">
          Last updated: {site.legalUpdatedAt}
        </p>
      </header>
      {children}
    </main>
    <SiteFooter />
  </>
);

export const LegalSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="text-muted-foreground flex flex-col gap-4 leading-7">
    <h2 className="text-foreground text-xl font-semibold tracking-tight">
      {title}
    </h2>
    {children}
  </section>
);

export const LegalList = ({ children }: { children: ReactNode }) => (
  <ul className="flex list-disc flex-col gap-2 pl-5">{children}</ul>
);

export const SupportEmail = () => (
  <a
    href={`mailto:${site.supportEmail}`}
    className="text-foreground underline underline-offset-4"
  >
    {site.supportEmail}
  </a>
);

export const legalHead = (title: string, description: string) => ({
  meta: [
    { title: `${title} | ${site.name}` },
    { content: description, name: "description" },
  ],
});
