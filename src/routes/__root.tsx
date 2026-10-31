import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import appCss from "../styles.css?url";
import { defaultLanguage, isLanguage } from "../i18n";
import { ToasterProvider } from "@/components/ui/toaster";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "TapQR" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { name: "author", content: "TapQR" },
      {
        name: "google-site-verification",
        content: "s89d2JcWJ9yMygTWR00ELWiZQuHzQ2vpKIfAgokmiY8",
      },
      { name: "theme-color", content: "#ffb332" },
      { name: "application-name", content: "TapQR" },
      { name: "apple-mobile-web-app-title", content: "TapQR" },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        sizes: "any",
        href: "/favicon.svg",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/icon-192.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const localeSegment = useRouterState({
    select: (state) => state.location.pathname.split("/")[1],
  });
  const documentLanguage = isLanguage(localeSegment)
    ? localeSegment
    : defaultLanguage;

  return (
    <html lang={documentLanguage}>
      <head>
        <HeadContent />
      </head>
      <body>
        <ToasterProvider>{children}</ToasterProvider>
        {import.meta.env.DEV && <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />}
        <Scripts />
      </body>
    </html>
  );
}
