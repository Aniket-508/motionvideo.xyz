import { Link } from "@tanstack/react-router";

import { Logomark } from "@/components/logomark";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

export const SiteHeader = ({ signedIn }: { signedIn: boolean }) => (
  <header className="bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
    <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
      <Link
        to="/"
        className="flex items-center gap-2 font-semibold tracking-tight"
      >
        <Logomark className="h-4 w-auto" />
        {site.domain}
      </Link>
      <Link
        to={signedIn ? "/dashboard" : "/sign-in"}
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        {signedIn ? "Dashboard" : "Sign in"}
      </Link>
    </div>
  </header>
);

export const SiteFooter = () => (
  <footer className="border-t">
    <div className="text-muted-foreground mx-auto flex max-w-3xl flex-col gap-2 px-6 py-8 text-sm sm:flex-row sm:justify-between">
      <p>
        Made by{" "}
        <a
          href={site.authorUrl}
          className="hover:text-foreground underline underline-offset-4"
        >
          {site.authorName}
        </a>
      </p>
      <a
        href={site.githubUrl}
        className="hover:text-foreground underline underline-offset-4"
      >
        This site is open source
      </a>
    </div>
  </footer>
);
