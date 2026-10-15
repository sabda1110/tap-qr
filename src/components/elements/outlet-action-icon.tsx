import {
  Facebook,
  Link2,
  MapPin,
  Star,
  Utensils,
} from "lucide-react";
import type { OutletActionKind } from "../page/outlet-profile-config";
import instagram from "../assets/icons/social/instagram.svg";
import tiktok from "../assets/icons/social/tiktok.svg";
import whatsapp from "../assets/icons/social/whatsapp.svg";

const brandIcons = { instagram, tiktok, whatsapp } as const;

function isBrandIcon(kind: OutletActionKind): kind is keyof typeof brandIcons {
  return kind in brandIcons;
}

const icons = {
  google_review: Star,
  facebook: Facebook,
  custom: Link2,
  menu: Utensils,
  maps: MapPin,
} satisfies Record<Exclude<OutletActionKind, keyof typeof brandIcons>, typeof Star>;

export function OutletActionIcon({ kind }: { kind: OutletActionKind }) {
  if (isBrandIcon(kind)) {
    return (
      <img
        src={brandIcons[kind]}
        alt=""
        aria-hidden="true"
      />
    );
  }
  const Icon = icons[kind];
  return <Icon aria-hidden="true" className="size-5" strokeWidth={3} />;
}
