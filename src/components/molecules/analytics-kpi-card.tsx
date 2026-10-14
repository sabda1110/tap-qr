import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

type AnalyticsKpiCardProps = {
  title: string;
  value: string | number;
  subtext?: string;
  badge?: string;
  icon: LucideIcon;
  variant?: "default" | "cyan" | "orange";
  className?: string;
};

export function AnalyticsKpiCard({
  title,
  value,
  subtext,
  badge,
  icon: Icon,
  variant = "default",
  className,
}: AnalyticsKpiCardProps) {
  const iconVariants = {
    default: "border-black/8 bg-[#f5f8fa] text-[#172029]",
    cyan: "border-[#bce8ef] bg-[#e8f8fb] text-[#087e91]",
    orange: "border-[#ffe1a6] bg-[#fff8eb] text-[#d97706]",
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-2xl border border-black/8 bg-white p-5 transition-shadow hover:shadow-xs sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold tracking-wider text-[#69737d] uppercase">
          {title}
        </span>
        <div
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl border",
            iconVariants[variant],
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-3xl font-extrabold tracking-tight text-[#172029] sm:text-4xl">
          {value}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {badge && (
            <span className="rounded-full bg-[#eaf9fb] px-2 py-0.5 text-xs font-semibold text-[#087e91]">
              {badge}
            </span>
          )}
          {subtext && (
            <span className="text-xs font-medium text-[#646b75]">
              {subtext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
