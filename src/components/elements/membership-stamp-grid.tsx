import { Star } from "lucide-react";

export function MembershipStampGrid({ current, target }: { current: number; target: number }) {
  return (
    <div className="grid grid-cols-5 gap-2" aria-label={`${current}/${target}`}>
      {Array.from({ length: target }, (_, index) => (
        <span key={index} className={`grid aspect-square min-h-10 place-items-center border-2 border-black ${index < current ? "bg-[#ffb332] shadow-[2px_2px_0_#000]" : "bg-white"}`}>
          {index < current ? <Star className="size-5 fill-black" aria-hidden="true" /> : <span className="font-black">{index + 1}</span>}
        </span>
      ))}
    </div>
  );
}
