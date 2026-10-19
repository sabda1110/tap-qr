import type { LucideIcon } from "lucide-react";
import type { Language } from "../../i18n";
import { MotionReveal } from "../elements/motion-reveal";
import { SectionUnderline } from "../elements/section-underline";
import {
  PricingCard,
  type PricingCardContent,
} from "../molecules/pricing-card";

type PricingPlan = {
  content: PricingCardContent;
  icon: LucideIcon;
  featured?: boolean;
  order?: boolean;
};

type PricingSectionProps = {
  language: Language;
  heading: {
    kicker: string;
    titleStart: string;
    titleAccent: string;
    titleEnd: string;
    description: string;
  };
  plans: PricingPlan[];
  note: string;
};

export function PricingSection({
  heading,
  language,
  plans,
  note,
}: PricingSectionProps) {
  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden bg-[#f5f8fb] py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-12 -z-10 aspect-square w-[min(1100px,160vw)] -translate-x-1/2 sm:-top-16"
      >
        <span className="absolute inset-0 rounded-full border border-[#0798ad]/10" />
        <span className="absolute inset-[3%] rounded-full border border-[#0798ad]/10" />
        <span className="absolute inset-[6%] rounded-full border border-[#0798ad]/10" />
        <span className="absolute inset-[9%] rounded-full border border-[#0798ad]/10" />
      </div>

      <div className="mx-auto w-[calc(100%-2rem)] max-w-6xl sm:w-[calc(100%-4rem)]">
        <MotionReveal>
          <header className="mx-auto max-w-[820px] text-center">
            <h2 className="text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.18] font-bold tracking-[-0.045em] text-[#242424]">
              {heading.titleStart}{" "}
              <span className="relative inline-block text-[#0798ad]">
                {heading.titleAccent}
                <SectionUnderline />
              </span>{" "}
              {heading.titleEnd}
            </h2>
            <p className="mx-auto mt-7 max-w-[680px] text-[15px] leading-7 text-[#6f7280] sm:text-base">
              {heading.description}
            </p>
          </header>
        </MotionReveal>

        <div className="mt-14 grid gap-9 md:grid-cols-3 md:gap-5 lg:mt-16 lg:gap-7">
          {plans.map((plan, index) => (
            <MotionReveal
              key={plan.content.name}
              className={`h-full ${plan.featured ? "md:pb-8" : "md:pt-8"}`}
              delay={index * 110}
            >
              <PricingCard {...plan} language={language} />
            </MotionReveal>
          ))}
        </div>

        <p className="mx-auto mt-9 max-w-2xl text-center text-xs leading-6 text-[#58606b]">{note}</p>
      </div>
    </section>
  );
}
