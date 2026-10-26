import { isAcrylicPrintTheme, isPvcPrintTheme, type PrintThemeKey } from "../../lib/print-themes";
import type { CardMaterial } from "../../lib/firebase/firestore-schema";

function QrMark({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 28})`} fill="#172029">
      <rect width="28" height="28" rx="1" fill="white" />
      {[[2, 2], [18, 2], [2, 18]].map(([left, top]) => (
        <g key={`${left}-${top}`} transform={`translate(${left} ${top})`}>
          <path d="M0 0h8v8H0zm2 2v4h4V2z" fillRule="evenodd" />
          <rect x="3" y="3" width="2" height="2" />
        </g>
      ))}
      <path d="M12 2h3v5h-3zm0 8h7v3h-7zm9 2h5v4h-5zm-9 3h3v6h-3zm5 2h3v3h-3zm5 2h4v7h-4zm-6 5h4v2h-4z" />
    </g>
  );
}

function CopyLines({ x, y, width, color = "#172029" }: { x: number; y: number; width: number; color?: string }) {
  return <g fill={color}><rect x={x} y={y} width={width} height="8" /><rect x={x} y={y + 12} width={width * 0.7} height="8" /></g>;
}

export function PrintThemeSwatch({ theme, material }: { theme: PrintThemeKey; material: CardMaterial }) {
  if (isPvcPrintTheme(theme)) {
    return (
      <svg aria-hidden="true" className="size-full max-w-full rounded-md shadow-sm" viewBox="0 0 172 108">
        {theme === "pvc-signal" && <>
          <rect width="172" height="108" fill="#ffb332" />
          <rect x="10" y="10" width="38" height="5" fill="#172029" />
          <CopyLines x={10} y={29} width={81} />
          <path d="m66 77 17 0-7-7m7 7-7 7" fill="none" stroke="#172029" strokeWidth="3" />
          <rect x="108" y="15" width="56" height="80" fill="#172029" />
          <QrMark x={115} y={25} size={42} />
          <rect x="118" y="77" width="35" height="4" fill="#ffb332" />
          <path d="M10 96h83" stroke="#172029" strokeWidth="2" />
        </>}
        {theme === "pvc-orbit" && <>
          <rect width="172" height="108" fill="#172029" />
          <circle cx="144" cy="9" r="55" fill="none" stroke="#ffb332" strokeWidth="2" />
          <circle cx="144" cy="9" r="68" fill="none" stroke="#ffb332" strokeWidth="1" />
          <circle cx="19" cy="16" r="4" fill="#ffb332" />
          <CopyLines x={12} y={35} width={78} color="#fff7e9" />
          <path d="M12 80h43" stroke="#ffb332" strokeWidth="3" />
          <QrMark x={114} y={40} size={45} />
          <path d="M113 96h47" stroke="#ffb332" strokeWidth="2" />
        </>}
        {theme === "pvc-studio" && <>
          <rect width="172" height="108" fill="#fff7e9" />
          <rect width="172" height="19" fill="#ffb332" />
          <path d="M0 19h172M101 19v89M10 88h80" stroke="#172029" strokeWidth="2" />
          <CopyLines x={10} y={32} width={78} />
          <rect x="10" y="69" width="47" height="9" fill="#ffb332" />
          <QrMark x={112} y={37} size={48} />
          <path d="M113 96h46" stroke="#172029" strokeWidth="3" />
          <circle cx="101" cy="19" r="4" fill="#fff7e9" stroke="#172029" strokeWidth="2" />
        </>}
      </svg>
    );
  }

  if (isAcrylicPrintTheme(theme)) {
    return (
      <svg aria-hidden="true" className="size-full max-w-full rounded-md shadow-sm" viewBox="0 0 118 168">
        {theme === "acrylic-sunrise" && <>
          <rect width="118" height="168" fill="#ffb332" />
          <path d="M-20 50a79 79 0 0 1 158 0" fill="#fff7e9" />
          <path d="M0 52h118" stroke="#172029" strokeWidth="3" />
          <CopyLines x={10} y={14} width={93} />
          <rect x="26" y="67" width="73" height="73" fill="#172029" />
          <QrMark x={24} y={65} size={68} />
          <path d="M24 153h70" stroke="#172029" strokeWidth="4" />
        </>}
        {theme === "acrylic-arch" && <>
          <rect width="118" height="168" fill="#fff7e9" />
          <CopyLines x={11} y={11} width={91} />
          <path d="M15 140V84a44 44 0 0 1 88 0v56z" fill="#172029" />
          <QrMark x={29} y={72} size={60} />
          <circle cx="59" cy="53" r="4" fill="#ffb332" />
          <path d="M30 151h58" stroke="#172029" strokeWidth="4" />
          <path d="M36 158h46" stroke="#172029" strokeWidth="2" />
        </>}
        {theme === "acrylic-mosaic" && <>
          <rect width="118" height="168" fill="#fff7e9" />
          <path d="M0 0h60v45H0z" fill="#ffb332" />
          <path d="M60 0h58v45H60z" fill="#087e91" />
          <path d="M82 0h36v36z" fill="#172029" />
          <path d="M0 45h118M60 0v45" stroke="#172029" strokeWidth="3" />
          <CopyLines x={8} y={10} width={43} />
          <rect x="25" y="62" width="73" height="73" fill="#172029" />
          <QrMark x={21} y={58} size={72} />
          <path d="M0 144h118v24H0z" fill="#087e91" />
          <path d="M0 144h35v24H0z" fill="#ffb332" />
          <path d="M47 154h57" stroke="#fff7e9" strokeWidth="4" />
        </>}
      </svg>
    );
  }

  const palette = {
    google: ["#ffb332", "#172029"], "google-classic": ["#ffffff", "#4285f4"],
    minimal: ["#ffffff", "#172029"], natural: ["#f5eed9", "#244b37"],
    coffee: ["#f5e7ca", "#583b2d"], barbershop: ["#e6f6f2", "#087e91"],
    modern: ["#172029", "#bbff38"], "review-poster": ["#e8f1ff", "#2459dc"],
  }[theme];
  const landscape = material === "pvc";
  return (
    <svg aria-hidden="true" className="size-full max-w-full rounded-md shadow-sm" viewBox={landscape ? "0 0 172 108" : "0 0 118 168"}>
      <rect width="172" height="168" fill={palette[0]} />
      <CopyLines x={10} y={12} width={landscape ? 75 : 95} color={palette[1]} />
      <QrMark x={landscape ? 109 : 25} y={landscape ? 29 : 59} size={landscape ? 51 : 68} />
      <path d={landscape ? "M10 88h79" : "M25 145h68"} stroke={palette[1]} strokeWidth="6" />
      <path d={landscape ? "M10 97h48" : "M35 155h48"} stroke={palette[1]} strokeWidth="3" />
    </svg>
  );
}
