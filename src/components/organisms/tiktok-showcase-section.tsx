import { ArrowUpRight } from "lucide-react";
import type { Messages } from "../../i18n";
import { tapqrTikTok, tapqrVideos } from "../../lib/tiktok-videos";
import { TikTokVideoPreview } from "../molecules/tiktok-video-preview";
import { TikTokShowcaseDoodles } from "../elements/tiktok-showcase-doodles";
import { FeatureDivider } from "../elements/feature-divider";
import { landingButtonStyles } from "../elements/landing-button";
import "./tiktok-showcase-section.css";

export function TikTokShowcaseSection({ content }: { content: Messages["tiktokShowcase"] }) {
  return (
    <section id="videos" aria-labelledby="tiktok-heading" className="scroll-mt-24 overflow-hidden bg-white px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-center gap-4 sm:mb-12 sm:gap-6">
          <span aria-hidden="true" className="min-w-6 flex-1"><FeatureDivider /></span>
          <p className="max-w-60 text-center text-xs leading-6 font-semibold text-[#58606b] sm:max-w-none sm:text-sm">{content.divider}</p>
          <span aria-hidden="true" className="min-w-6 flex-1"><FeatureDivider /></span>
        </div>
        <div className="relative">
          <div className="relative isolate overflow-hidden rounded-[2rem] border-2 border-[#171b22] bg-[#fff4d7] p-5 text-[#171b22] shadow-[6px_6px_0_#171b22] sm:p-9 lg:p-10">
            <div aria-hidden="true" className="tiktok-doodle-dots pointer-events-none absolute -right-6 -top-5 -z-10 size-48 rounded-full opacity-20" />
            <svg aria-hidden="true" className="pointer-events-none absolute -bottom-9 -left-8 -z-10 h-36 w-64 text-[#ffb332]/25" viewBox="0 0 260 140" fill="none">
              <path d="M-10 10C60 100 125-40 270 70M-10 30C60 120 125-20 270 90M-10 50C60 140 125 0 270 110M-10 70C60 160 125 20 270 130" stroke="currentColor" strokeWidth="3" />
            </svg>
            <div className="grid items-center gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8">
              <div className="min-w-0">
                <p className="inline-block -rotate-2 rounded-full border-2 border-[#171b22] bg-[#ffb332] px-4 py-2 text-[11px] font-extrabold tracking-[0.12em] shadow-[3px_3px_0_#171b22]">{content.kicker}</p>
                <h2 id="tiktok-heading" className="mt-6 max-w-lg text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.15] font-extrabold tracking-[-0.04em]">
                  {content.title}<span className="relative mt-1 block w-fit">{content.accent}
                    <svg aria-hidden="true" className="pointer-events-none absolute -bottom-3 left-0 h-4 w-full text-[#ffb332]" viewBox="0 0 280 18" preserveAspectRatio="none" fill="none"><path d="M3 11c72-10 162-5 273-2M13 15c80-6 159-3 248-1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                  </span>
                </h2>
                <p className="mt-7 max-w-md text-[15px] leading-[1.8] text-[#58606b] sm:text-base">{content.description}</p>
                <a href={tapqrTikTok} target="_blank" rel="noopener noreferrer" className={landingButtonStyles({ compact: true, className: "mt-6 max-w-full gap-2" })}>
                  {content.profile}<ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
                <div aria-hidden="true" className="mt-7 hidden items-start gap-2 lg:flex">
                  <span className="-rotate-6 text-sm font-bold">{content.hint}</span>
                  <svg width="105" height="65" viewBox="0 0 105 65" fill="none" className="text-[#0798ad]">
                    <path d="M4 10C35 0 22 58 62 48c18-5 24-17 31-32m-20 5 22-7 4 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="grid min-w-0 gap-7 min-[560px]:grid-cols-2 min-[560px]:gap-5">
                {tapqrVideos.map((id, index) => <TikTokVideoPreview key={id} videoId={id} number={index + 1} content={content} />)}
              </div>
            </div>
            <p className="mt-7 text-xs leading-6 text-[#58606b] lg:text-right">{content.fallback}</p>
          </div>
          <TikTokShowcaseDoodles />
        </div>
      </div>
    </section>
  );
}
