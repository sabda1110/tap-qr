import type { FC } from "react";

export interface CardClaimMascotProps {
  className?: string;
  badgeText?: string;
  subText?: string;
}

export const CardClaimMascot: FC<CardClaimMascotProps> = ({
  className = "",
  badgeText = "Mudah & Cepat!",
  subText = "Siap digunakan ✨",
}) => {
  return (
    <div className={`hidden sm:flex items-center gap-2.5 select-none pointer-events-none ${className}`}>
      {/* Speech / Announcement Badge */}
      <div className="relative flex flex-col items-end justify-center rounded-2xl border border-[#bce8ef] bg-gradient-to-br from-cyan-50/90 via-white to-sky-50/80 px-3 py-1.5 shadow-xs">
        <span className="text-xs font-bold text-[#087e91] tracking-tight">{badgeText}</span>
        <span className="text-[11px] font-medium text-slate-500">{subText}</span>
        <span
          className="absolute -right-1.5 top-1/2 -translate-y-1/2 size-3 rotate-45 border-t border-r border-[#bce8ef] bg-white"
          aria-hidden="true"
        />
      </div>

      {/* Modern 3D-styled SVG Mascot holding Toa / Megaphone */}
      <div className="relative shrink-0 -my-3">
        <svg
          width="130"
          height="88"
          viewBox="0 0 130 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-auto drop-shadow-sm"
          aria-label="Maskot TapQR mengumumkan aktivasi"
        >
          <defs>
            <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="45%" stopColor="#0798ad" />
              <stop offset="100%" stopColor="#0e7490" />
            </linearGradient>
            <linearGradient id="hoodieShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#087e91" />
              <stop offset="100%" stopColor="#155e75" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#fbcfe8" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="toaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#cffafe" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#cffafe" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Glow */}
          <circle cx="85" cy="48" r="42" fill="url(#ambientGlow)" />

          {/* Sound Waves from Megaphone */}
          <path d="M 36 28 C 30 33 30 43 36 48" stroke="#0798ad" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.85" />
          <path d="M 28 22 C 18 31 18 45 28 54" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.75" />
          <path d="M 20 18 C 8 28 8 50 20 60" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" strokeDasharray="2 3" />

          {/* Sparkles / Celebration Stars */}
          <path d="M 24 12 Q 24 16 20 16 Q 24 16 24 20 Q 24 16 28 16 Q 24 16 24 12 Z" fill="#f59e0b" />
          <path d="M 12 36 Q 12 39 9 39 Q 12 39 12 42 Q 12 39 15 39 Q 12 39 12 36 Z" fill="#06b6d4" />
          <circle cx="34" cy="18" r="1.5" fill="#f59e0b" />
          <circle cx="16" cy="24" r="1.2" fill="#0798ad" />

          {/* Character Body / Hoodie */}
          <ellipse cx="94" cy="56" rx="24" ry="12" fill="url(#hoodieShadow)" />
          <path d="M 68 88 C 68 68 76 56 94 56 C 112 56 120 68 120 88 Z" fill="url(#hoodieGrad)" />
          <path d="M 90 62 L 90 76" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9" />
          <circle cx="90" cy="77" r="1.5" fill="#ffffff" />
          <path d="M 98 62 L 98 75" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.9" />
          <circle cx="98" cy="76" r="1.5" fill="#ffffff" />

          {/* Head & Neck */}
          <rect x="89" y="47" width="10" height="11" rx="4" fill="url(#skinGrad)" />
          <circle cx="94" cy="38" r="16" fill="url(#skinGrad)" />
          <circle cx="78" cy="38" r="3.5" fill="url(#skinGrad)" />
          <circle cx="110" cy="38" r="3.5" fill="url(#skinGrad)" />

          {/* Hair */}
          <path d="M 77 36 C 77 22 83 18 94 18 C 105 18 111 22 111 36 C 111 36 106 28 94 28 C 82 28 77 36 77 36 Z" fill="url(#hairGrad)" />
          <path d="M 80 26 C 85 20 95 19 104 22 C 100 24 95 24 88 28 Z" fill="#475569" opacity="0.6" />

          {/* Face details */}
          <path d="M 85 31 Q 88 29 91 31" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 97 31 Q 100 29 103 31" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 85 35 Q 88 38 91 35" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 97 35 Q 100 38 103 35" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
          <ellipse cx="84" cy="40" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.35" />
          <ellipse cx="104" cy="40" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.35" />
          <path d="M 90 41 Q 94 47 98 41 Z" fill="#be123c" />
          <path d="M 91 41 Q 94 43 97 41" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />

          {/* Right Arm / Hand (Thumbs Up) */}
          <path d="M 112 66 C 117 65 124 68 124 74 C 124 78 118 82 114 84" stroke="url(#hoodieGrad)" strokeWidth="7" strokeLinecap="round" />
          <circle cx="123" cy="71" r="3.5" fill="url(#skinGrad)" />
          <path d="M 123 71 L 123 66" stroke="url(#skinGrad)" strokeWidth="3" strokeLinecap="round" />

          {/* Left Arm & Megaphone (Toa) */}
          <path d="M 76 68 C 68 64 62 58 60 50" stroke="url(#hoodieGrad)" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="58" cy="48" rx="4" ry="4.5" fill="url(#skinGrad)" />
          <rect x="56" y="47" width="5" height="11" rx="2.5" fill="#334155" transform="rotate(18 56 47)" />
          <polygon points="62,42 63,52 43,45 42,35" fill="url(#toaGrad)" stroke="#94a3b8" strokeWidth="0.8" />
          <ellipse cx="42.5" cy="40" rx="3.5" ry="7" fill="url(#amberGrad)" stroke="#d97706" strokeWidth="0.8" />
          <ellipse cx="42.5" cy="40" rx="1.5" ry="4.5" fill="#78350f" />
          <ellipse cx="62.5" cy="47" rx="3.5" ry="5.5" fill="#087e91" />
          <circle cx="64" cy="47" r="2" fill="#22d3ee" />
          <path d="M 52 38 L 53 48" stroke="#0798ad" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};
