import { MessageSquare, Plus } from "lucide-react";
import type { Messages } from "../../i18n";
import { FaqDecorations } from "../elements/faq-decorations";
import { ActivationGuideLink } from "../elements/activation-guide-link";

type Props = {
  content: Messages["faq"];
  contactHref: string | null;
};

export function LandingFaqSection({ content, contactHref }: Props) {
  return (
    <section id="faq" className="relative isolate scroll-mt-24 overflow-hidden bg-white py-16 sm:py-24">
      <FaqDecorations />
      <div className="relative mx-auto w-[calc(100%-2rem)] max-w-6xl sm:w-[calc(100%-4rem)]">
        <header className="max-w-3xl">
          <p className="text-xs font-bold tracking-widest text-[#0798ad] uppercase">{content.kicker}</p>
          <h2 className="mt-4 text-[clamp(2.25rem,5vw,4rem)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[#171b22]">{content.title}</h2>
          <p className="mt-5 text-sm leading-7 text-[#58606b]">{content.description}</p>
        </header>
        <div className="mt-10 grid items-start gap-6 sm:mt-14 lg:grid-cols-[1.65fr_1fr] lg:gap-10">
          <div className="space-y-3">
            <details className="group rounded-xl border border-black/15 bg-white open:border-[#0798ad]/40">
              <summary className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-5 rounded-xl px-5 py-5 text-sm leading-6 font-bold text-[#171b22] sm:text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0798ad] [&::-webkit-details-marker]:hidden">
                {content.activationGuide.question}
                <Plus aria-hidden="true" className="size-5 shrink-0 text-[#0798ad] transition-transform group-open:rotate-45 motion-reduce:transition-none" />
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm leading-7 text-[#58606b]">{content.activationGuide.answer}</p>
                <ActivationGuideLink className="mt-3 min-h-11 px-3 text-sm font-bold text-[#087e91] hover:bg-[#fff8e9]" />
              </div>
            </details>
            {content.items.map((item, index) => (
              <details key={item.question} open={index === 0} className="group rounded-xl border border-black/15 bg-white open:border-[#0798ad]/40">
                <summary className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-5 rounded-xl px-5 py-5 text-sm leading-6 font-bold text-[#171b22] sm:text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0798ad] [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <Plus aria-hidden="true" className="size-5 shrink-0 text-[#0798ad] transition-transform group-open:rotate-45 motion-reduce:transition-none" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-7 text-[#58606b]">{item.answer}</p>
              </details>
            ))}
          </div>
          <aside className="flex flex-col items-center rounded-xl border border-black/15 bg-white px-6 py-8 text-center sm:px-8 sm:py-10 lg:sticky lg:top-28">
            <MessageSquare aria-hidden="true" className="size-14 fill-[#171b22] text-[#171b22]" strokeWidth={1.5} />
            <h3 className="mt-7 text-xl leading-snug font-bold tracking-tight text-[#171b22]">{content.contactTitle}</h3>
            <p className="mt-4 text-sm leading-7 text-[#58606b]">{content.contactDescription}</p>
            {contactHref && (
              <a href={contactHref} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#ffb332] px-5 py-3 text-sm font-bold text-[#171b22] no-underline hover:bg-[#ffc45c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0798ad] lg:mt-12">{content.contact}</a>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
