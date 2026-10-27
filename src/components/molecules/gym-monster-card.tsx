import { Dumbbell, Nfc, QrCode, ScanLine } from "lucide-react";
import { PVC_CARD_HEIGHT, PVC_CARD_WIDTH } from "../../lib/print-dimensions";
import { GymAccentBar, GymCardDecorations } from "../elements/gym-card-decorations";
import { MonsterMascot, MonsterStars } from "../elements/monster-print-artwork";
import type { PvcCardCopy } from "./order-pvc-card";

type Props = {
  landscape?: boolean;
  copy: PvcCardCopy;
  cardId: string;
  qrDataUrl: string;
  showMonster?: boolean;
  className?: string;
  id?: string;
};

export function GymMonsterCard({ landscape = false, copy, cardId, qrDataUrl, showMonster = true, className = "", id }: Props) {
  const title = copy.headline.trim() || copy.action;
  const qrAlt = copy.qrAlt.replace("{cardId}", cardId);
  const mascot = (
    <div className={`grid shrink-0 place-items-center rounded-full border-[3px] border-[#172029] bg-white shadow-[4px_4px_0_#172029] ${landscape ? "size-[58px]" : "size-[72px]"}`}>
      {showMonster ? <MonsterMascot character="gym" className="size-full p-0.5" /> : <Dumbbell aria-hidden="true" className="size-8 text-[#172029]" />}
    </div>
  );
  const heading = (
    <h1 className="line-clamp-3 shrink-0 font-black tracking-[-0.045em] uppercase" style={{ fontSize: title.length > 48 ? 22 : 25, lineHeight: 1.04, overflowWrap: "anywhere" }}>{title}</h1>
  );
  const banner = (
    <div className="relative flex h-[36px] shrink-0 items-center">
      <p className="flex min-h-[31px] w-full -rotate-2 items-center justify-center border-[3px] border-[#172029] bg-[#ffb332] px-2 py-1 text-center text-[9px] leading-3 font-black uppercase shadow-[3px_3px_0_#172029]">{copy.action}</p>
    </div>
  );
  const qr = (
    <div className="flex min-w-0 flex-col items-center text-center">
      <div className={`grid shrink-0 place-items-center rounded-[5px] border-[3px] border-[#172029] bg-white p-3 shadow-[5px_5px_0_#172029] ${landscape ? "size-[158px]" : "size-[138px]"}`}>
        {qrDataUrl ? <img src={qrDataUrl} alt={qrAlt} className="block size-full object-contain" /> : <QrCode aria-label={qrAlt} className="size-full" strokeWidth={1.5} />}
      </div>
      <p className="mt-3 flex items-center gap-1 text-[11px] leading-4 font-black uppercase"><ScanLine aria-hidden="true" className="size-3.5" />{copy.scan}</p>
      <p className="mt-1 text-[8px] leading-3 text-[#54606b]">{copy.scanHelp}</p>
    </div>
  );
  const tap = (
    <div className={`flex min-w-0 items-center ${landscape ? "gap-2.5" : "flex-col text-center"}`}>
      <div className={`relative grid shrink-0 place-items-center rounded-full border-[3px] border-[#172029] bg-white shadow-[5px_5px_0_#172029] ${landscape ? "size-[52px]" : "size-[138px]"}`}>
        <span aria-hidden="true" className="absolute inset-[5px] rounded-full border-2 border-[#0798ad]/30" />
        <Nfc aria-hidden="true" className={landscape ? "size-7" : "size-[60px]"} strokeWidth={2.5} />
      </div>
      <div className={landscape ? "min-w-0" : "mt-3"}>
        <p className="text-[11px] leading-4 font-black uppercase">{copy.tap}</p>
        <p className="mt-1 text-[8px] leading-3 text-[#54606b]">{copy.tapHelp}</p>
      </div>
    </div>
  );
  return (
    <article id={id} data-print-theme={landscape ? "pvc-monster-gym" : "acrylic-monster-gym"}
      className={`print-canvas-root ${landscape ? "pvc-print-canvas" : ""} relative flex shrink-0 flex-col overflow-hidden rounded-[26px] border-4 border-[#172029] bg-white text-[#172029] ${className}`}
      style={{ boxSizing: "border-box", width: landscape ? PVC_CARD_WIDTH : 380, height: landscape ? PVC_CARD_HEIGHT : 550 }}>
      {showMonster && <GymCardDecorations landscape={landscape} />}
      {landscape ? (
        <>
          <header className="relative z-10 flex h-[68px] shrink-0 items-center justify-between gap-4 px-5 pt-2">
            {mascot}
            <div className="flex max-w-[330px] flex-col items-end gap-2 text-right">
              <GymAccentBar />
              <p className="line-clamp-1 text-[9px] leading-3 font-extrabold tracking-[0.06em] text-[#b44513] uppercase">{copy.preHeadline}</p>
            </div>
          </header>
          <div className="relative z-10 grid h-[214px] shrink-0 grid-cols-[1fr_164px] gap-4 px-5 pt-1 pb-2">
            <div className="flex min-w-0 flex-col justify-between">
              {heading}<MonsterStars className="my-1" />{banner}<div className="mt-1">{tap}</div>
            </div>
            <div className="relative flex flex-col justify-center">
              <span className="absolute top-1/2 -left-[15px] text-[7px] font-black uppercase">{copy.or}</span>{qr}
            </div>
          </div>
        </>
      ) : (
        <>
          <header className="relative z-10 flex h-[230px] shrink-0 flex-col items-center px-7 pt-3 text-center">
            <GymAccentBar />
            <div className="mt-2 mb-2">{mascot}</div>
            <p className="line-clamp-1 shrink-0 text-[9px] leading-3 font-extrabold tracking-[0.06em] text-[#b44513] uppercase">{copy.preHeadline}</p>
            <div className="mt-1.5">{heading}</div>
            <MonsterStars className="mt-2 shrink-0" />
          </header>
          <div className="relative z-10 mx-8">{banner}</div>
          <div className="relative z-10 grid h-[214px] shrink-0 grid-cols-[138px_20px_138px] items-center justify-center gap-1.5 px-3 pt-2">
            {tap}
            <div className="flex flex-col items-center gap-2"><span aria-hidden="true" className="h-9 w-0.5 bg-[#172029]" /><span className="text-[8px] font-black uppercase">{copy.or}</span><span aria-hidden="true" className="h-9 w-0.5 bg-[#172029]" /></div>
            {qr}
          </div>
        </>
      )}
      <footer className={`relative z-10 mt-auto flex shrink-0 flex-col items-center justify-center gap-1.5 px-10 text-center ${landscape ? "h-[34px]" : "h-[62px]"}`}>
        <p className="line-clamp-2 text-[9px] leading-3 font-bold">{copy.footer}</p>
        {!landscape && <GymAccentBar />}
        {!landscape && cardId && <p className="max-w-full truncate font-mono text-[6px] leading-none text-[#54606b]">{cardId}</p>}
      </footer>
    </article>
  );
}
