import { Nfc, ScanLine, Star } from "lucide-react";
import { GoogleMark } from "../elements/google-mark";
import type { PrintCardCanvasProps } from "./print-card-canvas";
import { PosterDoodles } from "../elements/poster-doodles";

type Props = Omit<PrintCardCanvasProps, "theme" | "showMonster">;

export function PosterReviewCard({ cardId, preHeadline, headline, footerNote, qrDataUrl, labels, className = "", id }: Props) {
  const title = headline?.trim() ?? "";
  const titleSize = title.length > 65 ? 28 : title.length > 35 ? 38 : title.length > 20 ? 48 : 68;

  return (
    <article id={id} className={`print-canvas-root relative flex h-[550px] w-[380px] flex-col overflow-hidden border-4 border-[#174780] bg-[#fffef9] text-center text-[#174780] ${className}`} style={{ boxSizing: "border-box" }}>
      <PosterDoodles />
      <header className="relative flex h-[290px] shrink-0 flex-col items-center justify-center px-11 pb-7 pt-8">
        <p className="max-w-full -rotate-2 break-words text-[12px] font-extrabold leading-4">{preHeadline}</p>
        <h1 className="my-2 w-full -rotate-3 break-words font-serif font-black italic leading-[0.95] tracking-[-0.06em] uppercase [overflow-wrap:anywhere]" style={{ fontSize: titleSize }}>{title}</h1>
        <span className="mt-2 flex items-center gap-2 rounded-sm border-2 border-[#174780] bg-white px-3 py-1.5 shadow-[3px_3px_0_#174780]">
          <span className="[&_svg]:size-5"><GoogleMark /></span>
          <span aria-hidden="true" className="flex gap-0.5">{Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-4 fill-current" />)}</span>
        </span>
      </header>
      <p className="relative mx-5 -rotate-1 bg-[#174780] px-3 py-2 text-[10px] font-black leading-4 tracking-wider text-white uppercase">{labels.review}</p>
      <section className="relative grid flex-1 grid-cols-[1fr_22px_1fr] items-center gap-2 px-7 py-3">
        <div className="flex flex-col items-center">
          <div className="grid size-[108px] -rotate-3 place-items-center rounded-full border-[3px] border-current shadow-[3px_3px_0_#174780]"><Nfc aria-hidden="true" className="size-12" strokeWidth={2.5} /></div>
          <p className="mt-2 text-[12px] font-black uppercase">{labels.tap}</p>
          <p className="mt-1 text-[8px] leading-3">{labels.tapHelp}</p>
        </div>
        <span className="text-[8px] font-black uppercase">{labels.or}</span>
        <div className="flex flex-col items-center">
          <div className="size-[112px] border-[3px] border-[#174780] bg-white p-1.5 shadow-[3px_3px_0_#174780]">
            {qrDataUrl ? <img alt={labels.qrAlt.replace("{cardId}", cardId)} src={qrDataUrl} className="size-full object-contain" /> : <div className="size-full bg-[#f3f5f7]" />}
          </div>
          <p className="mt-2 flex items-center gap-1 text-[12px] font-black uppercase"><ScanLine aria-hidden="true" className="size-3" />{labels.scan}</p>
          <p className="mt-1 text-[8px] leading-3">{labels.scanHelp}</p>
        </div>
      </section>
      <footer className="relative border-t-2 border-[#174780] px-7 py-3"><p className="break-words text-[10px] font-bold leading-4">{footerNote}</p></footer>
    </article>
  );
}
