import { Coffee, RefreshCw, Scissors, Smile, Sparkles } from "lucide-react";
import type { PrintCardOption } from "../../server/print/admin-print.repository.server";
import type { PrintThemeKey } from "../elements/nfc-tap-target";
import { ThemePickerButton } from "../elements/theme-picker-button";

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
    themes: {
      google: { title: string; subtitle: string };
      coffee: { title: string; subtitle: string };
      barbershop: { title: string; subtitle: string };
      modern: { title: string; subtitle: string };
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
  return (
    <div className="space-y-4">
      {/* Card Selection Dropdown */}
      {!hideCardSelect && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#172029] uppercase">
            {labels.selectCardLabel}
          </label>
          <select
            className="w-full rounded-xl border border-black/10 bg-[#fbfcfd] px-3.5 py-2 text-xs font-semibold text-[#172029] outline-none focus:border-[#087e91]"
            onChange={(e) => onSelectCardId(e.target.value)}
            value={selectedCardId}
          >
            {cards.length === 0 ? (
              <option value="">Semua kartu sudah dicetak atau diklaim</option>
            ) : (
              cards.map((c) => (
                <option key={c.cardId} value={c.cardId}>
                  {c.cardId} ({c.material.toUpperCase()}) — Belum Dicetak
                </option>
              ))
            )}
          </select>
        </div>
      )}

      {/* Theme Presets */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#172029] uppercase">
          {labels.chooseThemeLabel}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <ThemePickerButton
            active={theme === "google"}
            icon={<Sparkles className="size-4 text-[#4285f4]" />}
            onClick={() => onSelectTheme("google")}
            subtitle={labels.themes.google.subtitle}
            title={labels.themes.google.title}
          />
          <ThemePickerButton
            active={theme === "coffee"}
            icon={<Coffee className="size-4 text-[#8b5a2b]" />}
            onClick={() => onSelectTheme("coffee")}
            subtitle={labels.themes.coffee.subtitle}
            title={labels.themes.coffee.title}
          />
          <ThemePickerButton
            active={theme === "barbershop"}
            icon={<Scissors className="size-4 text-[#0f172a]" />}
            onClick={() => onSelectTheme("barbershop")}
            subtitle={labels.themes.barbershop.subtitle}
            title={labels.themes.barbershop.title}
          />
          <ThemePickerButton
            active={theme === "modern"}
            icon={<span className="text-sm">🐙</span>}
            onClick={() => onSelectTheme("modern")}
            subtitle={labels.themes.modern.subtitle}
            title={labels.themes.modern.title}
          />
        </div>
      </div>

      {/* Monster Mascot Switch */}
      <div className="flex items-center justify-between rounded-xl border border-black/8 bg-[#f8fafc] p-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
            <Smile className="size-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#172029]">{labels.showMonsterLabel}</p>
            <p className="text-[10px] text-[#69737d]">Maskot kartun 2D sesuai tema</p>
          </div>
        </div>
        <button
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            showMonster ? "bg-[#087e91]" : "bg-gray-300"
          }`}
          onClick={() => onToggleMonster(!showMonster)}
          role="switch"
          aria-checked={showMonster}
          type="button"
        >
          <span
            className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              showMonster ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Copywriting Inputs */}
      <div className="space-y-2.5 pt-1">
        <div>
          <label className="text-[11px] font-semibold text-[#69737d]">
            {labels.preHeadlineLabel}
          </label>
          <input
            className="mt-1 w-full rounded-xl border border-black/10 px-3 py-1.5 text-xs text-[#172029] outline-none focus:border-[#087e91]"
            onChange={(e) => onChangePreHeadline(e.target.value)}
            value={preHeadline}
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[#69737d]">
            {labels.headlineLabel}
          </label>
          <input
            className="mt-1 w-full rounded-xl border border-black/10 px-3 py-1.5 text-xs font-semibold text-[#172029] outline-none focus:border-[#087e91]"
            onChange={(e) => onChangeHeadline(e.target.value)}
            value={headline}
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-[#69737d]">
            {labels.footerNoteLabel}
          </label>
          <input
            className="mt-1 w-full rounded-xl border border-black/10 px-3 py-1.5 text-xs text-[#172029] outline-none focus:border-[#087e91]"
            onChange={(e) => onChangeFooterNote(e.target.value)}
            value={footerNote}
          />
        </div>

        <div className="flex justify-end pt-0.5">
          <button
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#69737d] hover:text-black"
            onClick={onResetDefaults}
            type="button"
          >
            <RefreshCw className="size-3" />
            {labels.resetDefaults}
          </button>
        </div>
      </div>
    </div>
  );
}
