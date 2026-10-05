import { MotionReveal } from "../elements/motion-reveal";

export type FeatureItemContent = {
  eyebrow: string;
  title: string;
  description: string;
  imageAlt: string;
};

type FeatureItemProps = {
  content: FeatureItemContent;
  imageSrc: string;
  reverse?: boolean;
};

export function FeatureItem({ content, imageSrc, reverse }: FeatureItemProps) {
  const textOrder = reverse ? "lg:order-2" : "";
  const imageOrder = reverse ? "lg:order-1" : "";

  return (
    <MotionReveal direction={reverse ? "left" : "right"}>
      <article className="grid items-center gap-8 py-10 sm:gap-12 sm:py-12 lg:grid-cols-2 lg:items-start lg:gap-20 lg:py-14">
        <div className={textOrder}>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-black/45 uppercase">
            {content.eyebrow}
          </p>
          <h3 className="mt-4 max-w-[520px] text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.18] font-semibold tracking-[-0.035em] text-[#161a22]">
            {content.title}
          </h3>
          <p className="mt-5 max-w-[560px] text-[15px] leading-[1.8] text-[#6f7280] sm:text-base">
            {content.description}
          </p>
        </div>

        <figure className={`flex justify-center ${imageOrder}`}>
          <img
            className="h-auto w-full max-w-[520px] select-none"
            src={imageSrc}
            alt={content.imageAlt}
            loading="lazy"
            draggable={false}
          />
        </figure>
      </article>
    </MotionReveal>
  );
}
