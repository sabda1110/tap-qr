import { Check } from "lucide-react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";

import type { Messages } from "../../i18n";
import { cn } from "../../lib/utils";
import type { CardLinksEditValues } from "../../server/outlets/outlet.schemas";
import { SocialBrandMark } from "../elements/social-brand-mark";

type LinkType = CardLinksEditValues["links"][number]["type"];
const fixedChannels = [
  "google_review",
  "instagram",
  "tiktok",
  "whatsapp",
] as const;

export function CardClaimChannelStep({
  form,
  content,
  channels,
}: {
  form: UseFormReturn<CardLinksEditValues>;
  content: Messages["cardClaim"];
  channels: Messages["adminDashboard"]["activation"]["channels"];
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });
  const selectedTypes = new Set(fields.map((link) => link.type));

  function addLink(type: LinkType) {
    const channelType = type === "facebook" ? "custom" : type;
    append({
      id: crypto.randomUUID(),
      type,
      label:
        channelType === "custom"
          ? content.additionalLink
          : channels[channelType].title,
      value: "",
      ...(type === "whatsapp"
        ? { message: content.whatsappMessageDefault }
        : {}),
      isActive: true,
    });
  }

  function toggleChannel(type: (typeof fixedChannels)[number]) {
    const index = fields.findIndex((link) => link.type === type);
    if (index >= 0) remove(index);
    else addLink(type);
  }

  return (
    <section>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
          {content.channelTitle}
        </h2>
        <p className="mt-1 text-sm leading-5 text-slate-500">
          {content.channelDescription}
        </p>
      </div>
      <div className="mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-2.5 sm:grid-cols-4">
        {fixedChannels.map((type) => {
          const selected = selectedTypes.has(type);
          return (
            <button
              key={type}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleChannel(type)}
              className={cn(
                "relative flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-white p-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155ee8] focus-visible:ring-offset-2",
                selected
                  ? "border-[#155ee8] shadow-[0_8px_24px_rgba(21,94,232,0.12)]"
                  : "border-slate-200 hover:border-blue-200",
              )}
            >
              {selected && (
                <span className="absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-[#155ee8] text-white">
                  <Check className="size-3.5" />
                </span>
              )}
              <SocialBrandMark type={type} />
              <span className="text-sm font-bold text-slate-900">
                {channels[type].title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
