import { Quote, Star } from "lucide-react";

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

const accentClasses: Record<TestimonialAccent, string> = {
  cyan: "from-[#bcecf2] to-[#58c7d6] text-[#075e6c]",
  yellow: "from-[#ffe3a0] to-[#ffb332] text-[#6f4500]",
  coral: "from-[#ffd0c4] to-[#ff856e] text-[#7a281c]",
};

export function TestimonialCard({
  content,
  accent,
  ratingLabel,
}: TestimonialCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white/95 p-7 shadow-[0_18px_50px_rgba(37,48,68,0.08)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 motion-safe:hover:-translate-y-2 hover:border-[#ffb332]/60 hover:shadow-[0_28px_70px_rgba(37,48,68,0.15)] sm:p-8">
      <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#ffb332] to-transparent opacity-70" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-1" aria-label={ratingLabel}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className="size-4 fill-[#ffb332] text-[#ffb332] transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5"
              style={{ transitionDelay: `${index * 35}ms` }}
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="flex size-10 items-center justify-center rounded-full bg-[#f4f8fc] text-[#0798ad] transition-transform duration-300 motion-safe:group-hover:rotate-6 motion-safe:group-hover:scale-110">
          <Quote className="size-5 fill-current" strokeWidth={1.6} aria-hidden="true" />
        </span>
      </div>

      <blockquote className="mt-7 flex-1 text-[15px] leading-[1.85] font-medium text-[#30343d] sm:text-base">
        “{content.quote}”
      </blockquote>

      <footer className="mt-8 flex items-center gap-4 border-t border-black/8 pt-6">
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold shadow-sm ${accentClasses[accent]}`}
          aria-hidden="true"
        >
          {content.initials}
        </span>
        <span>
          <span className="block text-sm font-semibold text-[#161a22]">
            {content.name}
          </span>
          <span className="mt-1 block text-xs text-black/40">{content.role}</span>
        </span>
      </footer>
    </article>
  );
}
