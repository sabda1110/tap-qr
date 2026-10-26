import { Leaf, Nfc, QrCode, Star, Wifi } from "lucide-react";
import type { ReactNode } from "react";
import type { OrderDraft } from "../../server/orders/order.schemas";
import { PVC_CARD_HEIGHT, PVC_CARD_WIDTH } from "../../lib/print-dimensions";
import { isMonsterPrintTheme, isPvcPrintTheme } from "../../lib/print-themes";
import monsterBarber from "../assets/images/monsters/monster-barber.jpg";
import monsterOrange from "../assets/images/monsters/monster-orange.png";
import { GoogleMark } from "../elements/google-mark";
import { MonsterAvatar } from "../elements/monster-avatar";
import { VintageCoffeeMascot } from "../elements/vintage-coffee-mascot";
import { ContemporaryPvcCard } from "./contemporary-pvc-card";
import { MonsterPvcCard } from "./monster-pvc-card";

export { PVC_CARD_HEIGHT, PVC_CARD_WIDTH } from "../../lib/print-dimensions";

export type PvcCardCopy = {
  preHeadline?: string;
  headline: string;
  footer: string;
  action: string;
  tap: string;
  tapHelp: string;
  scan: string;
  scanHelp: string;
  or: string;
  network?: string;
  qrAlt: string;
};

type PvcCardVisual = {
  surface: string;
  panel: string;
  accent: string;
  action: string;
  muted: string;
  marker: string;
};

const visuals = {
  google: { surface: "border-[#172029] bg-white text-[#172029]", panel: "bg-[#4285f4] text-white", accent: "bg-[#fbbc05] text-[#172029]", action: "border-[#172029] bg-white", muted: "text-white/80", marker: "bg-[#34a853]" },
  mono: { surface: "border-[#172029] bg-[#faf9f6] text-[#172029]", panel: "bg-[#172029] text-white", accent: "bg-white text-[#172029]", action: "border-[#172029] bg-white", muted: "text-white/70", marker: "bg-[#172029]" },
  natural: { surface: "border-[#172029] bg-[#f5f0e5] text-[#172029]", panel: "bg-[#283d32] text-white", accent: "bg-[#ffb332] text-[#172029]", action: "border-[#172029] bg-[#e2e8da]", muted: "text-white/75", marker: "bg-[#ffb332]" },
  coffee: { surface: "border-[#2c1810] bg-[#fff8e9] text-[#2c1810]", panel: "bg-[#d97706] text-[#172029]", accent: "bg-[#0d9488] text-white", action: "border-[#2c1810] bg-[#fef3c7]", muted: "text-[#2c1810]/70", marker: "bg-[#0d9488]" },
  barbershop: { surface: "border-[#172029] bg-[#f8f5ee] text-[#172029]", panel: "bg-[#172029] text-white", accent: "bg-[#b48c36] text-[#172029]", action: "border-[#172029] bg-white", muted: "text-white/70", marker: "bg-[#d9383a]" },
  neon: { surface: "border-[#84e034] bg-[#090d16] text-white", panel: "bg-[#090d16] text-white", accent: "bg-[#84e034] text-[#090d16]", action: "border-[#84e034] bg-[#131b2e] text-[#84e034]", muted: "text-slate-300", marker: "bg-[#84e034]" },
  poster: { surface: "border-[#174780] bg-[#fffef9] text-[#174780]", panel: "bg-[#fffef9] text-[#174780]", accent: "bg-[#174780] text-white", action: "border-[#174780] bg-white", muted: "text-[#174780]/70", marker: "bg-[#174780]" },
  monster: { surface: "border-[#172029] bg-white text-[#172029]", panel: "bg-[#27b9cf] text-[#172029]", accent: "bg-[#ffb332] text-[#172029]", action: "border-[#172029] bg-[#fff4dd]", muted: "text-[#172029]/70", marker: "bg-[#ffb332]" },
} satisfies Record<string, PvcCardVisual>;

function getVisual(product: OrderDraft["product"], theme: OrderDraft["theme"]): PvcCardVisual {
  if (theme === "coffee" || theme === "barbershop" || theme === "natural") return visuals[theme];
  if (theme === "modern" || theme === "kraken") return visuals.neon;
  if (theme === "review-poster" || theme === "poster") return visuals.poster;
  if (theme === "minimal" || theme === "mono") return visuals.mono;
  if (product === "wifi" && theme === "monster") return visuals.monster;
  return visuals.google;
}

