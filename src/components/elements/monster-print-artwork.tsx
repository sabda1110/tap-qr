import { Star } from "lucide-react";
import mango from "../assets/images/monsters/monster-mango.webp";
import boba from "../assets/images/monsters/monster-boba.webp";
import ziggy from "../assets/images/monsters/monster-ziggy.webp";

export type MonsterCharacter = "mango" | "boba" | "ziggy";

const mascotImages = { mango, boba, ziggy };

export function MonsterMascot({ character, className = "" }: { character: MonsterCharacter; className?: string }) {
  return <img src={mascotImages[character]} alt="" width={128} height={128} className={`shrink-0 object-contain ${className}`} />;
}

export function MonsterColorBar({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`flex h-[3px] w-24 shrink-0 overflow-hidden rounded-full ${className}`}>
      {["#4285f4", "#ea4335", "#fbbc05", "#34a853"].map((color) => <span key={color} className="flex-1" style={{ backgroundColor: color }} />)}
    </span>
  );
}

export function MonsterStars({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`flex items-center justify-center gap-1 text-[#ffb332] ${className}`}>
      {Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-[17px] fill-current stroke-[#172029]" strokeWidth={2.3} />)}
    </span>
  );
}

export function MonsterDecorations({ character, landscape = false }: { character: MonsterCharacter; landscape?: boolean }) {
  const width = landscape ? 516 : 380;
  const height = landscape ? 324 : 550;
  const accent = character === "mango" ? "#ff8a24" : character === "boba" ? "#27b9cf" : "#ffb332";
  const support = character === "mango" ? "#4285f4" : character === "boba" ? "#ffb332" : "#27b9cf";
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" viewBox={`0 0 ${width} ${height}`} fill="none">
      {character === "ziggy" ? (
        <g stroke="#172029" strokeWidth="4" strokeLinejoin="round">
          <path d="M-5 3H80L62 22 80 39 52 38 44 62 24 44 3 62Z" fill={accent} />
          <path d={`M${width + 5} ${height + 5}h-85l18-23-18-17 28 1 8-24 20 18 21-18Z`} fill={support} />
          <path d={`M${width - 46} -8l-13 30 25-4-10 24 45-34Z`} fill={accent} />
          <path d={`M-8 ${height - 68}l39 16-10 18 26 2-47 39Z`} fill={accent} />
        </g>
      ) : (
        <g stroke="#172029" strokeWidth="5" strokeLinejoin="round">
          <circle cx="0" cy="0" r={landscape ? 47 : 64} fill={support} />
          <circle cx={width} cy="0" r={landscape ? 45 : 62} fill={accent} />
          <circle cx="0" cy={height} r={landscape ? 36 : 54} fill={accent} />
          <circle cx={width} cy={height} r={landscape ? 45 : 65} fill={character === "mango" ? "#34a853" : support} />
          {character === "mango" ? <>
            <path d="M27 26C34 6 44-4 62-6L50 15 44 26Z" fill={accent} />
            <path d={`M${width - 55} -7q22 5 29 32h-17q-6-18-19-23Z`} fill={accent} />
            <path d={`M${width - 64} ${height + 4}q-25-26-34-18-9 12 4 13 9 0 5-7`} fill={accent} />
          </> : <>
            <circle cx="26" cy="0" r="15" fill={accent} />
            <circle cx={width - 19} cy={height - 7} r="17" fill={accent} />
            <path d={`M8 ${height - 30}q27-22 32-4 2 12-9 8`} stroke={support} strokeLinecap="round" />
          </>}
        </g>
      )}
      {!landscape && (
        <g stroke="#172029" strokeWidth="4" strokeLinejoin="round">
          <circle cx="-2" cy={character === "boba" ? 236 : 248} r="26" fill={accent} />
          <circle cx={width + 2} cy={character === "boba" ? 236 : 248} r="26" fill={accent} />
          {[0, 1, 2].map((index) => {
            const y = (character === "boba" ? 225 : 237) + index * 10;
            return <g key={index} fill="#fff8e9"><path d={`M23 ${y}l8 4-8 4Z`} /><path d={`M${width - 23} ${y}l-8 4 8 4Z`} /></g>;
          })}
        </g>
      )}
    </svg>
  );
}
