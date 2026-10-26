import { Check } from "lucide-react";
import type { CardMaterial } from "../../lib/firebase/firestore-schema";
import { getSocialPrintThemes, isAcrylicPrintTheme, isPvcPrintTheme, type PrintThemeKey } from "../../lib/print-themes";
import { PrintThemeSwatch } from "../elements/print-theme-swatch";
import { Button } from "../ui/button";

export type SocialPrintThemeLabels = Record<PrintThemeKey, { title: string; subtitle: string }>;

export function SocialPrintThemePicker({ material, theme, onChange, labels, className = "" }: {
  material: CardMaterial;
  theme: PrintThemeKey;
  onChange: (theme: PrintThemeKey) => void;
  labels: SocialPrintThemeLabels;
  className?: string;
}) {
  const available = getSocialPrintThemes(material);
  const dedicated = available.filter((key) => isPvcPrintTheme(key) || isAcrylicPrintTheme(key));
  const legacy = available.filter((key) => !isPvcPrintTheme(key) && !isAcrylicPrintTheme(key));

  return (
    <div className={`grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 ${className}`}>
      {[...dedicated, ...legacy].map((key) => {
        const active = theme === key;
        return (
          <Button
            key={key}
            type="button"
            variant="outline"
            aria-pressed={active}
            className={`relative h-auto min-w-0 flex-col items-stretch gap-0 overflow-hidden rounded-xl p-3 text-left whitespace-normal transition-colors ${active ? "border-[#087e91] bg-[#e8f8fb] shadow-[0_0_0_1px_#087e91] hover:bg-[#e8f8fb]" : "border-black/8 bg-white hover:border-[#087e91]/40 hover:bg-[#f8fcfd]"}`}
            onClick={() => onChange(key)}
          >
            <span className="flex h-28 items-center justify-center rounded-lg border border-black/5 bg-[#f3f5f7] p-2.5 [&_svg]:h-full [&_svg]:w-auto [&_svg]:shrink">
              <PrintThemeSwatch theme={key} material={material} />
            </span>
            {active && <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-[#087e91] text-white ring-2 ring-white"><Check aria-hidden="true" className="size-3.5 stroke-[3]" /></span>}
            <span className="mt-3 block text-sm font-bold leading-5 text-[#172029]">{labels[key].title}</span>
            <span className="mt-1 block text-xs font-normal leading-5 text-[#69737d]">{labels[key].subtitle}</span>
          </Button>
        );
      })}
    </div>
  );
}
