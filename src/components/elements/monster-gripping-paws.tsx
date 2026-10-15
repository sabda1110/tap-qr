type MonsterGrippingPawsProps = {
  variant?: "furry-paw" | "cartoon-glove";
  furColor?: string;
  padColor?: string;
  clawColor?: string;
  topClass?: string;
};

export function MonsterGrippingPaws({
  variant = "cartoon-glove",
  furColor = "#5c3a21",
  padColor = "#dfb182",
  clawColor = "#facc15",
  topClass = "top-28",
}: MonsterGrippingPawsProps) {
  if (variant === "cartoon-glove") {
    return (
      <>
        {/* LEFT 1930s VINTAGE CARTOON GLOVE GRIPPING THE CARD */}
        <div className={`pointer-events-none absolute ${topClass} -left-3 z-30 drop-shadow-[2px_3px_0px_#000]`}>
          <svg
            className="h-16 w-8 text-white"
            viewBox="0 0 32 64"
            fill="currentColor"
            stroke="black"
            strokeLinejoin="round"
            strokeWidth="2.5"
          >
            {/* 3 Chunky cartoon gloved fingers clutching inwards */}
            <path d="M-4 6 C 12 6, 25 12, 25 21 C 25 26, 18 28, 10 28 C 21 28, 27 32, 27 38 C 27 42, 20 44, 12 44 C 20 44, 25 48, 23 54 C 21 58, 10 60, -4 60 Z" />
            {/* Iconic 3 black dart stitches on back of 1930s glove */}
            <path d="M4 22 L14 24" stroke="black" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 36 L15 37" stroke="black" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 50 L13 49" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* RIGHT 1930s VINTAGE CARTOON GLOVE GRIPPING THE CARD */}
        <div className={`pointer-events-none absolute ${topClass} -right-3 z-30 drop-shadow-[-2px_3px_0px_#000]`}>
          <svg
            className="h-16 w-8 text-white"
            viewBox="0 0 32 64"
            fill="currentColor"
            stroke="black"
            strokeLinejoin="round"
            strokeWidth="2.5"
          >
            {/* 3 Chunky cartoon gloved fingers clutching inwards */}
            <path d="M36 6 C 20 6, 7 12, 7 21 C 7 26, 14 28, 22 28 C 11 28, 5 32, 5 38 C 5 42, 12 44, 20 44 C 12 44, 7 48, 9 54 C 11 58, 22 60, 36 60 Z" />
            {/* Iconic 3 black dart stitches on back of 1930s glove */}
            <path d="M28 22 L18 24" stroke="black" strokeWidth="2" strokeLinecap="round" />
            <path d="M28 36 L17 37" stroke="black" strokeWidth="2" strokeLinecap="round" />
            <path d="M28 50 L19 49" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </>
    );
  }

  return (
    <>
      {/* LEFT MONSTER HAND GRIPPING THE CARD */}
      <div className={`pointer-events-none absolute ${topClass} -left-3.5 z-30 drop-shadow-[2px_3px_0px_#000]`}>
        <svg
          className="h-16 w-8"
          viewBox="0 0 32 64"
          fill={furColor}
          stroke="black"
          strokeLinejoin="round"
          strokeWidth="2.5"
        >
          <path d="M-4 6 C 14 6, 26 12, 26 22 C 26 26, 20 28, 12 28 C 22 28, 28 32, 28 38 C 28 42, 22 44, 14 44 C 22 44, 26 48, 24 54 C 22 58, 12 60, -4 60 Z" />
          <path d="M26 22 L30 23 L25 25" fill={clawColor} stroke="black" strokeWidth="1.5" />
          <path d="M28 38 L32 39 L27 41" fill={clawColor} stroke="black" strokeWidth="1.5" />
          <path d="M24 54 L28 55 L23 57" fill={clawColor} stroke="black" strokeWidth="1.5" />
          <ellipse cx="16" cy="22" rx="4" ry="2.5" fill={padColor} stroke="none" />
          <ellipse cx="18" cy="38" rx="4.5" ry="2.5" fill={padColor} stroke="none" />
          <ellipse cx="15" cy="52" rx="4" ry="2.5" fill={padColor} stroke="none" />
        </svg>
      </div>

      {/* RIGHT MONSTER HAND GRIPPING THE CARD */}
      <div className={`pointer-events-none absolute ${topClass} -right-3.5 z-30 drop-shadow-[-2px_3px_0px_#000]`}>
        <svg
          className="h-16 w-8"
          viewBox="0 0 32 64"
          fill={furColor}
          stroke="black"
          strokeLinejoin="round"
          strokeWidth="2.5"
        >
          <path d="M36 6 C 18 6, 6 12, 6 22 C 6 26, 12 28, 20 28 C 10 28, 4 32, 4 38 C 4 42, 10 44, 18 44 C 10 44, 6 48, 8 54 C 10 58, 20 60, 36 60 Z" />
          <path d="M6 22 L2 23 L7 25" fill={clawColor} stroke="black" strokeWidth="1.5" />
          <path d="M4 38 L0 39 L5 41" fill={clawColor} stroke="black" strokeWidth="1.5" />
          <path d="M8 54 L4 55 L9 57" fill={clawColor} stroke="black" strokeWidth="1.5" />
          <ellipse cx="16" cy="22" rx="4" ry="2.5" fill={padColor} stroke="none" />
          <ellipse cx="14" cy="38" rx="4.5" ry="2.5" fill={padColor} stroke="none" />
          <ellipse cx="17" cy="52" rx="4" ry="2.5" fill={padColor} stroke="none" />
        </svg>
      </div>
    </>
  );
}
