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
        content:
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
      },
      {
        title: "TapQR — Satu Tap, Lebih Banyak Pelanggan",
      },
      {
        name: "description",
        content:
          "TapQR membantu UMKM mendapat lebih banyak review Google dan terhubung dengan pelanggan melalui satu tap NFC atau scan QR.",
      },
      {
        name: "keywords",
        content:
          "TapQR, tap qr, nfc umkm, qr code umkm, google review nfc, kartu nfc review, stiker nfc kasir, cara perbanyak review google, google my business review, review google maps, tap to review, smart review card, kartu akrilik nfc, qr standee cafe, umkm digital indonesia",
      },
      {
        name: "author",
        content: "TapQR",
      },
      {
        name: "theme-color",
        content: "#ffffff",
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "default",
      },
      {
        name: "apple-mobile-web-app-title",
        content: "TapQR",
      },
      {
        name: "application-name",
        content: "TapQR",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:site_name",
        content: "TapQR",
      },
      {
        property: "og:title",
        content: "TapQR — Satu Tap, Lebih Banyak Pelanggan",
      },
      {
        property: "og:description",
        content:
          "Tingkatkan review Google dan loyalitas pelanggan UMKM secara instan dengan satu tap kartu NFC atau scan QR code.",
      },
      {
        property: "og:image",
        content: "/icon-512.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "TapQR — Satu Tap, Lebih Banyak Pelanggan",
      },
      {
        name: "twitter:description",
        content:
          "Tingkatkan review Google dan loyalitas pelanggan UMKM secara instan dengan satu tap kartu NFC atau scan QR code.",
      },
      {
        name: "twitter:image",
        content: "/icon-512.png",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
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
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
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
