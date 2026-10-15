import type { PrintThemeKey } from "./nfc-tap-target";
import monsterOrange from "../assets/images/monsters/monster-orange.png";
import monsterBarber from "../assets/images/monsters/monster-barber.jpg";
import { VintageCoffeeMascot } from "./vintage-coffee-mascot";

type MonsterAvatarProps = {
  theme: PrintThemeKey;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function MonsterAvatar({ theme, className = "", size = "md" }: MonsterAvatarProps) {
  const sizeClasses = {
    sm: "size-12 sm:size-14",
    md: "size-16 sm:size-20",
    lg: "size-20 sm:size-24",
  }[size];

  if (theme === "coffee") {
    return (
      <div
        className={`relative inline-flex ${sizeClasses} shrink-0 items-center justify-center overflow-hidden rounded-full border-3 border-black bg-[#fef3c7] shadow-md ${className}`}
      >
        <VintageCoffeeMascot size="sm" className="scale-125" />
      </div>
    );
  }

  if (theme === "barbershop") {
    return (
      <div
        className={`relative inline-flex ${sizeClasses} shrink-0 items-center justify-center overflow-hidden rounded-full border-3 border-[#0f172a] bg-white shadow-md ${className}`}
      >
        <img
          alt="Barber Monster"
          className="size-full object-cover object-center scale-105"
          src={monsterBarber}
        />
      </div>
    );
  }

  if (theme === "google") {
    return (
      <div
        className={`relative inline-flex ${sizeClasses} shrink-0 items-center justify-center overflow-hidden rounded-full border-3 border-[#ea4335] bg-white shadow-md ${className}`}
      >
        <img
          alt="TapQR Monster"
          className="size-full object-contain p-0.5 scale-110"
          src={monsterOrange}
        />
      </div>
    );
  }

  // Modern Kraken Neon Monster (2D Green Kraken with cute tentacles and big googly eyes)
  return (
    <div
      className={`relative inline-flex ${sizeClasses} shrink-0 items-center justify-center overflow-hidden rounded-full border-3 border-[#84e034] bg-[#090d16] shadow-lg ${className}`}
    >
      <svg
        className="size-full p-1 drop-shadow-md"
        fill="none"
        viewBox="0 0 100 100"
      >
        {/* Curled mini tentacles behind body */}
        <path d="M 22 75 C 10 70, 5 50, 15 45 C 22 40, 28 55, 24 65" stroke="#84e034" strokeWidth="6" strokeLinecap="round" />
        <path d="M 78 75 C 90 70, 95 50, 85 45 C 78 40, 72 55, 76 65" stroke="#84e034" strokeWidth="6" strokeLinecap="round" />

        {/* Kraken Head/Dome */}
        <path
          d="M 25 65 C 20 40, 30 20, 50 20 C 70 20, 80 40, 75 65 C 70 75, 60 78, 50 78 C 40 78, 30 75, 25 65 Z"
          fill="#84e034"
          stroke="#090d16"
          strokeWidth="3.5"
        />

        {/* Big White Googly Eyes with Shine */}
        <circle cx="39" cy="45" r="9" fill="white" stroke="#090d16" strokeWidth="3" />
        <circle cx="61" cy="45" r="9" fill="white" stroke="#090d16" strokeWidth="3" />
        {/* Pupils */}
        <circle cx="41" cy="44" r="4.5" fill="#090d16" />
        <circle cx="63" cy="44" r="4.5" fill="#090d16" />
        {/* Eye reflection glint */}
        <circle cx="43" cy="42" r="1.5" fill="white" />
        <circle cx="65" cy="42" r="1.5" fill="white" />

        {/* Wide Grin Mouth with tiny fangs */}
        <path d="M 38 60 Q 50 70, 62 60" stroke="#090d16" strokeWidth="3" strokeLinecap="round" />
        <polygon points="43,60 46,64 49,60" fill="white" />
        <polygon points="51,60 54,64 57,60" fill="white" />

        {/* Front cute tentacles reaching down */}
        <path d="M 35 75 Q 32 90, 24 88" stroke="#84e034" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 45 76 Q 47 92, 42 92" stroke="#84e034" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 55 76 Q 53 92, 58 92" stroke="#84e034" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 65 75 Q 68 90, 76 88" stroke="#84e034" strokeWidth="5.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
