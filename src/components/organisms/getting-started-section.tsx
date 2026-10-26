import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CircleCheck, ScanLine, ShoppingBag, Store, UserRoundPlus } from "lucide-react";
import type { Language, Messages } from "../../i18n";
import { MotionReveal } from "../elements/motion-reveal";
import { SectionUnderline } from "../elements/section-underline";
import { GettingStartedStep } from "../molecules/getting-started-step";
import { Button } from "../ui/button";

type Props = {
  content: Messages["gettingStarted"];
  language: Language;
};

export function GettingStartedSection({ content, language }: Props) {
  const steps = [
    { key: "purchase", content: content.steps.purchase, icon: ShoppingBag },
    { key: "account", content: content.steps.account, icon: UserRoundPlus },
    { key: "outlet", content: content.steps.outlet, icon: Store },
    { key: "activate", content: content.steps.activate, icon: ScanLine },
  ];

  return (
    <section id="how-it-works" aria-labelledby="getting-started-title" className="scroll-mt-24 bg-[#fff8e9] py-16 sm:py-24">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-6xl sm:w-[calc(100%-4rem)]">
        <MotionReveal>
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold tracking-widest text-[#087e91] uppercase">{content.kicker}</p>
            <h1 id="getting-started-title" className="mt-4 text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.18] font-extrabold tracking-[-0.045em] text-[#171b22]">
              {content.titleStart}{" "}
              <span className="relative inline-block">
                {content.titleAccent}
                <SectionUnderline />
              </span>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-[#58606b] sm:text-base">{content.description}</p>
          </header>
        </MotionReveal>

        <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:gap-7">
          {steps.map((step, index) => (
            <li key={step.key}>
              <MotionReveal className="h-full" delay={(index % 2) * 100}>
                <GettingStartedStep content={step.content} icon={step.icon} number={index + 1} />
              </MotionReveal>
            </li>
          ))}
        </ol>

        <MotionReveal>
          <div className="mt-8 flex flex-col gap-7 rounded-3xl bg-[#171b22] p-6 text-white sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-2xl items-start gap-4">
              <CircleCheck aria-hidden="true" className="mt-1 size-7 shrink-0 text-[#ffb332]" />
              <div>
                <h2 className="text-xl font-bold tracking-tight">{content.readyTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-white/75">{content.readyDescription}</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-4">
              <Button
                nativeButton={false}
                render={<Link to="/$locale/order" params={{ locale: language }} />}
                variant="warning"
                className="h-12 w-full rounded-xl px-6 no-underline"
              >
                {content.buy}<ArrowUpRight aria-hidden="true" />
              </Button>
              <Link to="/$locale/auth/$mode" params={{ locale: language, mode: "register" }} className="rounded text-sm text-white underline underline-offset-4 hover:text-[#ffb332] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb332]">
                {content.register}
              </Link>
            </div>
          </div>
        </MotionReveal>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-6 text-[#58606b]">{content.wifiNote}</p>
      </div>
    </section>
  );
}
