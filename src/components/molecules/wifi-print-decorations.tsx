import type { WifiPrintTheme } from "../../hooks/use-wifi-print";
import { KrakenTentaclesOverlay, OrangeMonsterClawsOverlay } from "./print-card-monster-graphics";

export const wifiThemeVisuals: Record<WifiPrintTheme, {
  surface: string; header: string; footer: string; target: string; divider: string;
}> = {
  monster: { surface: "bg-white text-[#172029]", header: "bg-[#27b9cf]", footer: "bg-[#ffb332]", target: "bg-[#fff4dd] border-[#172029] shadow-[4px_4px_0_#172029]", divider: "bg-[#172029]" },
  mono: { surface: "bg-[#faf9f6] text-[#172029]", header: "bg-[#172029] text-white", footer: "bg-white", target: "bg-white border-[#172029] shadow-[4px_4px_0_#172029]", divider: "bg-[#172029]" },
  natural: { surface: "bg-[#f5f0e5] text-[#172029]", header: "bg-[#283d32] text-white", footer: "bg-[#ffb332]", target: "bg-[#e2e8da] border-[#172029] shadow-[4px_4px_0_#172029]", divider: "bg-[#172029]" },
  coffee: { surface: "bg-[#fff8e9] text-[#2c1810]", header: "bg-[#d97706] text-[#172029]", footer: "bg-[#0d9488] text-white", target: "bg-[#fef3c7] border-[#172029] shadow-[4px_4px_0_#172029]", divider: "bg-[#5c3a21]" },
  barbershop: { surface: "bg-[#f8f5ee] text-[#172029]", header: "bg-[#172029] text-white", footer: "bg-[#b48c36] text-[#172029]", target: "bg-white border-[#172029] shadow-[4px_4px_0_#172029]", divider: "bg-[#172029]" },
  kraken: { surface: "bg-[#090d16] text-white", header: "bg-[#84e034] text-[#172029]", footer: "bg-[#84e034] text-[#172029]", target: "bg-[#131b2e] text-[#84e034] border-[#84e034] shadow-[4px_4px_0_#84e034]", divider: "bg-[#84e034]" },
};

export function WifiPrintDecorations({ theme }: { theme: WifiPrintTheme }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {theme === "monster" && <OrangeMonsterClawsOverlay />}
      {theme === "kraken" && <KrakenTentaclesOverlay />}
      {theme === "coffee" && <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(#5c3a21 1px, transparent 1px)", backgroundSize: "8px 8px" }} />}
      {theme === "barbershop" && <>
        <div className="absolute inset-y-0 left-0 w-2.5 border-r-2 border-[#172029]" style={{ background: "repeating-linear-gradient(35deg,#d9383a 0 10px,#fff 10px 20px,#1e3a8a 20px 30px,#fff 30px 40px)" }} />
        <div className="absolute inset-y-0 right-0 w-2.5 border-l-2 border-[#172029]" style={{ background: "repeating-linear-gradient(35deg,#d9383a 0 10px,#fff 10px 20px,#1e3a8a 20px 30px,#fff 30px 40px)" }} />
      </>}
    </div>
  );
}
