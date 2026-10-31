import { Link } from "@tanstack/react-router";
import type { Language, Messages } from "../../i18n";
import { BrandLogo } from "../elements/brand-logo";
import { landingButtonStyles } from "../elements/landing-button";

export function ReviewGuideArticle({ content, language }: { content: Messages["reviewGuide"]; language: Language }) {
  return (
    <main className="min-h-screen bg-[#fff8e9] px-4 py-8 text-[#171b22] sm:px-6 sm:py-14">
      <article className="mx-auto max-w-4xl rounded-3xl border border-black/10 bg-white p-6 sm:p-12">
        <BrandLogo language={language} homeLabel={content.home} />
        <nav aria-label={content.breadcrumbLabel} className="mt-6 text-sm leading-6">
          <ol className="flex flex-wrap gap-x-2">
            <li><Link to="/$locale" params={{ locale: language }} className="underline underline-offset-4">{content.home}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{content.title}</li>
          </ol>
        </nav>
        <h1 className="mt-8 text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">{content.title}</h1>
        <p className="mt-5 text-base leading-8 text-[#58606b]">{content.introduction}</p>
        <nav aria-label={content.contents} className="mt-8 rounded-2xl bg-[#fff8e9] p-5 sm:p-6">
          <h2 className="font-bold">{content.contents}</h2>
          <ul className="mt-3 space-y-2">
            {content.sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="inline-block py-1 text-sm leading-6 underline underline-offset-4">{section.title}</a></li>)}
          </ul>
        </nav>
        {content.sections.map((section) => (
          <section key={section.id} id={section.id} className="mt-10 scroll-mt-8 border-t border-black/10 pt-8">
            <h2 className="text-xl leading-8 font-bold sm:text-2xl">{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-8 text-[#58606b]">{paragraph}</p>)}
          </section>
        ))}
        <aside className="mt-10 rounded-2xl border border-black/10 bg-[#fff8e9] p-5 sm:p-7">
          <h2 className="text-xl font-bold">{content.nextTitle}</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6">
            <li><Link to="/$locale/tutorial/google-place-id" params={{ locale: language }} className="inline-block py-1 underline underline-offset-4">{content.placeId}</Link></li>
            <li><Link to="/$locale/tutorial/activation" params={{ locale: language }} className="inline-block py-1 underline underline-offset-4">{content.activation}</Link></li>
            <li><Link to="/$locale" params={{ locale: language }} hash="pricing" className="inline-block py-1 underline underline-offset-4">{content.pricing}</Link></li>
          </ul>
          <Link to="/$locale/consultation" params={{ locale: language }} className={landingButtonStyles({ className: "mt-6 mb-2 text-center" })}>{content.consultation}</Link>
        </aside>
        <a href="https://support.google.com/business/answer/3474122" rel="noopener noreferrer" target="_blank" className="mt-8 inline-block py-2 text-sm leading-6 underline underline-offset-4">{content.source}</a>
        <p className="mt-4 text-xs leading-6 text-[#58606b]">{content.disclaimer}</p>
      </article>
    </main>
  );
}
