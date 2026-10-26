import { ArrowUpRight, Nfc, QrCode, ScanLine } from "lucide-react";
import type { ReactNode } from "react";
import type { ContemporaryAcrylicTheme } from "@/lib/print-themes";
import type { ReviewCardLabels } from "./classic-review-card";

type Props = {
  theme: ContemporaryAcrylicTheme;
  cardId: string;
  preHeadline?: string;
  headline?: string;
  footerNote?: string;
  qrDataUrl: string;
  labels: ReviewCardLabels;
  className?: string;
  id?: string;
};

type ArtworkProps = Omit<Props, "theme" | "className" | "id">;

function PrintBrand({ light = false }: { light?: boolean }) {
  return (
    <span className={`text-[16px] leading-none font-black tracking-[-0.06em] ${light ? "text-[#faf9f6]" : "text-[#172029]"}`}>
      Tap<span className="text-[#ffb332]">QR</span>
    </span>
  );
}

function PrintQr({ qrDataUrl, cardId, labels, className = "" }: Pick<Props, "qrDataUrl" | "cardId" | "labels"> & { className?: string }) {
  return (
    <div className={`grid shrink-0 place-items-center bg-white p-3 ${className}`}>
      {qrDataUrl ? (
        <img
          src={qrDataUrl}
          alt={labels.qrAlt.replace("{cardId}", cardId)}
          className="block size-full object-contain"
        />
      ) : (
        <QrCode aria-label={labels.qrAlt.replace("{cardId}", cardId)} className="size-full text-[#172029]" strokeWidth={1.5} />
      )}
    </div>
  );
}

function PrintTitle({ headline, labels, className = "" }: Pick<Props, "headline" | "labels"> & { className?: string }) {
  const title = headline?.trim() || labels.review;
  return (
    <h1
      className={`line-clamp-3 font-black tracking-[-0.045em] uppercase ${className}`}
      style={{ fontSize: title.length > 48 ? 28 : 32, lineHeight: 1.04, overflowWrap: "anywhere" }}
    >
      {title}
    </h1>
  );
}

function PrintFooter({ footerNote, cardId, className = "" }: Pick<Props, "footerNote" | "cardId"> & { className?: string }) {
  return (
    <footer className={`flex min-h-0 flex-col justify-center gap-2 px-5 ${className}`}>
      {footerNote && <p className="line-clamp-2 text-[11px] leading-[1.4] font-bold">{footerNote}</p>}
      <p className="truncate font-mono text-[7px] leading-none tracking-[0.1em] opacity-70">{cardId}</p>
    </footer>
  );
}

function SunriseArtwork(props: ArtworkProps) {
  const { preHeadline, labels } = props;
  return (
    <>
      <header className="relative h-[188px] shrink-0 overflow-hidden border-b-4 border-[#172029] bg-[#ffb332] px-5 pt-5">
        <svg aria-hidden="true" viewBox="0 0 220 220" className="pointer-events-none absolute -top-16 -right-14 size-[260px] text-[#172029]/15">
          {Array.from({ length: 12 }, (_, index) => (
            <path key={index} d="M110 110 98 0H122Z" fill="currentColor" transform={`rotate(${index * 30} 110 110)`} />
          ))}
          <circle cx="110" cy="110" r="35" fill="#faf9f6" />
        </svg>
        <div className="relative flex items-center justify-between">
          <span className="inline-flex bg-[#faf9f6] px-2 py-1"><PrintBrand /></span>
          <ArrowUpRight aria-hidden="true" className="size-6" strokeWidth={3} />
        </div>
        {preHeadline && <p className="relative mt-4 line-clamp-1 text-[9px] font-extrabold tracking-[0.16em] uppercase">{preHeadline}</p>}
        <PrintTitle {...props} className="relative mt-2 max-w-[306px]" />
      </header>
      <section className="grid h-[276px] shrink-0 grid-cols-[210px_1fr] items-center gap-3 bg-[#faf9f6] px-5">
        <div className="flex flex-col items-center">
          <p className="mb-2 flex items-center gap-1.5 text-[13px] leading-4 font-black uppercase">
            <ScanLine aria-hidden="true" className="size-4" />{labels.scan}
          </p>
          <PrintQr {...props} className="size-[198px] border-[3px] border-[#172029] shadow-[5px_5px_0_#172029]" />
          <p className="mt-3 text-center text-[9px] leading-3 font-bold">{labels.scanHelp}</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="mb-3 text-[9px] font-bold uppercase">{labels.or}</span>
          <div className="grid size-[84px] place-items-center rounded-full border-[3px] border-[#172029] bg-[#27b9cf] shadow-[4px_4px_0_#172029]">
            <Nfc aria-hidden="true" className="size-10" strokeWidth={2.2} />
          </div>
          <p className="mt-3 text-[11px] leading-[1.2] font-black uppercase">{labels.tap}</p>
          <p className="mt-1.5 text-[9px] leading-[1.4] font-medium">{labels.tapHelp}</p>
        </div>
      </section>
      <PrintFooter {...props} className="h-[78px] shrink-0 border-t-4 border-[#172029] bg-[#172029] text-[#faf9f6]" />
    </>
  );
}

