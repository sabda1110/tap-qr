import { GymMonsterCard } from "./gym-monster-card";
import { Nfc, QrCode, ScanLine } from "lucide-react";
import type { AcrylicMonsterTheme } from "@/lib/print-themes";
import {
  MonsterColorBar,
  MonsterDecorations,
  MonsterMascot,
  MonsterStars,
} from "../elements/monster-print-artwork";
import type { ReviewCardLabels } from "./classic-review-card";

type Props = {
  theme: AcrylicMonsterTheme;
  cardId: string;
  preHeadline?: string;
  headline?: string;
  footerNote?: string;
  qrDataUrl: string;
  labels: ReviewCardLabels;
  showMonster?: boolean;
  className?: string;
  id?: string;
};

const styles = {
  mango: {
    surface: "bg-white",
    header: "h-[230px] pt-3",
    mascot: "size-[64px] -rotate-6 rounded-full bg-white",
    preHeadline: "text-[#c2410c]",
    banner: "-rotate-2 bg-[#ffb332]",
    nfc: "rounded-full bg-white",
    qr: "rounded-[6px] shadow-[5px_5px_0_#172029]",
    footer: "",
  },
  boba: {
    surface: "bg-[#f4fcfd]",
    header: "h-[218px] pt-3",
    mascot: "h-[64px] w-[88px] rotate-3 rounded-[28px] bg-[#27b9cf]",
    preHeadline: "text-[#0e6573]",
    banner: "rotate-1 rounded-full bg-[#27b9cf]",
    nfc: "rounded-[36px] bg-[#e8f8fb]",
    qr: "rounded-[20px] shadow-[5px_5px_0_#27b9cf]",
    footer: "border-t-2 border-dashed border-[#172029]/30",
  },
  ziggy: {
    surface: "bg-[#fff8e9]",
    header: "h-[230px] pt-3",
    mascot: "size-[64px] rotate-6 rounded-[18px] bg-[#ffb332]",
    preHeadline: "text-[#8a4709]",
    banner: "-rotate-1 bg-white",
    nfc: "rounded-[24px] bg-[#ffb332]",
    qr: "rounded-[6px] shadow-[5px_5px_0_#27b9cf]",
    footer: "border-t-[3px] border-[#172029] bg-[#ffb332]",
  },
} as const;

type Character = keyof typeof styles;

function getCharacter(theme: AcrylicMonsterTheme): Character {
  if (theme === "acrylic-monster-boba") return "boba";
  return theme === "acrylic-monster-ziggy" ? "ziggy" : "mango";
}

function ReviewHeader({ character, preHeadline, headline, labels, showMonster }: Props & { character: Character }) {
  const visual = styles[character];
  const title = headline?.trim() || labels.review;
  return (
    <header className={`relative z-10 flex shrink-0 flex-col items-center px-7 text-center ${visual.header}`}>
      <MonsterColorBar className="mb-2 shrink-0" />
      <div className={`mb-2 grid shrink-0 place-items-center border-[3px] border-[#172029] shadow-[4px_4px_0_#172029] ${visual.mascot}`}>
        {showMonster ? (
          <MonsterMascot character={character} className="size-full p-0.5" />
        ) : (
          <span className="text-[17px] font-black tracking-[-0.06em]">TapQR</span>
        )}
      </div>
      {preHeadline && <p className={`line-clamp-1 shrink-0 text-[9px] leading-3 font-extrabold tracking-[0.08em] uppercase ${visual.preHeadline}`}>{preHeadline}</p>}
      <h1
        className="mt-1.5 line-clamp-3 shrink-0 font-black tracking-[-0.045em] uppercase"
        style={{ fontSize: title.length > 48 ? 22 : 25, lineHeight: 1.04, overflowWrap: "anywhere" }}
      >
        {title}
      </h1>
      <MonsterStars className="mt-2 shrink-0" />
    </header>
  );
}

