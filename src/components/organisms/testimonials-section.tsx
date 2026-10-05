import { MotionReveal } from "../elements/motion-reveal";
import { SectionUnderline } from "../elements/section-underline";
import { TestimonialDecorations } from "../elements/testimonial-decorations";
import {
  TestimonialCard,
  type TestimonialCardContent,
} from "../molecules/testimonial-card";

type TestimonialsSectionProps = {
  heading: {
    kicker: string;
    titleStart: string;
    titleAccent: string;
    titleEnd: string;
  };
  testimonials: TestimonialCardContent[];
  ratingLabel: string;
};

const accents = ["cyan", "yellow", "coral"] as const;

export function TestimonialsSection({
  heading,
  testimonials,
  ratingLabel,
}: TestimonialsSectionProps) {
  return (
    <section
      id="testimonials"
      className="relative isolate overflow-hidden bg-[#f4f8fc] py-20 sm:py-24 lg:py-28"
    >
      <TestimonialDecorations />
      <div className="relative z-10 mx-auto w-[calc(100%-2rem)] max-w-6xl sm:w-[calc(100%-4rem)]">
        <MotionReveal>
          <header className="mx-auto max-w-[820px] text-center">
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

        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:mt-16">
          {testimonials.map((testimonial, index) => (
            <MotionReveal
              key={testimonial.name}
              className="h-full"
              delay={index * 110}
            >
              <TestimonialCard
                content={testimonial}
                accent={accents[index % accents.length] ?? "cyan"}
                ratingLabel={ratingLabel}
              />
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
