import { landingButtonStyles } from "../elements/landing-button";
import type { Messages } from "../../i18n";
import { HeroDecorations } from "../elements/hero-decorations";
import { HeroTitleUnderline } from "../elements/hero-title-underline";
import { MotionReveal } from "../elements/motion-reveal";

type HeroSectionProps = {
  content: Messages["home"];
  imageSrc: string;
  contactHref: string | null;
};

export function HeroSection({ content, imageSrc, contactHref }: HeroSectionProps) {
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
                <HeroTitleUnderline />
              </span>{" "}
              {content.titleEnd}
            </span>
          </h1>

          <p className="mt-9 max-w-[760px] text-[15px] leading-[1.7] font-normal text-[#333333] sm:text-base">
            {content.description}
          </p>

          <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-5 sm:w-auto sm:flex-row sm:items-center">
            <a
              className={landingButtonStyles()}
              href="#pricing"
            >
              {content.getStarted}
            </a>
            <a
              className={landingButtonStyles({ tone: "black" })}
              href={contactHref ?? "#features"}
              target={contactHref ? "_blank" : undefined}
              rel={contactHref ? "noopener noreferrer" : undefined}
            >
              {contactHref ? content.contact : content.tryDemo}
            </a>
          </div>
        </MotionReveal>

        <MotionReveal trigger="load" delay={160}>
          <img
            className="mt-9 h-auto w-[min(760px,96vw)] select-none sm:mt-7 md:w-[min(720px,75vw)]"
            src={imageSrc}
            alt={content.illustrationAlt}
            width={1536}
            height={1024}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
        </MotionReveal>
      </div>
    </section>
  );
}
