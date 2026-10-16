import { Nfc, ScanLine, Wifi } from "lucide-react";
import { PosterDoodles } from "../elements/poster-doodles";
import type { WifiPrintCardProps } from "./wifi-print-card";

type Props = Omit<WifiPrintCardProps, "theme">;

export function WifiPosterCard({ job, title, footer, content, id }: Props) {
  const headline = title.trim();
  const titleSize = headline.length > 45 ? 32 : headline.length > 25 ? 42 : 56;

  return (
    <article id={id} className="print-canvas-root relative flex h-[550px] w-[380px] flex-col overflow-hidden border-4 border-[#174780] bg-[#fffef9] text-center text-[#174780]" style={{ boxSizing: "border-box" }}>
      <PosterDoodles />
      <header className="relative flex h-[248px] shrink-0 flex-col items-center justify-center px-11 pb-7 pt-7">
        <Wifi aria-hidden="true" className="mb-3 size-8 shrink-0 -rotate-6" strokeWidth={3} />
        <h1 className="w-full -rotate-3 break-words font-serif font-black italic leading-[0.98] tracking-[-0.06em] uppercase [overflow-wrap:anywhere]" style={{ fontSize: titleSize }}>{headline}</h1>
      </header>
      <div className="relative mx-5 -rotate-1 bg-[#174780] px-3 py-2 text-white">
        <p className="text-[8px] font-bold tracking-widest uppercase">{content.network}</p>
        <p className="mt-1 break-all text-[16px] font-black leading-[18px]">{job.ssid}</p>
      </div>
      <section className="relative grid flex-1 grid-cols-[1fr_20px_1fr] items-center gap-2 px-6 py-3">
        <div className="flex min-w-0 flex-col items-center">
          <div className="grid size-[108px] -rotate-3 place-items-center rounded-full border-[3px] border-current shadow-[3px_3px_0_#174780]"><Nfc aria-hidden="true" className="size-12" strokeWidth={2.5} /></div>
          <p className="mt-2 text-[12px] font-black uppercase">{content.tap}</p>
          <p className="mt-1 text-[8px] leading-3">{content.tapHelp}</p>
        </div>
        <span className="text-[8px] font-black uppercase">{content.or}</span>
        <div className="flex min-w-0 flex-col items-center">
          <div className="size-[124px] shrink-0 border-[3px] border-[#174780] bg-white p-2 shadow-[3px_3px_0_#174780]">
            {job.qrDataUrl ? <img alt={content.qrAlt.replace("{ssid}", job.ssid)} src={job.qrDataUrl} className="size-full object-contain" /> : <div className="size-full bg-[#f3f5f7]" />}
          </div>
          <p className="mt-2 flex items-center gap-1 text-[9px] font-black uppercase"><ScanLine aria-hidden="true" className="size-3 shrink-0" />{content.scan}</p>
        </div>
      </section>
      <footer className="relative border-t-2 border-[#174780] px-6 py-2"><p className="break-words text-[10px] font-bold leading-[14px]">{footer.trim()}</p></footer>
    </article>
  );
}
