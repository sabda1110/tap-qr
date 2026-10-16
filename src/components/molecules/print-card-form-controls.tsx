import {
  Coffee,
  CreditCard,
  Image,
  Palette,
  RefreshCw,
  Scissors,
  Sparkles,
  Type,
  Waves,
  Leaf,
  LayoutTemplate,
} from "lucide-react";
import { GoogleMark } from "../elements/google-mark";
import { useId } from "react";
import type { PrintCardOption } from "../../server/print/admin-print.repository.server";
import type { PrintThemeKey } from "../elements/nfc-tap-target";
import { ThemePickerButton } from "../elements/theme-picker-button";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type PrintCardFormControlsProps = {
  cards: PrintCardOption[];
  selectedCardId: string;
  onSelectCardId: (id: string) => void;
  theme: PrintThemeKey;
  onSelectTheme: (theme: PrintThemeKey) => void;
  showMonster: boolean;
  onToggleMonster: (show: boolean) => void;
  preHeadline: string;
  onChangePreHeadline: (val: string) => void;
  headline: string;
  onChangeHeadline: (val: string) => void;
  footerNote: string;
  onChangeFooterNote: (val: string) => void;
  onResetDefaults: () => void;
  labels: {
    selectCardLabel: string;
    chooseThemeLabel: string;
    showMonsterLabel: string;
    preHeadlineLabel: string;
    headlineLabel: string;
    footerNoteLabel: string;
    resetDefaults: string;
    cardStatusUnprinted: string;
    emptyCardLabel: string;
    themeHelp: string;
    mascotHelp: string;
    copySectionTitle: string;
    copySectionDescription: string;
    themes: {
      "review-poster": { title: string; subtitle: string };
      google: { title: string; subtitle: string };
      coffee: { title: string; subtitle: string };
      barbershop: { title: string; subtitle: string };
      modern: { title: string; subtitle: string };
      "google-classic": { title: string; subtitle: string };
      minimal: { title: string; subtitle: string };
      natural: { title: string; subtitle: string };
    };
  };
  hideCardSelect?: boolean;
};

