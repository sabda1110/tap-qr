import { Nfc, QrCode, ScanLine } from "lucide-react";
import { PVC_CARD_HEIGHT, PVC_CARD_WIDTH } from "@/lib/print-dimensions";
import type { PvcMonsterTheme } from "@/lib/print-themes";
import {
  MonsterColorBar,
  MonsterDecorations,
  MonsterMascot,
  MonsterStars,
} from "../elements/monster-print-artwork";
import type { PvcCardCopy } from "./order-pvc-card";

type Props = {
  theme: PvcMonsterTheme;
  copy: PvcCardCopy;
  cardId: string;
  qrDataUrl: string;
  showMonster?: boolean;
  id?: string;
};

const styles = {
  mango: {
    surface: "bg-white",
    badge: "-rotate-6 rounded-full bg-white",
    banner: "-rotate-2 bg-[#ffb332]",
    nfc: "rounded-full bg-white",
    qr: "rounded-[6px] shadow-[4px_4px_0_#172029]",
    footer: "bg-white",
  },
  boba: {
    surface: "bg-[#f4fcfd]",
    badge: "rotate-3 rounded-[22px] bg-[#27b9cf]",
    banner: "rotate-1 rounded-full bg-[#27b9cf]",
    nfc: "rounded-[20px] bg-[#e8f8fb]",
    qr: "rounded-[20px] shadow-[4px_4px_0_#27b9cf]",
    footer: "border-t-2 border-dashed border-[#172029]/30 bg-[#e8f8fb]",
  },
  ziggy: {
    surface: "bg-[#fff8e9]",
    badge: "rotate-6 rounded-[16px] bg-[#ffb332]",
    banner: "-rotate-1 bg-white",
    nfc: "rounded-[16px] bg-[#ffb332]",
    qr: "rounded-[6px] shadow-[4px_4px_0_#27b9cf]",
    footer: "border-t-[3px] border-[#172029] bg-[#ffb332]",
  },
} as const;

type Character = keyof typeof styles;
type ContentProps = Omit<Props, "theme" | "id"> & { character: Character };

function getCharacter(theme: PvcMonsterTheme): Character {
  if (theme === "pvc-monster-boba") return "boba";
  return theme === "pvc-monster-ziggy" ? "ziggy" : "mango";
}

function MascotBadge({ character, showMonster, size = 58 }: Pick<ContentProps, "character" | "showMonster"> & { size?: number }) {
  return (
    <div className={`grid shrink-0 place-items-center border-[3px] border-[#172029] shadow-[3px_3px_0_#172029] ${styles[character].badge}`} style={{ width: size, height: size }}>
      {showMonster ? <MonsterMascot character={character} className="size-full p-0.5" /> : <span className="text-[13px] font-black tracking-[-0.06em]">TapQR</span>}
    </div>
  );
}

function ReviewTitle({ copy, compact = false, className = "" }: Pick<ContentProps, "copy"> & { compact?: boolean; className?: string }) {
  const title = copy.headline.trim() || copy.action;
  return (
    <h1
      className={`line-clamp-3 min-w-0 font-black tracking-[-0.045em] uppercase ${className}`}
      style={{ fontSize: compact || title.length > 48 ? 23 : 27, lineHeight: 1.08, overflowWrap: "anywhere" }}
    >
      {title}
    </h1>
  );
}

function ScanPanel({ character, copy, qrDataUrl, cardId }: ContentProps) {
  const qrAlt = copy.qrAlt.replace("{cardId}", cardId);
  return (
    <section className="relative flex min-w-0 flex-col items-center justify-center text-center">
      <span className="absolute top-1/2 -left-[15px] -translate-y-1/2 text-[7px] font-black uppercase">{copy.or}</span>
      <div className={`grid size-[158px] shrink-0 place-items-center border-[3px] border-[#172029] bg-white p-3 ${styles[character].qr}`}>
        {qrDataUrl ? <img src={qrDataUrl} alt={qrAlt} className="block size-full object-contain" /> : <QrCode aria-label={qrAlt} className="size-full" strokeWidth={1.5} />}
      </div>
      <p className="mt-2.5 flex items-center gap-1 text-[11px] leading-4 font-black uppercase"><ScanLine aria-hidden="true" className="size-3.5" />{copy.scan}</p>
      <p className="mt-0.5 text-[8px] leading-3 text-[#54606b]">{copy.scanHelp}</p>
    </section>
  );
}

function TapPanel({ character, copy }: Pick<ContentProps, "character" | "copy">) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`grid size-[52px] shrink-0 place-items-center border-[3px] border-[#172029] shadow-[3px_3px_0_#172029] ${styles[character].nfc}`}>
        <Nfc aria-hidden="true" className="size-[29px]" strokeWidth={2.6} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] leading-4 font-black uppercase">{copy.tap}</p>
        <p className="mt-0.5 text-[8px] leading-3 text-[#54606b]">{copy.tapHelp}</p>
      </div>
    </div>
  );
}

