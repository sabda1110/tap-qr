import { MessageCircle, Quote, Star } from "lucide-react";

import { TestimonialDecorations } from "../elements/testimonial-decorations";

export type TestimonialCardContent = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

type TestimonialAccent = "cyan" | "yellow" | "coral";

type TestimonialCardProps = {
  content: TestimonialCardContent;
  accent: TestimonialAccent;
  ratingLabel: string;
};

const accentClasses = {
  cyan: { pattern: "text-[#0798ad]", surface: "bg-[#bcecf2]" },
  yellow: { pattern: "text-[#c88412]", surface: "bg-[#ffb332]" },
  coral: { pattern: "text-[#d77961]", surface: "bg-[#ffd0c4]" },
} satisfies Record<TestimonialAccent, { pattern: string; surface: string }>;

const corners = [
  "-left-[5px] -top-[5px]",
  "-right-[5px] -top-[5px]",
  "-bottom-[5px] -left-[5px]",
  "-bottom-[5px] -right-[5px]",
];

export function TestimonialCard({
  content,
  accent,
  ratingLabel,
}: TestimonialCardProps) {
  const colors = accentClasses[accent];

  return (
    <article className={`relative h-full p-4 pb-6 ${colors.pattern}`}>
      <TestimonialDecorations />

      <div className="relative flex h-full flex-col border-2 border-[#171b22] bg-white px-5 pb-9 pt-10 text-[#171b22] shadow-[4px_4px_0_#171b22] sm:px-6">
        {corners.map((position) => (
          <span
            key={position}
            aria-hidden="true"
            className={`pointer-events-none absolute size-2 border border-[#171b22] bg-white ${position}`}
          />
        ))}

        <span className={`absolute left-1/2 top-0 max-w-[90%] -translate-x-1/2 -translate-y-1/2 border-2 border-[#171b22] px-3 py-1 text-center text-[11px] font-bold leading-4 ${colors.surface}`}>
          {content.role}
        </span>

        <header className="flex items-center gap-3">
          <span
            className={`flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[#171b22] text-sm font-bold ${colors.surface}`}
            aria-hidden="true"
          >
            {content.initials}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold">{content.name}</h3>
            <div className="mt-2 flex gap-0.5" role="img" aria-label={ratingLabel}>
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className="size-3.5 fill-[#ffb332] text-[#996000]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </header>

        <blockquote className="mt-6 flex-1 text-[15px] leading-7 text-[#303740]">
          “{content.quote}”
        </blockquote>

        <div className="mt-6 flex items-center gap-4" aria-hidden="true">
          <span className={`h-px flex-1 bg-current opacity-30 ${colors.pattern}`} />
          <Quote className={`size-8 fill-current ${colors.pattern}`} strokeWidth={1} />
        </div>

        <span
          aria-hidden="true"
          className={`absolute bottom-0 left-1/2 grid size-10 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full border-2 border-[#171b22] shadow-[2px_2px_0_#171b22] ${colors.surface}`}
        >
          <MessageCircle className="size-5 fill-white" strokeWidth={1.8} />
        </span>
      </div>
    </article>
  );
}
