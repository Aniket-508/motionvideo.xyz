import { Link } from "@tanstack/react-router";

import { Logomark } from "@/components/logomark";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

export const SiteHeader = ({ signedIn }: { signedIn: boolean }) => (
  <header className="bg-background/80 sticky top-0 z-10 backdrop-blur">
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

const footerLink = "hover:text-foreground transition-colors";

export const SiteFooter = () => (
  <footer>
    <div className="text-muted-foreground mx-auto flex max-w-3xl flex-col gap-4 px-6 pt-16 pb-12 text-sm sm:flex-row sm:justify-between">
      <p>
        © {new Date().getFullYear()} {site.name} · Made by{" "}
        <a href={site.authorUrl} className={footerLink}>
          {site.authorName}
        </a>
      </p>
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
