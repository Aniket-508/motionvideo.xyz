import { createFileRoute } from "@tanstack/react-router";
import { cn } from "cn";
import { DownloadIcon } from "lucide-react";

import { Logomark } from "@/components/logomark";
import {
  PageHeader,
  PageList,
  PageSection,
  SupportEmail,
} from "@/components/page";
import { ROUTES } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { breadcrumbJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

const assets = [
  {
    files: [
      { href: "/brand/motionvideo-logomark-black.svg", label: "SVG" },
      { href: "/brand/motionvideo-logomark-black.png", label: "PNG" },
    ],
    name: "Logomark, black",
    preview: "bg-white text-black ring-1 ring-border",
  },
  {
    files: [
      { href: "/brand/motionvideo-logomark-white.svg", label: "SVG" },
      { href: "/brand/motionvideo-logomark-white.png", label: "PNG" },
    ],
    name: "Logomark, white",
    preview: "bg-black text-white",
  },
  {
    files: [
      { href: "/brand/motionvideo-app-icon.svg", label: "SVG" },
      { href: "/brand/motionvideo-app-icon-512.png", label: "PNG" },
    ],
    name: "App icon",
    preview: "bg-cta-to text-black",
  },
] as const;

const colors = [
  { hex: "#FFBE25", name: "Yellow", swatch: "bg-cta-to" },
  { hex: "#FFDD73", name: "Light yellow", swatch: "bg-cta-from" },
  { hex: "#000000", name: "Black", swatch: "bg-black" },
] as const;

const Brand = () => (
  <>
    <PageHeader
      title="Brand"
      intro={`Logos and colors for writing about ${SITE.NAME}. There is a logomark only; set the name in plain text next to it.`}
    />
    <PageSection title="Logomark">
      <div className="grid gap-4 sm:grid-cols-3">
        {assets.map((asset) => (
          <div key={asset.name} className="flex flex-col gap-3">
            <div
              className={cn(
                "flex aspect-video items-center justify-center rounded-xl",
                asset.preview
              )}
            >
              <Logomark className="h-8 w-auto" />
            </div>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-foreground">{asset.name}</span>
              <span className="flex gap-3">
                {asset.files.map((file) => (
                  <a
                    key={file.href}
                    href={file.href}
                    download
                    className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
                  >
                    <DownloadIcon aria-hidden className="size-3.5" />
                    {file.label}
                  </a>
                ))}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PageSection>

    <PageSection title="Colors">
      <div className="grid gap-4 sm:grid-cols-3">
        {colors.map((color) => (
          <div key={color.hex} className="flex items-center gap-3">
            <span
              aria-hidden
              className={cn(
                "size-10 rounded-lg ring-1 ring-black/10",
                color.swatch
              )}
            />
            <span className="flex flex-col text-sm">
              <span className="text-foreground">{color.name}</span>
              <span className="font-mono">{color.hex}</span>
            </span>
          </div>
        ))}
      </div>
    </PageSection>

    <PageSection title="Usage">
      <PageList>
        <li>Write the name as {SITE.NAME}: one word, capital M and V.</li>
        <li>
          Keep clear space around the logomark of at least half its height.
        </li>
        <li>
          Don’t stretch, rotate, recolor outside the palette, or add effects.
        </li>
        <li>
          Don’t use the mark in a way that suggests we endorse your product.
        </li>
      </PageList>
      <p>
        Questions or a press request? <SupportEmail />
      </p>
    </PageSection>
  </>
);

export const Route = createFileRoute("/_pages/brand")({
  component: Brand,
  head: () => ({
    ...createMetadata({
      canonical: ROUTES.BRAND,
      description: `${SITE.NAME} logomark, app icon, and colors.`,
      title: "Brand",
    }),
    scripts: [breadcrumbJsonLd({ name: "Brand", path: ROUTES.BRAND })],
  }),
});
