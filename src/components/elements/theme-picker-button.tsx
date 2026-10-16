import { Check } from "lucide-react";
import type { ReactNode } from "react";

type ThemePickerButtonProps = {
  active: boolean;
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
};

export function ThemePickerButton({
  active,
  icon,
  title,
  subtitle,
  onClick,
}: ThemePickerButtonProps) {
  return (
    <button
      aria-pressed={active}
      className={`group relative flex min-h-28 flex-col rounded-2xl border p-4 text-left outline-none transition-all focus-visible:ring-3 focus-visible:ring-[#087e91]/20 ${
        active
          ? "border-[#087e91] bg-[#e8f8fb] shadow-[0_0_0_1px_#087e91]"
          : "border-black/8 bg-white hover:border-[#087e91]/40 hover:bg-[#f8fcfd]"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex w-full items-start gap-3">
        <span
          className={`relative grid size-9 shrink-0 place-items-center rounded-xl transition-colors ${
            active ? "bg-white text-[#087e91]" : "bg-[#f3f5f7] text-[#4f5964]"
          }`}
        >
          {icon}
          {active && (
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#087e91] text-white ring-2 ring-[#e8f8fb]">
              <Check aria-hidden="true" className="size-3.5 stroke-[3]" />
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1 break-words pt-1 text-sm font-bold leading-5 text-[#172029] [overflow-wrap:anywhere]">
          {title}
        </span>
      </div>
      <span className="mt-3 text-xs leading-5 text-[#69737d]">{subtitle}</span>
    </button>
  );
}
