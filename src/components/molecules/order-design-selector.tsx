import { Type } from "lucide-react";
import type { Messages } from "../../i18n";
import { socialOrderThemes, type OrderDraft } from "../../server/orders/order.schemas";
import { ThemePickerButton } from "../elements/theme-picker-button";
import { WifiPrintThemePicker } from "./wifi-print-theme-picker";
import { PrintCardCanvas } from "./print-card-canvas";
import { WifiPrintCard } from "./wifi-print-card";

export function OrderDesignSelector({ value, onChange, messages }: {
  value: Pick<OrderDraft, "product" | "theme">;
  onChange: (theme: OrderDraft["theme"]) => void;
  messages: Messages;
}) {
  const content = messages.orders;
  const studio = messages.adminDashboard.printStudio;
  const theme = value.theme;
  const social = value.product === "social" && theme !== "monster" && theme !== "mono" && theme !== "kraken" && theme !== "poster" ? theme : "google";
  const wifi = value.product === "wifi" && theme !== "google" && theme !== "google-classic" && theme !== "minimal" && theme !== "modern" && theme !== "review-poster" ? theme : "monster";
  const defaults = studio.themes[social];
  return (
    <section className="space-y-5">
      {value.product === "wifi" ? <WifiPrintThemePicker theme={wifi} onChange={onChange} content={studio.wifi} /> : (
        <div className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
          <h2 className="text-sm font-bold">{content.design}</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {socialOrderThemes.map((key) => <ThemePickerButton key={key} active={theme === key} onClick={() => onChange(key)} icon={<Type aria-hidden="true" className="size-4.5" />} title={studio.themes[key].title} subtitle={studio.themes[key].subtitle} />)}
          </div>
        </div>
      )}
      <div className="rounded-2xl border border-black/8 bg-[#f3f5f7] p-5">
        <h2 className="text-sm font-bold">{content.preview}</h2>
        <p className="mt-1 text-xs leading-5 text-[#69737d]">{content.previewHelp}</p>
        <div aria-hidden="true" className="mx-auto mt-5 h-[330px] w-[228px]">
          <div className="origin-top-left scale-[0.6]">
            {value.product === "wifi" ? <WifiPrintCard job={{ id: "preview", ssid: "TapQR WiFi", qrDataUrl: "" }} theme={wifi} title={studio.wifi.defaultHeadline} footer={studio.wifi.defaultFooter} content={studio.wifi} /> : <PrintCardCanvas theme={social} cardId="" labels={studio.printLabels} qrDataUrl="" preHeadline={defaults.defaultPreHeadline} headline={defaults.defaultHeadline} footerNote={defaults.defaultFooter} />}
          </div>
        </div>
      </div>
    </section>
  );
}
