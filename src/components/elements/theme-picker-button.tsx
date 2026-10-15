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
      className={`flex flex-col rounded-2xl border p-3 text-left transition-all ${
        active
          ? "border-[#087e91] bg-[#e8f8fb] ring-2 ring-[#087e91]/20"
          : "border-black/8 bg-[#fbfcfd] hover:border-black/20 hover:bg-white"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-bold text-[#172029]">{title}</span>
      </div>
      <span className="mt-1 line-clamp-1 text-[10px] text-[#69737d]">{subtitle}</span>
    </button>
  );
}
