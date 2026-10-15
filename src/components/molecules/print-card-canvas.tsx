import { ScanLine } from "lucide-react";
import { type PrintThemeKey, NfcTapTarget } from "../elements/nfc-tap-target";
import { GoogleBrandText } from "../elements/google-brand-text";
import { FiveStarRating } from "../elements/five-star-rating";
import { MonsterAvatar } from "../elements/monster-avatar";
import {
  GoogleColorBar,
  GoogleCornerAccents,
} from "./print-card-decorations";
import {
  KrakenTentaclesOverlay,
  OrangeMonsterClawsOverlay,
} from "./print-card-monster-graphics";
import { CoffeeMonsterCard } from "./coffee-monster-card";
import { BarberMonsterCard } from "./barber-monster-card";

export type PrintCardCanvasProps = {
  theme: PrintThemeKey;
  cardId: string;
  preHeadline?: string;
  headline?: string;
  footerNote?: string;
  qrDataUrl: string;
  showMonster?: boolean;
  className?: string;
  id?: string;
};

type CanvasThemeVisual = {
  cardBg: string;
  cardBorder: string;
  textColor: string;
  preHeadlineClass: string;
  badgeBg: string;
  badgeBorder: string;
  badgeTextColor: string;
  tapTextColor: string;
  qrBorder: string;
  qrPillBg: string;
  qrPillText: string;
  dividerLine: string;
  footerClass: string;
};

const canvasThemeVisuals: Record<PrintThemeKey, CanvasThemeVisual> = {
  google: {
    cardBg: "bg-white",
    cardBorder: "border-[#f97316]/50 shadow-xl",
    textColor: "text-[#111827]",
    preHeadlineClass: "text-[#f97316] font-black",
    badgeBg: "bg-[#eef5fe]",
    badgeBorder: "border-[#d2e3fc]",
    badgeTextColor: "text-[#1a73e8]",
    tapTextColor: "text-[#1a73e8]",
    qrBorder: "border-[#4285f4]",
    qrPillBg: "bg-[#1a73e8]",
    qrPillText: "text-white",
    dividerLine: "bg-[#e5e7eb]",
    footerClass: "text-[#374151] font-medium italic",
  },
  coffee: {
    cardBg: "bg-[#fbf7f0]",
    cardBorder: "border-[#5c3a21] shadow-xl",
    textColor: "text-[#2c1810]",
    preHeadlineClass: "text-[#5c3a21] font-black text-xl sm:text-2xl",
    badgeBg: "bg-[#f1e6d7]",
    badgeBorder: "border-[#dfcca0]/60",
    badgeTextColor: "text-[#1d4ed8]",
    tapTextColor: "text-[#1d4ed8]",
    qrBorder: "border-[#5c3a21]",
    qrPillBg: "bg-[#3d2314]",
    qrPillText: "text-white",
    dividerLine: "bg-[#d8c2aa]",
    footerClass: "text-[#4a2c16] font-semibold italic",
  },
  barbershop: {
    cardBg: "bg-[#f8f5ee]",
    cardBorder: "border-[#0f172a] shadow-xl",
    textColor: "text-[#0f172a]",
    preHeadlineClass: "text-[#0f172a] font-serif font-black text-xl sm:text-2xl",
    badgeBg: "bg-[#efe9dc]",
    badgeBorder: "border-[#b48c36]",
    badgeTextColor: "text-[#0f172a]",
    tapTextColor: "text-[#0f172a]",
    qrBorder: "border-[#0f172a]",
    qrPillBg: "bg-[#0f172a]",
    qrPillText: "text-white",
    dividerLine: "bg-[#b48c36]/60",
    footerClass: "text-[#0f172a] font-serif italic",
  },
  modern: {
    cardBg: "bg-[#090d16]",
    cardBorder: "border-[#84e034]/60 shadow-2xl",
    textColor: "text-white",
    preHeadlineClass: "text-[#84e034] font-black",
    badgeBg: "bg-[#131b2e]",
    badgeBorder: "border-[#84e034]/40",
    badgeTextColor: "text-[#84e034]",
    tapTextColor: "text-[#84e034]",
    qrBorder: "border-[#84e034]",
    qrPillBg: "bg-[#84e034]",
    qrPillText: "text-[#090d16] font-black",
    dividerLine: "bg-[#84e034]/40",
    footerClass: "text-[#84e034] font-semibold italic",
  },
};

