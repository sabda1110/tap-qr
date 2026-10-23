import type { ReactNode } from "react";
import type { Messages } from "../../i18n";
import { MotionReveal } from "../elements/motion-reveal";
import { FeatureDivider } from "../elements/feature-divider";
import { ProductShowcaseDoodles } from "../elements/product-showcase-doodles";

type Props = { content: Messages["productShowcase"]; preview: ReactNode };

export function ProductShowcaseSection({ content, preview }: Props) {
  return (
    <section id="products" className="scroll-mt-24 overflow-hidden bg-white pb-14 pt-6 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-6xl sm:w-[calc(100%-4rem)]">
        <div className="mb-9 flex items-center justify-center gap-4 sm:mb-12 sm:gap-6">
          <span aria-hidden="true" className="min-w-6 flex-1"><FeatureDivider /></span>
          <p className="max-w-60 text-center text-xs leading-6 font-semibold text-[#58606b] sm:max-w-none sm:text-sm">{content.divider}</p>
          <span aria-hidden="true" className="min-w-6 flex-1"><FeatureDivider /></span>
        </div>
        <div className="relative">
          <div className="relative grid items-center overflow-hidden rounded-[2rem] bg-[#f5f3fa] px-6 pb-4 pt-9 sm:px-10 sm:pt-12 md:grid-cols-[0.9fr_1.1fr] md:gap-4 md:py-8 lg:pl-12 lg:pr-6">
            <MotionReveal className="relative z-10 min-w-0 md:py-6">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-black/45 uppercase">{content.kicker}</p>
              <h2 className="mt-4 max-w-lg text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.12] font-extrabold tracking-[-0.04em] text-[#161a22]">
                {content.titleStart}{" "}
                <span className="block">{content.titleAccent}</span>
              </h2>
              <p className="mt-6 max-w-lg text-[15px] leading-[1.8] text-[#6f7280] sm:text-base">{content.description}</p>
              <a href="#pricing" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-black px-6 py-3 text-xs font-medium text-white no-underline hover:bg-black/80 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0798ad]">
                {content.cta}
              </a>
            </MotionReveal>
            <MotionReveal delay={100} className="relative mt-6 min-w-0 md:mt-0">
              <figure className="mx-auto w-full max-w-[520px]">
                <div aria-hidden="true">{preview}</div>
                <figcaption className="mx-auto mb-3 mt-1 max-w-md text-center text-[10px] leading-4 text-[#58606b]">{content.caption}</figcaption>
              </figure>
            </MotionReveal>
          </div>
          <ProductShowcaseDoodles />
        </div>
      </div>
    </section>
  );
}
