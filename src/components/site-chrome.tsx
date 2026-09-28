import { Link } from "@tanstack/react-router";

import { Logomark } from "@/components/logomark";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

export const Brand = () => (
  <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
    <Logomark className="h-4 w-auto" />
    {site.name}
  </Link>
);

export const SiteHeader = ({ signedIn }: { signedIn: boolean }) => (
  <header>
    <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
      <Brand />
      <Link
        to={signedIn ? "/dashboard" : "/sign-in"}
        className={buttonVariants({ size: "sm", variant: "ghost" })}
      >
        {signedIn ? "Dashboard" : "Sign in"}
      </Link>
    </div>
  </header>
);

const footerLink = "hover:text-foreground transition-colors";

export const SiteFooter = () => (
  <footer>
    <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col gap-6 px-6 pt-16 pb-12 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <p>
          © {new Date().getFullYear()} {site.name} · Made by{" "}
          <a href={site.authorUrl} className={footerLink}>
            {site.authorName}
          </a>
        </p>
        <ThemeToggle />
      </div>
      <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
        <Link to="/terms" className={footerLink}>
          Terms
        </Link>
        <Link to="/privacy" className={footerLink}>
          Privacy
        </Link>
        <Link to="/refunds" className={footerLink}>
          Refunds
        </Link>
        <a href={`mailto:${site.supportEmail}`} className={footerLink}>
          Contact
        </a>
        <a href={site.githubUrl} className={footerLink}>
          Open source
        </a>
      </nav>
    </div>
  </footer>
);