export function PrintCardCanvas({
  theme,
  cardId,
  preHeadline,
  headline,
  footerNote,
  qrDataUrl,
  showMonster = true,
  className = "",
  id,
}: PrintCardCanvasProps) {
  if (theme === "coffee") {
    return (
      <CoffeeMonsterCard
        cardId={cardId}
        className={className}
        footerNote={footerNote}
        headline={headline}
        id={id}
        preHeadline={preHeadline}
        qrDataUrl={qrDataUrl}
      />
    );
  }

  if (theme === "barbershop") {
    return (
      <BarberMonsterCard
        cardId={cardId}
        className={className}
        footerNote={footerNote}
        headline={headline}
        id={id}
        preHeadline={preHeadline}
        qrDataUrl={qrDataUrl}
      />
    );
  }

  const visual = canvasThemeVisuals[theme];

  return (
    <div
      id={id}
      className={`print-canvas-root relative flex w-[380px] h-[550px] flex-col justify-between overflow-hidden rounded-[28px] border-2 p-5 text-center transition-all ${visual.cardBg} ${visual.cardBorder} ${className}`}
      style={{ boxSizing: "border-box" }}
    >
      {/* Monster Full-Card Graphic Overlays (Tentacles, Claws, Paws, Fur) */}
      {showMonster && theme === "modern" && <KrakenTentaclesOverlay />}
      {showMonster && theme === "google" && <OrangeMonsterClawsOverlay />}

      {/* Top Background Ornaments */}
      {theme === "google" && <GoogleCornerAccents />}

      {/* TOP HEADER SECTION */}
      <header className="relative z-10 space-y-1.5 pt-0.5">
        {/* Top Decorative Ribbon or Bar */}
        {theme === "google" && <GoogleColorBar className="mb-1.5" />}

        {/* Mascot Monster or Classic Emblem */}
        {showMonster ? (
          <div className="flex justify-center py-0.5">
            <MonsterAvatar theme={theme} size="md" />
          </div>
        ) : (
          <div className="flex justify-center py-0.5">
            {theme === "google" && <GoogleColorBar className="my-1" />}
          </div>
        )}

        {/* Pre-headline question if present */}
        {preHeadline ? (
          <h2 className={`tracking-tight leading-tight ${visual.preHeadlineClass}`}>
            {preHeadline}
          </h2>
        ) : null}

        {/* Main Headline: Berikan Review Anda di Google */}
        <h1 className={`text-xl sm:text-[23px] font-black leading-snug tracking-tight ${visual.textColor}`}>
          {headline ? (
            <span>{headline}</span>
          ) : (
            <>
              Berikan Review Anda di <GoogleBrandText />
            </>
          )}
        </h1>

        {/* 5-Star Rating with sparkle accents */}
        <div className="pt-0.5">
          <FiveStarRating theme={theme} />
        </div>

        {/* Callout Badge: Cukup TAP atau SCAN */}
        <div className="pt-1 flex items-center justify-center gap-1.5">
          {theme === "google" && (
            <span className="text-xs font-black text-[#4285f4]">‹</span>
          )}
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1 text-xs sm:text-[13px] font-bold shadow-2xs ${visual.badgeBg} ${visual.badgeBorder}`}
          >
            <span className={theme === "modern" ? "text-slate-300" : "text-[#374151]"}>Cukup</span>
            <span className={`font-black ${visual.tapTextColor}`}>TAP</span>
            <span className={theme === "modern" ? "text-slate-300" : "text-[#374151]"}>atau</span>
            <span className={`font-black ${visual.tapTextColor}`}>SCAN</span>
          </div>
          {theme === "google" && (
            <span className="text-xs font-black text-[#34a853]">›</span>
          )}
        </div>
      </header>

      {/* DUAL INTERACTION AREA: NFC TAP (LEFT) vs QR SCAN (RIGHT) */}
      <section className="relative z-10 my-auto py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* SISI KIRI: NFC TAP TARGET */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <NfcTapTarget
              label="Tap di sini"
              sublabel="Tempelkan ponsel Anda"
              theme={theme}
            />
          </div>

          {/* TENGAH: DIVIDER VERTICAL DENGAN LABEL 'atau' */}
          <div className="flex flex-col items-center justify-center px-1">
            <div className={`h-10 w-0.5 ${visual.dividerLine}`} />
            <span className={`my-1 text-[11px] font-medium italic ${theme === "modern" ? "text-slate-400" : "text-[#6b7280]"}`}>
              atau
            </span>
            <div className={`h-10 w-0.5 ${visual.dividerLine}`} />
          </div>

          {/* SISI KANAN: QR SCAN ZONE */}
          <div className="flex flex-1 flex-col items-center justify-center">
            {/* QR Box with rounded frame */}
            <div
              className={`relative flex size-[116px] sm:size-[126px] items-center justify-center rounded-2xl border-2 bg-white p-2 shadow-xs ${visual.qrBorder}`}
            >
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

            {/* Pill Button 'Scan QR Code' with scanner icon */}
            <div
              className={`mt-2 flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-extrabold shadow-xs ${visual.qrPillBg} ${visual.qrPillText}`}
            >
              <ScanLine className="size-3.5 shrink-0" strokeWidth={2.4} />
              <span>Scan QR Code</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="relative z-10 space-y-1.5 pt-0.5 text-center">
        <p className={`text-xs sm:text-[13px] leading-tight ${visual.footerClass}`}>
          {footerNote || "Terima kasih atas dukungan Anda!"}
        </p>

        {theme === "google" && <GoogleColorBar className="mt-1" />}
      </footer>
    </div>
  );
}
