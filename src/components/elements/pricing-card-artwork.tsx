import type { LucideIcon } from "lucide-react";

type Props = { icon: LucideIcon; featured?: boolean; royal?: boolean };

export function PricingCardArtwork({ icon: Icon, featured = false, royal = false }: Props) {
  return (
    <svg aria-hidden="true" className="pricing-artwork h-20 w-24 shrink-0 overflow-visible" viewBox="0 0 120 100" fill="none">
      <g stroke="#171b22" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {royal && (
          <g className="pricing-royal-cape">
            <path d="M32 23C14 31 16 62 5 83c19-3 30 10 52 7 21 5 41-8 54-4-12-20-7-48-25-61Z" fill="#9b3351" />
            <path d="M30 29C20 44 23 65 14 78m73-48c10 15 7 36 16 48" stroke="#ffb332" strokeWidth="2" />
            <path d="M28 25q28-20 59 0l-5 13q-24-15-49 1Z" fill="#fff8e9" />
            <path d="m36 28 1 3m12-8 1 3m14-3-1 3m14 2-1 3" strokeWidth="2" />
          </g>
        )}
        <path d={royal ? "M28 48 15 56l9 10m65-18 14 9 4-16" : featured ? "M28 48 16 34 10 17m79 31 14-14 7-17" : "M28 48 12 57l8 10m69-19 16 10-7 10"} />
        <path d="m43 74-6 15-11 2m48-17 5 15 12 2" />
        <rect x="26" y="14" width="65" height="62" rx="12" fill={royal ? "#ffdf83" : featured ? "#fff8e9" : "#bcecf2"} transform="rotate(-5 58 45)" />
        {royal && (
          <>
            <path d="m35 14-4-20 15 10 11-15L68 4 83-6l-4 20Z" fill="#ffb332" />
            <path d="M36 10h42" stroke="#fff8e9" strokeWidth="2" />
            <path d="m57-1 4 5-4 5-4-5Z" fill="#9b3351" strokeWidth="1.5" />
            <path d="m106 42 3-19" stroke="#ffdf83" strokeWidth="3" />
            <path d="m110 13 5 7-6 6-5-7Z" fill="#ffb332" strokeWidth="2" />
          </>
        )}
        <path d="M43 52v3m28-3v3m-22 8q10 8 19-1" />
        <path d="m12 14-5-3m5 9-7 1m104-7 5-3m-5 9 7 1" stroke={featured ? "#171b22" : "#ffb332"} />
      </g>
      <Icon x={44} y={23} width={29} height={25} color="#171b22" strokeWidth={1.8} />
      <path className="pricing-spark" d="m98 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#ffb332" stroke="#171b22" strokeWidth="1.5" />
    </svg>
  );
}
