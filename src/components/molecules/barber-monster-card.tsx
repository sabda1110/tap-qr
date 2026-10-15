import { Scissors, ScanLine } from "lucide-react";
import monsterBarberImg from "../assets/images/monsters/monster-barber.jpg";
import { GoogleBrandText } from "../elements/google-brand-text";

export type BarberMonsterCardProps = {
  cardId: string;
  preHeadline?: string;
  headline?: string;
  footerNote?: string;
  qrDataUrl: string;
  className?: string;
  id?: string;
};

export function BarberMonsterCard({
  cardId,
  preHeadline,
  headline,
  footerNote,
  qrDataUrl,
  className = "",
  id,
}: BarberMonsterCardProps) {
  return (
    <div
      id={id}
      className={`print-canvas-root relative flex w-[380px] h-[550px] flex-col justify-between overflow-hidden rounded-[32px] border-4 border-black bg-white p-5 text-center text-black shadow-2xl transition-all ${className}`}
      style={{ boxSizing: "border-box" }}
    >
      {/* BACKGROUND PATTERN: Halftone matrix, shears, comb & street sparkles on clean white */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <svg className="h-full w-full" fill="#0f766e">
          <pattern id="barber-white-pattern" width="56" height="56" patternUnits="userSpaceOnUse">
            {/* Halftone dot matrix */}
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="24" cy="8" r="1" />
            <circle cx="40" cy="8" r="1.5" />
            <circle cx="16" cy="20" r="1" />
            <circle cx="32" cy="20" r="1.5" />
            <circle cx="48" cy="20" r="1" />
            <circle cx="8" cy="36" r="1.5" />
            <circle cx="28" cy="36" r="1" />
            <circle cx="44" cy="36" r="1.5" />
            {/* Scissor silhouette */}
            <circle cx="14" cy="46" r="2" fill="none" stroke="#0f766e" strokeWidth="1" />
            <circle cx="20" cy="46" r="2" fill="none" stroke="#0f766e" strokeWidth="1" />
            <path d="M15 44 L24 35 M19 44 L10 35" stroke="#0f766e" strokeWidth="1" />
            {/* Street crosshair */}
            <path d="M42 42 h6 M45 39 v6" stroke="#ff4d3b" strokeWidth="1.2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#barber-white-pattern)" />
        </svg>
      </div>

      {/* TOP SLANTED BARBER POLE CAUTION STRIP */}
      <div className="pointer-events-none absolute -top-1 -right-8 z-20 w-36 rotate-12 overflow-hidden border-2 border-black bg-white shadow-md">
        <div className="flex h-3.5 w-full">
          <div className="h-full w-3 -skew-x-12 bg-[#ff4d3b]" />
          <div className="h-full w-3 -skew-x-12 bg-white" />
          <div className="h-full w-3 -skew-x-12 bg-[#14b8a6]" />
          <div className="h-full w-3 -skew-x-12 bg-black" />
          <div className="h-full w-3 -skew-x-12 bg-[#ff4d3b]" />
          <div className="h-full w-3 -skew-x-12 bg-white" />
          <div className="h-full w-3 -skew-x-12 bg-[#14b8a6]" />
          <div className="h-full w-3 -skew-x-12 bg-black" />
          <div className="h-full w-3 -skew-x-12 bg-[#ff4d3b]" />
        </div>
      </div>

      {/* STREETWEAR STICKER: CERTIFIED FRESH CUT */}
      <div className="pointer-events-none absolute top-3 left-4 z-20 -rotate-6">
        <div className="rounded-md border-2 border-black bg-[#facc15] px-2 py-0.5 text-[9px] font-black tracking-wider text-black uppercase shadow-[2px_2px_0px_#000]">
          ★ CERTIFIED FRESH CUT ★
        </div>
      </div>

      {/* DIE-CUT COMB ACCENT PEEKING OVER LEFT BORDER */}
      <div className="pointer-events-none absolute top-20 -left-2.5 z-20 -rotate-12 rounded-lg border-2 border-black bg-[#14b8a6] px-1.5 py-2 shadow-[2px_2px_0px_#000]">
        <svg className="h-6 w-3 text-black" viewBox="0 0 12 28" fill="currentColor">
          <rect x="0" y="0" width="3" height="28" rx="1" />
          <rect x="3" y="2" width="8" height="2" />
          <rect x="3" y="6" width="8" height="2" />
          <rect x="3" y="10" width="8" height="2" />
          <rect x="3" y="14" width="8" height="2" />
          <rect x="3" y="18" width="8" height="2" />
          <rect x="3" y="22" width="8" height="2" />
        </svg>
      </div>

      {/* HEADER SECTION: MASCOT, SPEECH BUBBLE & STREETWEAR DISPLAY TYPOGRAPHY */}
      <header className="relative z-10 space-y-1.5 pt-1">
        {/* Dominant Mascot Monster Breaking Out of Card */}
        <div className="relative mx-auto flex items-center justify-center pt-2">
          {/* Die-cut Streetwear Monster Badge with Hard Shadow */}
          <div className="relative z-10 size-24 shrink-0 overflow-hidden rounded-full border-4 border-black bg-[#0f766e] shadow-[4px_4px_0px_#000] ring-4 ring-[#14b8a6]/40 sm:size-26">
            <img
              alt="Dapper Teal Barber Monster"
              className="size-full object-cover object-center scale-110"
              src={monsterBarberImg}
            />
          </div>

          {/* Die-cut Scissor Reaching Past Frame & Pointing at QR Code */}
          <div className="pointer-events-none absolute -bottom-1 right-2 z-20 rotate-[35deg] rounded-full border-2 border-black bg-[#ff4d3b] p-1.5 text-white shadow-[2px_2px_0px_#000]">
            <Scissors className="size-4" strokeWidth={2.6} />
          </div>

          {/* Speech Bubble: "Rapi? Kasih bintang 5 dong! ✂️" */}
          <div className="absolute top-2 -right-3 z-20 flex items-center gap-1 rounded-xl border-2 border-black bg-white px-2.5 py-1 text-[11px] font-black text-black shadow-[3px_3px_0px_#000] rotate-3 sm:right-2">
            <span>Rapi? Kasih bintang 5 dong!</span>
            <span className="text-xs">✂️</span>
            {/* Bubble Tail */}
            <div className="absolute -bottom-1.5 left-3 size-2.5 rotate-45 border-r-2 border-b-2 border-black bg-white" />
          </div>
        </div>

        {/* Display Title with Marker Highlight on "potongan" */}
        <h2 className="pt-1 text-2xl font-black tracking-tight text-black uppercase drop-shadow-xs sm:text-[27px]">
          {preHeadline ? (
            preHeadline
          ) : (
            <>
              Puas dengan{" "}
              <span className="relative inline-block mx-0.5 px-2 py-0.5 text-white font-black">
                <span className="absolute inset-0 -skew-x-6 rounded-md bg-[#ff4d3b] shadow-xs -z-0" />
                <span className="relative z-10">potongan</span>
              </span>{" "}
              Anda?
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
            <span className="rounded-md border-2 border-black bg-[#14b8a6] px-2 py-0.5 font-black text-black uppercase shadow-[2px_2px_0px_#000]">
              TAP
            </span>
            <span>atau</span>
            <span className="rounded-md border-2 border-black bg-[#ff4d3b] px-2 py-0.5 font-black text-white uppercase shadow-[2px_2px_0px_#000]">
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
            {/* Cut Line with Small Scissor Leading into Target */}
            <div className="absolute -top-3 flex items-center gap-0.5 text-[9px] font-bold text-[#0d9488]">
              <span className="tracking-widest">--</span>
              <Scissors className="size-3 text-[#ff4d3b] -rotate-45" />
              <span className="tracking-widest">--</span>
            </div>

            {/* Stitched Patch Circle on Clean Light Teal / White */}
            <div className="relative flex size-[130px] sm:size-[142px] flex-col items-center justify-center rounded-full border-3 border-dashed border-[#0d9488] bg-[#f0fdfa] p-2 text-center shadow-[4px_4px_0px_#000]">
              {/* Concentric Pulse Ring */}
              <div className="absolute inset-0 rounded-full border border-[#0d9488]/30 animate-ping opacity-25" />

              {/* NFC Contactless Wave */}
              <svg
                className="size-8 shrink-0 drop-shadow-xs"
                fill="none"
                stroke="#0d9488"
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
              <p className="mt-0.5 text-[8.5px] sm:text-[9.5px] font-semibold text-teal-800">
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
            <div className="absolute -top-3 z-20 -rotate-6 rounded-md border-2 border-black bg-[#ff4d3b] px-2 py-0.5 text-[9px] font-black text-white uppercase shadow-[2px_2px_0px_#000]">
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

            {/* Pill Button "Scan QR Code" in Vibrant Streetwear Teal */}
            <div className="mt-2 flex items-center justify-center gap-1.5 rounded-full border-2 border-black bg-[#14b8a6] px-3.5 py-1 text-[11px] sm:text-xs font-black text-black shadow-[2px_2px_0px_#000]">
              <ScanLine className="size-3.5 shrink-0 text-black" strokeWidth={2.8} />
              <span>Scan QR Code</span>
            </div>

            {/* Hand-drawn SVG Doodle Arrow to QR */}
            <div className="pointer-events-none absolute -bottom-4 right-3 flex items-center gap-1 text-[#ff4d3b] rotate-[6deg]">
              <span className="font-mono text-[10px] font-black tracking-tight text-[#ff4d3b]">scan!</span>
              <svg className="h-4 w-6" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M20 14 C 15 15, 9 12, 6 4" />
                <path d="M11 5 L6 4 L5 9" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION: INCLUSIVE STREETWEAR SQUAD VIBE */}
      <footer className="relative z-10 pt-1 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-[13px] font-bold text-neutral-700">
          <Scissors className="size-3.5 text-[#ff4d3b]" strokeWidth={2.4} />
          <span>{footerNote || "Terima kasih sudah jadi bagian dari squad kami"}</span>
          <span className="text-xs text-[#d97706]">★</span>
        </div>
      </footer>
    </div>
  );
}
