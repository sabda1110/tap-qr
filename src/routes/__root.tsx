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
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TapQR — Satu Tap, Lebih Banyak Pelanggan",
      },
      {
        name: "description",
        content:
          "TapQR membantu UMKM mendapat lebih banyak review Google dan terhubung dengan pelanggan melalui satu tap NFC atau scan QR.",
      },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap",
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
}
