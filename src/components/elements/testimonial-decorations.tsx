import { useId } from "react";

export function TestimonialDecorations() {
  const patternId = useId();

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} width="28" height="9" patternUnits="userSpaceOnUse">
          <path
            d="M-7 4.5Q0-2.5 7 4.5T21 4.5T35 4.5"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
