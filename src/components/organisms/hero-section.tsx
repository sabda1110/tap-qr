import { Link } from "@tanstack/react-router";

import type { Language, Messages } from "../../i18n";
import { HeroDecorations } from "../elements/hero-decorations";
import { MotionReveal } from "../elements/motion-reveal";

type HeroSectionProps = {
  content: Messages["home"];
  imageSrc: string;
  language: Language;
};

export function HeroSection({ content, imageSrc, language }: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-white pb-14 pt-8 sm:pb-20 sm:pt-12 lg:pb-24">
      <HeroDecorations />

      <div className="relative z-10 mx-auto flex w-[calc(100%-2rem)] max-w-6xl flex-col items-center text-center md:w-[82%]">
        <MotionReveal
          className="flex flex-col items-center"
          trigger="load"
        >
          <h1 className="max-w-[940px] text-[clamp(2rem,4.6vw,3.2rem)] leading-[1.28] font-extrabold tracking-[-0.035em] text-black">
            <span className="block">{content.titleStart}</span>
            <span className="mt-1 block">
              <span className="relative inline-block">
                {content.titleAccent}
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full overflow-visible"
                  viewBox="0 0 250 14"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 5.5C72 .2 157 .4 247 9.5M6 6.5c77-4 161-2 238 6"
                    stroke="#ffb332"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              {content.titleEnd}
            </span>
          </h1>

          <p className="mt-9 max-w-[760px] text-[15px] leading-[1.7] font-normal text-[#333333] sm:text-base">
            {content.description}
          </p>

          <div className="mt-5 flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md bg-black px-6 text-[12px] font-medium text-white no-underline hover:bg-black/80 hover:text-white"
              to="/$locale/auth/$mode"
              params={{ locale: language, mode: "register" }}
            >
              {content.getStarted}
            </Link>
            <a
              className="text-[12px] font-medium text-black underline decoration-black/50 underline-offset-4 hover:text-black/65"
              href="#features"
            >
              {content.tryDemo}
            </a>
          </div>
        </MotionReveal>

        <MotionReveal trigger="load" delay={160}>
          <img
            className="mt-9 h-auto w-[min(760px,96vw)] select-none sm:mt-7 md:w-[min(720px,75vw)]"
            src={imageSrc}
            alt={content.illustrationAlt}
            draggable={false}
          />
        </MotionReveal>
      </div>
    </section>
  );
}
