export function GoogleCornerAccents() {
  return (
    <>
      {/* Top-left Google Blue curve */}
      <div className="pointer-events-none absolute -top-8 -left-8 size-28 rounded-full bg-[#4285f4] opacity-95" />
      {/* Top-right Google Red curve */}
      <div className="pointer-events-none absolute -top-8 -right-8 size-28 rounded-full bg-[#ea4335] opacity-95" />
      {/* Bottom-left Google Yellow curve */}
      <div className="pointer-events-none absolute -bottom-8 -left-8 size-28 rounded-full bg-[#fbbc05] opacity-95" />
      {/* Bottom-right Google Green curve */}
      <div className="pointer-events-none absolute -bottom-8 -right-8 size-28 rounded-full bg-[#34a853] opacity-95" />
    </>
  );
}

export function GoogleColorBar({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto flex h-1 w-24 overflow-hidden rounded-full ${className}`}>
      <span className="h-full flex-1 bg-[#4285f4]" />
      <span className="h-full flex-1 bg-[#ea4335]" />
      <span className="h-full flex-1 bg-[#fbbc05]" />
      <span className="h-full flex-1 bg-[#34a853]" />
    </div>
  );
}

export function CoffeeEmblem() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Coffee Cup with Steam SVG */}
      <svg
        className="size-11 drop-shadow-xs"
        fill="none"
        stroke="#4a2c16"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        viewBox="0 0 48 48"
      >
        {/* Rising steam waves */}
        <path d="M18 10c0-2 2-3 2-5" />
        <path d="M24 10c0-2.5 2-3.5 2-6" />
        <path d="M30 10c0-2 2-3 2-5" />
        {/* Cup body */}
        <path d="M12 16h24v13a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8V16Z" fill="#fef6ed" />
        {/* Cup handle */}
        <path d="M36 20h3a4 4 0 0 1 0 8h-3" />
        {/* Saucer plate */}
        <path d="M8 41h32" strokeWidth={2.4} />
      </svg>
      {/* Coffee bean divider line */}
      <div className="mt-1 flex items-center gap-2">
        <div className="h-px w-10 bg-[#8c6239]/40" />
        {/* Coffee bean icon */}
        <svg className="size-3.5 fill-[#5c3a21]" viewBox="0 0 24 24">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8 0-1.8.6-3.4 1.6-4.8 2.2 1.3 4.2 3.5 5.4 6.8 1.1 3 1.1 5.2 1 6zm6.4-3.2c-1.1-2.9-3.2-5.4-6.4-6.8-1.2-3.3-1.2-5.5-1-6.4 1.1-.4 2.2-.6 3.4-.6 4.4 0 8 3.6 8 8 0 2.2-.9 4.2-2.4 5.8z" />
        </svg>
        <div className="h-px w-10 bg-[#8c6239]/40" />
      </div>
    </div>
  );
}

export function BarbershopEmblem() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Crossed Scissors + Comb + Mustache SVG */}
      <svg
        className="size-13 drop-shadow-xs"
        fill="none"
        stroke="#0f172a"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        viewBox="0 0 64 54"
      >
        {/* Comb on angle */}
        <path d="M16 12l32 20" strokeWidth={2.2} />
        <path d="M20 12l2 4M24 14l2 4M28 17l2 4M32 19l2 4M36 22l2 4M40 24l2 4M44 27l2 4" strokeWidth={1.5} />
        {/* Scissors blades */}
        <path d="M18 36L44 8" strokeWidth={2} />
        <path d="M44 36L18 8" strokeWidth={2} />
        {/* Scissors handles */}
        <circle cx="16" cy="38" r="4.5" fill="#f8f5ee" strokeWidth={2} />
        <circle cx="46" cy="38" r="4.5" fill="#f8f5ee" strokeWidth={2} />
        {/* Gentleman Mustache silhouette */}
        <path
          d="M31 43c-3-2-7-1.5-10 1 3 3 8 2.5 10-1zm2 0c3-2 7-1.5 10 1-3 3-8 2.5-10-1z"
          fill="#0f172a"
          stroke="none"
        />
      </svg>
      {/* Decorative vintage diamond rule */}
      <div className="mt-0.5 flex items-center gap-1.5 text-[#b48c36]">
        <div className="h-px w-12 bg-[#b48c36]/60" />
        <span className="text-[9px]">◆</span>
        <div className="h-px w-12 bg-[#b48c36]/60" />
      </div>
    </div>
  );
}

export function BarberPoleRibbon() {
  return (
    <div className="relative mx-auto flex h-2.5 w-60 items-center justify-center overflow-hidden rounded-full shadow-xs">
      <div
        className="h-full w-full"
        style={{
          background:
            "repeating-linear-gradient(45deg, #d9383a, #d9383a 10px, #ffffff 10px, #ffffff 18px, #1e3a8a 18px, #1e3a8a 28px, #ffffff 28px, #ffffff 36px)",
        }}
      />
    </div>
  );
}
