import { ScanLine } from "lucide-react";
import { GoogleBrandText } from "../elements/google-brand-text";
import { MonsterGrippingPaws } from "../elements/monster-gripping-paws";
import { VintageCoffeeMascot } from "../elements/vintage-coffee-mascot";

export type CoffeeMonsterCardProps = {
  cardId: string;
  preHeadline?: string;
  headline?: string;
  footerNote?: string;
  qrDataUrl: string;
  className?: string;
  id?: string;
};

export function CoffeeMonsterCard({
  cardId,
  preHeadline,
  headline,
  footerNote,
  qrDataUrl,
  className = "",
  id,
}: CoffeeMonsterCardProps) {
  return (
    <div
      id={id}
      className={`print-canvas-root relative flex w-[380px] h-[550px] flex-col justify-between overflow-hidden rounded-[32px] border-4 border-black bg-white p-5 text-center text-black shadow-2xl transition-all ${className}`}
      style={{ boxSizing: "border-box" }}
    >
      {/* BACKGROUND PATTERN: Subtle 1930s screen-print dots & coffee beans on clean white */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <svg className="h-full w-full" fill="#1c1917">
          <pattern id="coffee-vintage-pattern" width="56" height="56" patternUnits="userSpaceOnUse">
            {/* Halftone dot matrix */}
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="24" cy="8" r="1" />
            <circle cx="40" cy="8" r="1.5" />
            <circle cx="16" cy="20" r="1" />
            <circle cx="32" cy="20" r="1.5" />
            <circle cx="48" cy="20" r="1" />
            {/* Tiny coffee bean silhouette */}
            <path d="M12 36 c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zm0 7.5c-1.6 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.4 3-3 3z" />
            {/* 1930s screen sparkle */}
            <path d="M42 38 Q 42 42, 45 42 Q 42 42, 42 46 Q 42 42, 39 42 Q 42 42, 42 38 Z" fill="#d97706" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#coffee-vintage-pattern)" />
        </svg>
      </div>

      {/* TOP SLANTED VINTAGE ROASTER TAPE */}
      <div className="pointer-events-none absolute -top-1 -right-8 z-20 w-36 rotate-12 overflow-hidden border-2 border-black bg-white shadow-md">
        <div className="flex h-3.5 w-full">
          <div className="h-full w-3 -skew-x-12 bg-[#d97706]" />
          <div className="h-full w-3 -skew-x-12 bg-white" />
          <div className="h-full w-3 -skew-x-12 bg-[#0d9488]" />
          <div className="h-full w-3 -skew-x-12 bg-black" />
          <div className="h-full w-3 -skew-x-12 bg-[#d97706]" />
          <div className="h-full w-3 -skew-x-12 bg-white" />
          <div className="h-full w-3 -skew-x-12 bg-[#0d9488]" />
          <div className="h-full w-3 -skew-x-12 bg-black" />
          <div className="h-full w-3 -skew-x-12 bg-[#d97706]" />
        </div>
      </div>

      {/* 1930s RETRO BADGE STICKER: FRESH ROAST CERTIFIED */}
      <div className="pointer-events-none absolute top-3 left-4 z-20 -rotate-6">
        <div className="rounded-md border-2 border-black bg-[#facc15] px-2 py-0.5 text-[9px] font-black tracking-wider text-black uppercase shadow-[2px_2px_0px_#000]">
          ★ FRESH ROAST CERTIFIED ★
        </div>
      </div>

      {/* 1930s VINTAGE CARTOON GLOVES GRIPPING THE CARD EDGES (LEFT & RIGHT) */}
      <MonsterGrippingPaws variant="cartoon-glove" topClass="top-28" />

      {/* PEEKING MONSTER EYES in bottom-left corner with hard shadow */}
      <div className="pointer-events-none absolute bottom-3 left-4 z-10 flex items-center gap-1 opacity-80">
        <div className="flex size-4 items-center justify-center rounded-full border-2 border-black bg-white shadow-2xs">
          <div className="size-1.5 rounded-full bg-black translate-x-0.5 -translate-y-0.5" />
        </div>
        <div className="flex size-3.5 items-center justify-center rounded-full border-2 border-black bg-white shadow-2xs">
          <div className="size-1.5 rounded-full bg-black translate-x-0.5 -translate-y-0.5" />
        </div>
      </div>

      {/* HEADER SECTION: 1930s RUBBER-HOSE COFFEE MASCOT, SPEECH BUBBLE & TYPOGRAPHY */}
      <header className="relative z-10 space-y-1 pt-1">
        {/* Dominant 1930s Vintage Coffee Mascot */}
        <div className="relative mx-auto flex items-center justify-center pt-0.5">
          <VintageCoffeeMascot size="md" />

          {/* Speech Bubble: "Enak kopinya? Review dong! ✦" */}
          <div className="absolute -top-1 right-2 sm:right-6 z-20 flex items-center gap-1 rounded-xl border-2 border-black bg-white px-2 py-0.5 text-[10px] font-black text-black shadow-[3px_3px_0px_#000] rotate-3">
            <span>Enak kopinya? Review dong!</span>
            <span className="text-xs text-[#d97706]">✦</span>
            {/* Bubble Tail */}
            <div className="absolute -bottom-1.5 left-3 size-2 rotate-45 border-r-2 border-b-2 border-black bg-white" />
          </div>
        </div>

        {/* Display Title with Marker Highlight on "kopi" */}
        <h2 className="pt-0.5 text-2xl font-black tracking-tight text-black uppercase drop-shadow-xs sm:text-[27px]">
          {preHeadline ? (
            preHeadline
          ) : (
            <>
              Suka{" "}
              <span className="relative inline-block mx-0.5 px-2 py-0.5 text-white font-black">
                <span className="absolute inset-0 -skew-x-6 rounded-md bg-[#d97706] shadow-xs -z-0" />
                <span className="relative z-10">kopi</span>
              </span>{" "}
              kami?
            </>
          )}
        </h2>

        {/* Subtitle: "Berikan Review Anda di Google" */}
        <div className="text-xs sm:text-sm font-extrabold text-neutral-800">
          {headline ? (
            <span>{headline}</span>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-neutral-100 px-3.5 py-0.5 shadow-2xs">
              <span>Berikan Review Anda di</span>
              <GoogleBrandText />
            </div>
          )}
        </div>

        {/* 5 ENAMEL PIN STARS with Shiny Highlight */}
        <div className="flex items-center justify-center gap-1 pt-0.5">
          <span className="text-xs font-black text-[#d97706]">✦</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className="relative flex size-6 sm:size-7 items-center justify-center rounded-lg border-2 border-black bg-[#facc15] text-xs font-black text-black shadow-[2px_2px_0px_#000] transition-transform hover:scale-110"
                style={{
                  transform: star % 2 === 0 ? "rotate(3deg)" : "rotate(-3deg)",
                }}
              >
                {/* Shiny Enamel Crescent Reflection */}
                <div className="absolute top-0.5 right-1 size-1 rounded-full bg-white/80" />
                <span className="text-sm sm:text-base leading-none">★</span>
              </div>
            ))}
          </div>
          <span className="text-xs font-black text-[#d97706]">✦</span>
        </div>

        {/* ACTION BADGE: Streetwear Sticker Style ("TAP" & "SCAN") */}
        <div className="pt-0.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700">
            <span>Cukup</span>
            <span className="rounded-md border-2 border-black bg-[#0d9488] px-2 py-0.5 font-black text-white uppercase shadow-[2px_2px_0px_#000]">
              TAP
            </span>
            <span>atau</span>
            <span className="rounded-md border-2 border-black bg-[#d97706] px-2 py-0.5 font-black text-white uppercase shadow-[2px_2px_0px_#000]">
              SCAN
            </span>
          </div>
        </div>
      </header>

      {/* DUAL INTERACTION AREA: STITCHED PATCH NFC (LEFT) & HARD-SHADOW STICKER QR (RIGHT) */}
      <section className="relative z-10 my-auto py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* SISI KIRI: STITCHED EMBROIDERED PATCH NFC TARGET */}
          <div className="relative flex flex-1 flex-col items-center justify-center">
            {/* Retro Sparkle Line Leading into Target */}
            <div className="absolute -top-3 flex items-center gap-0.5 text-[9px] font-bold text-[#d97706]">
              <span className="tracking-widest">--</span>
              <span className="text-[10px] text-[#0d9488]">✦</span>
              <span className="tracking-widest">--</span>
            </div>

            {/* Stitched Patch Circle on Warm Ivory */}
            <div className="relative flex size-[130px] sm:size-[142px] flex-col items-center justify-center rounded-full border-3 border-dashed border-[#d97706] bg-[#fffbeb] p-2 text-center shadow-[4px_4px_0px_#000]">
              {/* Concentric Pulse Ring */}
              <div className="absolute inset-0 rounded-full border border-[#d97706]/30 animate-ping opacity-25" />

              {/* NFC Contactless Wave */}
              <svg
                className="size-8 shrink-0 drop-shadow-xs"
                fill="none"
                stroke="#b45309"
                strokeLinecap="round"
                strokeWidth={3}
                viewBox="0 0 40 40"
              >
                <path d="M12 28a11.3 11.3 0 0 1 0-16" />
                <path d="M17 31a16.5 16.5 0 0 1 0-22" />
                <path d="M22 34a21.8 21.8 0 0 1 0-28" />
                <path d="M27 37a27 27 0 0 1 0-34" />
              </svg>

              {/* Bold Urban Label */}
              <p className="mt-1 text-xs sm:text-[13px] font-black uppercase tracking-wide text-black">
                Tap di sini
              </p>
              <p className="mt-0.5 text-[8.5px] sm:text-[9.5px] font-semibold text-[#92400e]">
                Tempelkan ponsel Anda
              </p>
            </div>

            {/* Hand-drawn SVG Doodle Arrow to TAP */}
            <div className="pointer-events-none absolute -bottom-4 left-3 flex items-center gap-1 text-[#0d9488] rotate-[-6deg]">
              <svg className="h-4 w-6" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 14 C 9 15, 15 12, 18 4" />
                <path d="M13 5 L18 4 L19 9" />
              </svg>
              <span className="font-mono text-[10px] font-black tracking-tight text-[#0d9488]">tap!</span>
            </div>
          </div>

          {/* TENGAH: URBAN STREETWEAR DIVIDER */}
          <div className="flex flex-col items-center justify-center px-1">
            <div className="h-7 w-0.5 bg-neutral-300" />
            <span className="my-1 rounded-md border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 text-[9px] font-black text-neutral-600 uppercase">
              atau
            </span>
            <div className="h-7 w-0.5 bg-neutral-300" />
          </div>

          {/* SISI KANAN: HARD-SHADOW STICKER QR TARGET */}
          <div className="relative flex flex-1 flex-col items-center justify-center">
            {/* Slanted "SCAN ME" Sticker */}
            <div className="absolute -top-3 z-20 -rotate-6 rounded-md border-2 border-black bg-[#d97706] px-2 py-0.5 text-[9px] font-black text-white uppercase shadow-[2px_2px_0px_#000]">
              SCAN ME ⚡
            </div>

            {/* Sticker QR Frame with Hard Shadow */}
            <div className="relative flex size-[116px] sm:size-[126px] items-center justify-center rounded-2xl border-3 border-black bg-neutral-50 p-2 shadow-[4px_4px_0px_#000]">
              <div className="size-full overflow-hidden rounded-xl bg-white border border-black/10">
                {qrDataUrl ? (
                  <img
                    alt={`QR Code ${cardId}`}
                    className="size-full object-contain"
                    src={qrDataUrl}
                  />
                ) : (
                  <div className="size-full animate-pulse rounded-lg bg-gray-100" />
                )}
              </div>
            </div>

            {/* Pill Button "Scan QR Code" in Rich Caramel */}
            <div className="mt-2 flex items-center justify-center gap-1.5 rounded-full border-2 border-black bg-[#d97706] px-3.5 py-1 text-[11px] sm:text-xs font-black text-white shadow-[2px_2px_0px_#000]">
              <ScanLine className="size-3.5 shrink-0 text-white" strokeWidth={2.8} />
              <span>Scan QR Code</span>
            </div>

            {/* Hand-drawn SVG Doodle Arrow to QR */}
            <div className="pointer-events-none absolute -bottom-4 right-3 flex items-center gap-1 text-[#d97706] rotate-[6deg]">
              <span className="font-mono text-[10px] font-black tracking-tight text-[#d97706]">scan!</span>
              <svg className="h-4 w-6" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M20 14 C 15 15, 9 12, 6 4" />
                <path d="M11 5 L6 4 L5 9" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION: CLEAN & DIRECT */}
      <footer className="relative z-10 pt-1 text-center">
        <p className="text-xs sm:text-[13px] font-bold text-neutral-700">
          {footerNote || "Terima kasih sudah mampir & mendukung kami!"}
        </p>
      </footer>
    </div>
  );
}
