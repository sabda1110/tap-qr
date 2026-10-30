import type { Language, Messages } from "../../i18n";
import { ConsultationLink } from "../elements/consultation-link";
import { ProductShowcaseDoodles } from "../elements/product-showcase-doodles";

type Props = {
  content: Messages["consultation"];
  language: Language;
  imageSrc: string;
};

export function ConsultationInvitationSection({ content, language, imageSrc }: Props) {
  const banner = content.invitation;
  return (
    <section id="consultation" aria-labelledby="consultation-invitation-title"
      className="scroll-mt-24 overflow-hidden bg-white px-4 py-12 sm:px-8 sm:py-16">
      <div className="relative mx-auto max-w-6xl">
        <div className="relative grid items-center gap-5 overflow-hidden rounded-[2rem] bg-[#f5f3fa] px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[1.1fr_0.9fr] md:gap-8 lg:px-12">
          <div className="relative z-10 min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-black/45 uppercase">{banner.kicker}</p>
            <h2 id="consultation-invitation-title" className="mt-4 max-w-xl text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.15] font-extrabold tracking-[-0.04em] text-[#171b22]">
              {banner.titleStart}<span className="mt-1 block">{banner.titleAccent}</span>
            </h2>
            <p className="mt-5 max-w-lg text-[15px] leading-[1.8] text-[#58606b] sm:text-base">{banner.description}</p>
            <ConsultationLink language={language} label={content.cta} className="mt-6 w-full sm:w-auto" />
            <p className="mt-4 max-w-md text-xs leading-6 text-[#69737d]">{content.landingNote}</p>
          </div>
          <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px]">
            <img src={imageSrc} alt={banner.imageAlt} width={720} height={658}
              loading="lazy" decoding="async" className="h-auto w-full object-contain" />
          </div>
        </div>
        <ProductShowcaseDoodles />
      </div>
    </section>
  );
}
