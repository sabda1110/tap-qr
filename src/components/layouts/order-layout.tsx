import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Language, Messages } from "../../i18n";
import { BrandLogo } from "../elements/brand-logo";
import { LanguageSwitcher } from "../elements/language-switcher";
import { HeaderNavUnderline } from "../elements/header-nav-underline";

export function OrderLayout({ children, language, messages }: { children: ReactNode; language: Language; messages: Messages }) {
  return <div className="min-h-dvh bg-[#f7f9fb] text-[#172029]">
    <header className="sticky top-0 z-40 border-b border-black/8 bg-white"><div className="mx-auto flex min-h-20 w-[calc(100%-2rem)] max-w-6xl flex-wrap items-center justify-between gap-4 py-5 md:min-h-[104px] md:w-[82%]">
      <BrandLogo homeLabel={messages.header.brandHomeLabel} language={language} />
      <nav aria-label={messages.header.mainNavigationLabel} className="flex flex-wrap items-center gap-x-5 gap-y-4 text-[13px]">
        {([
          { to: "/$locale/order", label: messages.orders.buy },
          { to: "/$locale/orders", label: messages.orders.checkOrder },
          { to: "/$locale/dashboard/user/orders", label: messages.orders.myOrders },
        ] as const).map(({ to, label }) => <Link key={to} to={to} params={{ locale: language }} activeOptions={{ exact: to === "/$locale/order" }} className="relative flex items-center pb-2 no-underline transition-colors hover:text-black focus-visible:outline-2 focus-visible:outline-ring">
          {({ isActive }) => <><span className={isActive ? "font-bold text-black" : "font-medium text-[#282828]"}>{label}</span><HeaderNavUnderline active={isActive} /></>}
        </Link>)}
        <LanguageSwitcher label={messages.header.languageLabel} />
      </nav>
    </div></header>
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
  </div>;
}
