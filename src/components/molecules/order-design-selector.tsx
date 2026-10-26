import type { Messages } from "../../i18n";
import type { WifiPrintTheme } from "../../hooks/use-wifi-print";
import { isSocialPrintTheme, supportsPrintThemeMaterial } from "../../lib/print-themes";
import { wifiOrderThemes, type OrderDraft } from "../../server/orders/order.schemas";
import { SocialPrintThemePicker } from "./social-print-theme-picker";
import { WifiPrintThemePicker } from "./wifi-print-theme-picker";
import { PrintCardCanvas } from "./print-card-canvas";
import { WifiPrintCard } from "./wifi-print-card";
import { PrintCardScaledFrame } from "../elements/print-card-scaled-frame";
import { OrderPvcCard, PVC_CARD_HEIGHT, PVC_CARD_WIDTH } from "./order-pvc-card";

function isWifiOrderTheme(theme: string): theme is WifiPrintTheme {
  return wifiOrderThemes.some((key) => key === theme);
}

export function OrderDesignSelector({ value, onChange, messages }: {
  value: Pick<OrderDraft, "product" | "theme" | "material">;
  onChange: (theme: OrderDraft["theme"]) => void;
  messages: Messages;
}) {
  const content = messages.orders;
  const studio = messages.adminDashboard.printStudio;
  const theme = value.theme;
  const social = value.product === "social" && isSocialPrintTheme(theme) && supportsPrintThemeMaterial(theme, value.material) ? theme : "google";
  const wifi = value.product === "wifi" && isWifiOrderTheme(theme) ? theme : "monster";
  const defaults = studio.themes[social];
  return (
    <section className="space-y-5">
      {value.product === "wifi" ? <WifiPrintThemePicker theme={wifi} onChange={onChange} content={studio.wifi} /> : (
        <div className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
          <h2 className="text-sm font-bold">{content.design}</h2>
          <SocialPrintThemePicker material={value.material} theme={social} onChange={onChange} labels={studio.themes} className="mt-3" />
        </div>
      )}
      <div className="rounded-2xl border border-black/8 bg-[#f3f5f7] p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div><h2 className="text-sm font-bold">{content.preview}</h2><p className="mt-1 text-xs leading-5 text-[#69737d]">{content.previewHelp}</p></div>
          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#087e91] shadow-xs">{content.materialSizes[value.material]}</span>
        </div>
        <div aria-hidden="true" className="mx-auto mt-5 w-full">
          {value.material === "pvc" ? (
            <PrintCardScaledFrame canvasWidth={PVC_CARD_WIDTH} canvasHeight={PVC_CARD_HEIGHT} maxWidth={430}>
              <OrderPvcCard value={value} copy={value.product === "wifi" ? {
                headline: studio.wifi.defaultHeadline, footer: studio.wifi.defaultFooter, action: content.wifi,
                tap: studio.wifi.tap, tapHelp: studio.wifi.tapHelp, scan: studio.wifi.scan, scanHelp: studio.printLabels.scanHelp,
                or: studio.wifi.or, network: studio.wifi.network, qrAlt: studio.wifi.qrAlt,
              } : {
                preHeadline: defaults.defaultPreHeadline, headline: defaults.defaultHeadline, footer: defaults.defaultFooter,
                action: studio.printLabels.review, tap: studio.printLabels.tap, tapHelp: studio.printLabels.tapHelp,
                scan: studio.printLabels.scan, scanHelp: studio.printLabels.scanHelp, or: studio.printLabels.or, qrAlt: studio.printLabels.qrAlt,
              }} />
            </PrintCardScaledFrame>
          ) : (
            <PrintCardScaledFrame maxWidth={228}>
              {value.product === "wifi" ? <WifiPrintCard job={{ id: "preview", ssid: "TapQR WiFi", qrDataUrl: "" }} theme={wifi} title={studio.wifi.defaultHeadline} footer={studio.wifi.defaultFooter} content={studio.wifi} /> : <PrintCardCanvas theme={social} cardId="" labels={studio.printLabels} qrDataUrl="" preHeadline={defaults.defaultPreHeadline} headline={defaults.defaultHeadline} footerNote={defaults.defaultFooter} />}
            </PrintCardScaledFrame>
          )}
        </div>
      </div>
    </section>
  );
}