function InteractionPanel({ character, labels, qrDataUrl, cardId }: Props & { character: Character }) {
  const visual = styles[character];
  const qrAlt = labels.qrAlt.replace("{cardId}", cardId);
  return (
    <section className="relative z-10 grid h-[214px] shrink-0 grid-cols-[138px_20px_138px] items-center justify-center gap-1.5 px-3 pt-2">
      <div className="flex min-w-0 flex-col items-center text-center">
        <div className={`grid size-[138px] place-items-center border-[3px] border-[#172029] shadow-[5px_5px_0_#172029] ${visual.nfc}`}>
          <Nfc aria-hidden="true" className="size-[60px]" strokeWidth={2.5} />
        </div>
        <p className="mt-3 text-[12px] leading-4 font-black uppercase">{labels.tap}</p>
        <p className="mt-1 text-[8px] leading-3 text-[#54606b]">{labels.tapHelp}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span aria-hidden="true" className="h-9 w-0.5 bg-[#172029]" />
        <span className="text-[8px] font-black uppercase">{labels.or}</span>
        <span aria-hidden="true" className="h-9 w-0.5 bg-[#172029]" />
      </div>
      <div className="flex min-w-0 flex-col items-center text-center">
        <div className={`grid size-[138px] place-items-center border-[3px] border-[#172029] bg-white p-3 ${visual.qr}`}>
          {qrDataUrl ? (
            <img src={qrDataUrl} alt={qrAlt} className="block size-full object-contain" />
          ) : <QrCode aria-label={qrAlt} className="size-full" strokeWidth={1.5} />}
        </div>
        <p className="mt-3 flex items-center gap-1 text-[12px] leading-4 font-black uppercase">
          <ScanLine aria-hidden="true" className="size-3.5" />{labels.scan}
        </p>
        <p className="mt-1 text-[8px] leading-3 text-[#54606b]">{labels.scanHelp}</p>
      </div>
    </section>
  );
}

export function MonsterAcrylicCard({ theme, className = "", id, showMonster = true, ...content }: Props) {
  if (theme === "acrylic-monster-gym") return (
    <GymMonsterCard id={id} className={className} cardId={content.cardId} qrDataUrl={content.qrDataUrl} showMonster={showMonster}
      copy={{ ...content.labels, headline: content.headline ?? "", preHeadline: content.preHeadline, footer: content.footerNote ?? "", action: content.labels.review }} />
  );
  const character = getCharacter(theme);
  const visual = styles[character];
  const props = { ...content, theme, character, showMonster };
  return (
    <article
      id={id}
      data-print-theme={theme}
      className={`print-canvas-root relative flex h-[550px] w-[380px] shrink-0 flex-col overflow-hidden rounded-[26px] border-4 border-[#172029] text-[#172029] ${visual.surface} ${className}`}
      style={{ boxSizing: "border-box" }}
    >
      {showMonster && <MonsterDecorations character={character} />}
      {character === "boba" && <span aria-hidden="true" className="pointer-events-none absolute -top-16 left-1/2 h-[224px] w-[360px] -translate-x-1/2 rounded-[50%] bg-[#e8f8fb]" />}
      {character === "ziggy" && (
        <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[202px] h-5 w-full" viewBox="0 0 372 20" preserveAspectRatio="none">
          <path d="m0 10 15-7 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 14 15-14 15 7" fill="none" stroke="#27b9cf" strokeWidth="4" />
        </svg>
      )}
      <ReviewHeader {...props} />
      <div className="relative z-10 mx-8 flex h-[36px] shrink-0 items-center">
        <p className={`flex min-h-[31px] w-full items-center justify-center border-[3px] border-[#172029] px-2 py-1 text-center text-[9px] leading-3 font-black tracking-[0.04em] uppercase shadow-[3px_3px_0_#172029] ${visual.banner}`}>
          {content.labels.review}
        </p>
      </div>
      <InteractionPanel {...props} />
      <footer className={`relative z-10 mt-auto flex min-h-[62px] flex-col items-center justify-center gap-1.5 px-10 text-center ${visual.footer}`}>
        {content.footerNote && <p className="line-clamp-2 text-[10px] leading-[1.4] font-bold">{content.footerNote}</p>}
        <MonsterColorBar />
        {content.cardId && <p className="max-w-full truncate font-mono text-[6px] leading-none text-[#54606b]">{content.cardId}</p>}
      </footer>
    </article>
  );
}
