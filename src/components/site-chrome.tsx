import { Link } from "@tanstack/react-router";
import { cn } from "cn";
import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";

import { GitHubIcon, XIcon } from "@/components/brand-icons";
import { Logomark } from "@/components/logomark";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LINK } from "@/constants/links";
import { OTHER_PRODUCTS, SHADCN_LABS_PROJECTS } from "@/constants/products";
import { SITE } from "@/constants/site";
import { withUtm } from "@/lib/utm";

export const Brand = () => (
  <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
    <Logomark className="h-4 w-auto" />
    {SITE.NAME}
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
        {signedIn ? "Dashboard" : "Access"}
      </Link>
    </div>
  </header>
);

const linkClass =
  "text-muted-foreground hover:text-foreground transition-colors";

const FooterColumn = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-foreground text-sm font-medium">{title}</h2>
    <ul className="flex flex-col gap-2 text-sm">{children}</ul>
  </div>
);

export const SiteFooter = () => (
  <footer className="mx-auto w-full max-w-5xl px-6 pt-24 pb-10">
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div className="flex flex-col gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <Logomark className="h-5 w-auto" />
          {SITE.NAME}
        </Link>
        <p className="text-muted-foreground max-w-xs text-sm">
          Motion design, written in code.
        </p>
        <div className="flex items-center gap-3">
          <a
            href={LINK.X}
            aria-label={`${SITE.NAME} on X (${SITE.AUTHOR.TWITTER})`}
            className={linkClass}
          >
            <XIcon className="size-4" />
          </a>
          <a
            href={LINK.GITHUB}
            aria-label={`${SITE.NAME} on GitHub`}
            className={linkClass}
          >
            <GitHubIcon className="size-4" />
          </a>
        </div>
      </div>

      <nav
        aria-label="Footer"
        className="grid grid-cols-2 gap-8 sm:grid-cols-4"
      >
        <FooterColumn title="Product">
          <li>
            <a href="/#features" className={linkClass}>
              Features
            </a>
          </li>
          <li>
            <a href="/#how-it-works" className={linkClass}>
              How it works
            </a>
          </li>
          <li>
            <a href="/#pricing" className={linkClass}>
              Pricing
            </a>
          </li>
          <li>
            <a href="/#faq" className={linkClass}>
              FAQ
            </a>
          </li>
        </FooterColumn>
        <FooterColumn title="Company">
          <li>
            <Link to="/about" className={linkClass}>
              About
            </Link>
          </li>
          <li>
            <Link to="/brand" className={linkClass}>
              Brand
            </Link>
          </li>
          <li>
            <Link to="/contact" className={linkClass}>
              Contact
            </Link>
          </li>
          <li>
            <a href={LINK.GITHUB_REPO} className={linkClass}>
              Source code
            </a>
          </li>
        </FooterColumn>
        <FooterColumn title="Legal">
          <li>
            <Link to="/terms" className={linkClass}>
              Terms of service
            </Link>
          </li>
          <li>
            <Link to="/privacy" className={linkClass}>
              Privacy policy
            </Link>
          </li>
          <li>
            <Link to="/refunds" className={linkClass}>
              Refund policy
            </Link>
          </li>
          <li>
            <Link to="/dpa" className={linkClass}>
              DPA
            </Link>
          </li>
        </FooterColumn>
        <FooterColumn title="Other products">
          {OTHER_PRODUCTS.map((product) => (
            <li key={product.name}>
              <a href={withUtm(product.url, "footer")} className={linkClass}>
                {product.name}
              </a>
            </li>
          ))}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span
                  className={cn(linkClass, "inline-flex items-center gap-1")}
                >
                  and more
                  <ChevronDownIcon
                    aria-hidden
                    className="size-3.5 transition-transform in-data-popup-open:rotate-180"
                  />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Shadcn Labs projects</DropdownMenuLabel>
                  {SHADCN_LABS_PROJECTS.map((project) => (
                    <DropdownMenuLinkItem
                      key={project.name}
                      href={withUtm(project.url, "footer")}
                    >
                      {project.name}
                    </DropdownMenuLinkItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </FooterColumn>
      </nav>
    </div>

    <div className="text-muted-foreground mt-16 flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p>
        © {new Date().getFullYear()} {SITE.NAME} · Built by{" "}
        <a
          href={withUtm(LINK.AUTHOR_WEBSITE, "footer")}
          className="hover:text-foreground transition-colors"
        >
          {SITE.AUTHOR.FIRST_NAME}
        </a>
      </p>
      <ThemeToggle />
    </div>
  </footer>
);
