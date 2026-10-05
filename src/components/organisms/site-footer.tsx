import { ArrowUp, ArrowUpRight } from "lucide-react";

import type { Language, Messages } from "../../i18n";
import { BrandLogo } from "../elements/brand-logo";
import { MotionReveal } from "../elements/motion-reveal";

type SiteFooterProps = {
  content: Messages["footer"];
  language: Language;
};

export function SiteFooter({ content, language }: SiteFooterProps) {
  const links = [
    { label: content.home, href: "#top" },
    { label: content.features, href: "#features" },
    { label: content.pricing, href: "#pricing" },
    { label: content.testimonials, href: "#testimonials" },
  ];

  return (
    <footer id="footer" className="overflow-hidden bg-[#0b0d10] text-white">
      <MotionReveal>
        <div className="mx-auto w-[calc(100%-2rem)] max-w-6xl py-16 sm:w-[calc(100%-4rem)] sm:py-20">
          <div className="grid gap-12 border-b border-white/12 pb-14 lg:grid-cols-[1.2fr_0.7fr_1fr] lg:gap-20">
            <div>
              <BrandLogo
                homeLabel={content.brandHomeLabel}
                language={language}
                theme="dark"
              />
              <p className="mt-5 max-w-[390px] text-sm leading-7 text-white/55">
                {content.tagline}
              </p>
            </div>

            <nav aria-label={content.navigationLabel}>
              <p className="text-xs font-semibold tracking-[0.16em] text-white/35 uppercase">
                {content.navigationTitle}
              </p>
              <ul className="mt-5 flex flex-col gap-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      className="group inline-flex items-center gap-2 text-sm text-white/70 no-underline hover:text-white"
                      href={link.href}
                    >
                      {link.label}
                      <ArrowUpRight
                        className="size-3.5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7">
              <p className="text-xl leading-snug font-semibold tracking-[-0.03em]">
                {content.ctaTitle}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/50">
                {content.ctaDescription}
              </p>
              <a
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#ffb332] px-5 text-sm font-semibold text-black no-underline hover:bg-[#ffc45b] hover:text-black"
                href="#pricing"
              >
                {content.ctaLabel}
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} TapQR. {content.rights}</p>
            <a
              className="inline-flex items-center gap-2 text-white/50 no-underline hover:text-white"
              href="#top"
            >
              {content.backToTop}
              <ArrowUp className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </MotionReveal>
    </footer>
  );
}
