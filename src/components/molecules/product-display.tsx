import type { Messages } from "../../i18n";
import previewQr from "../assets/images/product-preview-qr.svg";
import { PrintCardScaledFrame } from "../elements/print-card-scaled-frame";
import { ClassicReviewCard } from "./classic-review-card";

type Props = {
  content: Messages["adminDashboard"]["printStudio"];
  mascotSrc: string;
  benefits: string[];
};

export function ProductDisplay({ content, mascotSrc, benefits }: Props) {
  const acrylic = content.themes.google;
  const labels = content.printLabels;

  return (
    <div className="relative mx-auto aspect-[1.05] w-full max-w-[520px]">
      <span className="pointer-events-none absolute right-[3%] top-[3%] size-5 rotate-12 border-2 border-[#0798ad]" />
      <svg aria-hidden="true" className="pointer-events-none absolute bottom-[12%] right-[7%] size-9 text-[#171b22]" viewBox="0 0 40 40" fill="none">
        <path d="m20 3 2 12 12-4-9 9 11 6-13-1-3 12-3-12-13 1 11-6-9-9 12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>

      <div className="absolute right-[4%] top-[3%] w-[47%] rotate-3">
        <div className="relative rounded-xl border border-[#d1e4e8] bg-white/60 p-[3%] shadow-[3px_4px_0_rgba(164,187,191,0.45),6px_12px_18px_rgba(23,32,41,0.1)]">
          <PrintCardScaledFrame maxWidth={380}>
            <ClassicReviewCard
              monster
              theme="google-classic"
              cardId=""
              labels={labels}
              preHeadline={acrylic.defaultPreHeadline}
              headline={acrylic.defaultHeadline}
              footerNote={acrylic.defaultFooter}
              qrDataUrl={previewQr}
            />
          </PrintCardScaledFrame>
        </div>
        <div className="relative mx-auto -mt-0.5 h-4 w-[112%] -translate-x-[5%] skew-x-[-16deg] rounded-sm border border-[#c8dfe4] bg-[#dff2f5]/80 shadow-[0_3px_0_#abc9ce,3px_7px_10px_rgba(23,32,41,0.1)] sm:h-5" />
      </div>

      <div className="absolute bottom-0 left-[-3%] z-10 aspect-square w-[68%]">
        <img src={mascotSrc} alt="" width={1254} height={1254} className="h-auto w-full select-none" loading="lazy" decoding="async" draggable={false} />
        <ul className="absolute inset-x-[16%] top-[7%] flex h-[17%] flex-col items-center justify-center gap-1 text-center text-[clamp(6px,1.25vw,11px)] leading-tight font-bold text-white md:text-[clamp(6px,0.85vw,10px)]">
          {benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
        </ul>
      </div>
    </div>
  );
}
