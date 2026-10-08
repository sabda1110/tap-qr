import { useI18n } from "../../i18n";

const placeIdFinderUrl =
  "https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder";

export function GooglePlaceIdTutorialPage() {
  const { language, messages } = useI18n();
  const content = messages.googlePlaceIdTutorial;
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 sm:py-12">
      <article className="mx-auto max-w-3xl rounded-3xl border border-black/8 bg-white p-6 shadow-sm sm:p-10">
        <a href={`/${language}`} className="text-sm font-semibold text-[#087e91] underline">
          {content.backHome}
        </a>
        <p className="mt-8 text-xs font-bold tracking-[0.16em] text-[#0798ad] uppercase">
          Google Review
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#69737d]">
          {content.description}
        </p>
        <ol className="mt-8 grid gap-4">
          {content.steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-2xl border border-black/8 p-5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e8f8fb] text-sm font-bold text-[#087e91]">
                {index + 1}
              </span>
              <div>
                <h2 className="font-bold">{step.title}</h2>
                <p className="mt-1 text-sm leading-6 text-[#69737d]">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <a href={placeIdFinderUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-[#172029] px-5 text-sm font-bold text-white">
          {content.googleDocs}
        </a>
      </article>
    </main>
  );
}
