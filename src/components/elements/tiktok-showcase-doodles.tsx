import { ProductShowcaseDoodles } from "./product-showcase-doodles";

export function TikTokShowcaseDoodles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <ProductShowcaseDoodles />
      <svg className="tiktok-doodle-sway absolute -top-5 left-[12%] h-10 w-20 text-[#171b22] sm:-top-7 sm:left-[22%]" viewBox="0 0 90 45" fill="none">
        <path d="m9 25 8-15m12 21 2-23m17 26 12-14m12 17 8-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="m24 9 4-5m35 9 7-7" stroke="#ffb332" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <svg className="absolute -bottom-5 left-[58%] h-11 w-16 text-[#0798ad] sm:-bottom-6" viewBox="0 0 70 50" fill="none">
        <path d="M5 28c9-16 24-27 40-20s9 25-5 24S24 10 43 6m9 28 12 9m-5-18 8 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className="absolute -right-5 top-[44%] hidden h-20 w-10 text-[#171b22] sm:block" viewBox="0 0 40 90" fill="none">
        <path d="m11 7 15 12-15 12 15 12-15 12 15 12-15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg className="absolute -left-4 bottom-[14%] size-9 text-[#171b22] sm:-left-6 sm:size-12" viewBox="0 0 50 50" fill="none">
        <path d="m24 4 4 14 15 5-15 5-4 16-5-16-15-5 15-5Z" fill="#ffb332" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