function ThemeMark({ product, theme, showMonster }: Pick<OrderDraft, "product" | "theme"> & { showMonster: boolean }) {
  if (theme === "coffee" && showMonster) return <VintageCoffeeMascot size="sm" className="size-9!" />;
  if (theme === "barbershop" && showMonster) return <img alt="" src={monsterBarber} className="size-full rounded-lg object-cover" />;
  if ((theme === "modern" || theme === "kraken") && showMonster) return <MonsterAvatar theme="modern" size="sm" className="size-9!" />;
  if ((theme === "google" || theme === "monster") && showMonster) return <img alt="" src={monsterOrange} className="size-full object-contain p-1" />;
  if (product === "wifi") return <Wifi className="size-10" strokeWidth={3} />;
  if (theme === "google-classic") return <span className="[&_svg]:size-10"><GoogleMark /></span>;
  if (theme === "natural") return <Leaf className="size-10" strokeWidth={3} />;
  if (theme === "minimal") return <span className="text-[#172029] [&_svg]:size-10"><GoogleMark monochrome /></span>;
  return <Star className="size-10 fill-current" strokeWidth={2.5} />;
}

function ActionTile({ children, label, help, className }: { children: ReactNode; label: string; help: string; className: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center">
      <div className={`grid size-[100px] place-items-center rounded-2xl border-[3px] shadow-[5px_5px_0_#172029] ${className}`}>{children}</div>
      <p className="mt-3 text-center text-[12px] leading-4 font-black uppercase">{label}</p>
      <p className="mt-1 text-center text-[9px] leading-3 opacity-70">{help}</p>
    </div>
  );
}

export function OrderPvcCard({ value, copy, cardId = "", qrDataUrl = "", showMonster = true, id }: {
  value: Pick<OrderDraft, "product" | "theme">;
  copy: PvcCardCopy;
  cardId?: string;
  qrDataUrl?: string;
  showMonster?: boolean;
  id?: string;
}) {
  if (value.product === "social" && isPvcPrintTheme(value.theme)) {
    if (isMonsterPrintTheme(value.theme)) {
      return <MonsterPvcCard theme={value.theme} copy={copy} cardId={cardId} qrDataUrl={qrDataUrl} showMonster={showMonster} id={id} />;
    }
    return <ContemporaryPvcCard theme={value.theme} copy={copy} cardId={cardId} qrDataUrl={qrDataUrl} id={id} />;
  }
  const visual = getVisual(value.product, value.theme);
  return (
    <article id={id} className={`print-canvas-root pvc-print-canvas relative shrink-0 overflow-hidden rounded-[24px] border-4 ${visual.surface}`} style={{ boxSizing: "border-box", width: PVC_CARD_WIDTH, height: PVC_CARD_HEIGHT }}>
      <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-3 ${visual.marker}`} />
      <div aria-hidden="true" className="absolute -right-9 -top-9 size-28 rotate-12 border-4 border-current opacity-10" />
      <div className="grid h-full grid-cols-[210px_1fr]">
        <header className={`relative flex min-w-0 flex-col border-r-4 border-[#172029] px-5 pb-4 pt-6 ${visual.panel}`}>
          <div className={`grid size-12 shrink-0 -rotate-3 place-items-center rounded-lg border-[3px] border-[#172029] shadow-[4px_4px_0_#172029] ${visual.accent}`}>
            <ThemeMark product={value.product} theme={value.theme} showMonster={showMonster} />
          </div>
          {copy.preHeadline && <p className={`mt-3 text-[9px] leading-3 font-extrabold tracking-[0.04em] uppercase ${visual.muted}`}>{copy.preHeadline}</p>}
          <h1 className="mt-2 break-words text-[24px] leading-[1.04] font-black tracking-tight uppercase">{copy.headline}</h1>
          <div className={`mt-3 w-fit -rotate-1 border-2 border-[#172029] px-2 py-1 text-[9px] leading-3 font-black uppercase shadow-[3px_3px_0_#172029] ${visual.accent}`}>{copy.action}</div>
          <p className={`mt-auto pt-3 text-[9px] leading-3.5 font-bold ${visual.muted}`}>{copy.footer}</p>
        </header>
        <section className="relative flex min-w-0 flex-col justify-center px-5 py-5 text-center">
          {copy.network && <div className={`mb-4 rounded-lg border-2 border-current px-3 py-2 ${visual.accent}`}><p className="text-[8px] font-bold tracking-widest uppercase">{copy.network}</p><p className="mt-0.5 text-sm font-black">TapQR WiFi</p></div>}
          <div className="grid grid-cols-[1fr_18px_1fr] items-center gap-2">
            <ActionTile label={copy.tap} help={copy.tapHelp} className={visual.action}><Nfc className="size-11" strokeWidth={2.6} /></ActionTile>
            <span className="text-[9px] font-black uppercase opacity-60">{copy.or}</span>
            <ActionTile label={copy.scan} help={copy.scanHelp} className={`${visual.action} bg-white text-[#172029]`}>
              {qrDataUrl ? <img alt={copy.qrAlt.replace("{cardId}", cardId)} className="size-[82px] object-contain" src={qrDataUrl} /> : <QrCode className="size-17" strokeWidth={1.8} />}
            </ActionTile>
          </div>
        </section>
      </div>
    </article>
  );
}
