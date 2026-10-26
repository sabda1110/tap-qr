import mascotImage from "../assets/images/tapqr-cloud-mascot.webp";

type CardClaimMascotProps = {
  className?: string;
  badgeText: string;
  alt: string;
};

export function CardClaimMascot({
  className = "",
  badgeText,
  alt,
}: CardClaimMascotProps) {
  return (
    <div
      className={`pointer-events-none hidden h-20 items-center gap-2 select-none md:flex ${className}`}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden">
        <img
          src={mascotImage}
          alt={alt}
          className="size-20 object-contain"
        />
      </div>
      <p className="max-w-24 -rotate-3 text-center text-xs font-bold leading-4 text-[#4f5964]">
        {badgeText}
      </p>
    </div>
  );
}
