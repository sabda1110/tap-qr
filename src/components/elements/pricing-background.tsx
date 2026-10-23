export function PricingBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <span className="absolute -right-24 top-8 size-72 rounded-[45%_55%_38%_62%] bg-[#fff2d5]/60" />
      <span className="absolute -left-24 bottom-24 size-80 rounded-[60%_40%_55%_45%] bg-[#e0f2f5]/70" />
      <svg className="absolute -left-5 top-9 h-40 w-32 text-[#0798ad]/35 sm:left-[3%]" viewBox="0 0 130 160" fill="none">
        <path d="M10 15c80-18 98 31 59 46S8 53 25 31c22-30 86 40 58 87m-8-19 7 22 18-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 7" />
        <path d="m22 131 5 16m-13-6 20-4" stroke="#171b22" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className="pricing-background-spark absolute right-[3%] top-14 size-24 text-[#171b22]/30 sm:right-[6%] sm:size-32" viewBox="0 0 100 100" fill="none">
        <path d="m48 9 7 24 24-15-14 25 25 9-28 4 6 26-21-18-20 17 8-27-25-9 29-4-8-26 17 20Z" fill="#ffb332" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <svg className="absolute left-[5%] top-[45%] hidden h-36 w-16 text-[#0798ad]/30 lg:block" viewBox="0 0 70 160" fill="none">
        <path d="M14 9c38 20-19 34 16 54s-18 36 15 57m-33 18 22 10 18-17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg className="absolute bottom-14 right-[3%] size-24 text-[#0798ad]/40 sm:right-[7%] sm:size-32" viewBox="0 0 100 100" fill="none">
        <path d="m14 64 26-43 43 26-26 43Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="m61 16 13-5m9 13 7 5M9 82l-4 8" stroke="#171b22" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
