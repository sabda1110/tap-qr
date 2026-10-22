import { Check, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

import type { Language } from "../../i18n";

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
  order?: boolean;
  externalHref?: string | null;
};

export function PricingCard({
  content,
  icon: Icon,
  language,
  featured,
  order = false,
  externalHref,
}: PricingCardProps) {
  const ctaClassName = `mt-9 inline-flex min-h-12 items-center justify-center rounded-full px-4 py-3 text-center text-sm font-bold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0798ad] ${
    featured
      ? "bg-[#171b22] text-white hover:bg-[#303740] hover:text-white"
      : "bg-[#ffb332] text-[#171b22] hover:bg-[#ffc45c] hover:text-[#171b22]"
  }`;
  return (
    <article
      className={`group relative flex h-full min-w-0 flex-col rounded-[2rem] border p-7 shadow-[0_16px_36px_rgba(20,24,32,0.12)] transition-transform duration-300 ease-out motion-safe:hover:-translate-y-1 sm:p-8 md:p-5 lg:p-8 ${
        featured
          ? "border-[#ffb332] bg-[#ffb332] text-[#171b22]"
          : "border-[#242424] bg-[#242424] text-white"
      }`}
    >
      {content.badge ? (
        <span className={`absolute left-1/2 top-0 max-w-[90%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-4 py-2 text-[10px] font-bold tracking-[0.1em] uppercase ${featured ? "bg-[#171b22] text-white" : "bg-[#e7f7fb] text-[#171b22]"}`}>
          {content.badge}
        </span>
      ) : null}

      <span className={`flex size-12 items-center justify-center rounded-2xl ${featured ? "bg-[#171b22] text-[#ffb332]" : "bg-white/10 text-[#ffb332]"}`}>
        <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
      </span>

      <h3 className="mt-6 text-2xl font-bold tracking-[-0.035em]">
        {content.name}
      </h3>
      <p className={`mt-4 min-h-14 border-t pt-4 text-sm leading-6 ${featured ? "border-black/20 text-[#303740]" : "border-white/20 text-white/75"}`}>
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
          {content.cta}
        </a>
      ) : externalHref === null ? (
        <button className={`${ctaClassName} cursor-not-allowed opacity-50`} type="button" disabled>
          {content.cta}
        </button>
      ) : (
        <Link
          className={ctaClassName}
          to={order ? "/$locale/order" : "/$locale/auth/$mode"}
          params={{ locale: language, mode: "register" }}
        >
          {content.cta}
        </Link>
      )}
      {content.note ? (
        <p className="mt-3 text-xs leading-5 text-white/75 md:min-h-20">
          {content.note}
        </p>
      ) : (
        <span aria-hidden="true" className="mt-3 hidden md:block md:min-h-20" />
      )}
    </article>
  );
}