function ArchArtwork(props: ArtworkProps) {
  const { preHeadline, labels } = props;
  return (
    <>
      <header className="h-[186px] shrink-0 px-6 pt-5 text-center">
        <div className="flex items-center justify-between border-b-2 border-[#172029] pb-3">
          <PrintBrand />
          <span aria-hidden="true" className="h-2 w-14 bg-[#ffb332]" />
        </div>
        {preHeadline && <p className="mt-3 line-clamp-1 text-[9px] font-extrabold tracking-[0.14em] uppercase">{preHeadline}</p>}
        <PrintTitle {...props} className="mt-2" />
      </header>
      <section className="relative grid h-[248px] shrink-0 place-items-center">
        <span aria-hidden="true" className="absolute top-14 left-5 h-28 w-[3px] bg-[#172029]" />
        <span aria-hidden="true" className="absolute top-14 right-5 h-28 w-[3px] bg-[#172029]" />
        <div className="relative h-[244px] w-[244px] rounded-t-[122px] border-4 border-[#172029] bg-white shadow-[6px_6px_0_#ffb332]">
          <div aria-hidden="true" className="absolute top-3 left-1/2 grid size-11 -translate-x-1/2 place-items-center rounded-full border-[3px] border-[#172029] bg-[#ffb332]">
            <ArrowUpRight className="size-6" strokeWidth={3} />
          </div>
          <PrintQr {...props} className="absolute bottom-0 left-1/2 size-[180px] -translate-x-1/2" />
        </div>
      </section>
      <section className="mx-6 mt-3 flex h-[55px] shrink-0 items-center justify-center gap-3 border-[3px] border-[#172029] bg-[#ffb332] px-3">
        <Nfc aria-hidden="true" className="size-7 shrink-0" strokeWidth={2.3} />
        <div className="max-w-[118px] text-left">
          <p className="text-[12px] leading-4 font-black uppercase">{labels.tap}</p>
          <p className="text-[8px] leading-3 font-semibold">{labels.tapHelp}</p>
        </div>
        <span className="text-[8px] font-bold uppercase">{labels.or}</span>
        <div className="max-w-[108px] text-left">
          <p className="text-[12px] leading-4 font-black uppercase">{labels.scan}</p>
          <p className="text-[8px] leading-3 font-semibold">{labels.scanHelp}</p>
        </div>
      </section>
      <PrintFooter {...props} className="h-[41px] shrink-0 gap-1 text-center [&_p:first-child]:text-[9px]" />
    </>
  );
}

function MosaicArtwork(props: ArtworkProps) {
  const { preHeadline, labels } = props;
  return (
    <>
      <header className="relative h-[190px] shrink-0 overflow-hidden border-b-4 border-[#172029] bg-[#172029] px-5 pt-5 text-[#faf9f6]">
        <div aria-hidden="true" className="absolute top-0 right-0 grid size-[90px] grid-cols-2 border-b-4 border-l-4 border-[#172029]">
          <span className="rounded-br-full bg-[#ffb332]" />
          <span className="bg-[#27b9cf]" />
          <span className="bg-[#faf9f6]" />
          <span className="rounded-tl-full bg-[#ffb332]" />
        </div>
        <div className="relative"><PrintBrand light /></div>
        {preHeadline && <p className="relative mt-5 max-w-[240px] line-clamp-1 text-[9px] font-extrabold tracking-[0.14em] text-[#ffb332] uppercase">{preHeadline}</p>}
        <PrintTitle {...props} className="relative mt-2 max-w-[320px]" />
      </header>
      <section className="grid h-[268px] shrink-0 grid-cols-[222px_1fr] gap-3 px-4 py-4">
        <div className="flex flex-col items-center justify-center border-[3px] border-[#172029] bg-white shadow-[4px_4px_0_#172029]">
          <PrintQr {...props} className="size-[204px]" />
          <p className="mb-2 text-[12px] leading-4 font-black uppercase">{labels.scan}</p>
        </div>
        <div className="flex flex-col items-center justify-center border-[3px] border-[#172029] bg-[#27b9cf] px-1.5 text-center">
          <ArrowUpRight aria-hidden="true" className="mb-4 size-7" strokeWidth={3} />
          <Nfc aria-hidden="true" className="size-10" strokeWidth={2.3} />
          <p className="mt-4 text-[11px] leading-[1.25] font-black uppercase">{labels.tap}</p>
          <p className="mt-2 text-[8px] leading-[1.4] font-bold">{labels.tapHelp}</p>
        </div>
      </section>
      <footer className="flex h-[84px] shrink-0 items-center gap-3 border-t-4 border-[#172029] bg-[#ffb332] px-4">
        <div aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full border-[3px] border-[#172029] bg-[#faf9f6]">
          <ScanLine className="size-6" strokeWidth={2.3} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] leading-[1.4] font-black">{labels.scanHelp}</p>
          {props.footerNote && <p className="mt-1 line-clamp-2 text-[10px] leading-[1.3] font-semibold">{props.footerNote}</p>}
          <p className="mt-1 truncate font-mono text-[7px] leading-none opacity-70">{props.cardId}</p>
        </div>
      </footer>
    </>
  );
}

const acrylicArtworks = {
  "acrylic-sunrise": SunriseArtwork,
  "acrylic-arch": ArchArtwork,
  "acrylic-mosaic": MosaicArtwork,
} satisfies Record<ContemporaryAcrylicTheme, (props: ArtworkProps) => ReactNode>;

export function ContemporaryAcrylicCard({ theme, className = "", id, ...props }: Props) {
  const Artwork = acrylicArtworks[theme];
  return (
    <article
      id={id}
      data-print-theme={theme}
      className={`print-canvas-root relative flex h-[550px] w-[380px] shrink-0 flex-col overflow-hidden border-4 border-[#172029] bg-[#faf9f6] text-[#172029] ${className}`}
      style={{ boxSizing: "border-box" }}
    >
      <Artwork {...props} />
    </article>
  );
}
