import { Check } from "lucide-react";

import { AuthIllustration } from "../elements/auth-illustration";

export type AuthShowcaseContent = {
  kicker: string;
  title: string;
  description: string;
  benefits: string[];
};

type AuthShowcaseProps = {
  content: AuthShowcaseContent;
};

export function AuthShowcase({ content }: AuthShowcaseProps) {
  return (
    <section className="relative flex h-full flex-col justify-between overflow-hidden p-7 sm:p-10 lg:p-12">
      <span className="absolute -right-16 -top-14 size-44 rounded-full border border-[#0798ad]/20" />
      <span className="absolute right-8 top-10 size-4 rotate-45 border border-black/35" />

      <div className="relative z-10 max-w-[430px]">
        <p className="text-[11px] font-bold tracking-[0.18em] text-[#0798ad] uppercase">
          {content.kicker}
        </p>
        <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.15] font-semibold tracking-[-0.045em] text-[#171b22]">
          {content.title}
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#58606b] sm:text-[15px]">
          {content.description}
        </p>
      </div>

      <div className="relative z-10 mx-auto -mb-7 mt-2 w-[82%] max-w-[360px] sm:-mb-10 lg:my-0 lg:w-full">
        <AuthIllustration />
      </div>

      <ul className="relative z-10 hidden gap-3 lg:grid">
        {content.benefits.map((benefit) => (
          <li key={benefit} className="flex items-center gap-3 text-xs font-semibold text-[#303740]">
            <span className="grid size-6 place-items-center rounded-full bg-white text-[#0798ad] shadow-sm">
              <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
            </span>
            {benefit}
          </li>
        ))}
      </ul>
    </section>
  );
}
