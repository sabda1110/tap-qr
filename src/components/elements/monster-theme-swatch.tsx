import type { MonsterPrintTheme } from "../../lib/print-themes";
import mango from "../assets/images/monsters/monster-mango.webp";
import boba from "../assets/images/monsters/monster-boba.webp";
import ziggy from "../assets/images/monsters/monster-ziggy.webp";

const palettes = {
  mango: { image: mango, base: "#fffaf0", accent: "#ff8a26", support: "#087e91" },
  boba: { image: boba, base: "#e7f4ef", accent: "#087e91", support: "#ffb332" },
  ziggy: { image: ziggy, base: "#ffefb0", accent: "#ffb332", support: "#087e91" },
};

function MiniQr({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 28})`} fill="#172029">
      <rect width="28" height="28" rx="1" fill="#fff" />
      {[[2, 2], [18, 2], [2, 18]].map(([left, top]) => (
        <path key={`${left}-${top}`} transform={`translate(${left} ${top})`} d="M0 0h8v8H0zm2 2v4h4V2zm1 1h2v2H3z" fillRule="evenodd" />
      ))}
      <path d="M12 2h3v5h-3zm0 8h7v3h-7zm9 2h5v4h-5zm-9 3h3v6h-3zm5 2h3v3h-3zm5 2h4v7h-4zm-6 5h4v2h-4z" />
    </g>
  );
}

export function MonsterThemeSwatch({ theme }: { theme: MonsterPrintTheme }) {
  const character = theme.endsWith("mango") ? "mango" : theme.endsWith("boba") ? "boba" : "ziggy";
  const { image, base, accent, support } = palettes[character];
  const landscape = theme.startsWith("pvc");
  return (
    <svg aria-hidden="true" className="size-full max-w-full rounded-md shadow-sm" viewBox={landscape ? "0 0 172 108" : "0 0 118 168"}>
      <rect x="1.5" y="1.5" width={landscape ? 169 : 115} height={landscape ? 105 : 165} rx="5" fill={base} stroke="#172029" strokeWidth="3" />
      {landscape ? <>
        {character === "mango" && <>
          <path d="M2 2h28a28 28 0 0 1-28 28z" fill={accent} stroke="#172029" strokeWidth="2" />
          <path d="M170 106h-28a28 28 0 0 1 28-28z" fill={support} stroke="#172029" strokeWidth="2" />
          <circle cx="34" cy="59" r="26" fill="#fff" stroke="#172029" strokeWidth="2" />
          <image href={image} x="9" y="29" width="50" height="57" />
          <path d="M66 19h78M66 28h62" stroke="#172029" strokeWidth="6" />
          <rect x="66" y="39" width="36" height="11" fill={accent} stroke="#172029" strokeWidth="1.5" />
          <MiniQr x={111} y={42} size={43} />
          <path d="M68 68q8-10 0-20m6 23q12-13 0-26" fill="none" stroke="#172029" strokeWidth="2" />
          <path d="M63 94h83" stroke="#172029" strokeWidth="2" />
        </>}
        {character === "boba" && <>
          <path d="M2 2h168v18H2z" fill={accent} />
          <path d="M11 11h37m-37 19h64m-64 10h50" stroke="#172029" strokeWidth="5" />
          <rect x="9" y="52" width="58" height="44" rx="7" fill="#fff" stroke="#172029" strokeWidth="2" />
          <MiniQr x={20} y={56} size={35} />
          <circle cx="121" cy="63" r="30" fill={support} stroke="#172029" strokeWidth="2" />
          <image href={image} x="87" y="27" width="68" height="73" />
          <path d="m74 71 9 0-4-4m4 4-4 4" stroke="#172029" strokeWidth="2" fill="none" />
        </>}
        {character === "ziggy" && <>
          <path d="M4 24 14 5l10 19L34 5l10 19L54 5l10 19L74 5l10 19L94 5l10 19 10-19 10 19 10-19 10 19 10-19 14 19" fill={accent} stroke="#172029" strokeWidth="2" />
          <image href={image} x="5" y="28" width="60" height="69" />
          <path d="M70 39h82M70 49h67" stroke="#172029" strokeWidth="6" />
          <path d="m71 63 8-4 8 4 8-4 8 4v26H71z" fill={support} stroke="#172029" strokeWidth="2" />
          <MiniQr x={114} y={60} size={36} />
          <path d="M10 99h141" stroke="#172029" strokeWidth="2" />
        </>}
      </> : <>
        {character === "mango" && <>
          <path d="M2 2h30a30 30 0 0 1-30 30zm114 164H86a30 30 0 0 1 30-30z" fill={accent} stroke="#172029" strokeWidth="2" />
          <circle cx="59" cy="30" r="20" fill="#fff" stroke="#172029" strokeWidth="2" />
          <image href={image} x="38" y="7" width="42" height="44" />
          <path d="M19 61h80M27 72h64" stroke="#172029" strokeWidth="6" />
          <path d="m9 84 101-2 1 13L10 97z" fill={accent} stroke="#172029" strokeWidth="2" />
          <circle cx="31" cy="123" r="20" fill="#fff" stroke="#172029" strokeWidth="2" />
          <path d="M30 112q8 10 0 20m5-23q12 13 0 26" fill="none" stroke="#172029" strokeWidth="2" />
          <MiniQr x={68} y={105} size={37} />
        </>}
        {character === "boba" && <>
          <path d="M2 2h114v34H2z" fill={accent} />
          <path d="M14 14h89M25 25h68" stroke="#fffaf0" strokeWidth="6" />
          <circle cx="60" cy="64" r="28" fill={support} stroke="#172029" strokeWidth="2" />
          <image href={image} x="31" y="35" width="58" height="59" />
          <rect x="21" y="97" width="76" height="47" rx="8" fill="#fff" stroke="#172029" strokeWidth="2" />
          <MiniQr x={41} y={102} size={37} />
        </>}
        {character === "ziggy" && <>
          <path d="m2 21 11-17 12 17L37 4l12 17L61 4l12 17L85 4l12 17 12-17 7 17v14H2z" fill={accent} stroke="#172029" strokeWidth="2" />
          <image href={image} x="33" y="30" width="52" height="55" />
          <path d="M12 91h94M22 102h74" stroke="#172029" strokeWidth="6" />
          <rect x="36" y="111" width="51" height="38" fill={support} />
          <MiniQr x={39} y={111} size={36} />
        </>}
        <path d="M27 155h64" stroke="#172029" strokeWidth="2" />
      </>}
    </svg>
  );
}
