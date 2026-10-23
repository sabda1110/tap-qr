import { ArrowUpRight, Check, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

import type { Language } from "../../i18n";
import { PricingCardArtwork } from "../elements/pricing-card-artwork";

export type PricingCardContent = {
  name: string;
  badge: string;
  description: string;
  price: string;
  priceDetail: string;
  features: string[];
  cta: string;
  note?: string;
};

type PricingCardProps = {
  content: PricingCardContent;
  icon: LucideIcon;
  language: Language;
  featured?: boolean;
  royal?: boolean;
  order?: boolean;
  externalHref?: string | null;
};

export function PricingCard({
  content,
  icon: Icon,
  language,
  featured,
  royal = false,
  order = false,
  externalHref,
}: PricingCardProps) {
  const ctaClassName = `pricing-cta mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 py-3 text-center text-sm font-bold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0798ad] md:min-h-16 lg:min-h-12 ${
    featured
      ? "bg-[#171b22] text-white hover:bg-[#303740] hover:text-white"
      : "bg-[#ffb332] text-[#171b22] hover:bg-[#ffc45c] hover:text-[#171b22]"
  }`;
  const ctaContent = <>{content.cta}<ArrowUpRight aria-hidden="true" className="pricing-cta-arrow size-4 shrink-0" /></>;
  return (
    <article
      className={`pricing-plan group relative flex h-full min-w-0 flex-col rounded-[2rem] border-2 p-7 transition-transform duration-300 ease-out motion-safe:hover:-translate-y-1 sm:p-8 md:p-5 lg:p-8 ${
        featured
          ? "border-[#171b22] bg-[#ffb332] text-[#171b22] shadow-[6px_6px_0_#171b22]"
          : royal
            ? "border-[#d4a94d] bg-[#242424] text-white shadow-[6px_6px_0_#d4a94d]"
            : "border-[#242424] bg-[#242424] text-white shadow-[6px_6px_0_#c6e8ee]"
      }`}
    >
      {content.badge ? (
        <span className={`absolute left-1/2 top-0 max-w-[90%] -translate-x-1/2 -translate-y-1/2 -rotate-2 whitespace-nowrap rounded-lg border-2 border-[#171b22] px-4 py-2 text-[10px] font-bold tracking-[0.1em] uppercase shadow-[2px_2px_0_#171b22] ${featured ? "bg-[#171b22] text-white" : royal ? "bg-[#ffdf83] text-[#171b22]" : "bg-[#e7f7fb] text-[#171b22]"}`}>
          {content.badge}
        </span>
      ) : null}

      <div className="flex items-center justify-between gap-3 pt-1">
        <PricingCardArtwork icon={Icon} featured={featured} royal={royal} />
        <svg aria-hidden="true" className={`h-9 w-16 ${featured ? "text-[#171b22]/60" : "text-[#ffb332]"}`} viewBox="0 0 80 40" fill="none">
          <path className="pricing-action-line" d="M4 28c12-20 28-25 42-14s-7 29-16 13S53 0 72 13m-12 0 13 1-4-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 className="mt-4 text-2xl font-bold tracking-[-0.035em] md:min-h-14 lg:min-h-8">
        {content.name}
      </h3>
      <p className={`mt-4 min-h-28 border-t border-dashed pt-4 text-sm leading-6 md:min-h-40 lg:min-h-28 ${featured ? "border-black/25 text-[#303740]" : "border-white/25 text-white/75"}`}>
        {content.description}
      </p>

      <p className="mt-8 flex items-baseline gap-2 whitespace-nowrap">
        <span className="text-[clamp(2rem,3vw,2.75rem)] leading-none font-bold tracking-[-0.05em] md:text-[clamp(1.5rem,3vw,2.75rem)]">
          {content.price}
        </span>
        <span className={`text-xs ${featured ? "text-black/65" : "text-white/65"}`}>{content.priceDetail}</span>
      </p>

      <ul className="mt-7 flex flex-1 flex-col gap-3">
        {content.features.map((feature) => (
          <li key={feature} className={`flex gap-3 text-sm leading-6 ${featured ? "text-[#303740]" : "text-white/90"}`}>
            <Check
              className={`mt-1 size-4 shrink-0 rounded-full p-0.5 ${featured ? "bg-[#171b22] text-[#ffb332]" : "bg-[#ffb332] text-[#171b22]"}`}
              strokeWidth={2.4}
              aria-hidden="true"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {externalHref ? (
        <a className={ctaClassName} href={externalHref} target="_blank" rel="noopener noreferrer">
          {ctaContent}
        </a>
      ) : externalHref === null ? (
        <button className={`${ctaClassName} cursor-not-allowed opacity-50`} type="button" disabled>
          {ctaContent}
        </button>
      ) : (
        <Link
          className={ctaClassName}
          to={order ? "/$locale/order" : "/$locale/auth/$mode"}
          params={{ locale: language, mode: "register" }}
        >
          {ctaContent}
        </Link>
      )}
      {content.note ? (
        <p className="mt-3 text-xs leading-5 text-white/75 md:min-h-16">
          {content.note}
        </p>
      ) : (
        <span aria-hidden="true" className="mt-3 hidden md:block md:min-h-16" />
      )}
    </article>
  );
}
