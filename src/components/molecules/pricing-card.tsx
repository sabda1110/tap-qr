import { Check, type LucideIcon } from "lucide-react";

export type PricingCardContent = {
  name: string;
  badge: string;
  description: string;
  price: string;
  priceDetail: string;
  features: string[];
  cta: string;
};

type PricingCardProps = {
  content: PricingCardContent;
  icon: LucideIcon;
  featured?: boolean;
};

export function PricingCard({ content, icon: Icon, featured }: PricingCardProps) {
  return (
    <article
      className={`group relative flex h-full flex-col rounded-3xl border bg-white p-7 transition-[transform,box-shadow,border-color] duration-300 ease-out motion-safe:hover:-translate-y-2 sm:p-8 ${
        featured
          ? "border-black shadow-[0_20px_60px_rgba(20,24,32,0.12)] hover:border-[#0798ad] hover:shadow-[0_28px_70px_rgba(7,152,173,0.18)]"
          : "border-black/10 shadow-[0_12px_40px_rgba(20,24,32,0.06)] hover:border-[#0798ad]/60 hover:shadow-[0_28px_70px_rgba(7,152,173,0.14)]"
      }`}
    >
      {content.badge ? (
        <span className="absolute top-0 right-7 -translate-y-1/2 rounded-full bg-[#ffb332] px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-black uppercase">
          {content.badge}
        </span>
      ) : null}

      <span className="flex size-12 items-center justify-center rounded-2xl bg-[#e7f7fb] text-[#0798ad] transition-[transform,background-color,color] duration-300 motion-safe:group-hover:rotate-3 motion-safe:group-hover:scale-110 group-hover:bg-[#ffb332]/25 group-hover:text-black">
        <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
      </span>

      <h3 className="mt-6 text-2xl font-semibold tracking-[-0.035em] text-[#161a22]">
        {content.name}
      </h3>
      <p className="mt-3 min-h-14 text-sm leading-6 text-[#6f7280]">
        {content.description}
      </p>

      <p className="mt-7 flex items-end gap-2 text-black">
        <span className="text-[clamp(2rem,3vw,2.75rem)] leading-none font-bold tracking-[-0.05em]">
          {content.price}
        </span>
        <span className="pb-1 text-xs text-black/45">{content.priceDetail}</span>
      </p>

      <ul className="mt-7 flex flex-1 flex-col gap-3">
        {content.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-6 text-[#444854]">
            <Check
              className="mt-1 size-4 shrink-0 text-[#0798ad] transition-transform duration-300 motion-safe:group-hover:scale-110"
              strokeWidth={2.4}
              aria-hidden="true"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        className={`mt-8 inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm font-semibold no-underline ${
          featured
            ? "bg-black text-white hover:bg-black/80 hover:text-white"
            : "border border-black/15 bg-white text-black hover:border-black hover:text-black"
        }`}
        href="#get-started"
      >
        {content.cta}
      </a>
    </article>
  );
}
