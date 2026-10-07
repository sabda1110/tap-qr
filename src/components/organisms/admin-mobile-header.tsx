import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Dialog } from "@base-ui/react/dialog";
import {
  CreditCard,
  Link2,
  LogOut,
  Menu,
  ShieldCheck,
  Store,
  X,
} from "lucide-react";

import type { Language } from "../../i18n";
import { BrandLogo } from "../elements/brand-logo";

type AdminMobileHeaderProps = {
  content: {
    outlets: string;
    activation: string;
    cards: string;
    closeMenu: string;
    logout: string;
    navigationLabel: string;
    openMenu: string;
    roleLabel: string;
  };
  homeLabel: string;
  language: Language;
  onSignOut: () => void;
};

export function AdminMobileHeader({
  content,
  homeLabel,
  language,
  onSignOut,
}: AdminMobileHeaderProps) {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-black/8 bg-white/95 px-5 py-4 backdrop-blur lg:hidden">
      <BrandLogo
        homeLabel={homeLabel}
        language={language}
        to="/$locale/dashboard/admin"
      />
      <Dialog.Root onOpenChange={setOpen} open={open}>
        <Dialog.Trigger
          aria-label={content.openMenu}
          className="rounded-xl border border-black/10 p-2 text-[#252a32]"
          type="button"
        >
          <Menu className="size-5" />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <Dialog.Popup className="fixed right-0 bottom-0 left-0 z-50 translate-y-0 rounded-t-3xl bg-white p-6 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none data-ending-style:translate-y-[110%] data-starting-style:translate-y-[110%]">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-black/10" />
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#8b6a20]">
                <ShieldCheck className="size-4" />
                {content.roleLabel}
              </span>
              <Dialog.Close
                aria-label={content.closeMenu}
                className="rounded-lg p-2 hover:bg-black/5"
              >
                <X className="size-5" />
              </Dialog.Close>
            </div>
            <nav
              aria-label={content.navigationLabel}
              className="mt-6 grid gap-2"
            >
              <Link
                activeProps={{ className: "bg-[#e8f8fb] text-[#087e91]" }}
                className="flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-bold text-[#646b75] no-underline hover:bg-black/4 hover:text-[#252a32]"
                onClick={closeMenu}
                params={{ locale: language }}
                to="/$locale/dashboard/admin/cards"
              >
                <CreditCard className="size-5" />
                {content.cards}
              </Link>
              <Link
                activeProps={{ className: "bg-[#e8f8fb] text-[#087e91]" }}
                className="flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-bold text-[#646b75] no-underline hover:bg-black/4 hover:text-[#252a32]"
                onClick={closeMenu}
                params={{ locale: language }}
                to="/$locale/dashboard/admin/activation"
              >
                <Link2 className="size-5" />
                {content.activation}
              </Link>
              <Link
                activeProps={{ className: "bg-[#e8f8fb] text-[#087e91]" }}
                className="flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-bold text-[#646b75] no-underline hover:bg-black/4 hover:text-[#252a32]"
                onClick={closeMenu}
                params={{ locale: language }}
                to="/$locale/dashboard/admin/outlets"
              >
                <Store className="size-5" />
                {content.outlets}
              </Link>
            </nav>
            <button
              className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-black/8 px-4 py-4 text-left text-sm font-semibold text-[#646b75]"
              onClick={onSignOut}
              type="button"
            >
              <LogOut className="size-5" />
              {content.logout}
            </button>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
