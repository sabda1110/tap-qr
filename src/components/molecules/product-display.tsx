import type { Messages } from "../../i18n";
import { PVC_CARD_HEIGHT, PVC_CARD_WIDTH } from "../../lib/print-dimensions";
import previewQr from "../assets/images/product-preview-qr.svg";
import { PrintCardScaledFrame } from "../elements/print-card-scaled-frame";
import { ClassicReviewCard } from "./classic-review-card";
import { OrderPvcCard } from "./order-pvc-card";

type Props = { content: Messages["adminDashboard"]["printStudio"] };

export function ProductDisplay({ content }: Props) {
  const acrylic = content.themes.google;
  const pvc = content.themes["google-classic"];
  const labels = content.printLabels;

  return (
    <div className="relative mx-auto grid w-full max-w-[520px] grid-cols-[1fr_1.15fr] items-end gap-5 px-3 py-8 sm:gap-7 sm:px-4">
      <span className="pointer-events-none absolute inset-x-[3%] bottom-[10%] top-[15%] rounded-[45%_55%_50%_40%] bg-[#eaf6f8]/70" />
      <span className="pointer-events-none absolute right-[8%] top-[14%] size-5 rounded-full border-2 border-[#ffb332]" />

      <div className="relative mb-3 min-w-0 -rotate-3">
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

      <div className="relative mb-7 min-w-0 rotate-[5deg] rounded-2xl bg-[#c9cdd0] pb-0.5 pr-0.5 shadow-[4px_8px_14px_rgba(23,32,41,0.16)]">
        <PrintCardScaledFrame canvasWidth={PVC_CARD_WIDTH} canvasHeight={PVC_CARD_HEIGHT} maxWidth={PVC_CARD_WIDTH}>
          <OrderPvcCard
            value={{ product: "social", theme: "google-classic" }}
            copy={{
              preHeadline: pvc.defaultPreHeadline,
              headline: pvc.defaultHeadline,
              footer: pvc.defaultFooter,
              action: labels.review,
              tap: labels.tap,
              tapHelp: labels.tapHelp,
              scan: labels.scan,
              scanHelp: labels.scanHelp,
              or: labels.or,
              qrAlt: labels.qrAlt,
            }}
            qrDataUrl={previewQr}
          />
        </PrintCardScaledFrame>
      </div>
    </div>
  );
}
