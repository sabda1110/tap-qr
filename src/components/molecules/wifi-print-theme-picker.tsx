import { Coffee, Leaf, Scissors, Sparkles, Square, Type, Waves } from "lucide-react";
import type { wifiPrintId } from "../../i18n/locales/wifi-print-id";
import type { WifiPrintTheme } from "../../hooks/use-wifi-print";
import { ThemePickerButton } from "../elements/theme-picker-button";

const themeIcons = {
  monster: Sparkles,
  mono: Square,
  natural: Leaf,
  coffee: Coffee,
  barbershop: Scissors,
  kraken: Waves,
  poster: Type,
};

export function WifiPrintThemePicker({ theme, onChange, content }: {
  theme: WifiPrintTheme;
  onChange: (theme: WifiPrintTheme) => void;
  content: typeof wifiPrintId;
}) {
  return (
    <section className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
      <h2 className="text-sm font-bold">{content.themeTitle}</h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {(Object.keys(themeIcons) as WifiPrintTheme[]).map((key) => {
          const Icon = themeIcons[key];
          return <ThemePickerButton key={key} active={theme === key} onClick={() => onChange(key)} icon={<Icon aria-hidden="true" className="size-4.5" />} title={content[key]} subtitle={content.themeDescriptions[key]} />;
        })}
      </div>
    </section>
  );
}
