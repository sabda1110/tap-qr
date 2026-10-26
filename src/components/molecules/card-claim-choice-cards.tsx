import { Check } from "lucide-react";
import newStoreImage from "../assets/images/activation/new-store-orange.webp";
import existingStoreImage from "../assets/images/activation/existing-store-orange.webp";
import type { Messages } from "../../i18n";

type Props = {
  outletMode: "new" | "existing";
  onModeChange: (mode: "new" | "existing") => void;
  content: Messages["cardClaim"];
};

export function CardClaimChoiceCards({ outletMode, onModeChange, content }: Props) {
  const choices = [
    { mode: "new", title: content.newOutlet, description: content.newOutletDesc, image: newStoreImage },
    { mode: "existing", title: content.existingOutlet, description: content.existingOutletDesc, image: existingStoreImage },
  ] as const;
  return (
    <div role="group" aria-label={content.outletSelectTitle} className="grid gap-3 sm:grid-cols-2">
      {choices.map(({ mode, title, description, image }) => {
        const selected = outletMode === mode;
        return (
          <button key={mode} type="button" aria-pressed={selected} onClick={() => onModeChange(mode)}
            className={`flex min-h-28 min-w-0 cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e09a19] ${selected ? "border-[#171b22] bg-[#fff8e9] shadow-[3px_3px_0_#ffb332]" : "border-black/8 bg-white hover:border-[#e09a19]/60"}`}>
            <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl sm:size-20">
              <img src={image} alt="" width={80} height={80} decoding="async"
                className="h-full w-full object-contain" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm leading-5 font-bold text-[#171b22]">{title}</span>
              <span className="mt-1 block text-xs leading-5 text-[#69737d]">{description}</span>
            </span>
            <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${selected ? "border-[#171b22] bg-[#171b22] text-white" : "border-black/20"}`}>
              {selected && <Check aria-hidden="true" className="size-3" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
