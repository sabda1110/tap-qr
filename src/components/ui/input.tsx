import { forwardRef, type ComponentProps } from "react";

import { cn } from "cn";

const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-black/10 bg-[#f8fafc] px-4 text-sm text-[#252a32] outline-none transition placeholder:text-black/35 focus:border-[#0798ad] focus:bg-white focus:ring-4 focus:ring-[#0798ad]/10 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-500/10",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";

export { Input };
