import { Link2 } from "lucide-react";
import type { ActivationLink } from "../../lib/validation/owner-activation-schema";
import { GoogleMark } from "./google-mark";
import instagram from "../assets/icons/social/instagram.svg";
import tiktok from "../assets/icons/social/tiktok.svg";
import whatsapp from "../assets/icons/social/whatsapp.svg";

const brandAssets = {
  instagram: { image: instagram, background: "bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]" },
  tiktok: { image: tiktok, background: "bg-[#111111]" },
  whatsapp: { image: whatsapp, background: "bg-[#25d366]" },
};

export function SocialBrandMark({ type }: { type: ActivationLink["type"] }) {
  if (type === "google_review") return <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-black/6 bg-white"><GoogleMark /></span>;
  if (type === "custom") return <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf9fb] text-[#087e91]"><Link2 className="size-5" /></span>;
  const brand = brandAssets[type];
  return <span aria-hidden="true" className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${brand.background}`}><img src={brand.image} alt="" className="size-5 brightness-0 invert" /></span>;
}
