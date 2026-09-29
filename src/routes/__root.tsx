import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { themeScript } from "@/lib/theme";
import { organizationJsonLd, websiteJsonLd } from "@/seo/json-ld";
import { baseMetadata } from "@/seo/metadata";

import appCss from "../styles.css?url";

const RootDocument = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <HeadContent />
    </head>
    <body className="flex min-h-svh flex-col antialiased">
      {children}
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRoute({
  head: () => ({
    links: [
      { href: appCss, rel: "stylesheet" },
      // Fetch the font alongside the CSS instead of after it, so first paint
      // already uses Inter.
      {
        as: "font",
        crossOrigin: "anonymous",
        href: interLatin,
        rel: "preload",
        type: "font/woff2",
      },
      ...baseMetadata.links,
    ],
    meta: baseMetadata.meta,
    scripts: [{ children: themeScript }, websiteJsonLd(), organizationJsonLd()],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
});
