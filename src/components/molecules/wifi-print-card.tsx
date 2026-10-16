import { Nfc, ScanLine, Wifi } from "lucide-react";
import type { wifiPrintId } from "../../i18n/locales/wifi-print-id";
import type { WifiPrintJob, WifiPrintTheme } from "../../hooks/use-wifi-print";
import monsterOrange from "../assets/images/monsters/monster-orange.png";
import monsterBarber from "../assets/images/monsters/monster-barber.jpg";
import { VintageCoffeeMascot } from "../elements/vintage-coffee-mascot";
import { MonsterAvatar } from "../elements/monster-avatar";
import { WifiPrintDecorations, wifiThemeVisuals } from "./wifi-print-decorations";

type Props = {
  job: WifiPrintJob;
  theme: WifiPrintTheme;
  title: string;
  footer: string;
  content: typeof wifiPrintId;
  id?: string;
};

export function WifiPrintCard({ job, theme, title, footer, content, id }: Props) {
  const visual = wifiThemeVisuals[theme];
  return (
    <article id={id} className={`print-canvas-root relative flex h-[550px] w-[380px] flex-col overflow-hidden rounded-[16px] border-4 border-[#172029] text-center ${visual.surface}`} style={{ boxSizing: "border-box" }}>
      <WifiPrintDecorations theme={theme} />
      <header className={`relative z-10 flex h-[168px] shrink-0 flex-col items-center justify-center gap-2 border-b-4 border-[#172029] px-7 py-3 ${visual.header}`}>
        <div className="flex items-center gap-3">
          {theme === "monster" && <img alt="" src={monsterOrange} className="size-10 -rotate-6 rounded-full border-2 border-[#172029] bg-white object-contain shadow-[3px_3px_0_#172029]" />}
          {theme === "coffee" && <VintageCoffeeMascot size="sm" className="size-12!" />}
          {theme === "barbershop" && <img alt="" src={monsterBarber} className="size-12 -rotate-6 rounded border-[3px] border-[#b48c36] bg-white object-cover shadow-[3px_3px_0_#b48c36]" />}
          {theme === "kraken" && <span aria-hidden="true"><MonsterAvatar theme="modern" size="sm" className="size-12!" /></span>}
          <Wifi aria-hidden="true" className="size-9" strokeWidth={3} />
        </div>
        <h1 className="text-[25px] leading-[1.1] font-black tracking-tight break-words uppercase">{title.trim()}</h1>
      </header>
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-2">
        <p className="text-[9px] font-bold tracking-widest uppercase">{content.network}</p>
        <p className="mt-1 max-w-full text-[18px] leading-5 font-black break-all">{job.ssid}</p>
        <div className="mt-4 grid w-full grid-cols-[1fr_20px_1fr] items-center gap-2">
          <div className="flex min-w-0 flex-col items-center">
            <div className={`grid size-[118px] place-items-center rounded-full border-[3px] ${visual.target}`}>
              <Nfc aria-hidden="true" className="size-12" strokeWidth={2.5} />
            </div>
            <p className="mt-3 text-[13px] font-black uppercase">{content.tap}</p>
            <p className="mt-1 text-[9px] leading-3 font-medium">{content.tapHelp}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className={`h-8 w-0.5 ${visual.divider}`} />
            <span className="text-[9px] font-black uppercase">{content.or}</span>
            <span className={`h-8 w-0.5 ${visual.divider}`} />
          </div>
          <div className="flex min-w-0 flex-col items-center">
            <div className="size-[136px] shrink-0 rounded-lg border-[3px] border-[#172029] bg-white p-2 shadow-[4px_4px_0_#172029]">
              <img className="size-full object-contain" src={job.qrDataUrl} alt={content.qrAlt.replace("{ssid}", job.ssid)} />
            </div>
            <p className="mt-3 flex items-center gap-1 text-[10px] font-black uppercase"><ScanLine aria-hidden="true" className="size-3.5" />{content.scan}</p>
          </div>
        </div>
        <p className="mt-4 max-w-[260px] text-[10px] leading-4 font-medium">{content.instruction}</p>
      </div>
      <footer className={`relative z-10 border-t-4 border-[#172029] px-6 py-3 ${visual.footer}`}>
        <p className="text-[10px] leading-[14px] font-bold break-words">{footer.trim()}</p>
      </footer>
    </article>
  );
}
