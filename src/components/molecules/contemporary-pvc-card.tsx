import { ArrowDownRight, ArrowUpRight, Nfc, QrCode, Sparkle } from "lucide-react";
import type { PvcPrintTheme } from "../../lib/print-themes";
import { PVC_CARD_HEIGHT, PVC_CARD_WIDTH } from "../../lib/print-dimensions";
import { GoogleMark } from "../elements/google-mark";
import type { PvcCardCopy } from "./order-pvc-card";

type Props = {
  theme: PvcPrintTheme;
  copy: PvcCardCopy;
  qrDataUrl: string;
  cardId: string;
  id?: string;
};

type ContentProps = Omit<Props, "theme" | "id">;

function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`text-[17px] leading-none font-black tracking-[-0.06em] ${light ? "text-white" : "text-[#172029]"}`}>
      Tap<span className={light ? "text-[#ffb332]" : ""}>QR</span>
    </span>
  );
}

function QrTile({ copy, qrDataUrl, cardId, className = "" }: ContentProps & { className?: string }) {
  return (
    <div className={`grid size-[158px] shrink-0 place-items-center rounded-[6px] border-[3px] border-[#172029] bg-white p-[10px] text-[#172029] ${className}`}>
      {qrDataUrl ? (
        <img src={qrDataUrl} alt={copy.qrAlt.replace("{cardId}", cardId)} className="size-full object-contain" />
      ) : <QrCode aria-hidden="true" className="size-full" strokeWidth={1.6} />}
    </div>
  );
}

function SignalCard(props: ContentProps) {
  const { copy } = props;
  return (
    <>
      <header className="relative flex h-[45px] items-center justify-between border-b-[3px] border-[#172029] px-5">
        <Brand />
        <p className="max-w-[260px] text-right text-[9px] leading-3 font-extrabold uppercase">{copy.preHeadline}</p>
      </header>
      <div className="grid h-[271px] grid-cols-[1fr_192px]">
        <section className="relative flex min-w-0 flex-col px-5 pt-4 pb-3">
          <div aria-hidden="true" className="mb-3 flex items-center gap-1.5">
            <Sparkle className="size-5 fill-[#172029]" strokeWidth={2.5} />
            <span className="h-[3px] w-9 bg-[#172029]" />
          </div>
          <h1 className="max-w-[266px] text-[35px] leading-[1.04] font-black tracking-[-0.055em] break-words">{copy.headline || copy.action}</h1>
          <p className="mt-3 text-[10px] leading-4 font-bold">{copy.action}</p>
          <div className="mt-auto flex items-center gap-3 border-t-2 border-[#172029] pt-3">
            <Nfc aria-hidden="true" className="size-8 shrink-0" strokeWidth={2.5} />
            <div><p className="text-[12px] font-black uppercase">{copy.tap}</p><p className="mt-0.5 text-[9px]">{copy.tapHelp}</p></div>
            <ArrowUpRight aria-hidden="true" className="ml-auto size-6 shrink-0" strokeWidth={3} />
          </div>
        </section>
        <section className="flex min-w-0 flex-col items-center justify-center border-l-[3px] border-[#172029] bg-[#faf9f6] px-3 py-3 text-center">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase">
            <span className="[&_svg]:size-4"><GoogleMark /></span>{copy.scan}
          </div>
          <QrTile {...props} className="shadow-[4px_4px_0_#172029]" />
          <p className="mt-3 text-[9px] leading-3 font-bold">{copy.footer}</p>
        </section>
      </div>
    </>
  );
}

