import { Link } from "@tanstack/react-router";

import type { Language } from "../../i18n";

type BrandLogoProps = {
  homeLabel: string;
  language: Language;
  theme?: "light" | "dark";
  to?: "/$locale" | "/$locale/dashboard/user";
};

export function BrandLogo({
  homeLabel,
  language,
  theme = "light",
  to = "/$locale",
}: BrandLogoProps) {
  return (
    <Link
      className={`shrink-0 text-[25px] font-extrabold tracking-[-0.055em] no-underline ${
        theme === "dark"
          ? "text-white hover:text-white"
          : "text-black hover:text-black"
      }`}
      to={to}
      params={{ locale: language }}
      aria-label={homeLabel}
    >
      Tap<span className="text-[#ffb332]">QR</span>
    </Link>
  );
}
