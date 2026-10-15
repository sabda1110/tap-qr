import { Star } from "lucide-react";
import type { PrintThemeKey } from "./nfc-tap-target";

type FiveStarRatingProps = {
  theme: PrintThemeKey;
  className?: string;
};

export function FiveStarRating({ theme, className = "" }: FiveStarRatingProps) {
  if (theme === "barbershop") {
    return (
      <div className={`flex items-center justify-center gap-2.5 ${className}`}>
        <div className="h-px w-8 bg-[#b48c36]/60" />
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className="size-5 fill-[#d4af37] text-[#8c6d1f] drop-shadow-xs"
              strokeWidth={1.5}
            />
          ))}
        </div>
        <div className="h-px w-8 bg-[#b48c36]/60" />
      </div>
    );
  }

  if (theme === "coffee") {
    return (
      <div className={`relative flex items-center justify-center gap-1.5 ${className}`}>
        {/* Left radiate accents */}
        <div className="flex flex-col gap-1 opacity-70">
          <span className="block h-1 w-2 rounded-full bg-[#f59e0b] -rotate-45" />
          <span className="block h-1 w-2.5 rounded-full bg-[#f59e0b] -rotate-12" />
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className="size-5.5 fill-[#f59e0b] text-[#d97706] drop-shadow-xs"
              strokeWidth={1.2}
            />
          ))}
        </div>
        {/* Right radiate accents */}
        <div className="flex flex-col gap-1 opacity-70">
          <span className="block h-1 w-2 rounded-full bg-[#f59e0b] rotate-45" />
          <span className="block h-1 w-2.5 rounded-full bg-[#f59e0b] rotate-12" />
        </div>
      </div>
    );
  }

  // Google theme (Default)
  return (
    <div className={`relative flex items-center justify-center gap-2 ${className}`}>
      {/* Sparkle accents left */}
      <div className="flex flex-col gap-1">
        <span className="block h-1 w-2.5 rounded-full bg-[#fbbc05] -rotate-45" />
        <span className="block h-1 w-3 rounded-full bg-[#4285f4] -rotate-15" />
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className="size-6 fill-[#fbbc05] text-[#f59e0b] drop-shadow-xs"
            strokeWidth={1.2}
          />
        ))}
      </div>
      {/* Sparkle accents right */}
      <div className="flex flex-col gap-1">
        <span className="block h-1 w-2.5 rounded-full bg-[#fbbc05] rotate-45" />
        <span className="block h-1 w-3 rounded-full bg-[#34a853] rotate-15" />
      </div>
    </div>
  );
}
