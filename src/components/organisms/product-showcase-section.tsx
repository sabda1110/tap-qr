import { Nfc } from "lucide-react";
import type { ReactNode } from "react";
import type { Messages } from "../../i18n";
import { MotionReveal } from "../elements/motion-reveal";
import { SectionUnderline } from "../elements/section-underline";

type Props = { content: Messages["productShowcase"]; preview: ReactNode };

export function ProductShowcaseSection({ content, preview }: Props) {
  return (
    <section id="products" className="scroll-mt-24 overflow-hidden bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid w-[calc(100%-2rem)] max-w-6xl items-center gap-8 sm:w-[calc(100%-4rem)] md:grid-cols-2 lg:gap-16">
        <MotionReveal>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-black/45 uppercase">{content.kicker}</p>
          <h2 className="mt-4 max-w-lg text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.18] font-semibold tracking-[-0.035em] text-[#161a22]">
            {content.titleStart}{" "}
            <span className="relative inline-block">{content.titleAccent}<SectionUnderline /></span>
          </h2>
          <p className="mt-6 max-w-lg text-[15px] leading-[1.8] text-[#6f7280] sm:text-base">{content.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-5">
            <div>
              <dt className="text-base font-bold text-[#171b22]">{content.acrylicTitle}</dt>
              <dd className="mt-1 text-xs font-semibold text-[#087e91]">{content.acrylicSize}</dd>
            </div>
            <div>
              <dt className="text-base font-bold text-[#171b22]">{content.pvcTitle}</dt>
              <dd className="mt-1 text-xs font-semibold text-[#087e91]">{content.pvcSize}</dd>
            </div>
          </dl>
          <p className="mt-5 flex items-center gap-2 text-xs font-medium text-[#58606b]">
            <Nfc aria-hidden="true" className="size-4 text-[#087e91]" />{content.included}
          </p>
          <a href="#pricing" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-black px-6 py-3 text-xs font-medium text-white no-underline hover:bg-black/80 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0798ad]">
            {content.cta}
          </a>
        </MotionReveal>
        <MotionReveal delay={100} className="min-w-0">
          <figure className="mx-auto w-full max-w-[520px]">
            <div aria-hidden="true">{preview}</div>
            <figcaption className="mx-auto mt-2 max-w-md text-center text-[11px] leading-5 text-[#58606b]">{content.caption}</figcaption>
          </figure>
        </MotionReveal>
      </div>
    </section>
  );
}
