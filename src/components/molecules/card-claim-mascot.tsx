import mascotImage from "../assets/images/activation/mascot.jpg";

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
      <div className="relative h-20 w-24 shrink-0 overflow-hidden">
        <img
          src={mascotImage}
          alt={alt}
          className="absolute top-0 left-1/2 size-28 max-w-none -translate-x-1/2 object-cover object-top"
        />
      </div>
      <p className="max-w-24 -rotate-3 text-center text-xs font-bold leading-4 text-[#155ee8]">
        {badgeText}
      </p>
    </div>
  );
}