function ReviewBanner({ character, copy }: Pick<ContentProps, "character" | "copy">) {
  return (
    <p className={`border-2 border-[#172029] px-2 py-1.5 text-center text-[8px] leading-3 font-black uppercase shadow-[2px_2px_0_#172029] ${styles[character].banner}`}>
      {copy.action}
    </p>
  );
}

function MangoArtwork(props: ContentProps) {
  return (
    <>
      <header className="relative z-10 flex h-[68px] shrink-0 items-center justify-between px-5 pt-2">
        <MascotBadge {...props} />
        <div className="flex max-w-[330px] flex-col items-end gap-2 text-right">
          <MonsterColorBar />
          {props.copy.preHeadline && <p className="text-[9px] leading-3 font-extrabold tracking-[0.06em] text-[#c2410c] uppercase">{props.copy.preHeadline}</p>}
        </div>
      </header>
      <div className="relative z-10 grid h-[214px] shrink-0 grid-cols-[1fr_164px] gap-4 px-5 pt-1 pb-2">
        <section className="flex min-w-0 flex-col justify-between">
          <ReviewTitle {...props} />
          <MonsterStars className="my-1 [&_svg]:size-[17px]" />
          <ReviewBanner {...props} />
          <div className="mt-2"><TapPanel {...props} /></div>
        </section>
        <ScanPanel {...props} />
      </div>
    </>
  );
}

function BobaArtwork(props: ContentProps) {
  return (
    <>
      <header className="relative z-10 flex h-[42px] shrink-0 items-center justify-between border-b-2 border-dashed border-[#172029]/25 bg-[#e8f8fb] px-5">
        <span className="text-[17px] font-black tracking-[-0.06em]">Tap<span className="text-[#087f94]">QR</span></span>
        {props.copy.preHeadline && <p className="max-w-[320px] text-right text-[8px] leading-3 font-extrabold tracking-[0.06em] uppercase">{props.copy.preHeadline}</p>}
      </header>
      <div className="relative z-10 grid h-[240px] shrink-0 grid-cols-[1fr_164px] items-center gap-4 px-5 py-3">
        <section className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center gap-3">
            <MascotBadge {...props} size={66} />
            <ReviewTitle {...props} compact className="flex-1 text-left" />
          </div>
          <MonsterStars className="[&_svg]:size-[17px]" />
          <ReviewBanner {...props} />
          <TapPanel {...props} />
        </section>
        <ScanPanel {...props} />
      </div>
    </>
  );
}

function ZiggyArtwork(props: ContentProps) {
  return (
    <>
      <header className="relative z-10 flex h-[52px] shrink-0 items-center justify-between px-5 pt-1">
        <MonsterColorBar />
        {props.copy.preHeadline && <p className="max-w-[295px] text-right text-[8px] leading-3 font-extrabold tracking-[0.06em] uppercase">{props.copy.preHeadline}</p>}
      </header>
      <div className="relative z-10 grid h-[230px] shrink-0 grid-cols-[1fr_164px] gap-4 px-5 pb-3">
        <section className="flex min-w-0 flex-col justify-between">
          <div className="flex items-start gap-3">
            <ReviewTitle {...props} className="flex-1" />
            <MascotBadge {...props} size={55} />
          </div>
          <MonsterStars className="my-1 [&_svg]:size-[17px]" />
          <ReviewBanner {...props} />
          <div className="mt-3"><TapPanel {...props} /></div>
        </section>
        <ScanPanel {...props} />
      </div>
    </>
  );
}

export function MonsterPvcCard({ theme, id, showMonster = true, ...content }: Props) {
  const character = getCharacter(theme);
  const props = { ...content, character, showMonster };
  return (
    <article
      id={id}
      data-print-theme={theme}
      className={`print-canvas-root pvc-print-canvas relative flex shrink-0 flex-col overflow-hidden rounded-[20px] border-4 border-[#172029] text-[#172029] ${styles[character].surface}`}
      style={{ boxSizing: "border-box", width: PVC_CARD_WIDTH, height: PVC_CARD_HEIGHT }}
    >
      {showMonster && <MonsterDecorations character={character} landscape />}
      {character === "mango" ? <MangoArtwork {...props} /> : character === "boba" ? <BobaArtwork {...props} /> : <ZiggyArtwork {...props} />}
      <footer className={`relative z-10 mt-auto flex h-[34px] shrink-0 items-center justify-center gap-3 px-10 text-center ${styles[character].footer}`}>
        <p className="line-clamp-2 text-[9px] leading-3 font-bold">{content.copy.footer}</p>
      </footer>
    </article>
  );
}
