import { ArrowUpRight } from "lucide-react";
import type { Messages } from "../../i18n";
import { tapqrTikTok, type tapqrVideos } from "../../lib/tiktok-videos";

type Props = { videoId: typeof tapqrVideos[number]; number: number; content: Messages["tiktokShowcase"] };
export function TikTokVideoPreview({ videoId, number, content }: Props) {
  const label = `${content.label} ${String(number).padStart(2, "0")}`;
  return (
    <figure className="relative mx-auto w-full max-w-[325px] min-w-0 overflow-hidden rounded-2xl border-[3px] border-[#171b22] bg-white shadow-[6px_6px_0_#171b22]">
      <div className="flex items-center justify-between gap-2 border-b-[3px] border-[#171b22] bg-[#ffb332] px-3 py-3">
        <span className="text-xs font-extrabold uppercase">{label}</span>
        <span aria-hidden="true" className="flex gap-1"><span className="size-2 rounded-full border border-[#171b22] bg-white" /><span className="size-2 rounded-full border border-[#171b22] bg-white" /></span>
      </div>
      <div className="aspect-[9/16] w-full bg-[#171b22]">
        <iframe title={`${content.player} ${number}`} width="325" height="578" loading="lazy"
          src={`https://www.tiktok.com/player/v1/${videoId}?autoplay=0&controls=1&description=1&rel=0&closed_caption=1`}
          className="h-full w-full border-0" allow="fullscreen; encrypted-media; picture-in-picture" allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin" />
      </div>
      <figcaption className="border-t-[3px] border-[#171b22] bg-white px-3">
        <a href={`${tapqrTikTok}/video/${videoId}`} target="_blank" rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-between gap-2 text-xs font-bold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2">
          {content.open}<span className="sr-only">: {label}</span><ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
      </figcaption>
    </figure>
  );
}
