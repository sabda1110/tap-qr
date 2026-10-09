import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import { BrandLogo } from "../elements/brand-logo";
import { Button } from "../ui/button";

export function UserMobileHeader({
  activeItem,
  content,
  homeLabel,
  language,
  onSignOut,
}: {
  activeItem: "dashboard" | "accountSettings";
  content: Messages["userDashboard"]["sidebar"];
  homeLabel: string;
  language: Language;
  onSignOut: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/8 bg-white px-4 pt-2 pb-3 lg:hidden">
      <div className="flex items-center justify-between">
        <BrandLogo
          homeLabel={homeLabel}
          language={language}
          to="/$locale/dashboard/user"
        />
        <Button
          variant="ghost"
          className="h-11 px-3 text-[#69737d]"
          onClick={onSignOut}
        >
          <LogOut aria-hidden="true" />
          {content.logout}
        </Button>
      </div>
      <nav
        aria-label={content.navigationLabel}
        className="mt-2 grid grid-cols-2 gap-2"
      >
        {[
          {
            key: "dashboard",
            label: content.dashboard,
            to: "/$locale/dashboard/user",
            icon: LayoutDashboard,
          },
          {
            key: "accountSettings",
            label: content.accountSettings,
            to: "/$locale/dashboard/user/account",
            icon: Settings,
          },
        ].map(({ key, label, to, icon: Icon }) => (
          <Link
            key={key}
            to={to}
            params={{ locale: language }}
            aria-current={activeItem === key ? "page" : undefined}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold no-underline focus-visible:outline-2 focus-visible:outline-ring ${activeItem === key ? "bg-[#e8f8fb] text-[#087e91]" : "bg-[#f7f9fb] text-[#69737d] hover:bg-black/5"}`}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
