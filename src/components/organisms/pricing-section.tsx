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
    <section id="pricing" className="bg-[#f4f8fc] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-6xl sm:w-[calc(100%-4rem)]">
        <MotionReveal>
          <header className="mx-auto max-w-[820px] text-center">
            <p className="text-sm font-medium text-black/45">{heading.kicker}</p>
            <h2 className="mt-4 text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.18] font-medium tracking-[-0.045em] text-[#242424]">
              {heading.titleStart}{" "}
              <span className="relative inline-block">
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

        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:mt-16">
          {plans.map((plan, index) => (
            <MotionReveal
              key={plan.content.name}
              className="h-full"
              delay={index * 110}
            >
              <PricingCard {...plan} language={language} />
            </MotionReveal>
          ))}
        </div>

        <p className="mt-8 text-center text-xs leading-6 text-black/45">{note}</p>
      </div>
    </section>
  );
}
