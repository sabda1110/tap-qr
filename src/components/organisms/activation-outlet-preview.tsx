import { ArrowUpRight, MapPin, Sparkles, Store } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";
import type { OwnerActivationValues } from "../../lib/validation/owner-activation-schema";
import type { Messages } from "../../i18n";
import { SocialBrandMark } from "../elements/social-brand-mark";

type Content = Messages["adminDashboard"]["activation"];

export function ActivationOutletPreview({ control, content }: { control: Control<OwnerActivationValues>; content: Content }) {
  const [outletName, slug, address, city, province, links, logoUrl] = useWatch({ control, name: ["outletName", "slug", "address", "city", "province", "links", "logoUrl"] });
  const title = outletName.trim() || content.preview.defaultName;
  const location = [address, city, province].map((value) => value.trim()).filter(Boolean).join(", ");
  return <aside className="hidden min-w-0 self-start xl:sticky xl:top-6 xl:block" aria-label={content.preview.title}>
    <div className="mb-5 flex items-center justify-between gap-2">
      <h2 className="text-sm font-bold text-[#252a32]">{content.preview.title}</h2>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bce8ef] bg-[#eaf9fb] px-2.5 py-1 text-[10px] font-bold text-[#087e91]"><span className="size-1.5 rounded-full bg-[#0798ad]" />{content.preview.live}</span>
    </div>
    <div className="relative overflow-hidden rounded-[2.8rem] border-[7px] border-[#172029] bg-[#f6fafb] shadow-[0_24px_60px_-24px_rgba(8,126,145,0.4)]">
      <div className="absolute top-2 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#172029]" />
      <div className="max-h-[calc(100dvh-190px)] min-h-[520px] overflow-y-auto overscroll-contain">
        <div className="relative h-32 overflow-hidden bg-[#e4f5f8]">
          <div className="absolute -top-10 -right-10 size-40 rounded-full border border-[#91dbe6]" />
          <div className="absolute -bottom-6 -left-8 size-28 rounded-full bg-[#ffb332]/30" />
          <Sparkles aria-hidden="true" className="absolute top-14 right-10 size-5 text-[#0798ad]" />
        </div>
        <div className="relative -mt-9 px-5 pb-6">
          <div className="mx-auto flex size-20 items-center justify-center overflow-hidden rounded-[1.6rem] border-[5px] border-[#f6fafb] bg-[#0798ad] text-white shadow-sm">{logoUrl ? <img src={logoUrl} alt="" width={80} height={80} className="size-full bg-white object-contain" /> : <Store aria-hidden="true" className="size-8" />}</div>
          <h3 className="mt-3 break-words text-center text-xl font-extrabold tracking-[-0.04em] text-[#172029]">{title}</h3>
          <p className="mt-1 break-all text-center text-xs font-semibold text-[#087e91]">{slug.trim() ? `@${slug.trim()}` : content.preview.defaultSlug}</p>
          {location && <p className="mt-3 flex justify-center gap-1.5 text-center text-[11px] leading-5 text-[#69737d]"><MapPin aria-hidden="true" className="mt-1 size-3 shrink-0" />{location}</p>}
          <p className="mt-4 text-center text-xs leading-5 text-[#69737d]">{content.preview.welcome}</p>
          <div className="mt-6 grid gap-3">{links.map((link, index) => <div key={link.id} className="flex items-center gap-3 rounded-2xl border border-black/6 bg-white p-3 shadow-[0_3px_10px_rgba(23,32,41,0.03)]">
            <SocialBrandMark type={link.type} />
            <div className="min-w-0 flex-1"><p className="break-words text-xs font-bold text-[#252a32]">{link.label.trim() || content.channels[link.type].title}</p><p className="mt-0.5 text-[10px] text-[#69737d]">{index === 0 ? content.preview.primary : content.channels[link.type].title}</p></div>
            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-[#69737d]" />
          </div>)}</div>
          {links.length === 0 && <div className="mt-5 rounded-2xl border border-dashed border-[#bce8ef] px-4 py-7 text-center text-xs leading-5 text-[#69737d]">{content.preview.empty}</div>}
          <p className="mt-8 text-center text-[10px] text-[#7a838d]">{content.preview.poweredBy} <span className="font-bold text-[#172029]">Tap<span className="text-[#d08b16]">QR</span></span></p>
        </div>
      </div>
    </div>
    <p className="mt-4 text-center text-xs leading-5 text-[#69737d]">{content.preview.note}</p>
  </aside>;
}
