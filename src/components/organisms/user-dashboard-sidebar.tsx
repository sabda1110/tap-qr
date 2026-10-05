import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, QrCode } from "lucide-react";
import type { ReactNode } from "react";

import { BrandLogo } from "../elements/brand-logo";
import type { Language } from "../../i18n";

type UserDashboardSidebarProps = {
  activeItem: "dashboard" | "qrGenerator";
  content: {
    dashboard: string;
    logout: string;
    navigationLabel: string;
    qrGenerator: string;
  };
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
    <aside className="border-b border-black/8 bg-white px-5 py-4 lg:flex lg:min-h-dvh lg:flex-col lg:border-r lg:border-b-0 lg:px-6 lg:py-8">
      <div className="flex items-center justify-between lg:block">
        <BrandLogo homeLabel={homeLabel} language={language} to="/$locale/dashboard/user" />
        <nav aria-label={content.navigationLabel} className="lg:mt-12">
          <SidebarLink active={activeItem === "dashboard"} label={content.dashboard} language={language} to="/$locale/dashboard/user">
            <LayoutDashboard className="size-4" />
          </SidebarLink>
          <SidebarLink active={activeItem === "qrGenerator"} label={content.qrGenerator} language={language} to="/$locale/dashboard/user/qr-generator">
            <QrCode className="size-4" />
          </SidebarLink>
        </nav>
      </div>
      <button
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#646b75] transition-colors hover:text-black lg:mt-auto"
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
  to: "/$locale/dashboard/user" | "/$locale/dashboard/user/qr-generator";
}) {
  return (
    <Link
      className={`mt-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold no-underline transition-colors lg:w-full ${
        active ? "bg-[#e8f8fb] text-[#087e91]" : "text-[#646b75] hover:bg-black/4 hover:text-black"
      }`}
      params={{ locale: language }}
      to={to}
    >
      {children}
      {label}
    </Link>
  );
}