export function PrintCardFormControls({
  cards,
  selectedCardId,
  onSelectCardId,
  theme,
  onSelectTheme,
  showMonster,
  onToggleMonster,
  preHeadline,
  onChangePreHeadline,
  headline,
  onChangeHeadline,
  footerNote,
  onChangeFooterNote,
  onResetDefaults,
  labels,
  hideCardSelect = false,
}: PrintCardFormControlsProps) {
  const cardSelectId = useId();
  const preHeadlineId = useId();
  const headlineId = useId();
  const footerNoteId = useId();

  return (
    <div className="space-y-4">
      {!hideCardSelect && (
        <section className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#fff4dd] text-[#9a6200]">
              <CreditCard aria-hidden="true" className="size-4.5" />
            </span>
            <label className="text-sm font-bold text-[#172029]" htmlFor={cardSelectId}>
              {labels.selectCardLabel}
            </label>
          </div>
          {cards.length > 0 ? (
            <Select
              items={Object.fromEntries(cards.map((card) => [card.cardId, card.cardId]))}
              onValueChange={(value) => value && onSelectCardId(value)}
              value={selectedCardId}
            >
              <SelectTrigger className="mt-4 w-full" id={cardSelectId}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cards.map((card) => (
                  <SelectItem key={card.cardId} value={card.cardId}>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{card.cardId}</span>
                      <span className="block text-xs text-[#69737d]">
                        {card.material.toUpperCase()} · {labels.cardStatusUnprinted}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="mt-4 rounded-xl bg-[#f8fafc] px-4 py-3 text-sm text-[#69737d]">
              {labels.emptyCardLabel}
            </p>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e8f8fb] text-[#087e91]">
            <Palette aria-hidden="true" className="size-4.5" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-[#172029]">{labels.chooseThemeLabel}</h2>
            <p className="mt-0.5 text-xs leading-5 text-[#69737d]">{labels.themeHelp}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <ThemePickerButton active={theme === "google-classic"} icon={<GoogleMark />} onClick={() => onSelectTheme("google-classic")} {...labels.themes["google-classic"]} />
          <ThemePickerButton active={theme === "minimal"} icon={<LayoutTemplate className="size-4.5" />} onClick={() => onSelectTheme("minimal")} {...labels.themes.minimal} />
          <ThemePickerButton active={theme === "natural"} icon={<Leaf className="size-4.5" />} onClick={() => onSelectTheme("natural")} {...labels.themes.natural} />
          <ThemePickerButton active={theme === "review-poster"} icon={<Type className="size-4.5" />} onClick={() => onSelectTheme("review-poster")} {...labels.themes["review-poster"]} />
          <ThemePickerButton
            active={theme === "google"}
            icon={<Sparkles className="size-4.5" />}
            onClick={() => onSelectTheme("google")}
            subtitle={labels.themes.google.subtitle}
            title={labels.themes.google.title}
          />
          <ThemePickerButton
            active={theme === "coffee"}
            icon={<Coffee className="size-4.5" />}
            onClick={() => onSelectTheme("coffee")}
            subtitle={labels.themes.coffee.subtitle}
            title={labels.themes.coffee.title}
          />
          <ThemePickerButton
            active={theme === "barbershop"}
            icon={<Scissors className="size-4.5" />}
            onClick={() => onSelectTheme("barbershop")}
            subtitle={labels.themes.barbershop.subtitle}
            title={labels.themes.barbershop.title}
          />
          <ThemePickerButton
            active={theme === "modern"}
            icon={<Waves className="size-4.5" />}
            onClick={() => onSelectTheme("modern")}
            subtitle={labels.themes.modern.subtitle}
            title={labels.themes.modern.title}
          />
        </div>
        {theme !== "google-classic" && theme !== "minimal" && theme !== "natural" && theme !== "review-poster" && (
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-black/6 pt-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#fff4dd] text-[#9a6200]">
              <Image aria-hidden="true" className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#172029]">{labels.showMonsterLabel}</p>
              <p className="mt-0.5 text-[11px] leading-4 text-[#69737d]">{labels.mascotHelp}</p>
            </div>
          </div>
          <button
            aria-checked={showMonster}
            aria-label={labels.showMonsterLabel}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent outline-none transition-colors focus-visible:ring-3 focus-visible:ring-[#087e91]/20 ${
              showMonster ? "bg-[#087e91]" : "bg-gray-300"
            }`}
            onClick={() => onToggleMonster(!showMonster)}
            role="switch"
            type="button"
          >
            <span
              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm transition duration-200 ${
                showMonster ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        )}
      </section>

      <section className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f3f5f7] text-[#4f5964]">
            <Type aria-hidden="true" className="size-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-[#172029]">{labels.copySectionTitle}</h2>
            <p className="mt-0.5 text-xs leading-5 text-[#69737d]">{labels.copySectionDescription}</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div>
          <label className="text-xs font-semibold text-[#4f5964]" htmlFor={preHeadlineId}>
            {labels.preHeadlineLabel}
          </label>
          <Input
            className="mt-1.5 h-11 bg-[#f8fafc]"
            id={preHeadlineId}
            onChange={(e) => onChangePreHeadline(e.target.value)}
            value={preHeadline}
          />
          </div>

          <div>
          <label className="text-xs font-semibold text-[#4f5964]" htmlFor={headlineId}>
            {labels.headlineLabel}
          </label>
          <Input
            className="mt-1.5 h-11 bg-[#f8fafc] font-semibold"
            id={headlineId}
            onChange={(e) => onChangeHeadline(e.target.value)}
            value={headline}
          />
          </div>

          <div>
          <label className="text-xs font-semibold text-[#4f5964]" htmlFor={footerNoteId}>
            {labels.footerNoteLabel}
          </label>
          <Input
            className="mt-1.5 h-11 bg-[#f8fafc]"
            id={footerNoteId}
            onChange={(e) => onChangeFooterNote(e.target.value)}
            value={footerNote}
          />
          </div>
          <div className="flex justify-end border-t border-black/6 pt-3">
            <Button onClick={onResetDefaults} size="sm" type="button" variant="ghost">
              <RefreshCw aria-hidden="true" />
              {labels.resetDefaults}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
