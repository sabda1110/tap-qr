import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import type { ReactNode } from "react";

import { BrandLogo } from "../elements/brand-logo";
import type { Language, Messages } from "../../i18n";

type UserDashboardSidebarProps = {
  activeItem: "dashboard" | "accountSettings";
  content: Messages["userDashboard"]["sidebar"];
  homeLabel: string;
  language: Language;
  onSignOut: () => void;
};

export function UserDashboardSidebar({
  activeItem,
  content,
  homeLabel,
  language,
  onSignOut,
}: UserDashboardSidebarProps) {
  return (
    <aside className="hidden border-r border-black/8 bg-white px-6 py-8 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:overflow-y-auto">
      <div className="flex items-center justify-between lg:block">
        <BrandLogo
          homeLabel={homeLabel}
          language={language}
          to="/$locale/dashboard/user"
        />
        <nav aria-label={content.navigationLabel} className="lg:mt-12">
          <SidebarLink
            active={activeItem === "dashboard"}
            label={content.dashboard}
            language={language}
            to="/$locale/dashboard/user"
          >
            <LayoutDashboard className="size-4" />
          </SidebarLink>
          <SidebarLink
            active={activeItem === "accountSettings"}
            label={content.accountSettings}
            language={language}
            to="/$locale/dashboard/user/account"
          >
            <Settings className="size-4" />
          </SidebarLink>
        </nav>
      </div>
      <button
        className="mt-auto flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#646b75] transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-ring"
        onClick={onSignOut}
        type="button"
      >
        <LogOut className="size-4" />
        {content.logout}
      </button>
    </aside>
  );
}

function SidebarLink({
  active,
  children,
  language,
  label,
  to,
}: {
  active: boolean;
  children: ReactNode;
  language: Language;
  label: string;
  to: "/$locale/dashboard/user" | "/$locale/dashboard/user/account";
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`mt-1 flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-ring lg:w-full ${
        active
          ? "bg-[#e8f8fb] text-[#087e91]"
          : "text-[#646b75] hover:bg-black/4 hover:text-black"
      }`}
      params={{ locale: language }}
      to={to}
    >
      {children}
      {label}
    </Link>
  );
}
