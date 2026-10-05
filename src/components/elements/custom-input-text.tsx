import { forwardRef, type ComponentProps, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "cn";
import { Input } from "../ui/input";

type CustomInputTextProps = ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  helpText?: string;
  icon?: LucideIcon;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

const CustomInputText = forwardRef<HTMLInputElement, CustomInputTextProps>(
  ({
    className,
    error,
    helpText,
    icon: Icon,
    id,
    label,
    prefix,
    suffix,
    ...props
  }, ref) => {
    const inputId = id ?? props.name;
    const message = error ?? helpText;

    return (
      <div className="grid gap-2">
        <label className="text-sm font-semibold text-[#252a32]" htmlFor={inputId}>
          {label}
        </label>
        <div className="relative flex items-center">
          {Icon ? <Icon aria-hidden="true" className="pointer-events-none absolute left-4 size-4 text-[#7a838d]" /> : null}
          {prefix ? (
            <span className="pointer-events-none absolute left-4 text-sm font-semibold text-[#68717b]">
              {prefix}
            </span>
          ) : null}
          <Input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={message ? `${inputId}-message` : undefined}
            className={cn(Icon || prefix ? "pl-11" : undefined, suffix ? "pr-12" : undefined, className)}
            {...props}
          />
          {suffix ? (
            <span className="pointer-events-none absolute right-4 text-sm font-semibold text-[#68717b]">
              {suffix}
            </span>
          ) : null}
        </div>
        {message ? (
          <p
            id={`${inputId}-message`}
            className={cn("text-xs leading-5", error ? "text-red-600" : "text-[#7a838d]")}
          >
            {message}
          </p>
        ) : null}
      </div>
    );
  },
);

CustomInputText.displayName = "CustomInputText";

export { CustomInputText };
