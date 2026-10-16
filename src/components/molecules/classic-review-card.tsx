import { Leaf, Nfc, ScanLine, Star } from "lucide-react";
import type { ClassicPrintTheme } from "../elements/nfc-tap-target";
import { GoogleMark } from "../elements/google-mark";
import monsterOrange from "../assets/images/monsters/monster-orange.png";
import { GoogleColorBar, GoogleCornerAccents } from "./print-card-decorations";
import { OrangeMonsterClawsOverlay } from "./print-card-monster-graphics";

export type ReviewCardLabels = {
  tap: string;
  tapHelp: string;
  scan: string;
  scanHelp: string;
  or: string;
  review: string;
  qrAlt: string;
};

type Props = {
  monster?: boolean;
  showMonster?: boolean;
  theme: ClassicPrintTheme;
  cardId: string;
  preHeadline?: string;
  headline?: string;
  footerNote?: string;
  qrDataUrl: string;
  labels: ReviewCardLabels;
  className?: string;
  id?: string;
};

const visuals = {
  "google-classic": {
    surface: "bg-white text-[#172029] border-[#172029]",
    header: "bg-[#4285f4] text-white",
    accent: "bg-[#fbbc05] text-[#172029]",
    ring: "border-[#172029] text-[#172029]",
    footer: "bg-[#34a853] text-white",
  },
  minimal: {
    surface: "bg-[#faf9f6] text-[#172029] border-[#172029]",
    header: "bg-[#172029] text-[#faf9f6]",
    accent: "bg-white text-[#172029]",
    ring: "border-[#172029] text-[#172029]",
    footer: "bg-[#172029] text-white",
  },
  natural: {
    surface: "bg-[#f5f0e5] text-[#172029] border-[#172029]",
    header: "bg-[#283d32] text-[#f5f0e5]",
    accent: "bg-[#ffb332] text-[#172029]",
    ring: "border-[#172029] text-[#283d32]",
    footer: "bg-[#ffb332] text-[#172029]",
  },
};

export function ClassicReviewCard({
  theme, cardId, preHeadline, headline, footerNote, qrDataUrl, labels, className = "", id, monster = false, showMonster = true,
}: Props) {
  const visual = monster ? {
    ...visuals["google-classic"],
    surface: "bg-white text-[#172029] border-[#172029]",
    header: "text-[#172029]",
    accent: "bg-[#fbbc05] text-[#172029]",
    footer: "text-[#172029]",
  } : visuals[theme];
  return (
    <article
      id={id}
      className={`print-canvas-root relative flex h-[550px] w-[380px] flex-col overflow-hidden border-4 text-center ${monster ? "rounded-[20px]" : "rounded-[8px]"} ${visual.surface} ${className}`}
      style={{ boxSizing: "border-box" }}
    >
      {monster && <GoogleCornerAccents bold />}
      {monster && showMonster && <div aria-hidden="true" className="pointer-events-none absolute inset-0"><OrangeMonsterClawsOverlay /></div>}
      <header className={`relative z-10 flex h-[230px] shrink-0 flex-col items-center justify-center px-6 py-3 ${monster ? "" : "border-b-4 border-[#172029]"} ${visual.header}`}>
        {monster && <GoogleColorBar className="mb-3 shrink-0" />}
        <div className={`mb-3 grid shrink-0 place-items-center border-[3px] border-[#172029] bg-white shadow-[4px_4px_0_#172029] ${monster ? "size-16 -rotate-6 rounded-full" : "size-14 -rotate-6 rounded-[4px]"}`}>
          {monster && showMonster ? (
            <img src={monsterOrange} alt="" className="size-full object-contain p-1" />
          ) : theme === "natural" ? (
            <Leaf aria-hidden="true" className="size-8 text-[#283d32]" />
          ) : (
            <span className="[&_svg]:size-10"><GoogleMark /></span>
          )}
        </div>
        <p className={`text-[10px] font-extrabold tracking-[0.1em] uppercase ${monster ? "text-[#c2410c]" : ""}`}>{preHeadline}</p>
        <h1 className={`mt-2 leading-[1.08] font-black tracking-tight uppercase ${monster ? "text-[25px]" : "text-[27px]"}`}>
          {headline}
        </h1>
        <div aria-hidden="true" className="mt-3 flex gap-1 text-[#fbbc05]">
          {Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-5 fill-current stroke-[#172029]" strokeWidth={2} />)}
        </div>
      </header>
      <div className={`relative z-10 flex flex-1 flex-col justify-center py-3 ${monster ? "px-8" : "px-5"}`}>
        <p className={`mb-4 -rotate-2 border-2 border-[#172029] px-2 py-1.5 text-[10px] font-black tracking-[0.06em] uppercase shadow-[3px_3px_0_#172029] ${visual.accent}`}>{labels.review}</p>
        <div className="grid grid-cols-[1fr_24px_1fr] items-center gap-1">
          <div className="flex flex-col items-center">
            <div className={`grid size-[118px] place-items-center border-[3px] bg-white shadow-[4px_4px_0_#172029] ${monster ? "rounded-full" : "rounded-[4px]"} ${visual.ring}`}>
              <Nfc aria-hidden="true" className="size-14" strokeWidth={2.5} />
            </div>
            <p className="mt-3 text-[13px] font-black uppercase">{labels.tap}</p>
            <p className="mt-1 text-[9px] opacity-70">{labels.tapHelp}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="h-9 w-0.5 bg-current" />
            <span className="text-[9px] font-black uppercase">{labels.or}</span>
            <span className="h-9 w-0.5 bg-current" />
          </div>
          <div className="flex flex-col items-center">
            <div className={`size-[118px] rounded-[4px] border-[3px] bg-white p-2 shadow-[4px_4px_0_#172029] ${visual.ring}`}>
              {qrDataUrl ? <img alt={labels.qrAlt.replace("{cardId}", cardId)} src={qrDataUrl} className="size-full object-contain" /> : <div className="size-full rounded-lg bg-[#f3f5f7]" />}
            </div>
            <p className="mt-3 flex items-center gap-1 text-[13px] font-black uppercase"><ScanLine aria-hidden="true" className="size-3.5" />{labels.scan}</p>
            <p className="mt-1 text-[9px] opacity-70">{labels.scanHelp}</p>
          </div>
        </div>
      </div>
      <footer className={`relative z-10 py-3 ${monster ? "mx-auto w-[240px] px-2" : "border-t-4 border-[#172029] px-5"} ${visual.footer}`}>
        <p className="text-[11px] leading-4 font-bold">{footerNote}</p>
        {monster && <GoogleColorBar className="mt-2" />}
      </footer>
      {theme === "google-classic" && !monster && (
        <div aria-hidden="true" className="grid h-2 shrink-0 grid-cols-4 border-t-2 border-[#172029]">
          <span className="bg-[#4285f4]" /><span className="bg-[#ea4335]" /><span className="bg-[#fbbc05]" /><span className="bg-[#34a853]" />
        </div>
      )}
    </article>
  );
}
