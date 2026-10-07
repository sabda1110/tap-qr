import { Link } from "@tanstack/react-router";
import { CreditCard, Link2, LogOut, ShieldCheck, Store } from "lucide-react";

import type { Language } from "../../i18n";
import { BrandLogo } from "../elements/brand-logo";

type AdminDashboardSidebarProps = {
  content: { outlets: string; activation: string; cards: string; logout: string; navigationLabel: string; roleLabel: string };
  homeLabel: string;
  language: Language;
  onSignOut: () => void;
};

export function AdminDashboardSidebar({ content, homeLabel, language, onSignOut }: AdminDashboardSidebarProps) {
  return (
    <aside className="hidden border-b border-black/8 bg-white px-5 py-4 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:overflow-y-auto lg:border-r lg:border-b-0 lg:px-6 lg:py-8">
      <div className="lg:block">
        <BrandLogo homeLabel={homeLabel} language={language} to="/$locale/dashboard/admin" />
        <nav aria-label={content.navigationLabel} className="mt-4 grid gap-2 lg:mt-12">
          <Link activeProps={{ className: "bg-[#e8f8fb] text-[#087e91]" }} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#646b75] no-underline hover:bg-black/4 hover:text-[#252a32]" params={{ locale: language }} to="/$locale/dashboard/admin/outlets"><Store className="size-4" />{content.outlets}</Link>
          <Link
            activeProps={{ className: "bg-[#e8f8fb] text-[#087e91]" }}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#646b75] no-underline hover:bg-black/4 hover:text-[#252a32] lg:w-full"
            params={{ locale: language }}
            to="/$locale/dashboard/admin/cards"
          >
            <CreditCard className="size-4" />
            {content.cards}
          </Link>
          <Link
            activeProps={{ className: "bg-[#e8f8fb] text-[#087e91]" }}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#646b75] no-underline hover:bg-black/4 hover:text-[#252a32] lg:w-full"
            params={{ locale: language }}
            to="/$locale/dashboard/admin/activation"
          >
            <Link2 className="size-4" />
            {content.activation}
          </Link>
        </nav>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/8 pt-4 lg:mt-auto lg:block lg:border-0 lg:pt-0">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8b6a20] lg:mb-5">
          <ShieldCheck className="size-4" />
          {content.roleLabel}
        </span>
        <button className="flex items-center gap-2 text-sm font-semibold text-[#646b75] hover:text-black" onClick={onSignOut} type="button">
          <LogOut className="size-4" />
          {content.logout}
        </button>
      </div>
    </aside>
  );
}
