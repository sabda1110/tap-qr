import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Flag, Footprints, ScanLine, ShoppingBag, Store, UserRoundPlus } from "lucide-react";
import type { Messages } from "../../i18n";
import { Button } from "../ui/button";
import { GettingStartedStep } from "./getting-started-step";
import "./activation-journey-map.css";

type Props = { content: Messages["gettingStarted"] };
const stops = [
  { key: "purchase", icon: ShoppingBag, x: 23, y: 26 },
  { key: "account", icon: UserRoundPlus, x: 77, y: 26 },
  { key: "outlet", icon: Store, x: 77, y: 74 },
  { key: "activate", icon: ScanLine, x: 23, y: 74 },
] as const;

export function ActivationJourneyMap({ content }: Props) {
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const [position, setPosition] = useState(0);
  const positionRef = useRef(0);
  const [hop, setHop] = useState(0);
  const copy = content.journey;
  const stop = stops[selected];
  const current = content.steps[stop.key];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      positionRef.current = selected;
      setPosition(selected);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const advance = () => {
      if (positionRef.current === selected) return;
      positionRef.current += Math.sign(selected - positionRef.current);
      setPosition(positionRef.current);
      setHop((value) => value + 1);
      timer = setTimeout(advance, 650);
    };
    advance();
    return () => clearTimeout(timer);
  }, [selected]);

  function choose(index: number) {
    setSelected(index);
    setPreview(null);
  }

  return (
    <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.15fr_1fr]">
      <div className="rounded-3xl border-2 border-[#171b22] bg-white p-4 shadow-[5px_5px_0_#171b22] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-extrabold text-[#171b22]"><Footprints aria-hidden="true" className="size-5 text-[#087e91]" />{copy.title}</p>
          <span className="rounded-full bg-[#fff8e9] px-3 py-1 text-xs font-bold text-[#946115]">{selected + 1} / 4</span>
        </div>
        <p className="mt-2 text-xs leading-6 text-[#58606b]">{copy.hint}</p>
        <div className="journey-board" role="group" aria-label={copy.title}>
          <svg className="journey-road" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M23 26 H77 V74 H23" fill="none" stroke="#ffb332" strokeWidth="13" strokeLinejoin="round" />
            <path d="M23 26 H77 V74 H23" fill="none" stroke="#fff8e9" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <span className="journey-start" aria-hidden="true">{copy.start}</span>
          <span className="journey-finish" aria-hidden="true"><Flag className="size-4" />{copy.finish}</span>
          <span className="journey-spark journey-spark-one" aria-hidden="true">✦</span>
          <span className="journey-spark journey-spark-two" aria-hidden="true">✧</span>
          <div className="journey-pawn-track" style={{ left: `${stops[position].x}%`, top: `${stops[position].y}%` }} aria-hidden="true">
            <div key={hop} className={hop ? "journey-pawn journey-pawn-hop" : "journey-pawn"}>
              <svg viewBox="0 0 48 64" className="h-14 w-11" fill="none">
                <ellipse cx="24" cy="58" rx="20" ry="5" fill="#171b22" opacity=".15" />
                <path d="M17 27C17 39 13 45 8 50C5 55 43 55 40 50C35 45 31 39 31 27Z" fill="#0798ad" stroke="#171b22" strokeWidth="3" />
                <circle cx="24" cy="17" r="13" fill="#ffb332" stroke="#171b22" strokeWidth="3" />
                <circle cx="20" cy="16" r="1.5" fill="#171b22" /><circle cx="28" cy="16" r="1.5" fill="#171b22" />
                <path d="M20 21Q24 25 28 21" stroke="#171b22" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          {stops.map(({ key, icon: Icon, x, y }, index) => (
            <div key={key} className="journey-stop" style={{ left: `${x}%`, top: `${y}%` }} onMouseEnter={() => setPreview(index)} onMouseLeave={() => setPreview(null)}>
              <Button
                variant="outline"
                className="journey-stop-button"
                aria-pressed={selected === index}
                aria-controls="journey-details"
                aria-label={`${index + 1}. ${content.steps[key].title}`}
                aria-describedby={preview === index ? `journey-preview-${key}` : undefined}
                onFocus={() => setPreview(index)}
                onBlur={() => setPreview(null)}
                onKeyDown={(event) => { if (event.key === "Escape") setPreview(null); }}
                onClick={() => choose(index)}
              >
                <Icon aria-hidden="true" className="size-6" />
                <span className="journey-stop-number" aria-hidden="true">{index + 1}</span>
              </Button>
              <span className="journey-stop-label">{copy.labels[key]}</span>
              {preview === index && (
                <div id={`journey-preview-${key}`} role="tooltip" className="journey-preview">
                  {content.steps[key].description}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-black/10 pt-4">
          <Button variant="outline" className="min-h-11 px-3" disabled={selected === 0} onClick={() => choose(selected - 1)}><ArrowLeft aria-hidden="true" />{copy.previous}</Button>
          <Button variant="warning" className="min-h-11 px-3" onClick={() => choose(selected === 3 ? 0 : selected + 1)}>{selected === 3 ? copy.restart : copy.next}<ArrowRight aria-hidden="true" /></Button>
        </div>
        <p className="mt-3 text-xs leading-5 text-[#69737d]">{copy.note}</p>
        <a href="#journey-details" className="mt-3 inline-flex min-h-11 items-center rounded-lg text-sm font-bold text-[#087e91] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 lg:hidden">{copy.readStep}<ArrowRight aria-hidden="true" className="ml-2 size-4" /></a>
      </div>
      <div id="journey-details" className="scroll-mt-6">
        <p role="status" className="sr-only">{copy.currentStep} {selected + 1}: {current.title}</p>
        <div key={stop.key} className="journey-details-enter">
          <GettingStartedStep content={current} icon={stop.icon} number={selected + 1} />
        </div>
      </div>
    </div>
  );
}
