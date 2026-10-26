import { Store } from "lucide-react";
import { useState } from "react";

export function OutletAvatar({
  name,
  logoUrl,
  fallbackSrc,
}: {
  name: string;
  logoUrl: string | null;
  fallbackSrc?: string;
}) {
  const [hasImage, setHasImage] = useState(Boolean(logoUrl));

  if ((!hasImage || !logoUrl) && fallbackSrc)
    return <img src={fallbackSrc} alt="" width={56} height={56} className="size-14 shrink-0 rounded-xl object-contain" />;

  if (!hasImage || !logoUrl)
    return (
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e8f8fb] text-[#087e91]">
        <Store aria-hidden="true" className="size-5" />
      </span>
    );

  return (
    <img
      src={logoUrl}
      alt={name}
      width={44}
      height={44}
      className="size-11 shrink-0 rounded-xl border border-black/8 bg-white object-contain"
      onError={() => setHasImage(false)}
    />
  );
}
