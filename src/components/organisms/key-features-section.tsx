import { FeatureDivider } from "../elements/feature-divider";
import { MotionReveal } from "../elements/motion-reveal";
import { SectionUnderline } from "../elements/section-underline";
import {
  FeatureItem,
  type FeatureItemContent,
} from "../molecules/feature-item";

type Feature = {
  content: FeatureItemContent;
  imageSrc: string;
  imageSrcSet?: string;
};

type KeyFeaturesSectionProps = {
  heading: {
    kicker: string;
    titleStart: string;
    titleAccent: string;
    titleEnd: string;
  };
  features: Feature[];
};

export function KeyFeaturesSection({
  heading,
  features,
}: KeyFeaturesSectionProps) {
  return (
    <section id="features" className="bg-white pb-0 pt-20 sm:pt-24 lg:pt-28">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-6xl sm:w-[calc(100%-4rem)]">
        <MotionReveal>
          <header className="mx-auto max-w-[850px] text-center">
            <p className="text-sm font-medium text-black/45">{heading.kicker}</p>
            <h2 className="mt-4 text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.18] font-medium tracking-[-0.045em] text-[#242424]">
              {heading.titleStart}{" "}
              <span className="relative inline-block">
                {heading.titleAccent}
                <SectionUnderline />
              </span>{" "}
              {heading.titleEnd}
            </h2>
          </header>
        </MotionReveal>

        <div className="mt-8 sm:mt-10">
          {features.map((feature, index) => (
            <div key={feature.content.title}>
              <FeatureItem
                content={feature.content}
                imageSrc={feature.imageSrc}
                imageSrcSet={feature.imageSrcSet}
                reverse={index % 2 === 1}
              />
              {index < features.length - 1 ? <FeatureDivider /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
