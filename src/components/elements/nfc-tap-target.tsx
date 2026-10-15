export type PrintThemeKey = "google" | "coffee" | "barbershop" | "modern";

type NfcTapTargetProps = {
  theme: PrintThemeKey;
  label?: string;
  sublabel?: string;
  className?: string;
};

const themeStyles: Record<
  PrintThemeKey,
  {
    outerRing: string;
    innerBorder: string;
    bg: string;
    waveColor: string;
    titleColor: string;
    subtextColor: string;
  }
> = {
  google: {
    outerRing: "border-[#4285f4] shadow-xs",
    innerBorder: "border-[#4285f4]/30",
    bg: "bg-white",
    waveColor: "#1a1a1a",
    titleColor: "text-[#111827]",
    subtextColor: "text-[#6b7280]",
  },
  coffee: {
    outerRing: "border-[#5c3a21] shadow-xs",
    innerBorder: "border-[#8b5a2b]/30",
    bg: "bg-[#fbf7f0]",
    waveColor: "#3d2314",
    titleColor: "text-[#2c1810]",
    subtextColor: "text-[#785942]",
  },
  barbershop: {
    outerRing: "border-[#0f172a] shadow-xs",
    innerBorder: "border-[#b48c36]",
    bg: "bg-[#f8f5ee]",
    waveColor: "#0f172a",
    titleColor: "text-[#0f172a] font-serif",
    subtextColor: "text-[#52525b]",
  },
  modern: {
    outerRing: "border-[#84e034] shadow-lg",
    innerBorder: "border-[#84e034]/40",
    bg: "bg-[#090d16]",
    waveColor: "#84e034",
    titleColor: "text-[#84e034]",
    subtextColor: "text-slate-300",
  },
};

export function NfcTapTarget({
  theme,
  label = "Tap di sini",
  sublabel = "Tempelkan ponsel Anda",
  className = "",
}: NfcTapTargetProps) {
  const styles = themeStyles[theme];

  return (
    <div
      className={`relative flex size-[132px] sm:size-[144px] flex-col items-center justify-center rounded-full border-2 transition-all p-2 text-center ${styles.outerRing} ${styles.innerBorder} ${styles.bg} ${className}`}
    >
      {/* Contactless 4-Wave Radio SVG Icon */}
      <svg
        className="size-9 shrink-0 drop-shadow-xs"
        fill="none"
        stroke={styles.waveColor}
        strokeLinecap="round"
        strokeWidth={3}
        viewBox="0 0 40 40"
      >
        <path d="M12 28a11.3 11.3 0 0 1 0-16" />
        <path d="M17 31a16.5 16.5 0 0 1 0-22" />
        <path d="M22 34a21.8 21.8 0 0 1 0-28" />
        <path d="M27 37a27 27 0 0 1 0-34" />
      </svg>

      {/* Primary Label */}
      <p className={`mt-1.5 text-xs sm:text-[13px] font-black leading-tight tracking-tight ${styles.titleColor}`}>
        {label}
      </p>

      {/* Instruction Subtext */}
      <p className={`mt-0.5 text-[8.5px] sm:text-[9.5px] font-medium leading-tight ${styles.subtextColor}`}>
        {sublabel}
      </p>
    </div>
  );
}
