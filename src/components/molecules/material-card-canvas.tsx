import type { CardMaterial } from "../../lib/firebase/firestore-schema";
import type { PrintThemeKey } from "../elements/nfc-tap-target";
import type { ReviewCardLabels } from "./classic-review-card";
import { OrderPvcCard } from "./order-pvc-card";
import { PrintCardCanvas } from "./print-card-canvas";

export type MaterialCardCanvasProps = {
  cardId: string;
  material: CardMaterial;
  labels: ReviewCardLabels;
  theme: PrintThemeKey;
  showMonster: boolean;
  preHeadline?: string;
  headline?: string;
  footerNote?: string;
  qrDataUrl: string;
};

export function MaterialCardCanvas({
  cardId,
  material,
  labels,
  theme,
  showMonster,
  preHeadline,
  headline,
  footerNote,
  qrDataUrl,
}: MaterialCardCanvasProps) {
  if (material === "pvc")
    return (
      <OrderPvcCard
        cardId={cardId}
        copy={{
          preHeadline,
          headline: headline ?? "",
          footer: footerNote ?? "",
          action: labels.review,
          tap: labels.tap,
          tapHelp: labels.tapHelp,
          scan: labels.scan,
          scanHelp: labels.scanHelp,
          or: labels.or,
          qrAlt: labels.qrAlt,
        }}
        qrDataUrl={qrDataUrl}
        showMonster={showMonster}
        value={{ product: "social", theme }}
      />
    );
  return (
    <PrintCardCanvas
      labels={labels}
      cardId={cardId}
      theme={theme}
      showMonster={showMonster}
      preHeadline={preHeadline}
      headline={headline}
      footerNote={footerNote}
      qrDataUrl={qrDataUrl}
    />
  );
}
