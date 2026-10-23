import type { LucideIcon } from "lucide-react";
import type { Language } from "../../i18n";
import { MotionReveal } from "../elements/motion-reveal";
import { SectionUnderline } from "../elements/section-underline";
import { PricingDoodles } from "../elements/pricing-doodles";
import { PricingBackground } from "../elements/pricing-background";
import "./pricing-section.css";
import {
  PricingCard,
  type PricingCardContent,
} from "../molecules/pricing-card";

type PricingPlan = {
  content: PricingCardContent;
  icon: LucideIcon;
  featured?: boolean;
  royal?: boolean;
  order?: boolean;
  externalHref?: string | null;
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
      className="pricing-section relative isolate scroll-mt-24 overflow-hidden bg-[#f5f8fb] py-20 sm:py-24 lg:py-28"
    >
      <PricingBackground />

      <div className="mx-auto w-[calc(100%-2rem)] max-w-6xl sm:w-[calc(100%-4rem)]">
        <MotionReveal>
          <header className="relative mx-auto max-w-[820px] text-center">
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

        <div className="relative mt-14 lg:mt-16">
          <PricingDoodles />
          <div className="grid gap-10 md:grid-cols-3 md:gap-5 lg:gap-7">
            {plans.map((plan, index) => (
              <MotionReveal
                key={plan.content.name}
                className={`h-full md:order-none ${plan.featured ? "order-first md:pb-8" : "md:pt-8"}`}
                delay={index * 110}
              >
                <PricingCard {...plan} language={language} />
              </MotionReveal>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-2xl text-center text-xs leading-6 text-[#58606b]">{note}</p>
      </div>
    </section>
  );
}