function OrbitCard(props: ContentProps) {
  const { copy } = props;
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute -top-[146px] -left-[130px] size-[430px] rounded-full border-[3px] border-[#ffb332]/30" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-[105px] -left-[90px] size-[350px] rounded-full border-[3px] border-[#ffb332]/30" />
      <header className="relative flex h-14 items-center justify-between px-6">
        <Brand light />
        <div aria-hidden="true" className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#27b9cf]" /><Sparkle className="size-6 fill-[#ffb332] text-[#ffb332]" /></div>
      </header>
      <div className="relative grid h-[208px] grid-cols-[1fr_190px] gap-3 px-6">
        <section className="flex min-w-0 flex-col justify-center pb-2">
          <p className="mb-3 text-[9px] leading-3 font-bold tracking-[0.12em] text-[#ffb332] uppercase">{copy.preHeadline}</p>
          <h1 className="text-[31px] leading-[1.08] font-black tracking-[-0.045em] break-words">{copy.headline || copy.action}</h1>
          <div className="mt-4 flex items-center gap-2 text-[9px] leading-3 font-bold text-[#e8e7df]">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white [&_svg]:size-4"><GoogleMark /></span>{copy.action}
          </div>
        </section>
        <section className="flex flex-col items-center justify-center text-center">
          <QrTile {...props} className="border-white shadow-[5px_5px_0_#ffb332]" />
          <p className="mt-3 flex items-center gap-2 text-[10px] font-extrabold uppercase">{copy.scan}<ArrowUpRight aria-hidden="true" className="size-4 text-[#ffb332]" /></p>
        </section>
      </div>
      <footer className="absolute inset-x-0 bottom-0 flex min-h-[48px] items-center gap-3 border-t-2 border-[#ffb332] bg-[#ffb332] px-5 py-2 text-[#172029]">
        <Nfc aria-hidden="true" className="size-7 shrink-0" strokeWidth={2.7} />
        <span className="shrink-0 text-[11px] font-black uppercase">{copy.tap}</span>
        <span className="ml-auto max-w-[260px] text-right text-[9px] leading-3 font-semibold">{copy.footer}</span>
      </footer>
    </>
  );
}

function StudioCard(props: ContentProps) {
  const { copy } = props;
  return (
    <>
      <aside className="absolute inset-y-0 left-0 flex w-12 flex-col items-center justify-between border-r-[3px] border-[#172029] bg-[#ffb332] py-4">
        <Sparkle aria-hidden="true" className="size-6 fill-[#172029]" />
        <span className="text-[21px] font-black tracking-[-0.06em] [writing-mode:vertical-rl]">TapQR</span>
        <ArrowDownRight aria-hidden="true" className="size-6" strokeWidth={3} />
      </aside>
      <div className="ml-12 flex h-full flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b-2 border-dashed border-[#172029] px-4">
          <p className="text-[9px] leading-3 font-bold uppercase">{copy.preHeadline}</p>
          <span aria-hidden="true" className="grid size-7 shrink-0 -rotate-6 place-items-center border-2 border-[#172029] bg-white [&_svg]:size-4"><GoogleMark /></span>
        </header>
        <div className="grid min-h-0 flex-1 grid-cols-[1fr_164px] items-center gap-4 px-4 py-3">
          <section className="flex min-w-0 flex-col items-start">
            <h1 className="text-[29px] leading-[1.05] font-black tracking-[-0.045em] break-words">{copy.headline || copy.action}</h1>
            <p className="mt-2 text-[9px] leading-3 font-semibold">{copy.action}</p>
            <div className="mt-4 flex items-center gap-2 border-2 border-[#172029] bg-white px-2 py-2 shadow-[3px_3px_0_#172029]">
              <Nfc aria-hidden="true" className="size-6 shrink-0" strokeWidth={2.5} />
              <div><p className="text-[10px] leading-3 font-black uppercase">{copy.tap}</p><p className="mt-0.5 text-[8px] leading-3">{copy.tapHelp}</p></div>
            </div>
          </section>
          <section className="flex flex-col items-center text-center">
            <QrTile {...props} className="shadow-[4px_4px_0_#27b9cf]" />
            <p className="mt-2 text-[10px] font-black uppercase">{copy.scan}</p>
          </section>
        </div>
        <footer className="flex min-h-[35px] shrink-0 items-center gap-3 border-t-2 border-[#172029] bg-white px-4 py-2">
          <div aria-hidden="true" className="grid shrink-0 grid-cols-4">{Array.from({ length: 8 }, (_, index) => <span key={index} className={`size-2 ${[0, 2, 5, 7].includes(index) ? "bg-[#172029]" : "bg-white"}`} />)}</div>
          <p className="text-[9px] leading-3 font-semibold">{copy.footer}</p>
        </footer>
      </div>
    </>
  );
}

export function ContemporaryPvcCard({ theme, id, ...content }: Props) {
  return (
    <article
      id={id}
      data-print-theme={theme}
      className={`print-canvas-root pvc-print-canvas relative shrink-0 overflow-hidden rounded-[18px] border-4 border-[#172029] ${theme === "pvc-orbit" ? "bg-[#172029] text-white" : theme === "pvc-signal" ? "bg-[#ffb332] text-[#172029]" : "bg-[#faf9f6] text-[#172029]"}`}
      style={{ boxSizing: "border-box", width: PVC_CARD_WIDTH, height: PVC_CARD_HEIGHT }}
    >
      {theme === "pvc-signal" ? <SignalCard {...content} /> : theme === "pvc-orbit" ? <OrbitCard {...content} /> : <StudioCard {...content} />}
    </article>
  );
}
