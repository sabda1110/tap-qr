import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const Combobox = ComboboxPrimitive.Root;
const ComboboxList = ComboboxPrimitive.List;
const ComboboxStatus = ComboboxPrimitive.Status;

function ComboboxInput({
  triggerLabel,
  className,
  ...props
}: ComboboxPrimitive.Input.Props & { triggerLabel: string }) {
  return (
    <ComboboxPrimitive.InputGroup className="relative flex h-12 w-full items-center rounded-xl border border-black/10 bg-white shadow-sm focus-within:border-[#159eb5] focus-within:ring-3 focus-within:ring-[#27b9cf]/20 has-[:disabled]:bg-[#f3f5f7]">
      <ComboboxPrimitive.Input
        className={cn(
          "h-full w-full min-w-0 rounded-xl bg-transparent pr-11 pl-4 text-sm text-[#172029] outline-none placeholder:text-[#8b949e] disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...props}
      />
      <ComboboxPrimitive.Trigger
        aria-label={triggerLabel}
        className="absolute right-2 grid size-8 place-items-center rounded-lg text-[#69737d] hover:bg-black/5 disabled:opacity-50"
      >
        <ChevronDown className="size-4" />
      </ComboboxPrimitive.Trigger>
    </ComboboxPrimitive.InputGroup>
  );
}

function ComboboxContent({
  className,
  children,
  ...props
}: ComboboxPrimitive.Popup.Props) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        className="z-[70] outline-none"
        sideOffset={6}
      >
        <ComboboxPrimitive.Popup
          className={cn(
            "w-[var(--anchor-width)] max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-hidden rounded-2xl border border-black/8 bg-white p-1.5 text-[#172029] shadow-[0_18px_55px_rgba(23,32,41,0.16)] outline-none transition-[transform,opacity] duration-150 data-starting-style:translate-y-1 data-starting-style:opacity-0 data-ending-style:translate-y-1 data-ending-style:opacity-0 motion-reduce:transition-none",
            className,
          )}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      className={cn(
        "relative flex min-h-11 cursor-default items-center rounded-xl py-2 pr-10 pl-3 text-sm outline-none data-highlighted:bg-[#e8f9fc] data-highlighted:text-[#087f94] data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator className="absolute right-3 grid size-5 place-items-center rounded-full bg-[#ffb332] text-[#172029]">
        <Check className="size-3.5 stroke-[3]" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
};
